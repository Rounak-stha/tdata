import { ProjectListPage } from "@/components/pages/project";
import { getOrganizationByKey, getProjects } from "@/lib/server";

export default async function ProjectPage({ params }: { params: Promise<{ orgKey: string }> }) {
  const { orgKey } = await params;
  const organization = await getOrganizationByKey(orgKey);
  const projects = await getProjects(organization.id);

  return <ProjectListPage organization={organization} projects={projects} />;
}
