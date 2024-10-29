import { type NodeProps } from "@xyflow/react";
import { Base } from "./base";

interface GenericProps extends NodeProps {
  data: { label: string };
}

export const Generic = (props: GenericProps) => (
  <Base {...props}>
    <p>{props.data.label}</p>
  </Base>
);
