import { useSelection } from "@/hooks/use-selection";
import { styles } from "@/lib/styles/layout";
import { cn } from "@/lib/utils/class";
import { useState } from "react";
import { defaultNodePrefs } from "./canvas";

export const Explorer = () => {
  const [selectedTab, setSelectedTab] = useState("Nodes");
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
    const event = new CustomEvent("createNode", {
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
        {["Nodes", "Logs"].map((tab) => (
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

      {selectedTab === "Nodes" ? (
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
        <div className="flex-1 p-2 font-mono text-neutral-500">
          <pre>
            {`[2021-09-02T15:00:00Z] INFO: Created Event Stream\n[2021-09-02T15:00:01Z] INFO: Created Generic Node`}
          </pre>
        </div>
      )}
    </section>
  );
};
