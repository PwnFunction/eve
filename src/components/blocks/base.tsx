import { cn } from "@/lib/utils/class";
import { Handle, type NodeProps, Position } from "@xyflow/react";

interface BaseProps extends NodeProps {
  className?: string;
  children?: React.ReactNode;
}

// Props that should not be passed to the DOM element
const nonDOMProps = [
  "id",
  "type",
  "data",
  "dragHandle",
  "draggable",
  "selectable",
  "deletable",
  "selected",
  "dragging",
  "sourcePosition",
  "targetPosition",
  "hidden",
  "positionAbsoluteX",
  "positionAbsoluteY",
  "zIndex",
  "isConnectable",
  "parentId",
] as const;

export const Base = ({
  className,
  children,
  selected,
  ...props
}: BaseProps) => {
  // Filter out React Flow specific props
  const divProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => !nonDOMProps.includes(key as any)),
  );

  return (
    <div
      className={cn(
        "w-fit border bg-neutral-50 px-4 py-2 active:bg-neutral-100",
        selected && "ring-1 ring-black",
        className,
      )}
      {...divProps}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-4 !w-1 !rounded-none !bg-neutral-400 transition-all hover:!bg-black"
      />
      {children}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-4 !w-1 !rounded-none !bg-neutral-400 transition-all hover:!bg-black"
      />
    </div>
  );
};
