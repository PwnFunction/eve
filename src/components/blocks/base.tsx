"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
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

  /**
   * Delete the node when the delete context menu item is clicked
   * @returns void
   */
  const handleDelete = () => {
    // Dispatch a custom event to delete the node
    const event = new CustomEvent("deleteNode", {
      detail: { nodeId: props.id },
    });
    window.dispatchEvent(event);
  };

  /**
   * Remove connections from the node when the remove connections context menu item is clicked
   * @returns void
   */
  const handleRemoveConnections = () => {
    const event = new CustomEvent("removeConnections", {
      detail: { nodeId: props.id },
    });
    window.dispatchEvent(event);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
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
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Duplicate</ContextMenuItem>
        <ContextMenuItem>Duplicate with connections</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Disable</ContextMenuItem>
        <ContextMenuItem onClick={handleRemoveConnections}>
          Remove connections
        </ContextMenuItem>
        <ContextMenuItem className="text-red-600" onClick={handleDelete}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
