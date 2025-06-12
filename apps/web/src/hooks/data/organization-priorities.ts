import { Priority } from "@tdata/shared/types";
import useSWR from "swr";

export const useOrganizationPriorities = () => {
  const { data, isLoading } = useSWR<Priority[]>(`/api/priorities`, null, {
    revalidateOnFocus: true,
  });
  return { data, isLoading };
};
