import { Avatar } from "@components/ui/avatar";

import { TaskCommentDetail } from "@tdata/shared/types";
import { FC } from "react";
import { extractTextFromJSONString } from "@tdata/editor";

type CommentProps = {
  comment: TaskCommentDetail;
};

export const Comment: FC<CommentProps> = ({ comment }) => {
  const content = extractTextFromJSONString(comment.content);
  return (
    <div className="flex items-start space-x-3 text-sm">
      <Avatar size="md" src={comment.user.imageUrl} />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{comment.user.name}</span>
          <span className="text-gray-500 text-xs">{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="mt-2 text-gray-300">{content}</div>
      </div>
    </div>
  );
};
