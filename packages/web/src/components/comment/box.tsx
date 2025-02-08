import { Avatar } from "@components/ui/avatar";
import { Editor, type EditorRenderActionProps } from "@tdata/editor";
import { ContentRefValue } from "@tdata/global";
import { FC, useRef } from "react";
import { Button } from "@components/ui/button";
import { useOrganizations, useUser } from "@/hooks";
import { addComment } from "@/lib/actions/task";
import { Comment } from "@/types";

type CommentBoxProps = {
  taskId: number;
  onComment?: (comment: Comment) => void;
};

export const CommentBox: FC<CommentBoxProps> = ({ taskId, onComment }) => {
  const editorContentRef = useRef<ContentRefValue>(null);
  const { organization } = useOrganizations();
  const { user } = useUser();

  const handleComment = async () => {
    const content = editorContentRef.current?.getContent();

    if (content) {
      const comment = await addComment({ taskId, organizationId: organization.id, content, userId: user.id });
      if (onComment) onComment(comment);
    }
  };
  return (
    <div className="flex space-x-3">
      <Avatar size="lg" className="mt-1" src="/placeholder.svg" />
      <Editor ref={editorContentRef} className="border rounded-sm py-1 px-4 min-h-16 text-sm" renderActions={(p) => <EditorActions {...p} onComment={handleComment} />} />
    </div>
  );
};

function EditorActions({ resetEditor, onComment }: EditorRenderActionProps & { onComment: () => void }) {
  const handleComment = () => {
    onComment();
    resetEditor();
  };
  return (
    <div className="flex items-center space-x-3">
      <div className="flex-1"></div>
      <Button onClick={resetEditor} size="sm" variant="ghost">
        Cancel
      </Button>
      <Button onClick={handleComment} size="sm">
        Comment
      </Button>
    </div>
  );
}
