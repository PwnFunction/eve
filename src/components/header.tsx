import { styles } from "@/lib/styles/layout";

export const Header = () => (
  <header
    className="flex select-none items-center border-b border-neutral-200 px-2"
    style={styles.header}
  >
    <span>
      Eve <span className="font-mono text-xs">(0.0.1)</span>
    </span>
  </header>
);
