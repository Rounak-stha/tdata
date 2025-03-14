ALTER TABLE "automation_node_links" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "automation_nodes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "automation_trigger" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "automation_node_links" CASCADE;--> statement-breakpoint
DROP TABLE "automation_nodes" CASCADE;--> statement-breakpoint
DROP TABLE "automation_trigger" CASCADE;--> statement-breakpoint
ALTER TABLE "automations" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "automations" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();--> statement-breakpoint
ALTER TABLE "automations" ADD COLUMN "project_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "automations" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "automations" ADD COLUMN "trigger_type" "automation_trigger_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "automations" ADD COLUMN "flow" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "automations" ADD COLUMN "variables" jsonb;--> statement-breakpoint
ALTER TABLE "automations" ADD CONSTRAINT "automations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;