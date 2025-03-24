CREATE TABLE "priorities" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"created_by" uuid NOT NULL,
	"icon" text NOT NULL,
	"name" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_priorities" (
	"project_id" integer NOT NULL,
	"priority_id" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_task_types" (
	"project_id" integer NOT NULL,
	"task_type_id" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_workflow_status" (
	"project_id" integer NOT NULL,
	"workflow_status_id" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"created_by" uuid NOT NULL,
	"icon" text NOT NULL,
	"name" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transitions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "workflows" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "transitions" CASCADE;--> statement-breakpoint
DROP TABLE "workflows" CASCADE;--> statement-breakpoint
ALTER TABLE "tasks" RENAME COLUMN "priority" TO "priority_id";--> statement-breakpoint
ALTER TABLE "project_templates" DROP CONSTRAINT "project_templates_workflow_id_workflows_id_fk";
--> statement-breakpoint
ALTER TABLE "workflow_status" DROP CONSTRAINT "workflow_status_workflow_id_workflows_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "type_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "priorities" ADD CONSTRAINT "priorities_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "priorities" ADD CONSTRAINT "priorities_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_priorities" ADD CONSTRAINT "project_priorities_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_priorities" ADD CONSTRAINT "project_priorities_priority_id_priorities_id_fk" FOREIGN KEY ("priority_id") REFERENCES "public"."priorities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_task_types" ADD CONSTRAINT "project_task_types_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_task_types" ADD CONSTRAINT "project_task_types_task_type_id_task_types_id_fk" FOREIGN KEY ("task_type_id") REFERENCES "public"."task_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_workflow_status" ADD CONSTRAINT "project_workflow_status_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_workflow_status" ADD CONSTRAINT "project_workflow_status_workflow_status_id_workflow_status_id_fk" FOREIGN KEY ("workflow_status_id") REFERENCES "public"."workflow_status"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_types" ADD CONSTRAINT "task_types_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_types" ADD CONSTRAINT "task_types_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "prioritiesOrganizationIdIndex" ON "priorities" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_project_pririties" ON "project_priorities" USING btree ("project_id","priority_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_project_task_types" ON "project_task_types" USING btree ("project_id","task_type_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_project_workflow_status" ON "project_workflow_status" USING btree ("project_id","workflow_status_id");--> statement-breakpoint
CREATE INDEX "taskTypesOrganizationIdIndex" ON "task_types" USING btree ("organization_id");--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_priority_id_priorities_id_fk" FOREIGN KEY ("priority_id") REFERENCES "public"."priorities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_type_id_task_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."task_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_templates" DROP COLUMN "workflow_id";--> statement-breakpoint
ALTER TABLE "workflow_status" DROP COLUMN "workflow_id";