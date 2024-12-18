import { useSelection } from "@/hooks/use-selection";
import { CustomEvents } from "@/lib/constants/custom-events";
import { styles } from "@/lib/styles/layout";
import { cn } from "@/lib/utils/class";
import { useState } from "react";
import { defaultNodePrefs } from "./blocks";
import Logs from "./logs";

/**
 * Explorer component
 * @returns JSX.Element
 */
export const Explorer = () => {
  const [selectedTab, setSelectedTab] = useState("Blocks");
  const { clearSelection } = useSelection();

  /**
   * Drag start event handler
   * @param event
   * @param nodeType
   * @returns void
   */
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("nodeType", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  /**
   * Double click event handler
   * @param nodeType
   * @returns void
   */
  const onDoubleClick = (nodeType: string) => {
    // Clear node selection
    clearSelection();

    // Create a custom event to communicate with the Canvas component
    const event = new CustomEvent(CustomEvents.CreateNode, {
      detail: {
        type: nodeType,
      },
    });
    window.dispatchEvent(event);
  };

  return (
    <section
      className="flex flex-col border-t border-neutral-200"
      style={styles.bottomPanel}
    >
      <div className="flex w-full select-none items-center space-x-4 border-b p-2">
        {["Blocks", "Logs"].map((tab) => (
          <span
            key={tab}
            className={cn(
              "cursor-pointer font-medium text-neutral-500",
              selectedTab === tab && "text-black",
            )}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </span>
        ))}
      </div>

      {selectedTab === "Blocks" ? (
        <div className="space-y-2 p-2">
          {Object.keys(defaultNodePrefs).map((nodeType) => (
            <div
              key={nodeType}
              className="active:bg-neutral-0 w-fit cursor-move border bg-neutral-50 px-4 py-2"
              onDragStart={(e) => onDragStart(e, nodeType)}
              onDoubleClick={() => onDoubleClick(nodeType)}
              draggable
            >
              {nodeType}
            </div>
          ))}
        </div>
      ) : (
        <Logs />
      )}
    </section>
  );
};
