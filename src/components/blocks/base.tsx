import { cn } from "@/lib/utils/class";
import { Handle, type NodeProps, Position } from "@xyflow/react";

interface BaseProps extends NodeProps {
  className?: string;
  children?: React.ReactNode;
  leftHandle?: boolean;
  rightHandle?: boolean;
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

/**
 * Base component for blocks
 * @param props
 * @returns JSX.Element
 */
export const Base = ({
  className,
  children,
  leftHandle = true,
  rightHandle = true,
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
      {leftHandle && (
        <Handle
          type="target"
          position={Position.Left}
          className="!h-4 !w-1 !rounded-none !bg-neutral-400 transition-all hover:!bg-black"
        />
      )}
      {children}
      {rightHandle && (
        <Handle
          type="source"
          position={Position.Right}
          className="!h-4 !w-1 !rounded-none !bg-neutral-400 transition-all hover:!bg-black"
        />
      )}
    </div>
  );
};
