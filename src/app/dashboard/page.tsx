"use client";

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard/AuthGuard";
import { useSession } from "next-auth/react";
import gsap from "gsap";
import { TrendingUp, ShieldCheck, Zap, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentItem {
  name: string;
  price: number;
}

interface Payment {
  _id: string;
  userEmail: string;
  totalAmount: number;
  paymentStatus: string;
  transactionId: string;
  items: PaymentItem[];
}

interface PriceAnalysis {
  range: string;
  count: number;
  percentage: number;
}

interface DashboardData {
  totalRevenue: number;
  activeOrders: number;
  totalCustomers: number;
  recentOrders: Payment[];
  topProducts: any[];
  priceAnalysis: PriceAnalysis[];
}

// Segmented Progress Bar Component
const SegmentedBar = ({ percentage, blocks = 20 }: { percentage: number, blocks?: number }) => {
  const filledBlocks = Math.round((percentage / 100) * blocks);
  return (
    <div className="flex gap-1 h-6 w-full">
      {[...Array(blocks)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            backgroundColor: i < filledBlocks ? "#D9FF00" : "#1A1A1A"
          }}
          transition={{ delay: i * 0.02 }}
          className="flex-1 rounded-[1px] shadow-[0_0_10px_rgba(217,255,0,0.1)]"
        />
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<DashboardData>({
    totalRevenue: 0,
    activeOrders: 0,
    totalCustomers: 0,
    recentOrders: [],
    topProducts: [],
    priceAnalysis: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = "https://t-mark-4.onrender.com";
        const [payRes, prodRes] = await Promise.all([
          fetch(`${baseUrl}/api/payment/paymentData`),
          fetch(`${baseUrl}/api/all-products/getall`),
        ]);

        const payJson = await payRes.json();
        const prodJson = await prodRes.json();

        const payments: Payment[] = payJson.data || [];
        const products = prodJson.data || [];

        const completed = payments.filter(p => p.paymentStatus === "completed" || p.paymentStatus === "paid" || p.paymentStatus === "pending");
        const totalRevenue = completed.reduce((sum, p) => sum + (Number(p.totalAmount) || 0), 0);

        const ranges = [
          { label: "BUDGET_TIER", min: 0, max: 100, count: 0 },
          { label: "MID-RANGE_TIER", min: 101, max: 300, count: 0 },
          { label: "PRO_TIER", min: 301, max: 600, count: 0 },
          { label: "ELITE_TIER", min: 601, max: Infinity, count: 0 },
        ];

        completed.forEach(p => {
          const amount = Number(p.totalAmount);
          ranges.forEach(r => {
            if (amount >= r.min && amount <= r.max) r.count++;
          });
        });

        const priceAnalysis = ranges.map(r => ({
          range: r.label,
          count: r.count,
          percentage: (r.count / (completed.length || 1)) * 100
        }));

        setData({
          totalRevenue,
          activeOrders: payments.filter(p => p.paymentStatus === "pending").length,
          totalCustomers: new Set(payments.map(p => p.userEmail)).size,
          recentOrders: payments.slice(-8).reverse(),
          topProducts: products.slice(0, 4),
          priceAnalysis,
        });
      } catch (error) {
        console.error("Dashboard Sync Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useLayoutEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.from(".reveal-item", {
        y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: "power4.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 bg-[#050505]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-2 border-[#D9FF00]/10 border-t-[#D9FF00] rounded-full"
        />
        <div className="text-center font-bebas tracking-[10px] text-[#D9FF00] animate-pulse">INITIATING_COMMAND_CENTER</div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div ref={containerRef} className="p-6 md:p-12 space-y-12">

        {/* OPERATIONAL_GRID Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 reveal-item">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-[2px] bg-[#D9FF00]" />
              <h1 className="font-bebas text-3xl md:text-5xl tracking-[4px] text-white uppercase">SYSTEAM DETAILS</h1>
            </div>
            <p className="text-[10px] font-mono text-white/30 tracking-[6px] uppercase ml-6">SECTOR_7G // CORE_PROTOCOL_ACTIVE</p>
          </div>

          <div className="bg-[#0D0D0D] border border-white/5 px-8 py-5 rounded-sm min-w-[200px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[8px] font-mono text-white/20 tracking-widest uppercase">UPLINK_STATUS</span>
              <span className="w-2 h-2 rounded-full bg-[#D9FF00] shadow-[0_0_8px_#D9FF00]" />
            </div>
            <div className="flex justify-between items-end">
              <span className="font-bebas text-2xl tracking-widest text-white/90 uppercase">ENCRYPTED</span>
              <div className="h-1.5 w-16 bg-[#1A1A1A] rounded-sm overflow-hidden">
                <div className="h-full w-2/3 bg-[#D9FF00]" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-item">
          {[
            { label: "GROSS_REVENUE", value: `$${data.totalRevenue.toLocaleString()}`, icon: <TrendingUp size={20} />, status: "LIVE" },
            { label: "HIGH_PRECISION_ORDERS", value: `0${data.recentOrders.length}`.slice(-2), icon: <ShieldCheck size={20} />, status: "PRECISION" },
            { label: "ACTIVE_NODES", value: `0${data.totalCustomers}`.slice(-2), icon: <Activity size={20} />, status: "OPTIMAL" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#0D0D0D] p-8 space-y-8 group hover:bg-[#111111] transition-colors duration-500 border-l border-white/5">
              <div className="flex justify-between items-start">
                <div className="text-white/40 group-hover:text-[#D9FF00] transition-colors">{stat.icon}</div>
                <span className="text-[8px] font-mono text-white/10 uppercase tracking-[4px]">{stat.status}</span>
              </div>
              <div>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-[4px] mb-2">{stat.label}</p>
                <h2 className="font-bebas text-6xl text-white tracking-widest group-hover:text-[#D9FF00] transition-colors">{stat.value}</h2>
              </div>
            </div>
          ))}
        </div>

        {/* Chart & Feed Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

          {/* Segmented Distribution Chart */}
          <div className="xl:col-span-8 bg-[#0D0D0D] p-10 space-y-12 reveal-item border-l border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bebas text-3xl tracking-widest text-white">PURCHASE_PRICE_DISTRIBUTION</h3>
              <div className="flex gap-2 text-white/10">
                <div className="w-4 h-4 bg-[#D9FF00]/10 border border-white/5" />
                <div className="w-4 h-4 bg-[#D9FF00]" />
                <div className="w-4 h-4 bg-[#D9FF00]/10 border border-white/5" />
              </div>
            </div>

            <div className="space-y-12">
              {data.priceAnalysis.map((item, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="font-bebas text-xl text-white/30 tracking-widest uppercase">{item.range}</span>
                    <span className="font-mono text-[10px] text-[#D9FF00] tracking-widest">{Math.round(item.percentage)}%</span>
                  </div>
                  <SegmentedBar percentage={item.percentage} />
                </div>
              ))}
            </div>

            <p className="text-[8px] font-mono text-white/10 uppercase tracking-[6px] mt-12">GLOBAL_MARKET_ALLOCATION</p>
          </div>

          {/* Live Feed */}
          <div className="xl:col-span-4 bg-[#0D0D0D] p-10 reveal-item border-l border-white/5">
            <div className="flex items-center gap-4 mb-12">
              <Zap className="text-[#D9FF00] animate-pulse" size={20} />
              <h3 className="font-bebas text-3xl tracking-widest text-white uppercase">LIVE_FEED</h3>
            </div>

            <div className="space-y-6 max-h-[500px] overflow-y-auto no-scrollbar pr-2">
              <AnimatePresence>
                {data.recentOrders.map((order, i) => (
                  <motion.div
                    key={order._id || i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="p-4 bg-white/[0.02] border-l-2 border-white/5 hover:border-[#D9FF00] transition-colors group cursor-pointer"
                  >
                    <div className="flex justify-between text-[8px] font-mono tracking-widest mb-3">
                      <span className={`px-2 py-0.5 border ${order.paymentStatus === 'completed' ? 'border-green-500/20 text-green-500' : 'border-[#D9FF00]/20 text-[#D9FF00]'}`}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                      <span className="text-white/20 uppercase">04:12_AGO</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className="font-bebas text-xl tracking-widest text-white/90 group-hover:text-white transition-colors truncate uppercase leading-none mb-2">
                          {order.items?.[0]?.name || "UNIT_HARDWARE_X"}
                        </h4>
                        <span className="text-[9px] font-mono text-white/10 uppercase tracking-tighter">ID: {order.transactionId?.slice(0, 15)}...</span>
                      </div>
                      <span className="font-bebas text-2xl text-white tracking-widest leading-none">${order.totalAmount}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button className="w-full mt-10 py-4 border border-white/5 text-[9px] font-bebas tracking-[4px] text-white/20 hover:text-white hover:bg-white/5 transition-all">
              LOAD_FULL_LOGS
            </button>

            <div className="mt-12 pt-8 border-t border-white/5">
              <p className="text-[9px] font-mono text-white/10 uppercase tracking-[4px]">NODE_HEALTH_INDEX</p>
              <div className="mt-4 flex gap-1 h-1">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className={`flex-1 ${i < 15 ? 'bg-green-500/20' : 'bg-white/5'}`} />
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </AuthGuard>
  );
}