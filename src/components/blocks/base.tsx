import { cn } from "@/lib/utils/class";
import { Handle, Position } from "@xyflow/react";

export const Base = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <div
    className={cn(
      "w-fit border bg-neutral-50 px-4 py-2 active:bg-neutral-100",
      className,
    )}
    {...props}
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