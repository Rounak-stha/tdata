"use client";

import { Comment, CommentBox } from "@/components/comment";
import { Avatar, AvatarSkeleton } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks";
import { useTaskActivities } from "@/hooks/data/task";
import { type Comment as TComment, TaskActivityDetail, TaskFieldActivityMetadata, TaskUserRelationActivityMetadata } from "@/types";
import { FC } from "react";

type TaskActivitiesProps = {
  taskId: number;
};

export const TaskActivities: FC<TaskActivitiesProps> = ({ taskId }) => {
  const { user } = useUser();
  const { data, isLoading, loadMore, pageSize, addOptimisticData } = useTaskActivities(taskId);

  const isEmpty = data?.[0]?.length === 0;
  const reachedEnd = isEmpty || (data && data[data.length - 1]?.length < pageSize);

  const addOptimisticCommet = (comment: TComment) => {
    addOptimisticData({ ...comment, type: "comment", user });
  };

  return (
    <div>
      <div className="space-y-4">
        <CommentBox taskId={taskId} onComment={addOptimisticCommet} />
        {data &&
          data.map((activities) => {
            return activities.map((activity) => {
              if (activity.type == "activity") return <Activity key={activity.id} activity={activity} />;
              return <Comment key={activity.id} comment={activity} />;
            });
          })}
        {isLoading && Array.from({ length: 5 }).map((_, i) => <ActivitySkeleton key={i} />)}
        {!isLoading && !reachedEnd && <Button onClick={() => loadMore()}>Load More</Button>}
      </div>
    </div>
  );
};

const ActivitySkeleton = () => {
  return (
    <div className="flex items-center space-x-3 text-sm">
      <AvatarSkeleton size="md" />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="h-4 w-20 rounded-sm animate-pulse bg-accent"></span>
          <span className="h-4 flex-1 rounded-sm animate-pulse bg-accent"></span>
        </div>
      </div>
    </div>
  );
};

type ActivityProps = {
  activity: TaskActivityDetail;
};
const Activity: FC<ActivityProps> = ({ activity }) => {
  const action = activity.action;
  switch (action) {
    case "FIELD_UPDATE":
      return <FieldUpdateActivity activity={activity} />;
    case "TASK_CREATE":
      return <TaskCreateActivity activity={activity} />;
    /* case "COMMENT_ADD":
		case "COMMENT_DELETE":
		case "ATTACHMENT_UPLOAD":
		case "ATTACHMENT_DELETE":
		case "TASK_DELETE": */
  }
};

const FieldUpdateActivity: FC<{ activity: TaskActivityDetail }> = ({ activity }) => {
  const { type } = activity.metadata;

  if (type == "user") {
    return <TaskUserRelationActivity activity={activity} />;
  }

  const { name, to } = activity.metadata as TaskFieldActivityMetadata;

  return (
    <div className="flex items-start space-x-3 text-sm">
      <Avatar size="md" src={activity.user.imageUrl} />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{activity.user.name}</span>
          <span className="text-gray-400">
            updated {name} to{" "}
            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
              {to}
            </Badge>
          </span>
          <span className="text-gray-500 text-xs">{new Date(activity.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

const TaskCreateActivity: FC<{ activity: TaskActivityDetail }> = ({ activity }) => {
  return (
    <div className="flex items-start space-x-3 text-sm">
      <Avatar size="md" src={activity.user.imageUrl} />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{activity.user.name}</span>
          <span className="text-gray-400">created the task</span>
          <span className="text-gray-500 text-xs">{new Date(activity.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

const TaskUserRelationActivity: FC<{ activity: TaskActivityDetail }> = ({ activity }) => {
  const { name, subtype, user } = activity.metadata as TaskUserRelationActivityMetadata;
  return (
    <div className="flex items-start space-x-3 text-sm">
      <Avatar size="md" src={activity.user.imageUrl} />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{activity.user.name}</span>
          {subtype == "add" && (
            <span className="text-gray-400">
              upadted {name} to {user.name}
            </span>
          )}
          {subtype == "remove" && (
            <span className="text-gray-400">
              removed {user.name} as {name}
            </span>
          )}
          <span className="text-gray-500 text-xs">{new Date(activity.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
