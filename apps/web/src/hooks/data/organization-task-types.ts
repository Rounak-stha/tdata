import { TaskType } from "@tdata/shared/types";
import useSWR from "swr";

export const useOrganizationTaskTypes = () => {
  const { data, isLoading } = useSWR<TaskType[]>(`/api/task-types`, null, {
    revalidateOnFocus: false,
  });
  return { data, isLoading };
};
