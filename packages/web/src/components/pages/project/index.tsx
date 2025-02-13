import { FC, Suspense } from "react";

import { TabsContent } from "@/components/ui/tabs";
import { Project } from "@/types";
import { ProjectPageHeader } from "./header";
import { ProjectTab } from "./tabs";
import { ProjectBoard } from "./board";
import { BoardSkeleton } from "./board/loading";

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
        <TabsContent value="board" className="mt-0">
          <Suspense fallback={<BoardSkeleton />}>
            <ProjectBoard projectId={project.id} />
          </Suspense>
        </TabsContent>
      </ProjectTab>
    </div>
  );
};
