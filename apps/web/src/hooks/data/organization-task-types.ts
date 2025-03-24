import { TaskType } from "@tdata/shared/types";
import useSWR from "swr";

export const useOrganizationTaskTypes = (organizationId: number) => {
  const { data, isLoading } = useSWR<TaskType[]>(`/api/${organizationId}/task-types`, null, {
    revalidateOnFocus: false,
  });
  return { data, isLoading };
};
