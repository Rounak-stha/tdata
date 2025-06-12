"use client";

import { FC } from "react";
import Link from "next/link";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Paths } from "@/lib/constants";
import { Automation, Project } from "@tdata/shared/types";
import { useOrganizations } from "@/hooks";

type ProjectListProps = {
  project: Project;
  automations: Automation[];
};

export const AutomationList: FC<ProjectListProps> = ({ project, automations }) => {
  const { organization } = useOrganizations();
  return (
    <div className="rounded-sm border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted">
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {automations.map((automation) => (
            <TableRow key={project.id} className="border hover:bg-muted">
              <TableCell>
                <Link href={Paths.projectAutomation(project.key, automation.id)} className="text-blue-400 hover:underline cursor-pointer">
                  {automation.name}
                </Link>
              </TableCell>
              <TableCell>{automation.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
