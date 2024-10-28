"use client";

import { Canvas } from "@/components/canvas";
import { Explorer } from "@/components/explorer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Inspector } from "@/components/inspector";
import { Layers } from "@/components/layers";
import { styles } from "@/lib/styles/layout";
import { ReactFlowProvider } from "@xyflow/react";

export default function Home() {
  return (
    <ReactFlowProvider>
      <main
        className="grid min-h-screen border border-green-500 text-sm"
        style={styles.parent}
      >
        {/* Header */}
        <Header />

        {/* Layers */}
        <Layers />

        {/* Canvas */}
        <Canvas />

        {/* Explorer */}
        <Explorer />

        {/* Inspector */}
        <Inspector />

        {/* Footer */}
        <Footer />
      </main>
    </ReactFlowProvider>
  );
}
