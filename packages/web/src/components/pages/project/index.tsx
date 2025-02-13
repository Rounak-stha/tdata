import { FC } from "react";

import { TabsContent } from "@/components/ui/tabs";
import { Project } from "@/types";
import { ProjectPageHeader } from "./header";
import { ProjectTab } from "./tabs";
import { ProjectBoard } from "./board";

type ProjectPageProps = {
  project: Project;
};

export const ProjectPage: FC<ProjectPageProps> = ({ project }) => {
  return (
    <div>
      <ProjectPageHeader project={project} />
      <ProjectTab>
        <TabsContent value="overview" className="mt-0">
          <p>Project Overview</p>
        </TabsContent>
        <TabsContent value="tasks" className="mt-0">
          <ProjectBoard projectId={project.id} />
        </TabsContent>
      </ProjectTab>
    </div>
  );
};
