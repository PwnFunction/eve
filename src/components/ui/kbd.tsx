export const Kbd = ({ children }: { children: React.ReactNode }) => {
  return (
    <kbd className="uppercas mx-0.5 rounded border border-neutral-200 bg-neutral-100 px-1 font-mono text-xs">
      {children}
    </kbd>
  );
};
Kbd.displayName = "Kbd";
