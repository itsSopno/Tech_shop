"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import { useGlobalContext, IUserData } from "@/context/globalContext";

interface HeroBentoProps {
  session: Session | null;
}

// Kata kona (chamfer) shape, rounded corner er bodole Sinners-er sharp identity
const CHAMFER =
  "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px))";

const IMG = {
  keyboards: "https://i.pinimg.com/1200x/2a/fd/8a/2afd8aad593898f9f4aea5efce8e8c12.jpg",
  mice: "https://i.pinimg.com/1200x/45/44/2d/45442d6d9733e9d2f38dcfe96c900b03.jpg",
  controller: "https://i.pinimg.com/736x/26/73/2d/26732d31d357d34f3ebd81b48b2010a6.jpg",
  keycaps: "https://i.pinimg.com/736x/b8/70/55/b870553a9cfde3ad5aa6600f236b5c8a.jpg",
  gaming: "https://i.pinimg.com/1200x/f5/ac/87/f5ac8769da0b112b60ba5e8fdaef506e.jpg",
};

const strip = [
  { id: 1, title: "Keyboards", note: "Custom built boards", img: IMG.keyboards, href: "/Store?category=keyboards" },
  { id: 2, title: "Mouse", note: "Ultra-light and fast", img: IMG.mice, href: "/Store?category=mice" },
  { id: 3, title: "Controller", note: "Zero stick drift", img: IMG.controller, href: "/Store?category=controller" },
  { id: 4, title: "KeyCaps", note: "Artisan, one of a kind", img: IMG.keycaps, href: "/Store?category=keycaps" },
  { id: 5, title: "Gaming", note: "Everything for the setup", img: IMG.gaming, href: "/Store?category=gaming" },
];

const ticker = [
  "New artisan keycaps just landed",
  "Custom 75% boards, built to order",
  "Hall-effect controllers, zero drift",
  "Delivery all over Bangladesh",
  "Dhaka hub, online 24/7",
];

