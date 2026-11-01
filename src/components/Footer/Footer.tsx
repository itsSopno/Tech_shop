import React from "react";
import Link from "next/link";
import SinnersLogo from "./sinnersLogo";
import "./footer.css";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/Contact", label: "Contact" },
  { href: "/Payment", label: "Payments" },
  { href: "/Story", label: "Story" },
  { href: "/Caps", label: "Caps" },
];

const SOCIALS = ["TikTok", "Instagram", "YouTube", "Twitch"];
const BRANDS = ["ASUS", "AJAZZ", "REDDRAGON", "HYPERX", "LOGITECH"];

const LandoHero = () => {
  return (
    <section className="footer">
      <section className="body relative mx-2 my-4 flex flex-col items-center overflow-hidden rounded-[24px] bg-indigo-500/20 px-4 py-8 text-indigo-500 md:mx-4 md:rounded-[36px] md:px-12 md:py-10">
        {/* Background contour lines */}
        <div className="pointer-events-none absolute inset-0 opacity-5 md:opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 200 Q 250 100 500 200 T 1000 200" fill="none" stroke="white" strokeWidth="1" />
            <path d="M0 400 Q 250 300 500 400 T 1000 400" fill="none" stroke="white" strokeWidth="1" />
            <path d="M0 600 Q 250 500 500 600 T 1000 600" fill="none" stroke="white" strokeWidth="1" />
          </svg>
        </div>

        {/* Main content */}
        <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-8 md:grid-cols-3 md:gap-0">
          {/* Navigation */}
          <div className="order-2 flex flex-col items-center gap-2 text-center md:order-1 md:items-start md:text-left">
            <span className="mb-1 text-[10px] uppercase tracking-[0.3em] text-white/40">Navigation</span>
            <div className="flex flex-row flex-wrap justify-center gap-x-5 gap-y-1 md:flex-col md:gap-y-1">
              {NAV.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-lg font-bold uppercase text-white transition-all hover:italic hover:text-indigo-500 md:text-xl"
                >
                  {l.label}
                </Link>
              ))}
              <Link href="/store" className="text-lg font-bold uppercase text-indigo-500 md:mt-2 md:text-xl">
                Store
              </Link>
            </div>
          </div>

          {/* Center: headline + helmet */}
          <div className="relative order-1 flex flex-col items-center md:order-2">
            <div className="pointer-events-none absolute -top-6 select-none font-line text-4xl font-black tracking-tighter text-white opacity-10 md:-top-8 md:text-6xl">
              SINNERS
            </div>

            <h2 className="z-20 text-center font-crenzo text-3xl font-black uppercase leading-[0.85] sm:text-4xl md:text-5xl">
              <span className="font-milky italic text-indigo-500">Always</span> <br />
              <span className="italic text-white">Ready</span>
              <br />
              <span className="text-2xl italic text-white sm:text-3xl md:text-4xl">For Customers.</span>
            </h2>

            <div className="group relative mt-4 h-40 w-32 sm:h-48 sm:w-40 md:h-56 md:w-48">
              <img
                src="https://i.postimg.cc/Sx3H5zkH/Chat-GPT-Image-Mar-24-2026-10-49-52-PM.png"
                alt="Lando Helmet"
                className="h-full w-full object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.6)] transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Socials */}
          <div className="order-3 flex flex-col items-center gap-2 text-center md:items-end md:text-right">
            <span className="mb-1 text-[10px] uppercase tracking-[0.3em] text-white/40">Follow On</span>
            <div className="flex flex-row flex-wrap justify-center gap-x-5 gap-y-1 md:flex-col">
              {SOCIALS.map((s) => (
                <a key={s} href="#" className="text-base font-bold uppercase text-white transition-colors hover:text-indigo-500 md:text-lg">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Partner brands */}
        <div className="relative z-10 mt-8 flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-2 opacity-30 grayscale transition-all duration-500 hover:grayscale-0">
          {BRANDS.map((b) => (
            <span key={b} className="text-[10px] font-bold uppercase tracking-[0.2em] text-white md:text-xs">
              {b}
            </span>
          ))}
        </div>

        {/* Official license + Sinners logo */}
        <div className="relative z-10 mt-6 flex w-full max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-5 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <SinnersLogo className="h-12 w-auto text-white" cut="#1b1c39" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold uppercase tracking-wide text-white">Official license</span>
              <span className="text-xs text-white/50">Authorized Sinners store</span>
            </div>
          </div>
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Sinners. All rights reserved.
          </p>
        </div>
      </section>
    </section>
  );
};

export default LandoHero;