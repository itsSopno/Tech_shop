"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import SinnersLogo from "../Footer/sinnersLogo";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  pad?: number; // "08" er moto leading zero lagle
}

const stats: Stat[] = [
  { label: "Products launched", value: 24, suffix: "+" },
  { label: "Community members", value: 10, suffix: "K" },
  { label: "Global partners", value: 8, pad: 2 },
];

const CHAMFER =
  "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))";

const fmt = (n: number, pad = 0) => String(Math.round(n)).padStart(pad, "0");

const HEADLINE = ["Hardware", "for your", "whole setup."];

const CATEGORIES = ["Graphics cards", "Keyboards", "Keycaps", "Controllers", "Mice", "Monitors"];

const AboutPage: React.FC = () => {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // Reduced motion hole kichui animate hobe na, final state-i dekhabe
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Headline: line-by-line mask reveal
        gsap.from(".line-in", {
          yPercent: 115,
          duration: 1.1,
          stagger: 0.12,
          ease: "power4.out",
        });

        // 2. Image: dark curtain uthe jay + image zoom-out, tarpor scroll-e halka parallax
        const tl = gsap.timeline({ delay: 0.2 });
        tl.to(".img-curtain", { scaleY: 0, duration: 1.1, ease: "power4.inOut" })
          .from(".img-photo", { scale: 1.3, duration: 1.4, ease: "power3.out" }, "<")
          .from(".img-seal", { scale: 0.6, rotate: -14, opacity: 0, duration: 0.8, ease: "back.out(1.6)" }, "-=0.4");

        gsap.fromTo(
          ".img-photo-inner",
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: ".img-frame", start: "top bottom", end: "bottom top", scrub: true },
          }
        );

        // 3. Text blocks: scroll-e ekbar uthe ashe
        gsap.from(".fade-up", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".copy", start: "top 85%", once: true },
        });

        // 4. Stats: number count-up + niche line ta tane
        gsap.utils.toArray<HTMLElement>(".stat").forEach((el) => {
          const num = el.querySelector<HTMLElement>(".stat-num")!;
          const fill = el.querySelector<HTMLElement>(".stat-fill")!;
          const target = Number(el.dataset.value);
          const pad = Number(el.dataset.pad ?? 0);
          const obj = { v: 0 };
          num.textContent = fmt(0, pad);

          const st = { trigger: el, start: "top 92%", once: true };
          gsap.to(obj, {
            v: target,
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: st,
            onUpdate: () => {
              num.textContent = fmt(obj.v, pad);
            },
          });
          gsap.fromTo(
            fill,
            { scaleX: 0 },
            { scaleX: 1, duration: 1.8, ease: "power2.out", scrollTrigger: st }
          );
        });
      });
    }, root);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <main ref={root} className="w-full overflow-hidden bg-[#09090b] text-white">
      <section className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 pb-14 pt-28 md:grid-cols-[1.15fr_0.85fr] md:gap-14 md:px-10 md:pb-20">
        {/* ── TEXT ── */}
        <div className="copy">
          <h1 className="font-space text-[clamp(34px,5.6vw,76px)] font-extrabold leading-[0.95] tracking-tighter">
            {HEADLINE.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <span
                  className={`line-in block ${
                    i === 1 ? "text-transparent [-webkit-text-stroke:1.5px_#d4ff3a]" : ""
                  } ${i === 2 ? "italic" : ""}`}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="fade-up mt-8 max-w-[46ch] text-lg leading-snug text-white/85">
            We sell computer hardware for gamers and creators, picked for people who care about every
            part of their setup.
          </p>

          <ul className="fade-up mt-5 flex flex-wrap gap-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c} className="bg-white/[0.06] px-3 py-1.5 text-white/70">
                {c}
              </li>
            ))}
            <li className="px-3 py-1.5 text-white/40">and more</li>
          </ul>

          <div className="fade-up mt-8 max-w-[46ch] border-l-2 border-[#d4ff3a] pl-4">
            <h2 className="font-bebas text-2xl leading-none text-white">Keycaps made with our collaborators</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-white/60">
              We create keycaps together with other creators, so every design comes with its own story.
            </p>
            <Link href="/Caps" className="mt-3 inline-block text-sm text-[#d4ff3a] hover:underline">
              See the keycaps
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-5">
            {stats.map((s) => (
              <div key={s.label} className="stat" data-value={s.value} data-pad={s.pad ?? 0}>
                <p className="font-bebas text-5xl leading-none sm:text-6xl">
                  <span className="stat-num">{fmt(s.value, s.pad)}</span>
                  {s.suffix && <span className="text-[#d4ff3a]">{s.suffix}</span>}
                </p>
                <div className="mt-3 h-px w-full bg-white/15">
                  <div className="stat-fill h-full origin-left bg-[#d4ff3a]" />
                </div>
                <p className="mt-2 text-xs text-white/50 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── IMAGE ── */}
        <div
          className="img-frame relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden bg-neutral-900 md:max-h-[540px]"
          style={{ clipPath: CHAMFER }}
        >
          <div className="img-photo absolute inset-0">
            <div className="img-photo-inner absolute -inset-[8%]">
              <Image
                src="https://i.pinimg.com/1200x/0b/38/24/0b3824e02cd454af2df5f78c623585bc.jpg"
                alt="Sinners hardware store"
                fill
                sizes="(min-width: 768px) 460px, 100vw"
                className="object-cover grayscale-[30%]"
                priority
              />
            </div>
          </div>
          <div className="img-curtain absolute inset-0 origin-top bg-[#09090b]" />

          {/* Brand seal: curtain-er pore reveal hoy */}
          <div className="img-seal absolute bottom-4 right-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#09090b] ring-1 ring-white/20 md:h-28 md:w-28">
            <span className="absolute inset-1.5 rounded-full border border-dashed border-white/20" aria-hidden />
            <SinnersLogo className="h-14 w-auto text-white md:h-16" cut="#09090b" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;