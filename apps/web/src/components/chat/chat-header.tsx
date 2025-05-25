import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RefreshCwIcon, SettingsIcon, DownloadIcon } from "lucide-react";
import { memo } from "react";

export const ChatHeader = memo(function ChatHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 bg-gradient-to-b from-[#3b82f6] to-[#2563eb] rounded-full" />
        <div>
          <h1 className="text-xl font-semibold">Mira</h1>
        </div>
      </div>
      {/* <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="border-[#2a2a2a] bg-transparent hover:bg-[#2a2a2a]">
                <DownloadIcon className="h-4 w-4 text-gray-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="border-[#2a2a2a] bg-transparent hover:bg-[#2a2a2a]">
                <SettingsIcon className="h-4 w-4 text-gray-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="border-[#2a2a2a] bg-transparent hover:bg-[#2a2a2a]">
                <RefreshCwIcon className="h-4 w-4 text-gray-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>New chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div> */}
    </header>
  );
});
