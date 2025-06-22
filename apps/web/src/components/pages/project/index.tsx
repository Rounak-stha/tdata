import { FC } from "react";

import { Organization, Project, ProjectDetailMinimal, TaskGroupedByStatus } from "@tdata/shared/types";
import { ProjectListPageHeader, ProjectPageHeader } from "./header";
import { ProjectBoard } from "./board";
import { ProjectList } from "./list";

type ProjectPageProps = {
  project: Project;
  tasks: TaskGroupedByStatus[];
};

export const ProjectPage: FC<ProjectPageProps> = ({ project, tasks }) => {
  return (
    <div>
      <ProjectPageHeader project={project} />
      <ProjectBoard project={project} tasks={tasks} />
    </div>
  );
};

type ProjectListPageProps = {
  projects: ProjectDetailMinimal[];
};

export const ProjectListPage: FC<ProjectListPageProps> = ({ projects }) => {
  return (
    <div className="px-6 py-4">
      <ProjectListPageHeader project={projects[0]} />
      <ProjectList projects={projects} />
    </div>
  );
};
