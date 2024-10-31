import { type NodeProps } from "@xyflow/react";
import { Base } from "./base";

interface GenericProps extends NodeProps {
  data: { name: string };
}

export const Generic = (props: GenericProps) => {
  const { name } = props.data;

  return (
    <Base {...props}>
      <p>{name}</p>
    </Base>
  );
};
