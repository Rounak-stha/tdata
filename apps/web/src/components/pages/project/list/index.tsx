import { Avatar } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Paths } from "@/lib/constants";
import { Organization, ProjectDetailMinimal } from "@tdata/shared/types";
import Link from "next/link";
import { FC } from "react";

type ProjectListProps = {
  organization: Organization;
  projects: ProjectDetailMinimal[];
};

export const ProjectList: FC<ProjectListProps> = ({ organization, projects }) => {
  return (
    <div className="rounded-sm border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted">
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>createdBy</TableHead>
            <TableHead>Template</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="border hover:bg-muted">
              <TableCell>
                <Link href={Paths.project(organization.key, project.key)} className="text-blue-400 hover:underline cursor-pointer">
                  {project.name}
                </Link>
              </TableCell>
              <TableCell>{project.key}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar src={project.createdBy.imageUrl} />
                  <span>{project.createdBy.name}</span>
                </div>
              </TableCell>
              <TableCell>{project.template.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
