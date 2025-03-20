import { WorkflowStatus } from "@tdata/shared/types";
import useSWR from "swr";

export const useOrganizationStatuses = (organizationId: number) => {
  const { data, isLoading } = useSWR<WorkflowStatus[]>(`/api/${organizationId}/statuses`, null, {
    revalidateOnFocus: false,
  });
  return { data, isLoading };
};
