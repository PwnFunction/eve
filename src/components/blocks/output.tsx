import { truncateString } from "@/lib/utils/truncate";
import { type NodeProps } from "@xyflow/react";
import { Base } from "./base";

export interface OutputProps extends NodeProps {
  data: { name: string; destination: string };
}

/**
 * Output component - A block for outputting events
 * @param props - OutputProps
 * @returns JSX.Element
 */
export const Output = (props: OutputProps) => {
  const { name } = props.data;

  return (
    <Base rightHandle={false} {...props}>
      <p>{truncateString(name)}</p>
    </Base>
  );
};
