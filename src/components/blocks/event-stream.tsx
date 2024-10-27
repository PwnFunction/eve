import { type NodeProps } from "@xyflow/react";
import { Base } from "./base";

interface EventStreamProps {
  data: { frequency: number };
}

export const EventStream = ({ data }: NodeProps & EventStreamProps) => {
  return (
    <Base>
      <p>
        Event Stream:{" "}
        <span className="font-mono text-xs">{data.frequency}</span>
      </p>
    </Base>
  );
};
