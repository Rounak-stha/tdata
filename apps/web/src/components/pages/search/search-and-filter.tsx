"use client";

import { FC, ReactNode, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";

import { CheckIcon, ChevronDownIcon, PlusIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RemoveFilter, SetFilter, useSearchFilter } from "@/hooks/data";
import { PaginatedTaskFilterParams, TaskFilterData, TaskFilterParams } from "@tdata/shared/types";
import { cn } from "@/lib/utils";
import { PriorityBadge, PrioritySelectList, ProjectBadge, ProjectSelectList, StatusBadge, StatusSelectList, UserBadge, UserSelectList } from "@/components/selects";
import { TaskTypeBadge, TaskTypeSelectList } from "@/components/selects/task-type";
import { Paths } from "@/lib/constants";
import { useOrganizations } from "@/hooks";
import { NUMBER_OF_TASKS_PER_SEARCH } from "@/automation-ui/lib/constants/search";

export function encodeTaskFilterParams(paramsObj: PaginatedTaskFilterParams): string {
  const params = new URLSearchParams();

  const appendArray = <T extends keyof Omit<TaskFilterParams, "title">>(key: T, values?: TaskFilterParams[T]) => {
    if (values && values.length > 0) {
      params.append(key, values.join(","));
    }
  };

  if (paramsObj.title) {
    params.append("title", paramsObj.title);
  }

  params.append("page", paramsObj.page.toString());
  params.append("limit", paramsObj.limit.toString());
  params.append("total", paramsObj.total.toString());

  appendArray("projects", paramsObj.projects);
  appendArray("status", paramsObj.status);
  appendArray("priorities", paramsObj.priorities);
  appendArray("assignees", paramsObj.assignees);
  appendArray("types", paramsObj.types);

  return params.toString();
}

export const SearchAndFilter = () => {
  const { data, filters, setFilter, removeFilter } = useSearchFilter();
  const { organization } = useOrganizations();

  const [isPending, startTransition] = useTransition();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<keyof Omit<TaskFilterParams, "title"> | null>();
  const router = useRouter();

  const initialRender = useRef(true);

  const filterKeys = useMemo(() => Object.keys(data).filter((d) => d != "title") as (keyof Omit<TaskFilterParams, "title">)[], [data]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    startTransition(() => {
      const searchParams = encodeTaskFilterParams(filters);
      router.push(Paths.search(organization.key, searchParams));
    });
  }, [filters, router, organization.key]);

  return (
    <div data-pending={isPending ? "" : undefined} className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search issues..." className="pl-8" value={filters.title} onChange={(e) => setFilter("title", e.target.value)} />
        </div>
        <div className="flex gap-2">
          {/* Filter button with command palette */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <PlusIcon className="h-4 w-4" />
                Add Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="end" side="bottom" sideOffset={5}>
              {!selectedProperty ? (
                <Command>
                  <CommandInput placeholder="Search properties..." />
                  <CommandList>
                    <CommandEmpty>No properties found.</CommandEmpty>
                    <CommandGroup>
                      {filterKeys.map((property) => (
                        <CommandItem key={property} onSelect={() => setSelectedProperty(property)} className="flex items-center justify-between">
                          {property}
                          <ChevronDownIcon className="h-4 w-4 opacity-50" />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              ) : (
                <Command>
                  <CommandInput placeholder={`Search ${selectedProperty} values...`} />
                  <CommandList>
                    <CommandEmpty>No values found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem className="text-sm text-muted-foreground" onSelect={() => setSelectedProperty(null)}>
                        <ChevronDownIcon className="h-4 w-4 rotate-90 mr-1" />
                        Back to properties
                      </CommandItem>
                      {data[selectedProperty]
                        ? data[selectedProperty].map(({ id, name }) => {
                            const alreadyIncluded = filters[selectedProperty] ? filters[selectedProperty].some((f) => f === id) : false;
                            return (
                              <CommandItem
                                key={id}
                                onSelect={() => (alreadyIncluded ? removeFilter(selectedProperty, id) : setFilter(selectedProperty, id))}
                                className="flex items-center justify-between"
                              >
                                {name}
                                {alreadyIncluded && <CheckIcon className="h-4 w-4" />}
                              </CommandItem>
                            );
                          })
                        : null}
                    </CommandGroup>
                  </CommandList>
                </Command>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <DisplaySelectedFilters data={data} filters={filters} removeFilter={removeFilter} setFilter={setFilter} />
    </div>
  );
};

type DisplaySelectedFiltersProps = {
  data: TaskFilterData;
  filters: TaskFilterParams;
  removeFilter: RemoveFilter;
  setFilter: SetFilter;
};

const DisplaySelectedFilters: FC<DisplaySelectedFiltersProps> = ({ data, filters, setFilter, removeFilter }) => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      {filters.status && filters.status.length ? (
        <FilterGroup type="status" select={<StatusSelectList options={data.status.filter((f) => !filters.status?.includes(f.id))} onSelect={(s) => setFilter("status", s.id)} />}>
          {filters.status.map((s) => (
            <StatusBadge key={s} status={data.status.find((status) => status.id == s)!} onRemove={() => removeFilter("status", s)} />
          ))}
        </FilterGroup>
      ) : null}
      {filters.priorities && filters.priorities.length ? (
        <FilterGroup
          type="priorities"
          select={<PrioritySelectList options={data.priorities.filter((f) => !filters.priorities?.includes(f.id))} onSelect={(s) => setFilter("priorities", s.id)} />}
        >
          {filters.priorities.map((s) => (
            <PriorityBadge key={s} priority={data.priorities.find((priority) => priority.id == s)!} onRemove={() => removeFilter("priorities", s)} />
          ))}
        </FilterGroup>
      ) : null}
      {filters.assignees && filters.assignees.length ? (
        <FilterGroup
          type="assignees"
          select={<UserSelectList options={data.assignees.filter((f) => !filters.assignees?.includes(f.id))} onSelect={(s) => setFilter("assignees", s.id)} />}
        >
          {filters.assignees.map((s) => (
            <UserBadge key={s} user={data.assignees.find((assignee) => assignee.id == s)!} onRemove={() => removeFilter("assignees", s)} />
          ))}
        </FilterGroup>
      ) : null}
      {filters.projects && filters.projects.length ? (
        <FilterGroup
          type="projects"
          select={<ProjectSelectList options={data.projects.filter((f) => !filters.projects?.includes(f.id))} onSelect={(s) => setFilter("projects", s.id)} />}
        >
          {filters.projects.map((s) => (
            <ProjectBadge key={s} project={data.projects.find((project) => project.id == s)!} onRemove={() => removeFilter("projects", s)} />
          ))}
        </FilterGroup>
      ) : null}
      {filters.types && filters.types.length ? (
        <FilterGroup type="types" select={<TaskTypeSelectList options={data.types.filter((f) => !filters.types?.includes(f.id))} onSelect={(s) => setFilter("types", s.id)} />}>
          {filters.types.map((s) => (
            <TaskTypeBadge key={s} tasktype={data.types.find((type) => type.id == s)!} onRemove={() => removeFilter("types", s)} />
          ))}
        </FilterGroup>
      ) : null}
    </div>
  );
};

type FilterGroupProps = {
  type: keyof TaskFilterData;
  children: ReactNode;
  select: ReactNode;
};

const FilterGroup: FC<FilterGroupProps> = ({ type, children, select }) => {
  return (
    <div
      className={cn(
        "group w-fit relative flex items-center gap-2 rounded-sm px-3 py-1.5",
        "bg-background/30 hover:bg-muted/30 shadow-sm border border-border",
        "transition-all duration-200"
      )}
    >
      <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <span>{type[0].toUpperCase() + type.slice(1)}</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap transition-all duration-200">{children}</div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-5 w-5">
            <PlusIcon size={14} className="text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60" align="start" sideOffset={5}>
          {select}
        </PopoverContent>
      </Popover>
    </div>
  );
};
