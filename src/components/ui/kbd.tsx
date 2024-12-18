export const Kbd = ({ children }: { children: React.ReactNode }) => {
  return (
    <kbd className="uppercas mx-0.5 border border-neutral-200 bg-neutral-100 px-1 py-[1px] font-mono text-xs">
      {children}
    </kbd>
  );
};
Kbd.displayName = "Kbd";
