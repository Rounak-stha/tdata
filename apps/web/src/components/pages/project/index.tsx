import { FC } from "react";

import { Organization, Project, ProjectDetailMinimal, TaskGroupedByStatus } from "@tdata/shared/types";
import { ProjectListPageHeader, ProjectPageHeader } from "./header";
import { ProjectBoard } from "./board";
import { ProjectList } from "./list";

type ProjectPageProps = {
  project: Project;
  orgKey: string;
  tasks: TaskGroupedByStatus[];
};

export const ProjectPage: FC<ProjectPageProps> = ({ project, orgKey, tasks }) => {
  return (
    <div>
      <ProjectPageHeader project={project} orgKey={orgKey} />
      <ProjectBoard project={project} tasks={tasks} />
    </div>
  );
};

type ProjectListPageProps = {
  organization: Organization;
  projects: ProjectDetailMinimal[];
};

export const ProjectListPage: FC<ProjectListPageProps> = ({ organization, projects }) => {
  return (
    <div className="px-6 py-4">
      <ProjectListPageHeader organization={organization} project={projects[0]} />
      <ProjectList organization={organization} projects={projects} />
    </div>
  );
};
