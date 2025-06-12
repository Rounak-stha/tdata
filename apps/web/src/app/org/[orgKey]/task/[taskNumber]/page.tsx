import { TaskPage as _TaskPage } from "@components/pages/task";
import { getOrganizationByKey } from "@/lib/server";
import { getTaskDetails } from "@/lib/server/task";

export default async function TaskPage({ params }: { params: Promise<{ orgKey: string; taskNumber: string }> }) {
  const { orgKey, taskNumber } = await params;
  const organization = await getOrganizationByKey(orgKey);
  const task = await getTaskDetails(taskNumber, organization.id);

  return <_TaskPage task={task} />;
}
