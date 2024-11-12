import { type NodeProps } from "@xyflow/react";
import { Base } from "./base";

export interface BatchProps extends NodeProps {
  data: { name: string; size: number };
}

export const Batch = (props: BatchProps) => {
  const { name } = props.data;

  return (
    <Base {...props}>
      <p>{name}</p>
    </Base>
  );
};
