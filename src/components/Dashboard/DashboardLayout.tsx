"use client";

import Sidebar from "@/components/Dashboard/Sidebar";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Database, Settings, User } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = now.toISOString().split('T')[1].split('.')[0] + "_UTC";
      setCurrentTime(timeStr);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // const footerTabs = [
  //   // { name: "INVENTORY_HOT_LIST", active: true },
  //   // { name: "ORDER_PRECISION", active: false },
  //   // { name: "REVENUE_STREAM", active: false },
  //   // { name: "NODE_STATUS", active: false },
  // ];

  const headerTabs = ["SYSTEM_CORE"];

  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-[#D9FF00] selection:text-black overflow-hidden relative">
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[108] md:hidden"
          />
        )}
      </AnimatePresence>

      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Floating Open Button (Visible when sidebar is collapsed) */}
      <AnimatePresence>
        {isCollapsed && !isMobileOpen && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => setIsCollapsed(false)}
            className="fixed left-6 top-1/2 -translate-y-1/2 w-10 h-24 bg-[#0D0D0D] border border-white/10 flex flex-col items-center justify-center gap-4 z-[100] group hover:border-[#D9FF00]/50 transition-all rounded-sm shadow-2xl"
          >
            <div className="w-[1px] h-6 bg-white/10 group-hover:bg-[#D9FF00] transition-colors" />
            <div className="font-bebas text-[10px] text-white/20 select-none uppercase -rotate-90 tracking-widest group-hover:text-white transition-colors">OS_NAV</div>
            <div className="w-[1px] h-6 bg-white/10 group-hover:bg-[#D9FF00] transition-colors" />

            {/* Hover Scanning Block */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#D9FF00]/0 via-[#D9FF00]/5 to-[#D9FF00]/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ${isCollapsed ? 'md:pl-0' : 'md:pl-[280px]'}`}>
        {/* Advanced Technical Header */}
        <header className="h-20 bg-[#080808] border-b border-white/5 flex items-center justify-between px-6 md:px-12 sticky top-0 z-[105]">
          <div className="flex items-center gap-12">
            {/* Logo Toggle Button */}
            <button
              className="group flex items-center justify-center w-12 h-12 bg-[#D9FF00] rounded-xl rotate-45 hover:rotate-90 hover:scale-110 transition-all duration-500 shadow-[0_0_20px_rgba(217,255,0,0.2)]"
              onClick={() => {
                if (window.innerWidth < 768) setIsMobileOpen(true);
                else setIsCollapsed(false);
              }}
            >
              <div className="-rotate-45 font-bebas text-black text-2xl font-bold transition-all duration-500 group-hover:rotate-[-90deg]">S</div>
            </button>

            {/* Header Navigation */}
            <nav className="hidden xl:flex items-center gap-8">
              {headerTabs.map((tab, i) => (
                <button key={tab} className={`font-bebas text-lg tracking-[3px] transition-all hover:text-[#D9FF00] ${i === 0 ? 'text-white border-b-2 border-[#D9FF00]' : 'text-white/30'}`}>
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-10">
            {/* System Time */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] font-mono text-white/20 uppercase tracking-[4px]">SYSTEM_TIME</span>
              <span className="font-bebas text-xl text-[#D9FF00] tracking-widest">{currentTime}</span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-6 text-white/40">
              <Radio size={20} className="hover:text-[#D9FF00] cursor-pointer" />
              <Database size={20} className="hover:text-[#D9FF00] cursor-pointer" />
              <Settings size={20} className="hover:text-[#D9FF00] cursor-pointer" />
              <div className="h-6 w-[1px] bg-white/10" />
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#D9FF00] hover:text-black transition-all cursor-pointer">
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content Area */}
        <main className="flex-1 bg-[#050505] overflow-y-auto pb-32 no-scrollbar">
          {children}
        </main>

        {/* Absolute Footer Navigation */}
        {/* <footer className="fixed bottom-0 left-0 right-0 h-24 bg-[#080808]/80 backdrop-blur-xl border-t border-white/5 z-[100] px-6 md:px-12 flex items-center justify-between pointer-events-none">
          <div className={`flex flex-1 transition-all duration-500 ${isCollapsed ? 'md:pl-0' : 'md:pl-[280px]'} pointer-events-auto`}>
            <div className="flex items-center w-full max-w-7xl mx-auto justify-between">
              {footerTabs.map((tab) => (
                <button
                  key={tab.name}
                  className={`flex-1 h-full flex flex-col items-center justify-center group transition-all duration-500 ${tab.active ? 'bg-[#D9FF00] text-black' : 'text-white/20 hover:text-white/40'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-sm border ${tab.active ? 'bg-black border-black' : 'border-[#D9FF00] group-hover:bg-[#D9FF00]/10'} flex items-center justify-center`}>
                      {tab.active && <div className="w-2 h-2 bg-[#D9FF00] rounded-[1px]" />}
                    </div>
                    <span className="font-bebas text-xl tracking-[3px] uppercase mt-1">{tab.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </footer> */}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
