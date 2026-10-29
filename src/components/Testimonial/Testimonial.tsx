
"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const reviews = [
    { id: "01", user: "NABIL HASAN", product: "NEON KEYCAPS", feedback: "THE TEXTURE IS PERFECT. BEST UPGRADE FOR MY BOARD.", img: "https://i.pinimg.com/1200x/67/f5/f6/67f5f6f9e46f47072a7b1cc23ec8d986.jpg" },
    { id: "02", user: "SAMIUL KARIM", product: "CUSTOM BOARD", feedback: "THOCKY SOUND IS ADDICTIVE. BUILD QUALITY IS 10/10.", img: "https://i.pinimg.com/1200x/c5/4e/0e/c54e0e95578da2fc7884b70ddbcb921d.jpg" },
    { id: "03", user: "ALAMIN", product: "HALL-CONTROLLER", feedback: "ZERO STICK DRIFT. RESPONSIVENESS IS ON ANOTHER LEVEL.", img: "https://i.pinimg.com/1200x/3d/eb/37/3deb374163936279d14784b6e25ee0b6.jpg" },
];

const PremiumTestimonials = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 50;
            const yPos = (clientY / window.innerHeight - 0.5) * 50;

            gsap.to(".bg-text", {
                x: xPos,
                y: yPos,
                duration: 1,
                ease: "power2.out",
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <main className="min-h-screen bg-obsidian text-silver overflow-hidden relative flex items-center justify-center">
            <div className="bg-text absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <h1 className="text-[25vw] font-black text-white/[0.02] leading-none uppercase italic tracking-tighter">
                    REVIEWS
                </h1>
            </div>

            <div className="relative z-10 w-full">
                {/* Header */}
                <div className="px-6 md:px-20 mb-12 flex justify-between items-end">
                    <div className="space-y-2">
                        <span className="text-indigo-500 font-mono text-xs tracking-[5px] uppercase">Validated_Users</span>
                        <h2 className="text-5xl md:text-7xl font-space font-bold leading-none uppercase">Arsenal <br /> Feedback</h2>
                    </div>
                    <p className="hidden md:block text-white/30 font-mono text-[10px] w-48 text-right uppercase tracking-widest">
                        Encryption: Active // Database_Sync: 100% // Stable_Build_V4
                    </p>
                </div>

                {/* Horizontal Card Slider */}
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto no-scrollbar px-6 md:px-20 pb-20 snap-x snap-mandatory"
                >
                    {reviews.map((item) => (
                        <div
                            key={item.id}
                            className="snap-center shrink-0 w-[85vw] md:w-[450px] aspect-[4/5] bg-white/[0.02] border border-white/5 relative group p-8 flex flex-col justify-between overflow-hidden"
                        >
                            {/* Image Background (Hover reveal) */}
                            <div className="absolute inset-0 opacity-20 group-hover:opacity-60 transition-opacity duration-700">
                                <img src={item.img} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-110 group-hover:scale-100 transition-transform duration-1000" />
                            </div>

                            {/* Card Content */}
                            <div className="relative z-10">
                                <span className="text-indigo-500 font-mono text-xs mb-2 block">{item.id} {'// LOG'}</span>
                                <h3 className="text-4xl font-space font-bold tracking-wider group-hover:italic transition-all uppercase">{item.product}</h3>
                            </div>

                            <div className="relative z-10 space-y-6">
                                <p className="text-xl md:text-2xl font-light leading-snug text-white/80">
                                    &ldquo;{item.feedback}&rdquo;
                                </p>

                                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                                    <div>
                                        <p className="text-xs text-white/40 uppercase tracking-widest">Buyer</p>
                                        <p className="font-space font-bold text-2xl text-indigo-500">{item.user}</p>
                                    </div>
                                    <div className="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-black transition-all">
                                        →
                                    </div>
                                </div>
                            </div>

                            {/* Top Accent Line */}
                            <div className="absolute top-0 left-0 w-0 h-[2px] bg-indigo-500 group-hover:w-full transition-all duration-700"></div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </main>
    );
};

export default PremiumTestimonials;