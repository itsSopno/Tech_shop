
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Keycap {
  _id?: string;
  id?: string;
  name: string;
  image: string;
  description: string;
  price: number | string;
  brand: string;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/keycaps`;
const FALLBACK_URL = "/key.json";
const CURRENCY = "$"; // BDT chaile "৳" kore din

const CHAMFER =
  "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px))";

const slugify = (s: string) =>
  s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const hrefFor = (item: Keycap) => {
  const id = item._id || item.id;
  return `/keycaps/${id ?? slugify(item.name)}`;
};

const fetchJson = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return res.json();
};

const KeycapsSection = () => {
  const [keycaps, setKeycaps] = useState<Keycap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [active, setActive] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const stageImgRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      let list: Keycap[] = [];
      try {
        const data = await fetchJson(API_URL);
        const maybe = data.keycaps || data;
        if (Array.isArray(maybe)) list = maybe;
      } catch {
        // API fail hole niche local fallback use hobe
      }
      if (list.length === 0) {
        const local = await fetchJson(FALLBACK_URL);
        list = Array.isArray(local) ? local : local.keycaps ?? [];
      }
      setKeycaps(list);
      setActive(0);
    } catch (err) {
      console.error("Keycaps load failed:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Scroll-e section dhukle ekbar entrance
  useEffect(() => {
    if (loading || keycaps.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".ks-anim", {
        y: 48,
        opacity: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: "power4.out",
        clearProps: "all",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, keycaps.length]);

  // Keycap bodlale stage-er image ar text smooth change
  useEffect(() => {
    if (loading || !stageImgRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        stageImgRef.current,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" }
      );
      gsap.fromTo(
        ".stage-text",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [active, loading]);

  const current = keycaps[active];

  /* ───────── loading / error / empty ───────── */
  if (loading) {
    return (
      <section className="w-full bg-[#DEDEDE] px-3 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1500px] gap-4 lg:grid-cols-12">
          <div style={{ clipPath: CHAMFER }} className="h-[420px] animate-pulse bg-[#4D4D4D]/10 lg:col-span-7 lg:h-[560px]" />
          <div className="flex flex-col gap-2 lg:col-span-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse bg-[#4D4D4D]/[0.05]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !current) {
    return (
      <section className="w-full bg-[#DEDEDE] px-6 py-24 text-center">
        <p className="font-bebas text-3xl text-[#4D4D4D]">
          {error ? "Could not load keycaps" : "No keycaps available yet"}
        </p>
        {error && (
          <button
            onClick={load}
            className="mt-6 bg-[#f25623] px-8 py-3 font-bebas text-xl text-white transition-colors hover:bg-[#d94514]"
          >
            Try again
          </button>
        )}
      </section>
    );
  }

  /* ───────── main ───────── */
  return (
    <section
      ref={sectionRef}
      id="keycaps"
      className="w-full bg-[#DEDEDE] px-3 py-20 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <div className="ks-anim mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm text-[#4D4D4D]/60">Limited edition</p>
            <h2 className="select-none font-space text-[clamp(40px,7vw,96px)] font-extrabold uppercase italic leading-[0.85] tracking-tighter text-[#4D4D4D]">
              Artisan{" "}
              <span className="text-transparent [-webkit-text-stroke:1px_rgba(77,77,77,0.5)]">
                Keycaps
              </span>
            </h2>
          </div>
          <p className="font-bebas text-2xl text-[#4D4D4D]/60" aria-live="polite">
            <span className="text-[#4D4D4D]">{active + 1}</span> of {keycaps.length}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          {/* ── STAGE: ja select kora ache ── */}
          <div
            style={{ clipPath: CHAMFER }}
            className="ks-anim relative min-h-[460px] overflow-hidden bg-neutral-900 lg:col-span-7 lg:min-h-[600px]"
          >
            <div ref={stageImgRef} className="absolute inset-0">
              <Image
                key={current._id || current.id || active}
                src={current.image}
                alt={current.name}
                fill
                priority={active === 0}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

            <span className="stage-text absolute left-6 top-6 bg-[#f25623] px-3 py-1 font-bebas text-lg text-white">
              {current.brand}
            </span>

            <div className="absolute inset-x-6 bottom-6 sm:inset-x-10 sm:bottom-10">
              <h3 className="stage-text max-w-2xl font-space text-[clamp(28px,4.5vw,60px)] font-extrabold uppercase italic leading-[0.95] tracking-tight text-white">
                {current.name}
              </h3>
              <p className="stage-text mt-4 line-clamp-2 max-w-lg text-base text-white/75">
                {current.description}
              </p>

              <div className="stage-text mt-6 flex flex-wrap items-center gap-5">
                <span className="font-bebas text-5xl leading-none text-white">
                  {CURRENCY}
                  {current.price}
                </span>
                <Link
                  href={hrefFor(current)}
                  className="bg-[#f25623] px-8 py-3 font-bebas text-2xl text-white transition-colors hover:bg-[#d94514] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25623]"
                >
                  View details
                </Link>
              </div>
            </div>
          </div>

          {/* ── SELECTOR LIST ── */}
          <div
            role="list"
            aria-label="Keycaps"
            className="ks-anim -mx-3 flex gap-2 overflow-x-auto px-3 pb-2 sm:-mx-6 sm:px-6 lg:col-span-5 lg:mx-0 lg:max-h-[600px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:px-0 lg:pb-0 lg:pr-2"
          >
            {keycaps.map((item, i) => {
              const isActive = i === active;
              return (
                <button
                  key={item._id || item.id || i}
                  role="listitem"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-current={isActive}
                  className={`flex min-w-[250px] shrink-0 items-center gap-4 border-l-2 p-3 text-left transition-colors lg:min-w-0 ${
                    isActive
                      ? "border-[#f25623] bg-[#f25623]/15"
                      : "border-[#4D4D4D]/20 bg-[#E5E5E5]/60 hover:bg-[#E5E5E5]"
                  }`}
                >
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden bg-neutral-800">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="64px"
                      className={`object-cover transition-all duration-500 ${
                        isActive ? "grayscale-0" : "grayscale"
                      }`}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-[#f25623] font-medium">{item.brand}</span>
                    <span
                      className={`block truncate font-bebas text-2xl leading-tight ${
                        isActive ? "text-[#4D4D4D]" : "text-[#4D4D4D]/70"
                      }`}
                    >
                      {item.name}
                    </span>
                  </span>
                  <span className="font-bebas text-2xl text-[#4D4D4D]/80">
                    {CURRENCY}
                    {item.price}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeycapsSection;