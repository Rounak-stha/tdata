import { PaginatedTaskFilterParams } from "@tdata/shared/types";

export const parseSearchUrlParams = (searchParams: Record<string, string>): PaginatedTaskFilterParams => {
  const sp = new URLSearchParams(searchParams);
  const parseNumberArray = (key: string): number[] =>
    sp
      .get(key)
      ?.split(",")
      .map(Number)
      .filter((v) => !isNaN(v)) ?? [];

  const parseStringArray = (key: string): string[] => sp.get(key)?.split(",").filter(Boolean) ?? [];

  return {
    types: parseNumberArray("types"),
    title: sp.get("title") ?? "",
    projects: parseNumberArray("projects"),
    assignees: parseStringArray("users"),
    limit: Number(sp.get("limit") ?? 15),
    page: Number(sp.get("page") ?? 1),
    priorities: parseNumberArray("priorities"),
    status: parseNumberArray("status"),
    total: Number(sp.get("total") ?? 0),
  };
};
