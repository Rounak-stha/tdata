"use client";

import { ComponentProps, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Editor } from "@tdata/editor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusSelect } from "@components/selects/status";
import { PrioritySelect } from "@components/selects/priority";
import { AssigneeSelect } from "@components/selects/assignee";
import { Priority } from "@/types/kanban";
import { WorkflowStatus } from "@/types/workflow";
import { ProjectSelect } from "./selects/project";
import { ContentRefValue, DynamicFormItemContentRefValue, FormItemContentRefValue } from "@tdata/global";
import { useOrganizations, useUser } from "@/hooks";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { toast } from "sonner";
import { Project } from "@/types/project";
import { createTask } from "@/lib/actions/task";
import { Paths } from "@/lib/constants";
import { useProjectTemplate } from "@/hooks/data";
import { ChevronRightIcon } from "lucide-react";
import { Label } from "@components/ui/label";
import { TaskPropertyTypes, TemplateProperty } from "@/types/template";
import { CustomProperty, CustomUserProperty } from "./common/custom-property";
import { ChangeParams, InsertTaskData, TaskProperty, TaskPropertyValue, TaskUserRelationMinimal, User } from "@/types";

interface NewTaskPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentTaskId?: string;
  parentTaskTitle?: string;
  status: WorkflowStatus;
  priority?: Priority;
  project?: Project;
}

type FormItem = "title" | "project" | "content" | "status" | "priority" | "assignee";

type FormItemValue = {
  assignee: string[] | undefined; // Assignee Id
  content: string;
  priority: Priority;
  project: Project | undefined;
  status: WorkflowStatus;
  title: string;
  date: Date | undefined;
  parentId: string | undefined;
};

type FormRef = { [key in FormItem]: FormItemContentRefValue<FormItemValue[key]> | null };
type DynamicFormItemRef = { [key: string]: DynamicFormItemContentRefValue<TaskPropertyValue> | null };

const REQUIRED_FORM_REF_KEYS = ["title", "project"] as const;
const ErrorDisplayDuration = 3000;

