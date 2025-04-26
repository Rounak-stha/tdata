"use client";

import { useState, useRef, useEffect, FC, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Save, X, Plus, Clock, Users, TagIcon, SlashIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ContentRefValue, DocumentDetail, DocumentTag, Organization, Tag, User } from "@tdata/shared/types";
import { Editor } from "@tdata/editor";
import { useDebounce, useOrganizations, useUser } from "@/hooks";
import { DebounceDelay, LowDebouncedDelay, Paths } from "@/lib/constants";
import { createDocument, createTag, searchTags, updateDocument } from "@/lib/actions/document";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DocumentBreadCrump } from "./doc-breadcrump";

interface DocumentEditorProps {
  document?: DocumentDetail;
  isNew?: boolean;
  onSave?: (document: DocumentDetail) => void;
  onCancel?: () => void;
}

const getDefaultDocument = (organization: Organization, user: User): DocumentDetail => ({
  id: "3",
  title: "",
  excerpt: "",
  organizationId: organization.id,

  tags: [],
  updatedAt: new Date(),
  createdAt: new Date(),
  createdBy: user,
  collaborators: [],
  content: "",
  createdById: "3",
});

export function DocumentEditWrapper({ document: _document, isNew = false, onSave, onCancel }: DocumentEditorProps) {
  const { organization } = useOrganizations();
  const { user } = useUser();
  const document = useMemo(() => _document || getDefaultDocument(organization, user), [organization]);
  const [title, setTitle] = useState(document.title || "Untitled Document");
  const [tags, setTags] = useState<Tag[]>(document.tags || []);
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<ContentRefValue>({} as ContentRefValue);

  useEffect(() => {
    if (isNew && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isNew]);

  const createNewDocument = async () => {
    return await createDocument({
      title,
      content: editorRef.current.getJSON(),
      excerpt: editorRef.current.getExcerpt(),
      tags,
      organizationId: organization.id,
      createdById: user.id,
    });
  };

  const updateCurrentDocument = async () => {
    if (!document.id) throw new Error("Invalid document");
    return await updateDocument({
      id: document.id,
      title,
      content: editorRef.current.getJSON(),
      excerpt: editorRef.current.getExcerpt(),
      tags,
      organizationId: organization.id,
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const upsertedDocument = isNew ? await createNewDocument() : await updateCurrentDocument();

      if (onSave) {
        onSave({ ...document, ...upsertedDocument });
      }

      if (isNew) {
        router.push(Paths.doc(organization.key, upsertedDocument.id));
      }
    } catch {
      toast.error("Failed to save document");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (isNew) {
      router.push("/docs");
    } else {
      router.push(`/docs/${document.id}`);
    }
  };

  const addTag = (tag: Tag) => {
    setTags([...tags, tag]);
  };

  const removeTag = (tagToRemove: string) => {};

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <div className="flex items-center mb-1">
          <div className="flex-1">
            <DocumentBreadCrump document={document} />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel} className="gap-1">
              <X className="h-4 w-4" />
              Cancel
            </Button>

            <Button variant="default" onClick={handleSave} disabled={isSaving} className="gap-1 shadow-sm hover:shadow">
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="md:!text-4xl !text-3xl font-bold tracking-tight border-none px-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Untitled Document"
          />

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Avatar className="h-5 w-5" src={document.createdBy.imageUrl} alt={document.createdBy.name} />
              <span>Editing as {document.createdBy.name}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Not saved yet"}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <TagIcon className="h-3.5 w-3.5" />
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-xs group hover:bg-muted/80 transition-colors">
                    {tag.name}
                    <button
                      onClick={() => removeTag(tag.name)}
                      className="ml-1 rounded-full hover:bg-background/80 h-3.5 w-3.5 inline-flex items-center justify-center text-muted-foreground"
                    >
                      <X className="h-2 w-2" />
                      <span className="sr-only">Remove {tag.name} tag</span>
                    </button>
                  </Badge>
                ))}
                <AddTag onAdd={addTag} tags={tags} organizationId={document.organizationId} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Editor ref={editorRef} content={document.content} />
    </div>
  );
}

type AddTagProps = {
  tags: Tag[];
  onAdd: (tag: Tag) => void;
  organizationId: number;
};

const AddTag: FC<AddTagProps> = ({ tags, onAdd, organizationId }) => {
  const [tagOpen, setTagOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [creatingTag, setCreatingTag] = useState(false);
  const [tagOptions, setTagsOptions] = useState<Tag[]>([]);
  const { debouncedValue: debouncedSearchTerm } = useDebounce(searchTerm, LowDebouncedDelay);

  useEffect(() => {
    async function searchTagsBySearchTerm() {
      try {
        if (!searchTerm) {
          setTagsOptions([]);
          return;
        }
        setSearching(true);
        setTagsOptions([]);
        const tags = await searchTags(searchTerm, organizationId);
        setTagsOptions(tags);
      } catch {
        toast.error("Failed to search tags");
      } finally {
        setSearching(false);
      }
    }
    searchTagsBySearchTerm();
  }, [debouncedSearchTerm]);

  const createTagWithSearchString = async () => {
    if (!searchTerm) {
      return;
    }
    try {
      setCreatingTag(true);
      const newTag = await createTag({ name: searchTerm, organizationId });
      onAdd(newTag);
      setSearchTerm("");
      setTagOpen(false);
    } catch {
      toast.error("Failed to create tag");
    } finally {
      setCreatingTag(false);
    }
  };

  return (
    <Popover open={tagOpen} onOpenChange={setTagOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-5 w-5 p-0 rounded-full">
          <Plus className="h-3 w-3" />
          <span className="sr-only">Add tag</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0" align="start">
        <Command className={cn({ "opacity-30": creatingTag })}>
          <CommandInput placeholder="Add tag..." value={searchTerm} onValueChange={setSearchTerm} />
          <CommandList>
            <CommandEmpty className="p-1">
              {searching ? (
                <div className="flex justify-center text-muted-foreground">Searching...</div>
              ) : searchTerm ? (
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={createTagWithSearchString}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create "{searchTerm}"
                </Button>
              ) : (
                <div className="flex justify-center text-muted-foreground mt-1">Search for tags</div>
              )}
            </CommandEmpty>
            <CommandGroup>
              {tagOptions.map((tag) => (
                <CommandItem
                  key={tag.id}
                  onSelect={() => {
                    onAdd(tag);
                    setTagOpen(false);
                  }}
                >
                  {tag.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
