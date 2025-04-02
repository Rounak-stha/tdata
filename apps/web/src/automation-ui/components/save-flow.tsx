import React, { FC, useState } from "react";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Save } from "lucide-react";
import { toast } from "sonner";
import { useFlowStore } from "@/automation-ui/store/flow";
import { validateFlow } from "@/automation-ui/utils/validation";
import { createAutomation } from "@/lib/actions/automation";
import { useOrganizations, useUser } from "@/hooks";
import { NodeType, ProjectDetail, TriggerNodeData, TriggerType } from "@tdata/shared/types";
import { useRouter } from "next/navigation";
import { Paths } from "@/lib/constants";

type CreateFlowProps = {
  project: ProjectDetail;
};

export const SaveFlow: FC<CreateFlowProps> = ({ project }) => {
  const [open, setOpen] = useState(false);
  const [flowName, setFlowName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { getFlow, getCustomVariables } = useFlowStore();
  const { organization } = useOrganizations();
  const { user } = useUser();

  const handleSave = async () => {
    try {
      if (!flowName.trim()) {
        toast.error("Please enter a flow name");
        return;
      }

      setLoading(true);

      const flow = getFlow();

      if (!validateFlow(flow)) {
        toast.error("Invalid workflow, please check the flow and try again.");
        return;
      }

      const triggerNode = flow.nodes.find((node) => node.type === ("TriggerNode" as NodeType))!;
      const customVariables = getCustomVariables();

      const automation = await createAutomation({
        name: flowName,
        flow,
        organizationId: organization.id,
        projectId: project.id,
        variables: customVariables,
        triggerType: (triggerNode.data as TriggerNodeData).type as TriggerType,
        createdBy: user.id,
      });

      // NOTE: Redirect users to the automation page
      toast.success("Flow saved successfully");

      setFlowName("");
      setOpen(false);
      router.push(Paths.projectAutomation(organization.key, project.key, automation.id));
    } catch (e) {
      console.log(e);
      toast.error("Failed to save flow");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Create Flow</Button>
      </DialogTrigger>
      <DialogContent className="bg-background border rounded-sm w-full max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <FileText className="h-5 w-5 text-[#9E77ED]" />
            Publish Workflow
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <label htmlFor="flow-name" className="block text-sm font-medium text-muted-foreground mb-2">
            Flow Name
          </label>
          <Input id="flow-name" value={flowName} onChange={(e) => setFlowName(e.target.value)} placeholder="Enter flow name..." autoFocus />
        </div>

        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => {
              setFlowName("");
            }}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} className="bg-[#9E77ED] hover:bg-[#8B5CF6] text-white border-none">
            <Save className="h-4 w-4 mr-2" />
            Save & Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
