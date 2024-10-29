import { type NodeProps } from "@xyflow/react";
import { Base } from "./base";

interface EventStreamProps extends NodeProps {
  data: {
    frequency: number;
  };
}

export const EventStream = (props: EventStreamProps) => {
  console.log(props.data.frequency);

  return (
    <Base {...props}>
      <p>Event Stream</p>
    </Base>
  );
};
