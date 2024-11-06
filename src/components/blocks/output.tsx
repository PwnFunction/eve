import { type NodeProps } from "@xyflow/react";
import { Base } from "./base";

interface OutputProps extends NodeProps {
  data: { name: string };
}

export const Output = (props: OutputProps) => {
  const { name } = props.data;

  return (
    <Base rightHandle={false} {...props}>
      <p>{name}</p>
    </Base>
  );
};
