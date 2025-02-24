import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FC, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";
import { Project } from "@tdata/shared/types";
import { useOrganizationProject } from "@/hooks";

interface ProjectSelectProps {
  project?: Project;
  onSelect?: (project: Project) => void;
}

export const ProjectSelect: FC<ProjectSelectProps> = ({ project, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(project);
  const projects = useOrganizationProject();

  const handleSelect = (id: number) => {
    const project = projects.find((p) => p.id === id);
    setSelectedProject(project);
    setOpen(false);
    if (onSelect) onSelect(project!);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <Popover open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-fit p-0 px-2 flex items-center justify-center bg-inherit">
                {selectedProject ? <span className="ml-0.5">{selectedProject.name}</span> : <span className="ml-0.5">Select Project</span>}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>{selectedProject ? selectedProject.name : "Assign task"}</TooltipContent>
          <PopoverContent align="start" className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search assignee..." />
              <CommandEmpty>No assignee found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {projects.map((project) => (
                    <CommandItem key={project.id} onSelect={() => handleSelect(project.id)} value={project.name}>
                      {project.name}
                      <CheckIcon className={cn("ml-auto h-4 w-4", selectedProject?.id === project.id ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </Tooltip>
    </TooltipProvider>
  );
};
