import type { ReactNode } from "react";

type SidebarProps = {
  title: string;
  children: ReactNode;
};

export function Sidebar({ title, children }: SidebarProps) {
  return (
    <aside className="glass-card rounded-2xl p-4">
      <h2 className="text-luxury-heading text-xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </aside>
  );
}
