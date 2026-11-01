"use client";

import React from "react";
import Image from "next/image";
import { ShowcaseShell, BaseProduct, formatPrice } from "@/components/ShowcaseShell/showcaseShell";

interface Keyboard extends BaseProduct {
  brand?: string;
  category?: string;
  layout?: string; // "60%", "75%", "TKL"
  switchType?: string; // "Mechanical"
  description?: string;
  isFeatured?: boolean;
}

const ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/api/keyboard`;

const KeyboardSection = () => (
  <ShowcaseShell<Keyboard>
    id="keyboards"
    eyebrow="Keyboards"
    title="Key"
    titleOutline="boards"
    accent="amber"
    endpoint={ENDPOINT}
    responseKeys={["keyboards"]}
    filterLabel="Layout"
    getFilter={(k) => k.layout}
    getHref={(k) => `/Store/keyboards/${k._id}`}
    noun={["keyboard", "keyboards"]}
    gridClass="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
    skeletonClass="aspect-[4/5]"
    renderCard={(k, t) => {
      const soldOut = typeof k.stock === "number" && k.stock <= 0;
      const price = formatPrice(k.price);

      return (
        <>
          {/* Image + boro layout text (60% / 75% / TKL) */}
          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-800">
            <Image
              src={k.image}
              alt={k.name}
              fill
              sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
              className={`object-cover transition-all duration-700 group-hover/card:scale-105 ${soldOut ? "grayscale" : "grayscale-[50%] group-hover/card:grayscale-0"
                }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/10 to-transparent" />

            {k.layout && (
              <span
                aria-hidden
                className="absolute bottom-2 right-4 select-none font-space text-6xl font-extrabold italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.45)]"
              >
                {k.layout}
              </span>
            )}

            {k.isFeatured && (
              <span className={`absolute left-4 top-4 px-3 py-1 font-bebas text-base text-black ${t.bg}`}>
                Featured
              </span>
            )}
            {soldOut && (
              <span className="absolute right-4 top-4 bg-white px-3 py-1 font-bebas text-base text-black">
                Sold out
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <p className={`text-sm ${t.textSoft}`}>{k.brand}</p>
            <h3 className="line-clamp-2 font-bebas text-2xl leading-tight text-white">{k.name}</h3>
            <p className="line-clamp-2 text-sm text-white/50">{k.description}</p>

            {/* Switch + layout ek line-e */}
            <dl className="mt-1 flex gap-6 border-t border-white/10 pt-3 text-sm">
              <div>
                <dt className="text-white/40">Switch</dt>
                <dd className="font-bebas text-xl text-white">{k.switchType ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-white/40">Layout</dt>
                <dd className="font-bebas text-xl text-white">{k.layout ?? "-"}</dd>
              </div>
            </dl>

            <div className="mt-auto flex items-center justify-between pt-3">
              <span className={`font-bebas text-3xl ${price ? "text-white" : "text-white/40"}`}>
                {price ?? "Coming soon"}
              </span>
              <span className={`bg-white px-4 py-1.5 font-bebas text-lg text-black transition-colors ${t.groupHoverBg}`}>
                Details
              </span>
            </div>
          </div>
        </>
      );
    }}
  />
);

export default KeyboardSection;