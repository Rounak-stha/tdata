"use client";

import { FC } from "react";
import { ViewToggle } from "@components/view-toggle";
import { Filters } from "@components/filter";
import type { Priority, ViewType } from "@type/kanban";
import { BreadCrump } from "./breadcrump";

type HeaderProps = {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  selectedPriorities: Priority[];
  setSelectedPriorities: (priorities: Priority[]) => void;
  selectedStatuses: string[];
  setSelectedStatuses: (statuses: string[]) => void;
};

export const Header: FC<HeaderProps> = ({ view, onViewChange, selectedPriorities, selectedStatuses, setSelectedPriorities, setSelectedStatuses }) => {
  return (
    <div className="w-full flex">
      <div className="flex-1 flex items-center">
        <BreadCrump />
      </div>
      <div className="flex items-center gap-4">
        <ViewToggle view={view} onViewChange={onViewChange} />
        <Filters selectedPriorities={selectedPriorities} selectedStatuses={selectedStatuses} onPriorityChange={setSelectedPriorities} onStatusChange={setSelectedStatuses} />
      </div>
    </div>
  );
};
