"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronRight, LayoutGrid, Target } from "lucide-react";

interface Keycap {
    id: string;
    name: string;
    series: string;
    image: string;
}

const COLLECTIONS: Keycap[] = [
    { id: "SN-01", name: "WHITE WATER", series: "White_Series", image: "https://i.pinimg.com/736x/62/ee/85/62ee854de29e8eb15d3994cec8210fed.jpg" },
    { id: "SN-02", name: "SKULL", series: "Skull_Series", image: "https://i.pinimg.com/736x/54/2c/db/542cdbf423e0ca7ce504ce676ca7ba12.jpg" },
    { id: "SN-03", name: "JET_FIRE", series: "Jet_Series", image: "https://i.pinimg.com/736x/0b/2f/a4/0b2fa4bd438596d013de0aadd0f9238d.jpg" },
    { id: "SN-04", name: "NARUTO", series: "Naruto_Series", image: "https://i.pinimg.com/736x/2f/5b/c6/2f5bc61409f8be196c4d1020d15d94be.jpg" },
    { id: "SN-05", name: "ONE_PIECE", series: "One_Piece_Series", image: "https://i.pinimg.com/736x/30/c8/48/30c8480883067a9195ad06cd7f4ce1d1.jpg" },
    // ... Duplicate or add your 15+ items here
    { id: "SN-06", name: "STAR_WARS", series: "Star_Wars_Series", image: "https://i.pinimg.com/736x/79/d4/39/79d4396fdea65f4dd8d4d0514179e011.jpg" },
    { id: "SN-07", name: "CHAINSAW_MAN", series: "CHAINSAW_Series", image: "https://i.pinimg.com/736x/a8/60/54/a860545829df326f6b58a50f35db8382.jpg" },
    { id: "SN-08", name: "MC_WHALE", series: "MC_Series", image: "https://i.pinimg.com/736x/db/9d/36/db9d36c681a9a4a5419774c159b8588f.jpg" },
    { id: "SN-09", name: "MC_WHALE", series: "MC_Series", image: "https://i.pinimg.com/736x/1a/6e/59/1a6e592d830544b41a53bb8cdb26cdf5.jpg" },
    { id: "SN-10", name: "MC_WHALE XSPIDER", series: "MC_Series", image: "https://i.pinimg.com/736x/7f/30/0f/7f300fdac4db42da81883d271e17b9f7.jpg" },
    { id: "SN-11", name: "APOLLO", series: "Apollo_Series", image: "https://i.pinimg.com/736x/42/8f/d5/428fd57ab9524c6b22e646fd8166c0d6.jpg" },
    { id: "SN-12", name: "THE ALBERT", series: "Albert_Series", image: "https://i.pinimg.com/736x/bf/8d/da/bf8ddae358b17208ebdead9fdf75e295.jpg" },
    { id: "SN-13", name: "MOON_DUST", series: "Moon_Dust_Series", image: "https://i.pinimg.com/1200x/46/59/45/46594568e63480764354a8dcf356e029.jpg" },
    { id: "SN-14", name: "DRAGON_BALL", series: "Dragon_Ball_Series", image: "https://i.pinimg.com/736x/79/d4/39/79d4396fdea65f4dd8d4d0514179e011.jpg" },
    { id: "SN-15", name: "PURPLE_DRAGON", series: "Purple_Dragon_Series", image: "https://i.pinimg.com/736x/a2/14/7e/a2147e12175a33c35a6df4dac84ed8e6.jpg" },
];

export default function PureShowcase() {
    // const [activeFilter, setActiveFilter] = useState("ALL_UNITS");

    return (
        <main className="bg-obsidian-lowest min-h-screen text-white font-body selection:bg-neon-lime selection:text-black">

            {/* HEADER: MINIMALIST TACTICAL */}
            <header className="p-8 lg:p-20 border-b border-white/[0.03] bg-obsidian-base">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Target size={14} className="text-indigo-500" />
                            <span className="text-[10px] font-mono tracking-[4px] text-white/40 uppercase">SPECIAL_EDITION</span>
                        </div>
                        <h1 className="font-display text-xl md:text-8xl font-black tracking-aggressive uppercase font-crenzo leading-none">
                            KEYCAPS_<span className="text-white/10">GALLERY</span>
                        </h1>
                    </div>
                </div>
            </header>

            {/* THE GRID: HIGH-DENSITY VISUALS */}
            <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-px bg-white/[0.02]">
                {COLLECTIONS.map((unit) => (
                    <div key={unit.id} className="bg-obsidian-base group relative aspect-square flex flex-col overflow-hidden">

                        {/* IMAGE: THE FOCUS */}
                        <div className="relative flex-1 overflow-hidden">
                            <Image
                                src={unit.image}
                                alt={unit.name}
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-40 group-hover:opacity-100"
                            />

                            {/* UNIT ID TAG */}
                            <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <span className="bg-neon-lime text-black px-3 py-1 font-mono text-[9px] font-black tracking-widest">
                                    ID_{unit.id}
                                </span>
                            </div>
                        </div>

                        {/* INFO OVERLAY (Only visible or emphasized on hover) */}
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 bg-obsidian-lowest/90 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm translate-y-4 group-hover:translate-y-0">
                            <p className="text-[3px] md:text-[9px] font-mono text-neon-lime mb-4 tracking-[5px] uppercase">{unit.series}</p>
                            <h3 className="font-display text-xl md:text-3xl font-black tracking-tighter uppercase mb-8">{unit.name}</h3>
                            <button className="flex items-center gap-4 text-[10px] font-black tracking-[4px] text-white/40 hover:text-neon-lime transition-colors uppercase">
                                Analyze_Unit <ChevronRight size={14} />
                            </button>
                        </div>

                        {/* STATIC LABEL (Visible when not hovering) */}
                        <div className="p-6 border-t border-white/[0.03] flex justify-between items-center group-hover:opacity-0 transition-opacity">
                            <span className="text-[10px] font-mono text-white/20 tracking-widest uppercase">{unit.name}</span>
                            <LayoutGrid size={12} className="text-white/10" />
                        </div>
                    </div>
                ))}
            </div>

            {/* FOOTER: MINIMALIST LOGS */}
            <footer className="py-12 px-8 flex justify-between items-center border-t border-white/[0.03] bg-obsidian-lowest">
                <p className="text-[9px] font-mono text-white/10 tracking-[5px] uppercase">
                    Total_Units_Indexed: {COLLECTIONS.length}
                </p>
                <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-white/10" />
                    ))}
                    <div className="w-1 h-1 bg-neon-lime animate-pulse" />
                </div>
            </footer>

        </main>
    );
}