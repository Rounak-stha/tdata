"use client";

import { FC, useMemo, useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { IconMap } from "@/lib/constants/icon";
import { IconType } from "@types";
import { IconComponent } from "../icons";
import { cn } from "@/lib/utils";

type IconSelectProps = {
  icon?: IconType;
  onSelect?: (value: IconType) => void;
};

export const IconSelect: FC<IconSelectProps> = ({ icon, onSelect }) => {
  const [selectedIcon, setSelectedIcon] = useState(icon);
  const icons = useMemo(() => Object.keys(IconMap), []);
  const Icon = selectedIcon && IconMap[selectedIcon];

  const handleSelect = (value: IconType) => {
    setSelectedIcon(value);
    if (onSelect) onSelect(value);
  };

  return (
    <Select onValueChange={handleSelect} value={selectedIcon}>
      <SelectTrigger className={cn({ "w-full": !Icon, "[&>svg]:hidden w-fit": Icon })}>
        <SelectValue placeholder="Select Icon">
          <span>{Icon && <IconComponent name={selectedIcon} />}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {icons.map((name) => (
          <SelectItem key={name} value={name}>
            <IconComponent name={name as IconType} size="md" />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
