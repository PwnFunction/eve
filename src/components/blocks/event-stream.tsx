import { type NodeProps } from "@xyflow/react";
import { Base } from "./base";

export interface EventStreamProps extends NodeProps {
  data: {
    name: string;
    frequency: number;
    unit: string;
    throttle: boolean;
  };
}

export const EventStream = (props: EventStreamProps) => {
  const { name } = props.data;

  return (
    <Base leftHandle={false} {...props}>
      <p>{name}</p>
    </Base>
  );
};
