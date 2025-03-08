import { Tooltip as TooltipPrimitive, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface TooltipProps {
  content: string;
}

export function Tooltip({ content }: TooltipProps) {
  return (
    <TooltipProvider>
      <TooltipPrimitive>
        <TooltipTrigger asChild>
          <InfoIcon className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </TooltipPrimitive>
    </TooltipProvider>
  );
}
