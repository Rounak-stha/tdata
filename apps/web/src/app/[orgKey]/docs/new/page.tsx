"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { DocumentEditWrapper } from "@/components/docs/doc-edit-wrapper";

export default function NewDocumentPage() {
  return (
    <div className="px-6 py-4">
      <DocumentEditWrapper isNew={true} />
    </div>
  );
}
