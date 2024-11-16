import { truncateString } from "@/lib/utils/truncate";
import { type NodeProps } from "@xyflow/react";
import { Base } from "./base";

export interface ProcessProps extends NodeProps {
  data: { name: string; time: number };
}

/**
 * Process component - A block for processing events
 * @param props - ProcessProps
 * @returns JSX.Element
 */
export const Process = (props: ProcessProps) => {
  const { name } = props.data;

  return (
    <Base {...props}>
      <p>{truncateString(name)}</p>
    </Base>
  );
};
