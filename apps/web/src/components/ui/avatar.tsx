"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";
import { ImageIcon, Loader2Icon, UserIcon } from "lucide-react";

const AvatarRoot = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root ref={ref} className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props} />
));
AvatarRoot.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Image>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>>(
  ({ className, ...props }, ref) => <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />,
);
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Fallback>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback ref={ref} className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted text-xs", className)} {...props} />
  ),
);
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

type AvatarProps = {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = "md", className: customCn }) => {
  const className = cn(
    {
      "h-4 w-4": size === "sm",
      "h-6 w-6": size === "md",
      "h-8 w-8": size == "lg",
    },
    customCn,
  );

  const fallbckClassName = cn({
    "p-0.5": size === "sm",
    "p-1": size === "md",
    "p-2": size == "lg",
  });
  return (
    <AvatarRoot className={className}>
      {/*  @ts-expect-error Pass null of no src as an empty string may cause the browser to download the whole page again */}
      <AvatarImage src={src || null} alt={alt} />
      <AvatarFallback className={fallbckClassName}>
        <UserIcon />
      </AvatarFallback>
    </AvatarRoot>
  );
};

const AvatarSkeleton: React.FC<AvatarProps> = ({ size = "md" }) => {
  const className = cn("rounded-full animate-pulse bg-accent", {
    "h-4 w-4": size === "sm",
    "h-6 w-6": size === "md",
    "h-8 w-8": size == "lg",
  });
  return <div className={className}></div>;
};

type AvatarUploadProps = {
  avatar?: string;
  isUploading: boolean;
};

const AvatarUpload: React.FC<AvatarUploadProps> = ({ avatar, isUploading }) => {
  return (
    <AvatarRoot className="w-20 h-20">
      <AvatarImage src={avatar} />
      <AvatarFallback className="bg-muted">{isUploading ? <Loader2Icon className="h-8 w-8 animate-spin" /> : <ImageIcon className="h-8 w-8" />}</AvatarFallback>
    </AvatarRoot>
  );
};

export { Avatar, AvatarUpload, AvatarSkeleton };
