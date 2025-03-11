"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

import { useOrganizations, useUser } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createProject } from "@/lib/actions/project";
import { ProjectTemplateUI } from "@types";
import { Paths } from "@/lib/constants";

interface ProjectDetailsFormProps {
  template: ProjectTemplateUI;
  onBack: () => void;
}

interface FormErrors {
  name?: string;
  key?: string;
  description?: string;
}

export function ProjectDetailsForm({ template, onBack }: ProjectDetailsFormProps) {
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { organization } = useOrganizations();
  const { user } = useUser();

  // const router = useRouter()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Project name is required";
    } else if (name.length > 50) {
      newErrors.name = "Project name cannot exceed 50 characters";
    }

    if (!key.trim()) {
      newErrors.key = "Project key is required";
    } else if (key.length < 2 || key.length > 10) {
      newErrors.key = "Project key must be between 2 and 10 characters";
    } else if (!/^[A-Z0-9]+$/.test(key)) {
      newErrors.key = "Project key must contain only uppercase letters and numbers";
    }

    if (description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        setLoading(true);
        const createdProject = await createProject(
          {
            name,
            key,
            description,
            organizationId: organization.id,
            createdBy: user.id,
          },
          { ...template }
        );
        resetForm();

        toast.success("Project created successfully");
        router.push(Paths.project(organization.key, createdProject.key));
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setKey("");
    setDescription("");
    setErrors({});
  };

  // Auto-generate project key from name
  const generateKeyName = useCallback(() => {
    if (!key) {
      const generatedKey = name
        .split(" ") // Split the name into words
        .map((word) => word.charAt(0).toUpperCase()) // Get the first letter of each word and convert to uppercase
        .join(""); // Join the letters together to form the initials
      setKey(generatedKey);
    }
  }, [key, name]);
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[800px] mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="h-4 w-4" />
          Back to templates
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} onBlur={generateKeyName} placeholder="My Awesome Project" />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            <p className="text-sm text-muted-foreground">This is the display name for your project.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="key">Project Key</Label>
            <Input id="key" value={key} onChange={(e) => setKey(e.target.value.toUpperCase())} placeholder="MAP" />
            {errors.key && <p className="text-sm text-destructive">{errors.key}</p>}
            <p className="text-sm text-muted-foreground">A unique identifier used in task IDs (e.g., MAP-123).</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your project..." className="resize-none" />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            <p className="text-sm text-muted-foreground">Optional project description.</p>
          </div>
          <Button disabled={loading} type="submit">
            Create Project
          </Button>
        </form>
      </div>
    </div>
  );
}
