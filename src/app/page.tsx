"use client";

import { Canvas } from "@/components/canvas";
import { Explorer } from "@/components/explorer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Inspector } from "@/components/inspector";
import { Layers } from "@/components/layers";
import { useWindowSize } from "@/hooks/use-window-size";
import { styles } from "@/lib/styles/layout";
import { ReactFlowProvider } from "@xyflow/react";
import { CircleAlert } from "lucide-react";

export default function Home() {
  const { width } = useWindowSize();

  // while width is loading
  if (typeof width === "undefined") {
    return null;
  }

  return width > 1080 ? (
    <ReactFlowProvider>
      <main className="grid h-screen text-sm" style={styles.parent}>
        <Header />
        <Layers />
        <Canvas />
        <Explorer />
        <Inspector />
        <Footer />
      </main>
    </ReactFlowProvider>
  ) : (
    <main className="flex h-screen items-center justify-center">
      <div className="flex items-center space-x-2">
        <CircleAlert size={18} className="text-red-600" />
        <span>Only desktop is supported</span>
      </div>
    </main>
  );
}
