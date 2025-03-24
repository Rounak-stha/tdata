import { ProjectPage as _ProjectPage } from "@components/pages/project";
import { getProjectBoardData, getProjectByKey } from "@/lib/server/project";

export default async function ProjectPage({ params }: { params: Promise<{ orgKey: string; projectKey: string }> }) {
  const { orgKey, projectKey } = await params;
  const project = await getProjectByKey(projectKey, orgKey);
  const tasks = await getProjectBoardData(project.id);

  return <_ProjectPage project={project} orgKey={orgKey} tasks={tasks} />;
}
