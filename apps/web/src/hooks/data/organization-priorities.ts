import { Priority } from "@tdata/shared/types";
import useSWR from "swr";

export const useOrganizationPriorities = (organizationId: number) => {
  const { data, isLoading } = useSWR<Priority[]>(`/api/${organizationId}/priorities`, null, {
    revalidateOnFocus: true,
  });
  return { data, isLoading };
};
