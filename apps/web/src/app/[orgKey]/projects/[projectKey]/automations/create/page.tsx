import AutomationFlow from "@/automation-ui/components/automation-flow";
import { getProjectByKey, getProjectTemplate } from "@/lib/server";

export default async function ProjectAutomationCreate({ params }: { params: Promise<{ orgKey: string; projectKey: string }> }) {
  const { orgKey, projectKey } = await params;
  const project = await getProjectByKey(projectKey, orgKey);
  const projectTemplate = await getProjectTemplate(project.id);

  if (!projectTemplate) throw new Error("Project Template not found");

  return <AutomationFlow project={{ ...project, template: projectTemplate }} />;
}
