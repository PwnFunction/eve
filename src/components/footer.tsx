"use client";

import { styles } from "@/lib/styles/layout";
import { Info } from "lucide-react";
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
      className="flex select-none items-center justify-between border-t border-neutral-200 bg-neutral-100 px-2 text-xs text-neutral-500"
      style={styles.footer}
    >
      <div className="flex items-center space-x-1">
        <Info size={12} />
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
