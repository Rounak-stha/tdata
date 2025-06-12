import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { DocumentDetailMinimal, Organization } from "@tdata/shared/types";
import { Paths } from "@/lib/constants";

interface DocCardProps {
  document: DocumentDetailMinimal;
  organization: Organization;
}

export function DocCard({ document }: DocCardProps) {
  return (
    <div className="group relative flex items-center justify-between p-4 rounded-sm border bg-card/30 hover:bg-card/60 transition-all hover:shadow-sm">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex-shrink-0">
          <div className="rounded-md bg-primary/10 p-2.5 text-primary">
            <FileText className="h-5 w-5" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Link href={Paths.doc(document.id)} className="font-bold hover:underline truncate">
              {document.title}
            </Link>
          </div>
          {document.excerpt && <p className="text-sm text-muted-foreground line-clamp-1">{document.excerpt}</p>}
          <div className="flex items-center flex-wrap gap-3 mt-1.5">
            <div className="flex items-center gap-1.5">
              <Avatar src={document.createdBy.imageUrl} alt={document.createdBy.name} fallbackText={document.createdBy.name[0]} />
              <span className="text-sm text-muted-foreground">{document.createdBy.name}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              Updated {formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true })}
            </div>
            {document.tags && document.tags.length > 0 && (
              <div className="flex items-center gap-1.5">
                {document.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
                {document.tags.length > 2 && <Badge variant="outline">+{document.tags.length - 2}</Badge>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
