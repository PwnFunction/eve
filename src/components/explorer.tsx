import { styles } from "@/lib/styles/layout";

export const Explorer = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("nodeType", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <section
      className="border-t border-neutral-200 p-2"
      style={styles.bottomPanel}
    >
      <p>Explorer</p>
      <div className="space-y-2">
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
          Generic Node
        </div>
      </div>
    </section>
  );
};
