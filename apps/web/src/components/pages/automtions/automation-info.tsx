"use client";

import { Button } from "@/components/ui/button";
import { Paths } from "@/lib/constants";
import { Project } from "@tdata/shared/types";
import { InfoIcon, PlusIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

type AutomationInfoProps = {
  project: Project;
};

export const AutomationInfo: FC<AutomationInfoProps> = ({ project }) => {
  return (
    <div className="bg-background text-center">
      <div className="max-w-md mx-auto">
        <div className="bg-[#F4EBFF] p-4 rounded-full inline-flex mb-4">
          <ZapIcon className="h-8 w-8 text-[#9E77ED]" />
        </div>
        <h3 className="text-xl font-semibold mb-4">No automations yet</h3>
        <p className="text-gray-600 mb-6">Create your first automation to streamline your workflow and save time on repetitive tasks.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-background p-4 rounded-sm border">
            <InfoIcon className="h-5 w-5 text-[#9E77ED] mb-2" />
            <h4 className="font-medium mb-1">Save Time</h4>
            <p className="text-sm text-gray-600">Eliminate manual work by automating routine operations</p>
          </div>
          <div className="bg-background p-4 rounded-sm border">
            <InfoIcon className="h-5 w-5 text-[#9E77ED] mb-2" />
            <h4 className="font-medium mb-1">Reduce Errors</h4>
            <p className="text-sm text-gray-600">Minimize human error by standardizing processes</p>
          </div>
          <div className="bg-background p-4 rounded-sm border">
            <InfoIcon className="h-5 w-5 text-[#9E77ED] mb-2" />
            <h4 className="font-medium mb-1">Track Results</h4>
            <p className="text-sm text-gray-600">Monitor automation performance and optimize workflows</p>
          </div>
          <div className="bg-background p-4 rounded-sm border">
            <InfoIcon className="h-5 w-5 text-[#9E77ED] mb-2" />
            <h4 className="font-medium mb-1">Stay Consistent</h4>
            <p className="text-sm text-gray-600">Ensure processes are followed the same way every time</p>
          </div>
        </div>

        <Link href={Paths.projectAutomationCreate(project.key)}>
          <Button className="px-5 py-2 bg-[#9E77ED] hover:bg-[#8B5CF6] text-white border-none">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Your First Automation
          </Button>
        </Link>
      </div>
    </div>
  );
};
