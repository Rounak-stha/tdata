import { WorkflowStatus } from "@tdata/shared/types";
import useSWR from "swr";

export const useOrganizationStatuses = () => {
  const { data, isLoading } = useSWR<WorkflowStatus[]>(`/api/statuses`, null, {
    revalidateOnFocus: false,
  });
  return { data, isLoading };
};
