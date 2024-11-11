import { type NodeProps } from "@xyflow/react";
import { Base } from "./base";

export interface QueueProps extends NodeProps {
  data: { name: string; max: number; broadcast: boolean };
}

export const Queue = (props: QueueProps) => {
  const { name } = props.data;

  return (
    <Base {...props}>
      <p>{name}</p>
    </Base>
  );
};
