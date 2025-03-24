ALTER TABLE "automation_node_links" DROP CONSTRAINT "automation_node_links_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "automation_nodes" DROP CONSTRAINT "automation_nodes_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "automation_trigger" DROP CONSTRAINT "automation_trigger_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "automations" DROP CONSTRAINT "automations_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "priorities" DROP CONSTRAINT "priorities_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "project_priorities" DROP CONSTRAINT "project_priorities_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "project_priorities" DROP CONSTRAINT "project_priorities_priority_id_priorities_id_fk";
--> statement-breakpoint
ALTER TABLE "project_task_types" DROP CONSTRAINT "project_task_types_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "project_task_types" DROP CONSTRAINT "project_task_types_task_type_id_task_types_id_fk";
--> statement-breakpoint
ALTER TABLE "project_templates" DROP CONSTRAINT "project_templates_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "project_workflow_status" DROP CONSTRAINT "project_workflow_status_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "project_workflow_status" DROP CONSTRAINT "project_workflow_status_workflow_status_id_workflow_status_id_fk";
--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "projects_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "task_activities" DROP CONSTRAINT "task_activities_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "task_comments" DROP CONSTRAINT "task_comments_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "task_types" DROP CONSTRAINT "task_types_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks_users" DROP CONSTRAINT "tasks_users_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "workflow_status" DROP CONSTRAINT "workflow_status_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "automation_node_links" ADD CONSTRAINT "automation_node_links_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_nodes" ADD CONSTRAINT "automation_nodes_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_trigger" ADD CONSTRAINT "automation_trigger_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automations" ADD CONSTRAINT "automations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "priorities" ADD CONSTRAINT "priorities_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_priorities" ADD CONSTRAINT "project_priorities_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_priorities" ADD CONSTRAINT "project_priorities_priority_id_priorities_id_fk" FOREIGN KEY ("priority_id") REFERENCES "public"."priorities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_task_types" ADD CONSTRAINT "project_task_types_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_task_types" ADD CONSTRAINT "project_task_types_task_type_id_task_types_id_fk" FOREIGN KEY ("task_type_id") REFERENCES "public"."task_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_templates" ADD CONSTRAINT "project_templates_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_workflow_status" ADD CONSTRAINT "project_workflow_status_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_workflow_status" ADD CONSTRAINT "project_workflow_status_workflow_status_id_workflow_status_id_fk" FOREIGN KEY ("workflow_status_id") REFERENCES "public"."workflow_status"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_activities" ADD CONSTRAINT "task_activities_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_comments" ADD CONSTRAINT "task_comments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_types" ADD CONSTRAINT "task_types_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks_users" ADD CONSTRAINT "tasks_users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_status" ADD CONSTRAINT "workflow_status_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;