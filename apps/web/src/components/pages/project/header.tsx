import { FC } from "react";
import Link from "next/link";
import { PlusIcon, SettingsIcon, ZapIcon } from "lucide-react";

import { Heading3 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Paths } from "@/lib/constants";

import { Organization, Project, ProjectDetailMinimal } from "@tdata/shared/types";

type ProjectPageHeaderProps = {
  project: Project;
};

export const ProjectPageHeader: FC<ProjectPageHeaderProps> = ({ project }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading3 text={project.name} />
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/automation">
            <ZapIcon className="h-4 w-4 text-orange-400 dark:text-orange-300" />
          </Link>
        </Button>
        <Button variant="ghost" size="sm">
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

type ProjectListPageHeaderProps = {
  organization: Organization;
  project: ProjectDetailMinimal;
};

export const ProjectListPageHeader: FC<ProjectListPageHeaderProps> = ({ organization, project }) => {
  return (
    <div className="flex items-center justify-between my-4">
      <Heading3 text="Projects" />
      <div className="flex items-center gap-2">
        <Button asChild>
          <Link href={Paths.newProject(organization.key)}>
            <span className="text-sm">New Project</span>
            <PlusIcon className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
