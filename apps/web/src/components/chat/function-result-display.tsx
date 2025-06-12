import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, FileTextIcon } from "lucide-react";
import { DocumentEmbeddingsMinimalForLLM, TaskMinimalGroupedByStatus } from "@tdata/shared/types";
import { FC, useMemo } from "react";
import { TaskList } from "../pages/my-tasks";
import Link from "next/link";
import { Paths } from "@/lib/constants";

type ChatTaskCardProps = {
  tasks: TaskMinimalGroupedByStatus[];
};

export const ChatTaskAssignedTaskList: FC<ChatTaskCardProps> = ({ tasks }) => {
  const total = useMemo(() => tasks.reduce((acc, group) => acc + group.tasks.length, 0), [tasks]);
  return (
    <Card className="p-4 bg-[#1a1a1a] border-[#2a2a2a] text-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium flex items-center">
          <CheckCircleIcon className="h-4 w-4 mr-2 text-[#3b82f6]" />
          Your Tasks
        </h3>
        <Badge variant="outline" className="bg-[#2a2a2a] text-white border-[#3b82f6]">
          {total} {total === 1 ? "task" : "tasks"}
        </Badge>
      </div>

      {tasks.length === 0 ? <div className="text-center py-6 text-gray-400 text-sm">No tasks assigned to you right now.</div> : <TaskList tasks={tasks} />}
    </Card>
  );
};

type DocumentSourceProps = {
  /**
   * This is actually a list of rows from the DocumentEmbeddings table which are returned as the result of the function call
   * We only need the documentId part to link to the sources
   */
  documents: DocumentEmbeddingsMinimalForLLM[];
};

export const DocumentSource: FC<DocumentSourceProps> = ({ documents }) => {
  const documentMap = useMemo(
    () =>
      documents.reduce(
        (a, c) => {
          if (a[c.document.id]) return a;
          else {
            a[c.document.id] = c.document.title;
            return a;
          }
        },
        {} as Record<string, string>,
      ),
    [documents],
  );

  return (
    <div className="mt-1">
      <p className="font-bold mb-0.5">Sources</p>
      <ul>
        {Object.entries(documentMap).map(([id, title]) => (
          <Link key={id} href={Paths.doc(id)} className="flex items-center gap-1 font-bold text-primary">
            <FileTextIcon size={20} />
            <li className="mt-0.5">{title}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
};
