import { type NodeProps } from "@xyflow/react";
import { Base } from "./base";

export interface BatchProps extends NodeProps {
  data: { name: string; size: number };
}

/**
 * Batch component - A block for batching events
 * @param props - BatchProps
 * @returns JSX.Element
 */
export const Batch = (props: BatchProps) => {
  const { name } = props.data;

  return (
    <Base {...props}>
      <p>{name}</p>
    </Base>
  );
};
