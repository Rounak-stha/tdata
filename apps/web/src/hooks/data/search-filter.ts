import { PaginatedTaskFilterParams, TaskFilterData } from "@tdata/shared/types";
import useSWR from "swr";
import { useOrganizations } from "../auth";
import { useCallback, useEffect, useReducer, useState } from "react";
import { NUMBER_OF_TASKS_PER_SEARCH } from "@/automation-ui/lib/constants/search";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

type TaskFilterAction =
  | { type: "SET_TITLE"; payload: string | undefined }
  | { type: "SET_PROJECTS"; payload: number[] }
  | { type: "SET_STATUS"; payload: number[] }
  | { type: "SET_PRIORITIES"; payload: number[] }
  | { type: "SET_ASSIGNEES"; payload: string[] }
  | { type: "SET_TYPES"; payload: number[] }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_LIMIT"; payload: number }
  | { type: "SET_TOTAL"; payload: number }
  | { type: "RESET_FILTERS" }
  | { type: "RESET_ALL" };

export const InitialData: TaskFilterData = {
  projects: [],
  status: [],
  priorities: [],
  assignees: [],
  types: [],
};

export function taskFilterReducer(state: PaginatedTaskFilterParams, action: TaskFilterAction): PaginatedTaskFilterParams {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_PROJECTS":
      return { ...state, projects: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SET_PRIORITIES":
      return { ...state, priorities: action.payload };
    case "SET_ASSIGNEES":
      return { ...state, assignees: action.payload };
    case "SET_TYPES":
      return { ...state, types: action.payload };
    case "SET_PAGE":
      return {
        ...state,
        page: action.payload,
      };
    case "SET_LIMIT":
      return {
        ...state,
        limit: action.payload,
      };
    case "SET_TOTAL":
      return {
        ...state,
        total: action.payload,
      };
    default:
      return state;
  }
}

export type SetFilter = (key: keyof PaginatedTaskFilterParams, value: string | number) => void;
export type RemoveFilter = (key: keyof PaginatedTaskFilterParams, value: string | number) => void;

export type SearchFilterHookReturn = {
  data: TaskFilterData;
  filters: PaginatedTaskFilterParams;
  isLoading: boolean;
  setPage: (page: number) => void;
  setTotal: (total: number) => void;
  reset: () => void;
  setFilter: SetFilter;
  removeFilter: RemoveFilter;
};

const getInitialFilterData = (searchParams: ReadonlyURLSearchParams): PaginatedTaskFilterParams => {
  return {
    title: searchParams.get("title") ?? "",
    projects: searchParams.get("projects")?.split(",").map(Number) ?? [],
    status: searchParams.get("status")?.split(",").map(Number) ?? [],
    priorities: searchParams.get("priorities")?.split(",").map(Number) ?? [],
    assignees: searchParams.get("assignees")?.split(",") ?? [],
    types: searchParams.get("types")?.split(",").map(Number) ?? [],
    limit: Number(searchParams.get("limit")) ?? NUMBER_OF_TASKS_PER_SEARCH,
    page: Number(searchParams.get("page")) ?? 1,
    total: Number(searchParams.get("total")) ?? 0,
  };
};

export const useSearchFilter = (): SearchFilterHookReturn => {
  const { organization } = useOrganizations();
  const searchParams = useSearchParams();
  const [data, setData] = useState<TaskFilterData>(InitialData);
  const { data: statusPriorityTypes, isLoading } = useSWR<Required<Pick<TaskFilterData, "status" | "priorities" | "types">>>(`/api/${organization.id}/search/filters`, null, {
    revalidateOnFocus: false,
  });
  const [filters, dispatch] = useReducer(taskFilterReducer, getInitialFilterData(searchParams));

  useEffect(() => {
    if (organization) {
      setData((prev) => ({ ...prev, projects: organization.projects, assignees: organization.members }));
    }
    if (statusPriorityTypes) {
      setData((prev) => ({ ...prev, status: statusPriorityTypes.status, priorities: statusPriorityTypes.priorities, types: statusPriorityTypes.types }));
    }
  }, [organization, statusPriorityTypes]);

  const setPage = useCallback((page: number) => {
    dispatch({ type: "SET_PAGE", payload: page });
  }, []);

  const setTotal = useCallback((total: number) => {
    dispatch({ type: "SET_TOTAL", payload: total });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET_ALL" });
  }, []);

  const setFilter: SetFilter = (key: keyof PaginatedTaskFilterParams, value: string | number) => {
    switch (key) {
      case "title": {
        dispatch({ type: "SET_TITLE", payload: value as string });
        break;
      }
      case "projects": {
        const payload = [...(filters.projects || []), value as number];
        dispatch({ type: "SET_PROJECTS", payload });
        break;
      }
      case "status": {
        const payload = [...(filters.status || []), value as number];
        dispatch({ type: "SET_STATUS", payload });
        break;
      }
      case "priorities": {
        const payload = [...(filters.priorities || []), value as number];
        dispatch({ type: "SET_PRIORITIES", payload });
        break;
      }
      case "assignees": {
        const payload = [...(filters.assignees || []), value as string];
        dispatch({ type: "SET_ASSIGNEES", payload });
        break;
      }
      case "types": {
        const payload = [...(filters.status || []), value as number];
        dispatch({ type: "SET_TYPES", payload });
        break;
      }
      default: {
        break;
      }
    }
  };

  const removeFilter: RemoveFilter = <T extends keyof PaginatedTaskFilterParams>(key: T, value: string | number) => {
    switch (key) {
      case "title": {
        dispatch({ type: "SET_TITLE", payload: value as string });
        break;
      }
      case "projects": {
        const newValue = filters["projects"] ? filters["projects"].filter((item) => item !== value) : [];
        dispatch({ type: "SET_PROJECTS", payload: newValue });
        break;
      }
      case "status": {
        const newValue = filters["status"] ? filters["status"].filter((item) => item !== value) : [];
        dispatch({ type: "SET_STATUS", payload: newValue });
        break;
      }
      case "priorities": {
        const newValue = filters["priorities"] ? filters["priorities"].filter((item) => item !== value) : [];
        dispatch({ type: "SET_PRIORITIES", payload: newValue });
        break;
      }
      case "assignees": {
        const newValue = filters["assignees"] ? filters["assignees"].filter((item) => item !== value) : [];
        dispatch({ type: "SET_ASSIGNEES", payload: newValue });
        break;
      }
      case "types": {
        const newValue = filters["types"] ? filters["types"].filter((item) => item !== value) : [];
        dispatch({ type: "SET_TYPES", payload: newValue });
        break;
      }
      default: {
        break;
      }
    }
  };

  return { data, filters, isLoading, setPage, setTotal, reset, setFilter, removeFilter };
};
