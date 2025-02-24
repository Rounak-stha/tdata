import { ProjectPage as _ProjectPage } from "@components/pages/project";
import { getProjectByKey } from "@/lib/server/project";

export default async function ProjectPage({ params }: { params: Promise<{ orgKey: string; projectKey: string }> }) {
  const { orgKey, projectKey } = await params;
  const project = await getProjectByKey(projectKey, orgKey);

  return <_ProjectPage project={project} />;
}
