CREATE TYPE "public"."automation_trigger_type" AS ENUM('TASK_CREATED', 'TASK_UPDATED');--> statement-breakpoint
ALTER TABLE "automation_trigger" ALTER COLUMN "trigger_type" SET DATA TYPE automation_trigger_type;--> statement-breakpoint
ALTER TABLE "automation_node_links" ADD COLUMN "organization_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "automation_node_links" ADD COLUMN "automation_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "automation_nodes" ADD COLUMN "organization_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "automation_trigger" ADD COLUMN "organization_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "automation_trigger" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "automation_trigger" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "automation_node_links" ADD CONSTRAINT "automation_node_links_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_node_links" ADD CONSTRAINT "automation_node_links_automation_id_automations_id_fk" FOREIGN KEY ("automation_id") REFERENCES "public"."automations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_nodes" ADD CONSTRAINT "automation_nodes_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_trigger" ADD CONSTRAINT "automation_trigger_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;