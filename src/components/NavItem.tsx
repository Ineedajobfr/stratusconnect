import { NavLink } from "react-router-dom";

export function NavItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-md px-3 py-2 text-sm ${isActive ? "bg-white/10 text-text" : "text-text/80 hover:bg-white/5"}`
      }
    >
      <Icon size={16} className="text-text/80 group-hover:text-text" />
      <span>{label}</span>
    </NavLink>
  );
}
