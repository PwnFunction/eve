import { type NodeProps } from "@xyflow/react";
import { Base } from "./base";

interface GenericProps {
  data: { label: string };
}

export const Generic = ({ data }: NodeProps & GenericProps) => {
  return (
    <Base>
      <p>{data.label}</p>
    </Base>
  );
};
