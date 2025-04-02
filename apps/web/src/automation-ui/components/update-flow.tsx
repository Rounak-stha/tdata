import React, { FC, useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFlowStore } from "@/automation-ui/store/flow";
import { validateFlow } from "@/automation-ui/utils/validation";
import { updateAutomation } from "@/lib/actions/automation";
import { useOrganizations, useUser } from "@/hooks";
import { NodeType, ProjectDetail, TriggerNodeData, TriggerType } from "@tdata/shared/types";

type UpdateFlowProps = {
  project: ProjectDetail;
  automationId: string;
};

export const UpdateFlow: FC<UpdateFlowProps> = ({ automationId, project }) => {
  const [loading, setLoading] = useState(false);
  const { getFlow, getCustomVariables } = useFlowStore();
  const { organization } = useOrganizations();
  const { user } = useUser();

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const flow = getFlow();

      if (!validateFlow(flow)) {
        toast.error("Invalid workflow, please check the flow and try again.");
        return;
      }

      const triggerNode = flow.nodes.find((node) => node.type === ("TriggerNode" as NodeType))!;
      const customVariables = getCustomVariables();

      await updateAutomation(automationId, {
        flow,
        variables: customVariables,
        triggerType: (triggerNode.data as TriggerNodeData).type as TriggerType,
      });

      // NOTE: Redirect users to the automation page
      toast.success("Flow Updated successfully");
    } catch (e) {
      console.log(e);
      toast.error("Failed to save flow");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleUpdate} className="w-full" disabled={loading}>
      Update Flow
    </Button>
  );
};
