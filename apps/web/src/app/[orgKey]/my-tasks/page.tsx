import { MyTaskPage } from "@/components/pages/my-tasks";
import { getOrganizationByKey, getSession } from "@/lib/server";
import { TaskRepository } from "@/repositories";

export default async function Page({ params }: { params: Promise<{ orgKey: string }> }) {
  const { orgKey } = await params;
  const session = await getSession();
  const organization = await getOrganizationByKey(orgKey);

  const tasks = await TaskRepository.getAssignedTasks(session.user.id, organization.id);

  return <MyTaskPage tasks={tasks} />;
}
