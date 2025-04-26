"use client";

import { FC, useState } from "react";
import Link from "next/link";

import { DocumentEditWrapper } from "@/components/docs/doc-edit-wrapper";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DocumentDetail, DocumentDetailMinimal, Organization } from "@tdata/shared/types";
import { ClockIcon, Edit2Icon, TagIcon, PlusCircle } from "lucide-react";

import { DocCard } from "@/components/docs/doc-card";

import { Badge } from "@/components/ui/badge";
import { Editor } from "@tdata/editor";
import { Paths } from "@/lib/constants";
import { DocumentBreadCrump } from "@/components/docs/doc-breadcrump";

type DocumentPageProps = {
  document: DocumentDetail;
};

export const DocumentPage: FC<DocumentPageProps> = ({ document: _document }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [document, setDocument] = useState(_document);

  return (
    <div className="px-6 py-4 animate-in fade-in duration-300">
      {isEditing ? (
        <DocumentEditWrapper
          document={document}
          onCancel={() => setIsEditing(false)}
          onSave={(document) => {
            setIsEditing(false);
            setDocument(document);
          }}
        />
      ) : (
        <>
          <div className="mb-6">
            <div className="flex items-center mb-1">
              <div className="flex-1">
                <DocumentBreadCrump document={document} />
              </div>
              <div className="mb-1">
                <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit2Icon className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{document.title}</h1>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Avatar className="h-5 w-5" src={document.createdBy.imageUrl} alt={document.createdBy.name} />
                  <span>Created by {document.createdBy.name}</span>
                </div>

                <div className="flex items-center gap-1">
                  <ClockIcon className="h-3.5 w-3.5" />
                  <span>
                    Updated {new Date(document.updatedAt).toLocaleDateString()} at {new Date(document.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {document.tags && document.tags.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <TagIcon className="h-3.5 w-3.5" />
                    <div className="flex flex-wrap gap-1.5">
                      {document.tags.map((tag) => (
                        <Badge key={tag.id} variant="secondary" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Editor content={document.content} readonly />
        </>
      )}
    </div>
  );
};

type DocumentListPage = {
  documents: DocumentDetailMinimal[];
  organization: Organization;
};

export const DocumentListPage: FC<DocumentListPage> = ({ documents, organization }) => {
  return (
    <div className="px-6 py-4 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Documents</h1>
          <p className="text-muted-foreground">Create, manage and collaborate on documents</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={Paths.newDoc(organization.key)}>
            <Button className="gap-2 shadow-sm transition-all hover:shadow-md">
              <PlusCircle className="h-4 w-4" />
              New Document
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1">
        {" "}
        {/* md:grid-cols-[1fr_250px] gap-6 */}
        <div className="space-y-6">
          {/* <div className="relative flex-1">
			<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
			<Input placeholder="Search documents..." className="pl-10" />
		  </div> */}

          <div className="grid grid-cols-1 gap-4">
            {documents.map((doc) => (
              <DocCard key={doc.id} document={doc} organization={organization} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          {/* <div className="bg-muted/40 rounded-lg p-5 border border-border/50">
			<h3 className="font-medium mb-3">Tags</h3>
			<div className="flex flex-wrap gap-2">
			  {Array.from(new Set(docs.flatMap((doc) => doc.tags))).map((tag) => (
				<Badge key={tag.id} variant="outline" className="hover:bg-muted cursor-pointer transition-colors">
				  {tag.name}
				</Badge>
			  ))}
			</div>
		  </div> */}

          {/* <div className="bg-muted/40 rounded-lg p-5 border border-border/50">
			<h3 className="font-medium mb-3">Recent Activity</h3>
			<div className="space-y-4">
			  {docs
				.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
				.slice(0, 3)
				.map((doc) => (
				  <div key={doc.id} className="flex items-start gap-3">
					<div className="rounded-full bg-muted w-8 h-8 flex items-center justify-center text-xs font-medium overflow-hidden">
					  <img src={doc.createdBy.imageUrl || "/placeholder.svg"} alt={doc.createdBy.name} className="w-full h-full object-cover" />
					</div>
					<div>
					  <p className="text-sm">
						<span className="font-medium">{doc.createdBy.name}</span> updated{" "}
						<Link href={`/docs/${doc.id}`} className="text-primary hover:underline">
						  {doc.title}
						</Link>
					  </p>
					  <p className="text-xs text-muted-foreground">
						{new Date(doc.updatedAt).toLocaleDateString()} at {new Date(doc.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
					  </p>
					</div>
				  </div>
				))}
			</div>
		  </div> */}
        </div>
      </div>
    </div>
  );
};
