import { useContext, createContext } from "react";
import { createFlowStore } from "@/automation-ui/store/flow";
import { Automation } from "@tdata/shared/types";

type BearContextType = ReturnType<typeof createFlowStore>;

const BearContext = createContext<BearContextType | null>(null);

export function useBearStore(): BearContextType {
  const context = useContext(BearContext);
  if (!context) {
    throw new Error("useBearStore must be used within a BearProvider");
  }
  return context;
}

export function useFlowStore() {
  const store = useContext(BearContext);
  if (!store) throw new Error("Missing BearContext.Provider in the tree");
  return store();
}

export function FlowProvider({ automation, children }: { automation?: Automation | null; children: React.ReactNode }) {
  const store = createFlowStore(automation);
  return <BearContext.Provider value={store}>{children}</BearContext.Provider>;
}
