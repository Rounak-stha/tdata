import useSWRInfinite from "swr/infinite";

import { TaskActivitySectionData } from "@tdata/shared/types";
import { useOrganizations } from "../auth";

const PageLimit = 10;

// https://swr.vercel.app/docs/pagination

export const useTaskActivities = (taskId: number) => {
  const { organization } = useOrganizations();

  const getKey = (pageIndex: number, previousPageData: []) => {
    if (previousPageData && !previousPageData.length) return null; // reached the end
    return `/api/${organization.id}/task/${taskId}/activities?page=${pageIndex + 1}&limit=${PageLimit}`; // SWR key
  };

  const { data, isLoading, size, setSize, mutate } = useSWRInfinite<TaskActivitySectionData[]>(getKey, null, {
    revalidateOnFocus: false,
  });

  const addOptimisticData = (newData: TaskActivitySectionData) => {
    const optimisticData = data ? [[newData], ...data] : undefined;
    mutate(optimisticData, {
      optimisticData: optimisticData,
      populateCache: true,
      revalidate: false,
    });
  };

  const loadMore = () => setSize(size + 1);
  return { data, isLoading, loadMore, pageSize: PageLimit, addOptimisticData };
};
