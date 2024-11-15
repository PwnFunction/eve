// hooks/use-node-focus.ts
import { CustomEvents } from "@/lib/constants/custom-events";
import { useEffect } from "react";

/**
 * Hook to listen for focus events on nodes
 * @param focusOnNode
 * @returns void
 */
export const useNodeFocusListener = (focusOnNode: (nodeId: string) => void) => {
  // Listen for custom focusNode events
  useEffect(() => {
    const handleFocusEvent = (event: CustomEvent<{ nodeId: string }>) => {
      const { nodeId } = event.detail;
      focusOnNode(nodeId);
    };

    window.addEventListener(
      CustomEvents.FocusNode,
      handleFocusEvent as EventListener,
    );
    return () => {
      window.removeEventListener(
        CustomEvents.FocusNode,
        handleFocusEvent as EventListener,
      );
    };
  }, [focusOnNode]);
};
