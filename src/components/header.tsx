import { useDebugStore } from "@/lib/store/debug";
import { styles } from "@/lib/styles/layout";
import { Switch } from "./ui/switch";

/**
 * Header component
 * @returns JSX.Element
 */
export const Header = () => {
  const debug = useDebugStore((state) => state.debug);
  const setDebug = useDebugStore((state) => state.setDebug);

  return (
    <header
      className="flex select-none items-center justify-between border-b border-neutral-200 px-2"
      style={styles.header}
    >
      <span className="font-medium">
        Eve <span className="font-mono text-xs">(v0.0.1)</span>
      </span>

      <div className="flex items-center space-x-2">
        <span className="text-neutral-500">Debug mode</span>
        <Switch className="m-2" checked={debug} onCheckedChange={setDebug} />
      </div>
    </header>
  );
};
