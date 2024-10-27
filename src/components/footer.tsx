"use client";

import { InfoIcon } from "@/lib/icons";
import { styles } from "@/lib/styles/layout";
import { useEffect, useState } from "react";

export const Footer = () => {
  const [datetime, setDatetime] = useState<string | null>(null);

  useEffect(() => {
    setDatetime(new Date().toLocaleString());

    const interval = setInterval(() => {
      setDatetime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      className="flex select-none items-center justify-between border-t border-neutral-200 px-2 text-xs text-neutral-500"
      style={styles.footer}
    >
      <div className="flex items-center space-x-1">
        <InfoIcon className="h-3 w-3 text-neutral-500" />
        <span className="">
          Drag and drop from the explorer onto the canvas, edit the block's
          properties in the inspector, and see the changes in real-time on the
          canvas.
        </span>
      </div>

      <span className="font-mono">{datetime}</span>
    </footer>
  );
};
