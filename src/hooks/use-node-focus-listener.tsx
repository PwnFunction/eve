// hooks/use-node-focus.ts
import { useEffect } from "react";

/**
 * Hook to listen for focus events on nodes
 * @param focusOnNode
 * @returns void
 */
export const useNodeFocusListener = (focusOnNode: (nodeId: string) => void) => {
  useEffect(() => {
    const handleFocusEvent = (event: CustomEvent<{ nodeId: string }>) => {
      const { nodeId } = event.detail;
      focusOnNode(nodeId);
    };

    window.addEventListener("focusNode", handleFocusEvent as EventListener);
    return () => {
      window.removeEventListener(
        "focusNode",
        handleFocusEvent as EventListener,
      );
    };
  }, [focusOnNode]);
};
