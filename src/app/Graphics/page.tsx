"use client";

import React from "react";
import Image from "next/image";
import { ShowcaseShell, BaseProduct, formatPrice, discountPct } from "@/components/ShowcaseShell/showcaseShell";

interface GraphicsCard extends BaseProduct {
  oldPrice?: number;
  brand?: string;
  model?: string;
  vramSize?: number;
  vramType?: string;
  coreClock?: number;
  boostClock?: number;
  powerConnectors?: unknown[];
  displayOutputs?: unknown[];
  rayTracing?: boolean;
  dlss?: string;
  port?: string;
  description?: string;
  isFeatured?: boolean;
}

// Apnar backend route onujayi ekhane URL bodle nin
const ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/api/graphics-cards`;

const Spec = ({ label, value, unit }: { label: string; value?: string | number; unit?: string }) => (
  <div className="flex flex-col gap-0.5 bg-neutral-900 px-3 py-3">
    <span className="text-xs text-white/40">{label}</span>
    <span className="font-bebas text-2xl leading-none text-white">
      {value ?? "-"}
      {value !== undefined && unit && <span className="ml-1 text-sm text-white/40">{unit}</span>}
    </span>
  </div>
);

const GraphicsCardSection = () => (
  <ShowcaseShell<GraphicsCard>
    id="graphics-cards"
    eyebrow="Graphics cards"
    title="Graphics"
    titleOutline="Cards"
    accent="emerald"
    endpoint={ENDPOINT}
    filterLabel="Brand"
    getFilter={(g) => g.brand}
    getHref={(g) => `/Store/graphics-cards/${g._id}`}
    noun={["card", "cards"]}
    gridClass="grid-cols-1 md:grid-cols-2 2xl:grid-cols-3"
    skeletonClass="aspect-[4/5]"
    renderCard={(g, t) => {
      const soldOut = typeof g.stock === "number" && g.stock <= 0;
      const low = typeof g.stock === "number" && g.stock > 0 && g.stock <= 5;
      const off = discountPct(g.price, g.oldPrice);

      return (
        <>
          {/* Image: wide, GPU-r jonno 16:10 */}
          <div className="relative aspect-[16/10] overflow-hidden bg-neutral-800">
            <Image
              src={g.image}
              alt={g.name}
              fill
              sizes="(min-width: 1536px) 30vw, (min-width: 768px) 45vw, 100vw"
              className={`object-cover transition-all duration-700 group-hover/card:scale-105 ${soldOut ? "grayscale" : "grayscale-[40%] group-hover/card:grayscale-0"
                }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />

            {off > 0 && (
              <span className={`absolute right-4 top-4 px-3 py-1 font-bebas text-lg text-black ${t.bg}`}>
                -{off}%
              </span>
            )}
            {(soldOut || low) && (
              <span className="absolute left-4 top-4 bg-white px-3 py-1 font-bebas text-base text-black">
                {soldOut ? "Sold out" : `Only ${g.stock} left`}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-4 p-5">
            <div>
              <p className={`text-sm ${t.textSoft}`}>
                {[g.brand, g.model?.toUpperCase()].filter(Boolean).join(" / ")}
              </p>
              <h3 className="mt-1 line-clamp-2 font-bebas text-2xl leading-tight text-white">{g.name}</h3>
            </div>

            {/* Spec grid: 1px gap diye divider */}
            <div className="grid grid-cols-3 gap-px bg-white/10">
              <Spec label={g.vramType ?? "VRAM"} value={g.vramSize} unit="GB" />
              <Spec label="Boost clock" value={g.boostClock} unit="MHz" />
              <Spec label="Interface" value={g.port?.replace("PCI Express", "PCIe").replace("PCI-E", "PCIe")} />
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              {g.rayTracing && (
                <span className={`px-2.5 py-1 ${t.bgSoft} ${t.textSoft}`}>Ray tracing</span>
              )}
              {g.dlss && <span className={`px-2.5 py-1 ${t.bgSoft} ${t.textSoft}`}>{g.dlss}</span>}
              {!!g.displayOutputs?.length && (
                <span className="bg-white/[0.06] px-2.5 py-1 text-white/60">
                  {g.displayOutputs.length} display output{g.displayOutputs.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="mt-auto flex items-end justify-between pt-2">
              <div className="flex flex-col leading-none">
                {g.oldPrice && g.oldPrice > g.price ? (
                  <span className="mb-1 text-sm text-white/40 line-through">{formatPrice(g.oldPrice)}</span>
                ) : null}
                <span className="font-bebas text-4xl text-white">{formatPrice(g.price) ?? "Price soon"}</span>
              </div>
              <span
                className={`bg-white px-4 py-1.5 font-bebas text-lg text-black transition-colors ${t.groupHoverBg}`}
              >
                Details
              </span>
            </div>
          </div>
        </>
      );
    }}
  />
);

export default GraphicsCardSection;