import { FC, Suspense } from "react";
import { AlertCircle } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { SearchAndFilter } from "./search-and-filter";
import { PrioritySelect, StatusSelect } from "@/components/selects";
import Link from "next/link";
import { Paths } from "@/lib/constants";
import { parseSearchUrlParams } from "@/lib/utils/search";
import { getOrganizationByKey } from "@/lib/server";
import { searchTasks } from "@/lib/server/task";

type SearchPageProps = {
  searchParams: Record<string, string>;
  orgKey: string;
};

export const SearchPage: FC<SearchPageProps> = ({ searchParams, orgKey }) => {
  return (
    <div className="p-4 group">
      <div className="flex flex-col space-y-4">
        <SearchAndFilter />
        <SearchItemTable searchParams={searchParams} orgKey={orgKey} />
      </div>
    </div>
  );
};

type SearchItemTableProps = {
  searchParams: Record<string, string>;
  orgKey: string;
};

const SearchItemTable: FC<SearchItemTableProps> = async ({ orgKey, searchParams }) => {
  const parsedParams = parseSearchUrlParams(searchParams);
  const organization = await getOrganizationByKey(orgKey);
  const tasks = await searchTasks(organization.id, parsedParams);
  return tasks.length > 0 ? (
    <div className="rounded-sm border group-has-[[data-pending]]:animate-pulse group-has-[[data-pending]]:opacity-20 group-has-[[data-pending]]:pointer-events-none">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[5%]">Key</TableHead>
            <TableHead className="w-3/4">Task</TableHead>
            <TableHead className="w-1/12">Status</TableHead>
            <TableHead className="1/12">Priority</TableHead>
            <TableHead className="w-1/12">Assignee</TableHead>
            <TableHead className="w-1/12">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-mono text-sm">{task.taskNumber}</TableCell>
              <TableCell>
                <Link href={Paths.task(task.taskNumber)}>{task.title}</Link>
              </TableCell>
              <TableCell>
                <StatusSelect size="full" projectId={task.projectId} status={task.status} />
              </TableCell>
              <TableCell>
                <PrioritySelect size="full" projectId={task.projectId} priority={task.priority} />
              </TableCell>
              <TableCell>
                {task.assignees.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <Avatar src={task.assignees[0].imageUrl} alt={task.assignees[0].name} />
                    <span className="text-sm">{task.assignees[0].name}</span>
                  </div>
                ) : (
                  "No Assignee"
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{task.createdAt.toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center rounded-sm border border-dashed p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <AlertCircle className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No issues found</h3>
      <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filters to find what you&apos;re looking for.</p>
    </div>
  );
};
