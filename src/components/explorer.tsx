import { styles } from "@/lib/styles/layout";
import { cn } from "@/lib/utils/class";
import { useState } from "react";

export const Explorer = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("nodeType", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const [selectedTab, setSelectedTab] = useState("Nodes");

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
          <div
            className="w-fit cursor-move border bg-neutral-50 px-4 py-2 active:bg-neutral-100"
            onDragStart={(e) => onDragStart(e, "EventStream")}
            draggable
          >
            Event Stream
          </div>
          <div
            className="w-fit cursor-move border bg-neutral-50 px-4 py-2 active:bg-neutral-100"
            onDragStart={(e) => onDragStart(e, "Generic")}
            draggable
          >
            Generic
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-black font-mono text-neutral-400">
          <pre>
            {`[2021-09-02T15:00:00Z] INFO: Created Event Stream\n[2021-09-02T15:00:01Z] INFO: Created Generic Node`}
          </pre>
        </div>
      )}
    </section>
  );
};
