import { FC, Suspense } from "react";

import { Organization, Project, ProjectDetailMinimal } from "@tdata/shared/types";
import { ProjectListPageHeader, ProjectPageHeader } from "./header";
import { ProjectBoard } from "./board";
import { BoardSkeleton } from "./board/loading";
import { ProjectList } from "./list";

type ProjectPageProps = {
  project: Project;
  orgKey: string;
};

export const ProjectPage: FC<ProjectPageProps> = ({ project, orgKey }) => {
  return (
    <div>
      <ProjectPageHeader project={project} orgKey={orgKey} />
      <Suspense fallback={<BoardSkeleton />}>
        <ProjectBoard project={project} />
      </Suspense>
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
