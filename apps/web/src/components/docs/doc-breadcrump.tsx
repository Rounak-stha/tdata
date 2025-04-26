import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { useOrganizations } from "@/hooks";
import { Paths } from "@/lib/constants";
import { Document } from "@tdata/shared/types";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

type DocumentBreadCrumpProps = {
  document: Document;
};

export const DocumentBreadCrump: FC<DocumentBreadCrumpProps> = ({ document }) => {
  const { organization } = useOrganizations();
  return (
    <Breadcrumb className="flex items-center gap-1 text-sm text-muted-foreground">
      <BreadcrumbItem>
        <Link href={Paths.org(organization.key)}>{organization.key}</Link>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <ChevronRightIcon className="h-4 w-4" />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <Link href={Paths.docs(organization.key)}>Docs</Link>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <ChevronRightIcon className="h-4 w-4" />
      </BreadcrumbItem>
      <BreadcrumbItem>{document.title.slice(0, 10)}...</BreadcrumbItem>
    </Breadcrumb>
  );
};
