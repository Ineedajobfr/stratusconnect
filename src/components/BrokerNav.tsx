import { LayoutGrid, FolderOpen, ArrowLeftRight, HandCoins, Users, Star, ChartLine } from "lucide-react";
import { NavItem } from "./NavItem";

export function BrokerNav() {
  return (
    <>
      <NavItem to="/terminal/broker/dashboard" icon={LayoutGrid} label="Dashboard" />
      <NavItem to="/terminal/broker/requests" icon={FolderOpen} label="Requests" />
      <NavItem to="/terminal/broker/quotes" icon={ArrowLeftRight} label="Quotes" />
      <NavItem to="/terminal/broker/deals" icon={HandCoins} label="Deals" />
      <NavItem to="/terminal/broker/operators" icon={Users} label="Operators" />
      <NavItem to="/terminal/broker/saved" icon={Star} label="Saved Jets" />
      <NavItem to="/terminal/broker/analytics" icon={ChartLine} label="Analytics" />
    </>
  );
}
