import { type NodeProps } from "@xyflow/react";
import { Base } from "./base";

interface EventStreamProps extends NodeProps {
  data: {
    name: string;
    frequency: number;
  };
}

export const EventStream = (props: EventStreamProps) => {
  const { name } = props.data;

  return (
    <Base {...props}>
      <p>{name}</p>
    </Base>
  );
};
