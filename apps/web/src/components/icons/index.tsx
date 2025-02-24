import { FC } from "react";

import { cva, VariantProps } from "class-variance-authority";

import { IconColorMap, IconMap } from "@/lib/constants/icon";
import { cn } from "@/lib/utils";
import { IconType } from "@types";
export * from "./google";

const IconComponentVariants = cva("", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

interface IconComponentBaseProps {
  name: IconType;
  className?: string;
}

export interface IconComponentProps extends IconComponentBaseProps, VariantProps<typeof IconComponentVariants> {}

export const IconComponent: FC<IconComponentProps> = ({ name, size, className }) => {
  const Icon = IconMap[name];
  if (!Icon) return null;
  return <Icon className={cn(IconComponentVariants({ size }), `${IconColorMap[name as IconType]}`, className)} />;
};
