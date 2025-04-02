import AutomationFlow from "@/automation-ui/components/automation-flow";
import { getAutomationById } from "@/lib/actions/automation";
import { getProjectByKey, getProjectTemplate } from "@/lib/server";

export default async function ProjectAutomation({ params }: { params: Promise<{ orgKey: string; projectKey: string; automationId: string }> }) {
  const { orgKey, projectKey, automationId } = await params;
  const project = await getProjectByKey(projectKey, orgKey);
  const projectTemplate = await getProjectTemplate(project.id);
  const automation = await getAutomationById(automationId);

  if (!projectTemplate) throw new Error("Project Template not found");
  if (!automation) throw new Error("Automation not found");

  return <AutomationFlow project={{ ...project, template: projectTemplate }} automation={automation} />;
}
