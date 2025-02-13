import { Heading3 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { SettingsIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

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
