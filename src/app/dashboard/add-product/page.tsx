"use client";

import ItemForm from "@/components/Dashboard/ItemForm";
import Image from "next/image";

export default function AddKeycapsPage() {
  return (
    <main className="relative min-h-screen w-full text-white font-body selection:bg-[#D9FF00] selection:text-black overflow-x-hidden">


      <div className="fixed inset-0 z-0">
        {/* grayscale// */}
        <Image
          src="https://i.pinimg.com/1200x/f1/8f/fe/f18ffed19934055256cf2f6f1b638bb8.jpg"
          alt="Studio Sinners Background"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>


      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-24 px-8 lg:px-20">


        <div className="text-center mb-20 space-y-4 max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-1.5 h-1.5 bg-[#D9FF00] rounded-none shadow-[0_0_10px_#D9FF00]" />
            <span className="text-[11px] text-white/50 font-mono font-bold uppercase tracking-[5px]">
              Brand Products
            </span>
          </div>

          <h1 className="font-bebas text-7xl md:text-9xl tracking-tighter text-white uppercase italic leading-none">
            Manage_<span className="text-white/10">Products</span>
          </h1>

          <div className="h-[1px] w-24 bg-[#D9FF00] mx-auto mt-8" />
          <p className="text-gray-400 text-sm font-normal leading-relaxed max-w-xl mx-auto pt-8">
            Provision a new primary artisan unit for the Brand collective registry. Precision metadata ensures global operational accuracy.
          </p>
        </div>
        <div className="w-full max-w-2xl bg-black/40 p-12 border border-white/5 backdrop-blur-sm shadow-2xl">
          <ItemForm type="product" />
        </div>
        <div className="mt-20 text-center text-[9px] font-mono text-white/20 tracking-[4px] uppercase">
          Authorized Personnel Only // Operational_Status: Nominal
        </div>
      </div>

    </main>
  );
}