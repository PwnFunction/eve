import { truncateString } from "@/lib/utils/truncate";
import { type NodeProps } from "@xyflow/react";
import { Base } from "./base";

export interface EventStreamProps extends NodeProps {
  data: {
    name: string;
    frequency: number;
    throttle: boolean;
  };
}

/**
 * EventStream component - A block for streaming events
 * @param props - EventStreamProps
 * @returns JSX.Element
 */
export const EventStream = (props: EventStreamProps) => {
  const { name } = props.data;

  return (
    <Base leftHandle={false} {...props}>
      <p>{truncateString(name)}</p>
    </Base>
  );
};
