
"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";

const categories = [
  { id: 1, title: "Keyboards", img: "https://i.pinimg.com/1200x/2a/fd/8a/2afd8aad593898f9f4aea5efce8e8c12.jpg" },
  { id: 2, title: "Mice", img: "https://i.pinimg.com/1200x/45/44/2d/45442d6d9733e9d2f38dcfe96c900b03.jpg" },
  { id: 3, title: "Controller", img: "https://i.pinimg.com/736x/26/73/2d/26732d31d357d34f3ebd81b48b2010a6.jpg" },
  { id: 4, title: "KeyCaps", img: "https://i.pinimg.com/736x/b8/70/55/b870553a9cfde3ad5aa6600f236b5c8a.jpg" },
  { id: 5, title: "Gaming", img: "https://i.pinimg.com/1200x/f5/ac/87/f5ac8769da0b112b60ba5e8fdaef506e.jpg" },
];

const ProductShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  const handleInteraction = (id: number, e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const target = e.currentTarget as HTMLElement;
    const isMobile = window.innerWidth < 1024;
    const others = Array.from(containerRef.current.children).filter(el => el !== target);

    setActiveId(id);

    if (isMobile) {
      // Mobile: Vertical Expansion
      gsap.to(target, { height: "45vh", duration: 0.6, ease: "power4.out" });
      gsap.to(others, { height: "12vh", duration: 0.6, ease: "power4.out" });
    } else {
      // Desktop: Horizontal Expansion
      gsap.to(target, { width: "40%", duration: 0.6, ease: "power4.out" });
      gsap.to(others, { width: "15%", duration: 0.6, ease: "power4.out" });
    }

    gsap.to(target.querySelector("img"), { scale: 1.1, duration: 0.8 });
  };

  const resetLayout = () => {
    if (!containerRef.current) return;
    const isMobile = window.innerWidth < 1024;
    setActiveId(null);

    if (isMobile) {
      gsap.to(containerRef.current.children, { height: "20vh", duration: 0.6, ease: "power4.out" });
    } else {
      gsap.to(containerRef.current.children, { width: "20%", duration: 0.6, ease: "power4.out" });
    }
    gsap.to("img", { scale: 1, duration: 0.8 });
  };

  return (
    <section className="w-full min-h-screen lg:h-screen bg-[#0A0A0A] overflow-hidden flex flex-col">
      <div
        ref={containerRef}
        className="flex flex-col lg:flex-row w-full h-full border-b border-white/[0.02] pointer-events-auto"
        onMouseLeave={!activeId ? undefined : resetLayout}
      >
        {categories.map((cat) => (
          <div
            key={cat.id}
            onMouseEnter={(e) => handleInteraction(cat.id, e)}
            onClick={(e) => handleInteraction(cat.id, e)}
            className="relative w-full lg:w-1/5 h-[20vh] lg:h-full border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden cursor-pointer group transition-all pointer-events-auto"
          >
            {/* Background Image */}
            <Image
              src={cat.img}
              alt={cat.title}
              fill
              className={`object-cover transition-all duration-700 ${activeId === cat.id ? 'grayscale-0' : 'grayscale'}`}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 lg:opacity-70" />

            {/* Title */}
            <div className="absolute bottom-6 lg:bottom-10 left-6 right-6">
              <h3 className="font-bebas text-2xl lg:text-4xl text-white uppercase tracking-tighter leading-none">
                {cat.title}
              </h3>
              <div className={`h-[2px] bg-indigo-500 mt-2 transition-all duration-300 ${activeId === cat.id ? 'w-full' : 'w-0'}`} />
            </div>

            {/* Index Number */}
            <span className="absolute top-6 lg:top-10 left-6 font-bebas text-white/20 text-lg lg:text-xl tracking-widest">
              0{cat.id}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Text */}
      <div className="h-14 lg:h-16 flex items-center justify-center bg-black px-4 text-center">
        <p className="font-bebas text-white/40 tracking-[0.2em] lg:tracking-[0.3em] text-[10px] lg:text-xs uppercase italic">
          The Takeover Is Complete // Lando Norris Gear
        </p>
      </div>
    </section>
  );
};

export default ProductShowcase;