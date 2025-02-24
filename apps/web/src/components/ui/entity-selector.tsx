"use client";

import * as React from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface EntitySelectorProps {
  entities: { label: string; value: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function EntitySelector({ entities, selected, onChange }: EntitySelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Open settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60" align="end">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Show/Hide Items</h4>
          <div className="space-y-2">
            {entities.map((entity) => (
              <div key={entity.value} className="flex items-center space-x-2">
                <Checkbox
                  id={entity.value}
                  checked={selected.includes(entity.value)}
                  onCheckedChange={(checked) => {
                    onChange(checked ? [...selected, entity.value] : selected.filter((value) => value !== entity.value));
                  }}
                />
                <Label htmlFor={entity.value}>{entity.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
