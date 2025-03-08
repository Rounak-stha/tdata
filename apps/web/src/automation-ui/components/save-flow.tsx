import { Button } from "@/components/ui/button";
import { useFlowStore } from "../store/flow";

export const SaveFlow = () => {
  const { getFlow } = useFlowStore();
  return (
    <Button
      onClick={() => {
        const flow = getFlow();
        console.log(flow);
      }}
    >
      Save Flow
    </Button>
  );
};
