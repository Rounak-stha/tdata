```SQL

-- SQL used to create the `create_project_sequence` function
CREATE OR REPLACE FUNCTION create_project_sequence(project_id integer)
RETURNS void AS $$
BEGIN
    EXECUTE format('CREATE SEQUENCE project_%s_task_seq', project_id);
END;
$$ LANGUAGE plpgsql;


-- SQL used to created qa Function to create function to set the task number
CREATE OR REPLACE FUNCTION set_task_number()
RETURNS TRIGGER AS $$
DECLARE
    seq_name text;
    project_key text;
    sequence_number integer;
BEGIN
    seq_name := format('project_%s_task_seq', NEW."project_id");

    -- Check if the sequence exists, if not, create it
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = seq_name) THEN
        PERFORM create_project_sequence(NEW."project_id");
    END IF;

    -- Get the next sequence number
    sequence_number := nextval(seq_name);

    -- Get the project key
    SELECT key INTO project_key FROM public.projects WHERE id = NEW."project_id";

    -- Set the taskNumber in the desired format
    NEW."task_number" := format('%s-%s', project_key, sequence_number);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Task Before Trigger to set the task number
CREATE TRIGGER before_insert_task
	BEFORE INSERT ON public.tasks
	FOR EACH ROW
	EXECUTE FUNCTION set_task_number();


-- SQL to Sync User

-- inserts a row into public.profiles
create function public.handle_new_user()

returns trigger

language plpgsql

security definer set search_path = ''

as $$

BEGIN
  -- Check if the profile already exists
  IF EXISTS (SELECT 1 FROM public.users WHERE email = NEW.email) THEN
    -- Update the existing profile
    UPDATE public.users
    SET id = New.id,
		name = NEW.raw_user_meta_data ->> 'name',
        email = NEW.raw_user_meta_data ->> 'email',
        "image_url" = NEW.raw_user_meta_data ->> 'avatar_url',
        active = true
    WHERE email = NEW.email;
  ELSE
    -- Insert a new profile
    INSERT INTO public.users (id, name, email, "image_url", active)
    VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'email', NEW.raw_user_meta_data ->> 'avatar_url', true);
  END IF;

  RETURN NEW;
END;

$$;



-- trigger the function every time a user is created

create trigger on_auth_user_created

  after insert on auth.users

  for each row execute procedure public.handle_new_user();

create trigger on_auth_user_updated

  after update on auth.users

  for each row execute procedure public.handle_new_user();

-- Soft Delete User Function

--- Use Security Definer: You can define the soft_delete_user function with the SECURITY DEFINER option. This allows the function to execute with the privileges of the user who created the --- function, rather than the user who is invoking the trigger. This is useful if the function needs to perform operations that the invoking user does not have permission to perform.
CREATE OR REPLACE FUNCTION soft_delete_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Set active to false and deleted_at to current timestamp
    UPDATE public.users
    SET active = false,
        deleted_at = current_timestamp
    WHERE id = OLD.id;

    RETURN OLD;  -- Return the old record
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


--- After Delete User Trigger**

CREATE TRIGGER before_user_delete
BEFORE DELETE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION soft_delete_user();


-- Create Default Workflow and initial Admin member for Organization after Create
CREATE OR REPLACE FUNCTION add_organization_defaults()
RETURNS TRIGGER AS $$
DECLARE
    new_workflow_id integer;
BEGIN
    -- Insert the default workflow with configured and description
    INSERT INTO public.workflows (name, organization_id, created_by, is_active, is_default, configured, description)
    VALUES ('Kanban', NEW.id, NEW.created_by, true, true, true, 'Kanban Workflow')
    RETURNING id INTO new_workflow_id;

    -- Insert default workflow stages
    INSERT INTO public.workflow_status (name, organization_id, workflow_id, icon, created_by)
    VALUES
        ('Backlog', NEW.id, new_workflow_id, 'Backlog', NEW.created_by),
        ('ToDo', NEW.id, new_workflow_id, 'ToDo', NEW.created_by),
        ('InProgress', NEW.id, new_workflow_id, 'InProgress', NEW.created_by),
        ('InReview', NEW.id, new_workflow_id, 'InReview', NEW.created_by),
        ('Completed', NEW.id, new_workflow_id, 'Completed', NEW.created_by);

    -- Add the organization creator as a member with 'Admin' role in organization_memberships
    INSERT INTO public.organization_memberships (organization_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'Admin');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_organization_create
AFTER INSERT ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION add_organization_defaults();
```
