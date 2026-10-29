"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Zap, Package, Users, FileText, X, Settings, Database, Scan, Home
} from "lucide-react";
import { useSession } from "next-auth/react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
}

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  console.log(session);
  useEffect(() => {
    setMounted(true);
  }, []);
  const userEmail = session?.user?.email;
  const userImage = session?.user?.image;
  type NavItem = {
    name: string;
    href: string;
    icon: React.ReactNode;
    badge?: string;
    hasNotification?: boolean;
  };

  const primaryOps: NavItem[] = [
    { name: "DASHBOARD", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "INVENTORY", href: "/dashboard/store", icon: <Package size={20} /> },
    { name: "NODES", href: "/dashboard/nodes", icon: <Users size={20} />, badge: "128_ONLINE" },
    { name: "Add_Product", href: "/dashboard/add-product", icon: <Package size={20} /> },
    { name: "Add_Keycaps", href: "/dashboard/add-keycaps", icon: <Package size={20} /> },
    { name: "Add_Keyboard", href: "/dashboard/add-keyboard", icon: <Package size={20} /> },
    { name: "Keycaps", href: "/dashboard/Kaycaps", icon: <Package size={20} /> }
  ];

  const systemOps: NavItem[] = [
    { name: "SYSTEM_LOGS", href: "/dashboard/system-logs", icon: <Database size={18} /> },
    { name: "SETTINGS", href: "/dashboard/settings", icon: <Settings size={18} /> },
  ];

  if (!mounted) return null;

  const isOpen = isMobileOpen || !isCollapsed;

  return (
    <motion.div
      animate={{
        width: isOpen ? 280 : 0,
        x: isOpen ? 0 : -280
      }}
      initial={false}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="fixed left-0 top-0 h-full bg-[#050505] text-white z-[110] border-r border-white/5 flex flex-col overflow-hidden"
    >
      {/* 1. Header: Profile System */}
      <div className="p-8 pb-6 shrink-0">
        <div className="flex items-center gap-5 mb-8">
          <div className="relative">
            <div className="w-14 h-14 bg-[#111] rounded-sm border border-white/10 p-[1px] overflow-hidden">
              <div className="w-full h-full bg-[#0A0A0A] flex items-center justify-center">
                {/* Generic dark avatar placeholder */}
                <img src={userImage || "https://ui-avatars.com/api/?name=Guest+User"} alt="" width={24} height={24} className="text-white/20" />
              </div>
            </div>
            {/* Status Indicator Dot */}
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#D9FF00] rounded-full border-[3px] border-[#050505] shadow-[0_0_10px_#D9FF00]" />
          </div>

          <div className="flex flex-col">
            <h1 className="font-bebas text-2xl tracking-[3.2px] text-[#D9FF00] leading-none uppercase">{userEmail}</h1>
            <span className="text-[10px] font-mono text-white/20 tracking-[1px] mt-2 font-bold select-none whitespace-nowrap">V.4.2_STABLE</span>
          </div>

          <button
            onClick={() => { setIsCollapsed(true); setIsMobileOpen(false); }}
            className="flex items-center gap-2 px-3 py-1.5 border border-white/10 hover:border-[#D9FF00]/50 transition-all bg-white/[0.02] group"
          >
            <span className="text-[9px] font-mono text-white/20 group-hover:text-white transition-colors uppercase tracking-widest">CLOSE</span>
            <X size={14} className="text-white/20 group-hover:text-[#D9FF00] transition-colors" />
          </button>
        </div>

        {/* 2. Action Button: INITIATE_SCAN */}
        <Link href="/" className="w-full py-4 bg-[#D9FF00] text-black font-bebas text-lg tracking-[3px] hover:shadow-[0_0_30px_rgba(217,255,0,0.3)] transition-all duration-500 rounded-sm font-black uppercase flex items-center justify-center gap-3 active:scale-[0.98]">
          <Home size={20} strokeWidth={3} />
          <span>HOME</span>
        </Link>
      </div>

      {/* 3. Navigation: PRIMARY_OPERATIONS */}
      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        <div className="px-8 mt-6">
          <h3 className="text-[10px] font-mono text-white/10 tracking-[4.5px] uppercase mb-10 select-none">PRIMARY_OPERATIONS</h3>
        </div>

        <nav className="space-y-1">
          {primaryOps.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => { if (window.innerWidth < 768) setIsMobileOpen(false); }}
              >
                <div className={`group relative flex items-center justify-between px-8 py-5 transition-all duration-300 ${isActive ? 'bg-white/[0.03]' : 'hover:bg-white/[0.01]'}`}>
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-bar"
                      className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#D9FF00] shadow-[0_0_15px_rgba(217,255,0,0.5)]"
                    />
                  )}

                  <div className="flex items-center gap-5">
                    <div className={`transition-all duration-500 ${isActive ? 'text-[#D9FF00]' : 'text-white/30 group-hover:text-white/60'}`}>
                      {item.icon}
                    </div>
                    <span className={`font-bebas text-xl tracking-[4.5px] uppercase transition-all duration-500 ${isActive ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`}>
                      {item.name}
                    </span>
                  </div>

                  {/* Status Markers */}
                  <div className="flex items-center">
                    {item.hasNotification && (
                      <div className="w-2.5 h-2.5 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                    )}
                    {item.badge && (
                      <div className="px-2 py-1 bg-white/[0.05] border border-white/5 rounded-sm">
                        <span className="text-[7px] font-mono text-white/30 tracking-widest">{item.badge}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 4. Bottom Section: System Elements */}
      <div className="p-8 pb-10 border-t border-white/5 bg-black/40 mt-auto">
        <div className="space-y-4">
          {systemOps.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-5 py-2 group"
            >
              <div className="text-white/20 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <span className="font-bebas text-lg tracking-[3px] text-white/20 group-hover:text-white transition-colors uppercase">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;