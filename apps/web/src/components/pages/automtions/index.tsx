import { Automation, Project } from "@tdata/shared/types";
import { ZapIcon } from "lucide-react";
import { FC } from "react";
import { AutomationList } from "./list";
import { AutomationInfo } from "./automation-info";

type AutomationPageProps = {
  project: Project;
  automations: Automation[];
};

export const AutomationPage: FC<AutomationPageProps> = ({ automations, project }) => {
  return (
    <div className="flex flex-col w-full bg-background">
      <div className="flex-1 p-8">
        <div className="mb-12 bg-background">
          <div className="flex items-start gap-4">
            <div className="bg-[#F4EBFF] p-3 rounded-full">
              <ZapIcon className="h-6 w-6 text-[#9E77ED]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Workflow Automations</h2>
              <p className="text-gray-600">
                Automations help you streamline your workflow by automatically performing actions based on triggers and conditions. Create custom workflows that suit your specific
                needs and save time on repetitive tasks.
              </p>
            </div>
          </div>
        </div>

        {automations.length > 0 ? <AutomationList automations={automations} project={project} /> : <AutomationInfo project={project} />}
      </div>
    </div>
  );
};
