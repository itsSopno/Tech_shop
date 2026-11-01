"use client";

import React from "react";
import Image from "next/image";
import { ShowcaseShell, BaseProduct, formatPrice } from "@/components/ShowcaseShell/showcaseShell";

// Note: keycaps collection-e stock / category nai, tai optional rakha hoyeche
interface Keycap extends BaseProduct {
  brand?: string;
  description?: string;
}

const ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/api/keycaps`;

const KeycapSection = () => (
  <ShowcaseShell<Keycap>
    id="keycaps"
    eyebrow="Artisan keycaps"
    title="Artisan"
    titleOutline="Keycaps"
    accent="indigo"
    endpoint={ENDPOINT}
    responseKeys={["keycaps"]}
    filterLabel="Brand"
    getFilter={(k) => k.brand}
    getHref={(k) => `/Store/keycaps/${k._id}`}
    noun={["keycap", "keycaps"]}
    gridClass="grid-cols-2 xl:grid-cols-3"
    skeletonClass="aspect-[3/4]"
    renderCard={(k, t) => (
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-800">
        <Image
          src={k.image}
          alt={k.name}
          fill
          sizes="(min-width: 1280px) 30vw, 50vw"
          className="object-cover grayscale-[30%] transition-all duration-700 group-hover/card:scale-110 group-hover/card:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {k.brand && (
          <span className={`absolute left-4 top-4 px-3 py-1 font-bebas text-base text-white ${t.bg}`}>
            {k.brand}
          </span>
        )}

        {/* Niche info panel: hover korle description uthe ashe, touch device-e hidden thake */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 sm:p-5">
          <h3 className="line-clamp-2 font-bebas text-2xl leading-tight text-white sm:text-3xl">{k.name}</h3>

          <p className="line-clamp-3 max-h-0 text-sm text-white/70 opacity-0 transition-all duration-500 group-hover/card:max-h-24 group-hover/card:opacity-100">
            {k.description}
          </p>

          <div className="flex items-center justify-between pt-1">
            <span className="font-bebas text-3xl text-white">{formatPrice(k.price) ?? "Price soon"}</span>
            <span
              aria-hidden
              className={`flex h-9 w-9 items-center justify-center bg-white text-black transition-colors ${t.groupHoverBg} group-hover/card:text-white`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    )}
  />
);

export default KeycapSection;