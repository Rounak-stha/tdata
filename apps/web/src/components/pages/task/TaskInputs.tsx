"use client";

import { ChangeEvent, FC, useEffect, useRef, useState } from "react";

import { Input } from "@components/ui/input";
import { Editor } from "@tdata/editor";
import { useDebounce, useOrganizations, useUser } from "@/hooks";
import { updateTask } from "@/lib/actions/task";

type TaskTitleProps = {
  taskId: number;
  title: string;
};

export const TaskTitle: FC<TaskTitleProps> = ({ taskId, title: initialTitle }) => {
  const { user } = useUser();
  const { organization } = useOrganizations();
  const [title, setTitle] = useState(initialTitle);
  const { debouncedValue: debouncedTitle, previousValue: previousTitle } = useDebounce(title, 1000);
  const initialRender = useRef(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  useEffect(() => {
    const handleTitleUpdate = async () => {
      await updateTask(
        { id: taskId, organizationId: organization.id },
        {
          name: "StandardFieldUpdate",
          performedBy: user.id,
          data: { title: debouncedTitle, previous: previousTitle || "", value: debouncedTitle },
        },
      );
    };
    if (initialRender.current) {
      initialRender.current = false;
    } else handleTitleUpdate();
  }, [debouncedTitle]);

  return <Input type="text" value={title} onChange={handleChange} className="text-xl md:text-2xl font-semibold bg-transparent border-0 p-0 w-full focus:outline-none" />;
};

type TaskContentProps = {
  taskId: number;
  content?: string;
};

export const TaskContent: FC<TaskContentProps> = ({ content: initialContent }) => {
  const [content] = useState(initialContent);

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  // 	/**
  // 	 * ToDo: Update Task title
  // 	 */
  // 	setContent(e.target.value)
  // }
  return <Editor content={content} className="min-h-[300px]" />;
};
