"use client";

import { Canvas } from "@/components/canvas";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { styles } from "@/lib/styles/layout";

export default function Home() {
  return (
    <main
      className="grid min-h-screen border border-green-500 text-sm"
      style={styles.parent}
    >
      {/* Header */}
      <Header />

      {/* Layers */}
      <aside className="border-r border-neutral-200" style={styles.leftPanel}>
        Layers
      </aside>

      {/* Canvas */}
      <Canvas />

      {/* Explorer */}
      <section
        className="border-t border-neutral-200"
        style={styles.bottomPanel}
      >
        Explorer
      </section>

      {/* Inspector */}
      <aside className="border-l border-neutral-200" style={styles.rightPanel}>
        Inspector
      </aside>

      {/* Footer */}
      <Footer />
    </main>
  );
}