// Mouse jekhane, shekhane halka indigo alo
const spot = (e: React.MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const Spotlight = () => (
  <div
    className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100"
    style={{
      background:
        "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(99,102,241,0.2), transparent 60%)",
    }}
  />
);

interface SideTileProps {
  title: string;
  note: string;
  img: string;
  href: string;
  badge: string;
}

const SideTile = ({ title, note, img, href, badge }: SideTileProps) => (
  <Link
    href={href}
    onMouseMove={spot}
    style={{ clipPath: CHAMFER }}
    className="bento-tile group/tile relative block min-h-[220px] overflow-hidden bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
  >
    <Image
      src={img}
      alt={title}
      fill
      sizes="(min-width: 1024px) 33vw, 100vw"
      className="object-cover grayscale transition-all duration-700 group-hover/tile:scale-105 group-hover/tile:grayscale-0"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
    <Spotlight />

    <span className="absolute right-6 top-6 z-30 bg-indigo-500 px-3 py-1 font-bebas text-sm tracking-widest text-white">
      {badge}
    </span>

    <div className="absolute bottom-6 left-6 right-6 z-30 flex items-end justify-between gap-4">
      <div>
        <h3 className="font-bebas text-4xl leading-none text-white lg:text-5xl">{title}</h3>
        <p className="mt-2 text-sm text-white/60">{note}</p>
      </div>
      <span className="flex h-11 shrink-0 items-center bg-white px-5 font-bebas text-lg tracking-wider text-black transition-colors group-hover/tile:bg-indigo-500 group-hover/tile:text-white">
        Shop now
      </span>
    </div>
  </Link>
);

const HeroBento = ({ session }: HeroBentoProps) => {
  const { allUsers } = useGlobalContext();
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  const isUserMatched = allUsers?.some((u: IUserData) => u.email === session?.user?.email);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduce) return;

      // Ekta-i orchestrated entrance: tile gulo ekshathe uthe ashe
      gsap.from(".bento-tile", {
        y: 48,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "power4.out",
      });

      // Ticker
      gsap.to(".ticker-track", { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
    }, rootRef);

    // Video parallax (properly cleaned up)
    const onMove = (e: MouseEvent) => {
      if (!videoRef.current || reduce) return;
      gsap.to(videoRef.current, {
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
        duration: 2,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      ctx.revert();
    };
  }, []);

  // Strip: hover/click korle oi panel boro hoy, baki chhoto
  const expand = (id: number) => {
    if (!stripRef.current) return;
    setActiveId(id);
    Array.from(stripRef.current.children).forEach((el, i) => {
      gsap.to(el, { flexGrow: strip[i].id === id ? 4 : 1, duration: 0.6, ease: "power4.out" });
    });
  };

  const reset = () => {
    if (!stripRef.current) return;
    setActiveId(null);
    gsap.to(stripRef.current.children, { flexGrow: 1, duration: 0.6, ease: "power4.out" });
  };

  return (
    <section ref={rootRef} className="w-full bg-[#09090b] px-3 pb-6 pt-20 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-3 lg:grid-cols-12">
        {/* ── MAIN TILE: video hero ── */}
        <div
          onMouseMove={spot}
          style={{ clipPath: CHAMFER }}
          className="bento-tile group/tile relative min-h-[520px] overflow-hidden bg-black lg:col-span-8 lg:min-h-[640px]"
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
          <Spotlight />

          <div className="absolute left-6 top-6 z-30 flex items-center gap-3 text-sm text-white/60">
            <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
            Online now, shipping from Dhaka
          </div>

          <div className="absolute inset-x-6 bottom-8 z-30 sm:inset-x-10 sm:bottom-12">
            <p className="mb-5 max-w-md text-base text-white/70 sm:text-lg">
              Custom boards, artisan keycaps and gear tuned for speed.
            </p>

            <h1 className="mb-10 select-none font-space text-[clamp(52px,9vw,150px)] font-extrabold uppercase italic leading-[0.8] tracking-tighter text-white">
              Tech
              <br />
              <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.5)]">
                Sinners
              </span>
            </h1>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/Store"
                className="bg-white px-10 py-4 text-center font-bebas text-2xl tracking-[0.08em] text-black transition-colors hover:bg-indigo-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
              >
                Explore store
              </Link>
              <Link
                href="/Story"
                className="border border-white/25 px-10 py-4 text-center font-bebas text-2xl tracking-[0.08em] text-white/85 transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
              >
                Our vision
              </Link>
              {isUserMatched ? (
                <Link
                  href="/Community"
                  className="border border-indigo-500/60 bg-indigo-500/20 px-10 py-4 text-center font-bebas text-2xl tracking-[0.08em] text-white transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
                >
                  Community
                </Link>
              ) : (
                <Link
                  href="/CreateProfile"
                  className="bg-indigo-500 px-10 py-4 text-center font-bebas text-2xl tracking-[0.08em] text-white transition-colors hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
                >
                  Join us
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── SIDE COLUMN: duita stacked tile ── */}
        <div className="grid grid-cols-1 gap-3 lg:col-span-4 lg:grid-rows-2">
          <SideTile
            title="Keyboards"
            note="Custom built mechanical masterpieces"
            img={IMG.keyboards}
            href="/Store?category=keyboards"
            badge="New drop"
          />
          <SideTile
            title="Mice"
            note="Ultra-light, built for aim"
            img={IMG.mice}
            href="/Store?category=mice"
            badge="Limited"
          />
        </div>

        {/* ── TICKER ── */}
        <div
          className="bento-tile overflow-hidden border-y border-white/10 bg-black py-3 lg:col-span-12"
          aria-hidden="true"
        >
          <div className="ticker-track flex w-max gap-12 whitespace-nowrap font-bebas text-xl tracking-[0.15em] text-white/50">
            {[...ticker, ...ticker, ...ticker, ...ticker].map((t, i) => (
              <span key={i} className="flex items-center gap-12">
                {t}
                <span className="h-1.5 w-1.5 rotate-45 bg-indigo-500" />
              </span>
            ))}
          </div>
        </div>

        {/* ── EXPANDING CATEGORY STRIP ── */}
        <div
          ref={stripRef}
          onMouseLeave={reset}
          className="bento-tile flex h-[78vh] flex-col gap-3 lg:col-span-12 lg:h-[340px] lg:flex-row"
        >
          {strip.map((cat) => {
            const active = activeId === cat.id;
            return (
              <div
                key={cat.id}
                onMouseEnter={() => expand(cat.id)}
                onClick={() => expand(cat.id)}
                style={{ clipPath: CHAMFER, flexGrow: 1 }}
                className="relative min-h-0 min-w-0 flex-1 basis-0 cursor-pointer overflow-hidden bg-neutral-900"
              >
                <Image
                  src={cat.img}
                  alt={cat.title}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className={`object-cover transition-all duration-700 ${
                    active ? "scale-110 grayscale-0" : "scale-100 grayscale"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute bottom-5 left-6 right-6">
                  <h3 className="font-bebas text-3xl leading-none text-white lg:text-4xl">
                    {cat.title}
                  </h3>
                  <div
                    className={`mt-2 h-[2px] bg-indigo-500 transition-all duration-500 ${
                      active ? "w-full" : "w-0"
                    }`}
                  />
                  <div
                    className={`flex items-center justify-between gap-3 overflow-hidden transition-all duration-500 ${
                      active ? "mt-3 max-h-12 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <span className="truncate text-sm text-white/70">{cat.note}</span>
                    <Link
                      href={cat.href}
                      tabIndex={active ? 0 : -1}
                      className="shrink-0 bg-white px-4 py-1.5 font-bebas text-lg tracking-wider text-black hover:bg-indigo-500 hover:text-white"
                    >
                      Shop now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroBento;