-- name: GetUsers :many
SELECT Id, Name, Email FROM Users;

-- name: GetAutomationById :one
SELECT * FROM Automations WHERE id = $1;

-- name: GetAutomationByEvent :many
SELECT * FROM Automations WHERE trigger_type = $1;


-- name: GetTaskDetail :one
SELECT 
    tasks.*, 
    COALESCE(
        JSON_OBJECT_AGG(
            relation_name, 
            user_data
        ), '{}' -- Return an empty object if no relations found
    ) AS "userRelations",
    COALESCE(
        ROW_TO_JSON(project_templates)::jsonb || jsonb_build_object(
            'workflow', ROW_TO_JSON(workflows)::jsonb || jsonb_build_object(
                'statuses', COALESCE(
                    jsonb_agg(
                        jsonb_build_object(
                            'id', workflow_status.id,
                            'workflow_id', workflow_status.workflow_id,
                            'organization_id', workflow_status.organization_id,
                            'created_by', workflow_status.created_by,
                            'name', workflow_status.name,
                            'icon', workflow_status.icon,
                            'created_at', workflow_status.created_at,
                            'updated_at', workflow_status.updated_at
                        )
                    ), '[]'
                )
            )
        ), '{}' -- Combine project_template and workflow with statuses into one JSON object
    ) AS "project_template"
FROM 
    tasks
LEFT JOIN (
    SELECT 
        tasks_users.task_id AS task_id,
        tasks_users.name AS relation_name,
        JSON_AGG(ROW_TO_JSON(users)) AS user_data
    FROM 
        tasks_users
    LEFT JOIN users ON users.id = tasks_users.user_id
    GROUP BY 
        tasks_users.task_id, tasks_users.name
) AS user_relations ON tasks.id = user_relations.task_id
INNER JOIN project_templates ON project_templates.id = tasks.project_id
INNER JOIN workflows ON workflows.id = project_templates.workflow_id
LEFT JOIN workflow_status ON workflow_status.workflow_id = workflows.id
AND workflow_status.organization_id = project_templates.organization_id
WHERE 
    tasks.id = $1
GROUP BY 
    tasks.id, project_templates.id, workflows.id;


