import { FC } from "react";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRightIcon } from "lucide-react";

export const BreadCrump: FC = () => {
  return (
    <Breadcrumb className="flex items-center gap-1 text-sm">
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Projects</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <ChevronRightIcon className="h-4 w-4 mt-0.5" />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="/project/1">Project Name</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <ChevronRightIcon className="h-4 w-4 mt-0.5" />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink>Tasks</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
};
