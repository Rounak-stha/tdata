import { FC } from "react";

import { TaskPropertyTypes } from "@types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { AllTaskPropertyTypes } from "@/lib/constants/template";

type AttributeTypeSelectProps = {
  type: TaskPropertyTypes;
  onSelect: (type: TaskPropertyTypes) => void;
};

export const AttributeTypeSelect: FC<AttributeTypeSelectProps> = ({ type, onSelect }) => {
  return (
    <Select onValueChange={onSelect} value={type}>
      <SelectTrigger className="w-full col-span-2">
        <SelectValue placeholder="Select Attribute Type" />
      </SelectTrigger>
      <SelectContent>
        {AllTaskPropertyTypes.map((name) => (
          <SelectItem key={name} value={name}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