export function NewTaskPopup({ open, onOpenChange, parentTaskId, parentTaskTitle, status, priority, project: initialProject }: NewTaskPopupProps) {
  const [loading, setLoading] = useState(false);
  const formRefs = useRef<FormRef>({} as FormRef);
  const dynamicFormItemRefs = useRef<DynamicFormItemRef>({} as DynamicFormItemRef);

  const { organization } = useOrganizations();
  const [project, setProject] = useState(initialProject || organization.projects[0]);
  const { data: projectTemplate, isLoading: isLoadingProjectTemplate } = useProjectTemplate(project.id);
  const { user } = useUser();
  const router = useRouter();

  if (!organization.projects.length) {
    toast.error("No projects found in the organization. Create a project to create a task");
    onOpenChange(false);
    return null;
  }

  if (!isLoadingProjectTemplate && !projectTemplate) {
    toast.error("Selected Project is corrupted. No Template Found");
    onOpenChange(false);
    return null;
  }

  const validateForm = () => {
    let hasError = false;

    REQUIRED_FORM_REF_KEYS.forEach((key) => {
      const ref = formRefs.current[key];
      if (!ref?.validate()) {
        hasError = true;
      }
    });

    Object.values(dynamicFormItemRefs.current).forEach((ref) => {
      if (!ref?.validate()) {
        console.log(ref?.type + "has error");
        hasError = true;
      }
    });

    return hasError;
  };

  const getTaskData = (): InsertTaskData => {
    const title = formRefs.current["title"]?.getContent() as FormItemValue["title"];
    const projectId = (formRefs.current["project"]?.getContent() as FormItemValue["project"])?.id || 0;
    const content = formRefs.current["content"]?.getContent() as FormItemValue["content"];
    const statusId = (formRefs.current["status"]?.getContent() as FormItemValue["status"]).id;
    const priority = formRefs.current["priority"]?.getContent() as FormItemValue["priority"];
    const organizationId = organization.id;
    const assignee = formRefs.current["assignee"]?.getContent() as FormItemValue["assignee"];
    const createdBy = user.id;
    const [properties, userRelations] = Object.entries(dynamicFormItemRefs.current).reduce(
      (a, [key, ref]) => {
        const content = ref?.getContent();
        if (content) {
          if (ref?.type === "user") {
            a[1][key] = content as string[];
          } else {
            a[0][key] = content;
          }
        }
        return a;
      },
      [{}, {}] as [TaskProperty, TaskUserRelationMinimal]
    );

    if (assignee) {
      userRelations["assignee"] = assignee;
    }

    return {
      title,
      organizationId,
      projectId,
      content,
      statusId,
      priority,
      createdBy,
      properties,
      userRelations,
    };
  };

  const submitForm = async () => {
    try {
      setLoading(true);
      if (validateForm()) return;
      const taskData = getTaskData();
      console.log(taskData);
      const createdTask = await createTask(taskData);
      // onCreate(createdTask);
      router.push(Paths.task(organization.key, createdTask.taskNumber));
    } catch (error) {
      console.log(error);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <VisuallyHidden>
        <DialogTitle>New Task Dialog</DialogTitle>
      </VisuallyHidden>
      <DialogContent className="sm:max-w-[800px] bg-muted border p-0">
        <div className="flex flex-col h-[80vh]">
          <DialogHeader className="p-4 border-b flex-shrink-0">
            <div className="flex items-center gap-2">
              <span>New Task</span>
              <ChevronRightIcon size={16} className="text-primary" />
              <SelectProjectFormItem
                ref={(val) => {
                  formRefs.current["project"] = val;
                }}
                project={project}
                onChange={setProject}
              />
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
              <span>{parentTaskId}</span>
              <span>{parentTaskTitle}</span>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-grow">
            <div className="p-4 space-y-4">
              <TitleFormItem
                ref={(val) => {
                  formRefs.current["title"] = val;
                }}
              />
              <EditorFormItem
                ref={(val) => {
                  formRefs.current["content"] = val;
                }}
              />
            </div>
          </ScrollArea>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <SelectStatusFormItem
              ref={(val) => {
                formRefs.current["status"] = val;
              }}
              status={status}
              allStatus={projectTemplate?.workflow.statuses || []}
              isLoading={isLoadingProjectTemplate}
            />
            <SelectPriorityFormItem
              ref={(val) => {
                formRefs.current["priority"] = val;
              }}
              priority={priority}
            />
            <SelectAssigneeFormItem
              ref={(val) => {
                formRefs.current["assignee"] = val;
              }}
              singleUser={projectTemplate?.singleAssignee || false}
            />

            {isLoadingProjectTemplate && <CustomPropertySkeletons />}

            {projectTemplate?.taskProperties
              ? projectTemplate.taskProperties.map((property) => {
                  if (property.type == "user") {
                    return (
                      <CustomUserPropertyFormItem
                        ref={(val) => {
                          dynamicFormItemRefs.current[property.name] = val;
                        }}
                        key={property.name}
                        {...property}
                        value={[]}
                      />
                    );
                  }
                  return (
                    <CustomPropertyFormItem
                      ref={(val) => {
                        dynamicFormItemRefs.current[property.name] = val;
                      }}
                      key={property.name}
                      {...property}
                      type={property.type as Exclude<TemplateProperty["type"], "user">}
                    />
                  );
                })
              : null}
            {/* <Button
									variant='outline'
									size='sm'
									className='h-7 bg-[#2A2A2A] text-gray-100 border hover:bg-gray-800 hover:text-gray-100 whitespace-nowrap'
								>
									{parentTaskId}
								</Button> */}
          </div>

          <DialogFooter className="p-4 border-t flex-shrink-0">
            <div className="flex items-center gap-2 ml-auto">
              <Button disabled={loading} variant="ghost" onClick={() => onOpenChange(false)}>
                Discard
              </Button>
              <Button disabled={loading} onClick={submitForm}>
                Save
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const TitleFormItem = forwardRef<FormItemContentRefValue<FormItemValue["title"]>>(function Title(_, ref) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    getContent: () => inputRef.current?.value || "",
    validate: () => {
      if (!inputRef.current?.value) {
        setTooltipOpen(true);
        return false;
      }
      return true;
    },
  }));

  useEffect(() => {
    if (tooltipOpen) {
      setTimeout(() => {
        setTooltipOpen(false);
      }, ErrorDisplayDuration);
    }
  }, [tooltipOpen]);

  return (
    <TooltipProvider>
      <Tooltip open={tooltipOpen}>
        <TooltipTrigger asChild>
          <Input ref={inputRef} placeholder="Title" className="focus-visible:ring-ring" autoFocus />
        </TooltipTrigger>
        <TooltipContent align="start" sideOffset={10}>
          <p className="text-xs p-1 bg-destructive text-foreground rounded-md">Title is requried</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

const EditorFormItem = forwardRef<FormItemContentRefValue<FormItemValue["content"]>>(function ContentEditorFormItem(_, ref) {
  const editorRef = useRef<ContentRefValue | null>({} as ContentRefValue);

  useImperativeHandle(ref, () => ({
    getContent: () => editorRef.current?.getContent() || "",
    validate: () => true,
  }));

  return (
    <Editor
      ref={(val) => {
        editorRef.current = val;
      }}
    />
  );
});

const SelectProjectFormItem = forwardRef<FormItemContentRefValue<FormItemValue["project"]>, { project?: Project; onChange: (project: Project) => void }>(
  function SelectPriorityFormItem({ project, onChange }, ref) {
    const [tooltipOpen, setTooltipOpen] = useState(false);

    useEffect(() => {
      if (tooltipOpen) {
        setTimeout(() => {
          setTooltipOpen(false);
        }, ErrorDisplayDuration);
      }
    }, [tooltipOpen]);

    useImperativeHandle(ref, () => ({
      getContent: () => project,
      validate: () => {
        if (!project) {
          setTooltipOpen(true);
          return false;
        }
        return true;
      },
    }));

    return (
      <TooltipProvider>
        <Tooltip open={tooltipOpen}>
          <TooltipTrigger asChild>
            <div>
              <ProjectSelect project={project} onSelect={onChange} />
            </div>
          </TooltipTrigger>
          <TooltipContent align="start" sideOffset={10}>
            <p className="text-xs p-1 bg-destructive text-foreground rounded-md">Project is requried</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

const SelectPriorityFormItem = forwardRef<FormItemContentRefValue<FormItemValue["priority"]>, { priority?: Priority }>(function SelectPriorityFormItem(
  { priority: initialPriority },
  ref
) {
  const [priority, setPriority] = useState<Priority>(initialPriority || "MEDIUM");

  useImperativeHandle(ref, () => ({
    getContent: () => priority,
    validate: () => true,
  }));

  const handleChange = (change: ChangeParams<Priority>) => {
    setPriority(change.newValue);
  };

  return (
    <div className="relative">
      <Label className="text-muted-foreground">Priority</Label>
      <PrioritySelect size="full" priority={priority} onChange={handleChange} />
    </div>
  );
});

const SelectStatusFormItem = forwardRef<FormItemContentRefValue<FormItemValue["status"]>, { status?: WorkflowStatus; allStatus: WorkflowStatus[]; isLoading: boolean }>(
  function SelectStatusFormItem({ status: initialStatus, allStatus, isLoading }, ref) {
    const [status, setStatus] = useState<WorkflowStatus>(initialStatus || allStatus[0]);

    useImperativeHandle(ref, () => ({
      getContent: () => status,
      validate: () => true,
    }));

    const handleChange = (change: ChangeParams<WorkflowStatus>) => {
      setStatus(change.newValue);
    };
    return (
      <div className="relative">
        <Label className="text-muted-foreground">Status</Label>
        <StatusSelect size="full" status={status} allStatus={allStatus} onChange={handleChange} isLoading={isLoading} />
      </div>
    );
  }
);

const SelectAssigneeFormItem = forwardRef<FormItemContentRefValue<FormItemValue["assignee"]>, { singleUser: boolean; assignee?: User[] }>(function SelectStatusFormItem(
  { singleUser, assignee: initialAssignee },
  ref
) {
  const [assignee, setAssignee] = useState<User[] | undefined>(initialAssignee);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    if (tooltipOpen) {
      setTimeout(() => {
        setTooltipOpen(false);
      }, ErrorDisplayDuration);
    }
  }, [tooltipOpen]);

  useEffect(() => {
    console.log("Assinee is: ", assignee);
  }, [assignee]);

  useImperativeHandle(ref, () => ({
    getContent: () => assignee && assignee.map((user) => user.id),
    validate: () => {
      if (!assignee || !assignee.length) {
        setTooltipOpen(true);
        return false;
      }
      return true;
    },
  }));

  const handleAssigneeChange = (change: ChangeParams<User[]>) => {
    console.log(change);
    setAssignee(change.newValue);
  };
  return (
    <TooltipProvider>
      <Tooltip open={tooltipOpen}>
        <div>
          <Label className="text-muted-foreground">Asignee</Label>
          <TooltipTrigger asChild>
            <div>
              <AssigneeSelect size="full" assignee={assignee} singleUser={singleUser} onChange={handleAssigneeChange} />
            </div>
          </TooltipTrigger>
        </div>
        <TooltipContent align="start" sideOffset={10}>
          <p className="text-xs p-1 bg-destructive text-foreground rounded-md">Assignee is requried</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

const CustomPropertySkeletons = () => {
  return Array.from({ length: 3 }).map((_, i) => <CustomPropertySkeleton key={i} />);
};

const CustomPropertySkeleton = () => {
  return (
    <div>
      <p className="w-16 h-4 bg-accent animate-pulse mb-1 rounded-sm"></p>
      <p className="w-full h-9 bg-accent animate-pulse rounded-sm"></p>
    </div>
  );
};

const CustomPropertyFormItem = forwardRef<DynamicFormItemContentRefValue<TaskPropertyValue>, ComponentProps<typeof CustomProperty>>(function CustomPropertyFormItem(props, ref) {
  const [value, setValue] = useState<TaskPropertyValue>("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (showError) {
      const timeoutId = setTimeout(() => {
        setShowError(false);
      }, ErrorDisplayDuration);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [showError]);

  useImperativeHandle(ref, () => ({
    getContent: () => value,
    type: props.type,
    validate: () => {
      if (props.required && !value) {
        setShowError(true);
        return false;
      }
      return true;
    },
  }));

  const handeleChange = (change: ChangeParams<TaskPropertyValue>) => {
    setValue(change.newValue);
  };

  return (
    <TooltipProvider>
      <Tooltip open={showError}>
        <CustomProperty asTooltipTrigger size="full" {...props} value={value} onChange={handeleChange} />
        <TooltipContent align="start" sideOffset={20}>
          <p className="text-xs p-1 bg-destructive text-foreground rounded-md">{props.name} is requried</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

const CustomUserPropertyFormItem = forwardRef<DynamicFormItemContentRefValue<TaskPropertyValue>, ComponentProps<typeof CustomUserProperty>>(function CustomPropertyFormItem(
  props,
  ref
) {
  const [users, setUsers] = useState<User[]>([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (showError) {
      const timeoutId = setTimeout(() => {
        setShowError(false);
      }, ErrorDisplayDuration);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [showError]);

  useImperativeHandle(ref, () => ({
    getContent: () => users.map((u) => u.id),
    type: "user" as TaskPropertyTypes,
    validate: () => {
      if (props.required && !users.length) {
        setShowError(true);
        return false;
      }
      return true;
    },
  }));

  const handlChange = (change: ChangeParams<User[]>) => {
    setUsers(change.newValue);
  };

  return (
    <TooltipProvider>
      <Tooltip open={showError}>
        <CustomUserProperty asTooltipTrigger size="full" {...props} value={users} onChange={handlChange} />
        <TooltipContent align="start" sideOffset={20}>
          <p className="text-xs p-1 bg-destructive text-foreground rounded-md">{props.name} is requried</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
