export type EventType = "TASK_CREATED" | "TASK_UPDATED";

export interface BaseMessage<T> {
  event: EventType;
  payload: T;
  userId: string;
  timestamp: number;
}

export interface TaskEventContent {
  taskId: number;
}

export type TaskMessage = BaseMessage<TaskEventContent>;
