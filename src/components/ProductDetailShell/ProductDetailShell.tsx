"use client";

import React, { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import CheckoutModal from "@/components/CheckoutModal/CheckoutModal";
import { useSession } from "next-auth/react";

/* ─────────────────────────── types ─────────────────────────── */

export interface DetailProduct {
    _id: string;
    name: string;
    image: string;
    description?: string;
    price: number;
    stock?: number | null;
    [key: string]: unknown; // extra fields (brand, layout, vramSize…)
}

export type DetailAccent = "emerald" | "amber" | "indigo" | "cyan";

const ACCENT_MAP: Record<
    DetailAccent,
    { text: string; bg: string; border: string; bgSoft: string }
> = {
    emerald: {
        text: "text-emerald-400",
        bg: "bg-emerald-500",
        border: "border-emerald-500",
        bgSoft: "bg-emerald-500/10",
    },
    amber: {
        text: "text-amber-400",
        bg: "bg-amber-500",
        border: "border-amber-500",
        bgSoft: "bg-amber-500/10",
    },
    indigo: {
        text: "text-indigo-400",
        bg: "bg-indigo-500",
        border: "border-indigo-500",
        bgSoft: "bg-indigo-500/10",
    },
    cyan: {
        text: "text-cyan-400",
        bg: "bg-cyan-500",
        border: "border-cyan-500",
        bgSoft: "bg-cyan-500/10",
    },
};

/* ─────────────────────────── props ─────────────────────────── */

interface ProductDetailShellProps {
    params: Promise<{ id: string }>;
    /** Full base URL of the endpoint, e.g. process.env.NEXT_PUBLIC_API_URL + "/api/graphics" */
    endpoint: string;
    /** Key inside the JSON response that holds the product object, e.g. "graphicsCard" */
    responseKey: string;
    /** Where the ← Back button navigates */
    backHref: string;
    /** Label for the back button */
    backLabel: string;
    /** Accent colour theme */
    accent?: DetailAccent;
    /** Optional slot for category/product-specific spec cards */
    renderSpecs?: (product: DetailProduct) => React.ReactNode;
}

/* ──────────────────── Spec Cell helper ──────────────────────── */

export const SpecCell = ({
    label,
    value,
    unit,
}: {
    label: string;
    value?: string | number | boolean | null;
    unit?: string;
}) => {
    if (value === undefined || value === null || value === false) return null;
    const display =
        typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
    return (
        <div className="flex flex-col gap-1 border border-white/5 bg-white/[0.02] p-5">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
                {label}
            </span>
            <span className="font-bebas text-2xl leading-none text-white">
                {display}
                {unit && (
                    <span className="ml-1 text-sm text-white/40">{unit}</span>
                )}
            </span>
        </div>
    );
};

/* ─────────────────────────── shell ─────────────────────────── */

export default function ProductDetailShell({
    params,
    endpoint,
    responseKey,
    backHref,
    backLabel,
    accent = "emerald",
    renderSpecs,
}: ProductDetailShellProps) {
    const { id } = use(params);
    const theme = ACCENT_MAP[accent];

    const [product, setProduct] = useState<DetailProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const { data: session } = useSession();

    const imgRef = useRef<HTMLDivElement>(null);

    /* ── Fetch ── */
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${endpoint}/${id}`);
                const data = await res.json();
                const item: DetailProduct | null =
                    data?.[responseKey] ?? data?.product ?? data?.data ?? null;
                setProduct(item);
            } catch (err) {
                console.error("ProductDetailShell fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, endpoint, responseKey]);

    /* ── GSAP entrance ── */
    useEffect(() => {
        if (loading || !product) return;
        if (
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
            return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                imgRef.current,
                { x: -60, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.9, ease: "power4.out" }
            );
            gsap.fromTo(
                ".detail-reveal",
                { y: 28, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.75,
                    stagger: 0.12,
                    ease: "power3.out",
                    delay: 0.15,
                }
            );
        });
        return () => ctx.revert();
    }, [loading, product]);

    /* ── States ── */
    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-[3px] border-white/10 border-t-white rounded-full animate-spin" />
                    <p className="font-bebas tracking-[0.3em] text-white/30 text-sm uppercase">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center gap-6">
                <p className="font-bebas text-5xl text-white/20 tracking-widest italic">
                    Product Not Found
                </p>
                <Link
                    href={backHref}
                    className="font-bebas tracking-widest text-white/40 hover:text-white transition-colors text-lg"
                >
                    ← {backLabel}
                </Link>
            </div>
        );
    }

    const inStock =
        product.stock === undefined ||
        product.stock === null ||
        product.stock > 0;
    const isAdmin = session?.user?.email === "admin@user";

    return (
        <main className="min-h-screen bg-[#09090b] text-white pt-28 pb-24 px-5 md:px-12 lg:px-20 overflow-hidden">
            {/* ── Back ── */}
            <Link
                href={backHref}
                className="inline-flex items-center gap-2 mb-12 text-white/40 hover:text-white transition-colors group"
            >
                <span className="group-hover:-translate-x-1 transition-transform">
                    ←
                </span>
                <span className="font-bebas tracking-widest text-base">
                    {backLabel}
                </span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start max-w-[1400px] mx-auto">
                {/* ── Image ── */}
                <div
                    ref={imgRef}
                    className="relative w-full aspect-square bg-neutral-900 overflow-hidden group border border-white/5"
                >
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        priority
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                    {/* Stock badge */}
                    {!inStock && (
                        <span className="absolute left-5 top-5 bg-white text-black font-bebas px-4 py-1 text-base tracking-widest">
                            Sold Out
                        </span>
                    )}
                    {inStock &&
                        typeof product.stock === "number" &&
                        product.stock <= 5 && (
                            <span
                                className={`absolute left-5 top-5 ${theme.bg} text-black font-bebas px-4 py-1 text-base tracking-widest`}
                            >
                                Only {product.stock} left
                            </span>
                        )}
                </div>

                {/* ── Info ── */}
                <div className="flex flex-col gap-8">
                    {/* Name + desc */}
                    <div className="space-y-4 detail-reveal">
                        <h1 className="font-bebas text-[clamp(48px,7vw,96px)] leading-[0.9] uppercase tracking-tight text-white">
                            {product.name}
                        </h1>
                        {product.description && (
                            <p className="text-white/40 text-base md:text-lg leading-relaxed max-w-xl">
                                {product.description}
                            </p>
                        )}
                    </div>

                    {/* Price + Stock */}
                    <div className="flex items-center gap-10 detail-reveal">
                        <div>
                            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mb-1">
                                Price
                            </p>
                            <p className={`font-bebas text-5xl ${theme.text}`}>
                                ${product.price.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mb-1">
                                Availability
                            </p>
                            <p
                                className={`font-bebas text-2xl ${inStock ? "text-green-400" : "text-red-400"
                                    }`}
                            >
                                {inStock
                                    ? typeof product.stock === "number"
                                        ? `In Stock (${product.stock})`
                                        : "In Stock"
                                    : "Sold Out"}
                            </p>
                        </div>
                    </div>

                    <div className="h-px w-full bg-white/5 detail-reveal" />

                    {/* ── Spec grid ── */}
                    {renderSpecs && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/5 detail-reveal">
                            {renderSpecs(product)}
                        </div>
                    )}

                    {/* ── Buttons ── */}
                    <div className="flex flex-wrap gap-4 detail-reveal">
                        <button
                            disabled={!inStock}
                            onClick={() => setIsCheckoutOpen(true)}
                            className={`flex-1 min-w-[180px] py-5 font-bebas text-xl tracking-widest transition-all duration-300 ${inStock
                                    ? `${theme.bg} text-black hover:opacity-90 hover:scale-[1.02] active:scale-95`
                                    : "bg-white/10 text-white/30 cursor-not-allowed"
                                }`}
                        >
                            {inStock ? "Acquire Item" : "Sold Out"}
                        </button>

                        <button className="flex-1 min-w-[180px] py-5 font-bebas text-xl tracking-widest border border-white/15 text-white/60 hover:border-white hover:text-white transition-all duration-300">
                            Add to Cart
                        </button>

                        {isAdmin && (
                            <Link
                                href={`/dashboard/edit-product/${product._id}`}
                                className="flex-1 min-w-[180px] py-5 font-bebas text-xl tracking-widest text-center border border-white/15 text-white/60 hover:border-white hover:text-white transition-all duration-300"
                            >
                                Edit Product
                            </Link>
                        )}
                    </div>

                    {/* ── Meta cards ── */}
                    <div className="grid grid-cols-2 gap-3 detail-reveal">
                        <div className={`p-5 border ${theme.border} ${theme.bgSoft}`}>
                            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-1">
                                Authenticity
                            </p>
                            <p className="text-sm font-bebas text-xl tracking-widest text-white">
                                100% Official
                            </p>
                        </div>
                        <div className="p-5 border border-white/5 bg-white/[0.02]">
                            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-1">
                                Shipping
                            </p>
                            <p className="text-sm font-bebas text-xl tracking-widest text-white">
                                Global Express
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Watermark */}
            <div className="fixed bottom-[-3vw] right-[-2vw] opacity-[0.025] font-bebas text-[22vw] italic pointer-events-none select-none text-white leading-none -rotate-12">
                SINNERS
            </div>

            {/* ── Checkout Modal ── */}
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                product={{
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                }}
            />
        </main>
    );
}
