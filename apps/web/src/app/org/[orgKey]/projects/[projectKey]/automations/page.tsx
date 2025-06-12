import { AutomationPage as _AutomationPage } from "@components/pages/automtions";
import { getProjectByKey } from "@/lib/server";
import { getProjectAutomatins } from "@/lib/server/automation";

export default async function AutomationsPage({ params }: { params: Promise<{ orgKey: string; projectKey: string }> }) {
  const { orgKey, projectKey } = await params;
  const project = await getProjectByKey(projectKey, orgKey);
  const automations = await getProjectAutomatins(project.id);

  return <_AutomationPage automations={automations} project={project} />;
}
