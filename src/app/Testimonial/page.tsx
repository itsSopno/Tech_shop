"use client";
import React, { useEffect } from "react";
import { gsap } from "gsap";

const reviews = [
    {
        id: "KC-01",
        product: "Neon Resin Keycaps",
        user: "@CyberPunk_99",
        comment: "The translucency is insane. My RGB looks 2x better now.",
        image: "https://i.pinimg.com/1200x/67/f5/f6/67f5f6f9e46f47072a7b1cc23ec8d986.jpg"
    },
    {
        id: "KB-02",
        product: "Custom 65% Board",
        user: "@ThockMaster",
        comment: "Gasket mount feels like typing on a cloud. 10/10 build quality.",
        image: "https://i.pinimg.com/1200x/c5/4e/0e/c54e0e95578da2fc7884b70ddbcb921d.jpg"
    },
    {
        id: "CT-03",
        product: "Hall-Effect Controller",
        user: "@ProGamer_BD",
        comment: "Zero deadzone. The triggers feel like a high-end sports car.",
        image: "https://i.pinimg.com/1200x/3d/eb/37/3deb374163936279d14784b6e25ee0b6.jpg"
    }
];

const VisualTestimonials = () => {
    useEffect(() => {
        gsap.fromTo(".vault-card",
            { opacity: 0, scale: 0.9, y: 30 },
            { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)" }
        );
    }, []);

    return (
        <main className="min-h-screen text-black py-24 px-6 md:px-12 lg:px-20 relative overflow-hidden">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="mb-20 space-y-4">
                    <div className="inline-block px-4 py-1 border border-[#d9ff00] text-[#d9ff00] font-mono text-xs uppercase tracking-widest">
                        Hardware_Validation_Status: Online
                    </div>
                    <h1 className="font-bebas text-7xl md:text-9xl leading-[0.8] uppercase">
                        Built by us. <br /> <span className="text-[#d9ff00]">Rated by you.</span>
                    </h1>
                </header>

                {/* Horizontal Scroll / Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {reviews.map((item) => (
                        <div key={item.id} className="vault-card group relative flex flex-col bg-[#111] border border-white/10 hover:border-[#d9ff00] transition-all duration-500 overflow-hidden rounded-sm">

                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.product}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                />
                                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-mono border border-white/20">
                                    REF: {item.id}
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-8 space-y-6 relative">
                                <div>
                                    <h3 className="font-bebas text-3xl tracking-wide uppercase mb-1">{item.product}</h3>
                                    <p className="text-[#d9ff00] font-mono text-xs uppercase tracking-widest">{item.user}</p>
                                </div>

                                <p className="text-white/60 text-lg leading-snug group-hover:text-white transition-colors italic">
                                    "{item.comment}"
                                </p>

                                {/* Corner Tech Detail */}
                                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <div key={s} className="w-2 h-2 bg-[#d9ff00]/40 group-hover:bg-[#d9ff00] transition-colors" />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-mono text-white/20">ENCRYPTED_SIGNATURE</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default VisualTestimonials;