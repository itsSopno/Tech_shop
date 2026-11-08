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
        text: "text-[#f25623]",
        bg: "bg-[#f25623]",
        border: "border-[#f25623]",
        bgSoft: "bg-[#f25623]/15",
    },
    amber: {
        text: "text-[#f25623]",
        bg: "bg-[#f25623]",
        border: "border-[#f25623]",
        bgSoft: "bg-[#f25623]/15",
    },
    indigo: {
        text: "text-[#f25623]",
        bg: "bg-[#f25623]",
        border: "border-[#f25623]",
        bgSoft: "bg-[#f25623]/15",
    },
    cyan: {
        text: "text-[#f25623]",
        bg: "bg-[#f25623]",
        border: "border-[#f25623]",
        bgSoft: "bg-[#f25623]/15",
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
        <div className="flex flex-col gap-1 border border-[#4D4D4D]/15 bg-[#EAEAEA] p-5">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#4D4D4D]/60">
                {label}
            </span>
            <span className="font-bebas text-2xl leading-none text-[#4D4D4D]">
                {display}
                {unit && (
                    <span className="ml-1 text-sm text-[#4D4D4D]/60">{unit}</span>
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
            <div className="min-h-screen bg-[#DEDEDE] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-[3px] border-[#4D4D4D]/20 border-t-[#f25623] rounded-full animate-spin" />
                    <p className="font-bebas tracking-[0.3em] text-[#4D4D4D]/60 text-sm uppercase">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#DEDEDE] flex flex-col items-center justify-center gap-6">
                <p className="font-bebas text-5xl text-[#4D4D4D]/30 tracking-widest italic">
                    Product Not Found
                </p>
                <Link
                    href={backHref}
                    className="font-bebas tracking-widest text-[#4D4D4D]/60 hover:text-[#f25623] transition-colors text-lg"
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
        <main className="min-h-screen bg-[#DEDEDE] text-[#4D4D4D] pt-28 pb-24 px-5 md:px-12 lg:px-20 overflow-hidden">
            {/* ── Back ── */}
            <Link
                href={backHref}
                className="inline-flex items-center gap-2 mb-12 text-[#4D4D4D]/60 hover:text-[#f25623] transition-colors group"
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
                    className="relative w-full aspect-square bg-[#EAEAEA] overflow-hidden group border border-[#4D4D4D]/15"
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
                        <span className="absolute left-5 top-5 bg-[#4D4D4D] text-white font-bebas px-4 py-1 text-base tracking-widest">
                            Sold Out
                        </span>
                    )}
                    {inStock &&
                        typeof product.stock === "number" &&
                        product.stock <= 5 && (
                            <span
                                className={`absolute left-5 top-5 ${theme.bg} text-white font-bebas px-4 py-1 text-base tracking-widest`}
                            >
                                Only {product.stock} left
                            </span>
                        )}
                </div>

                {/* ── Info ── */}
                <div className="flex flex-col gap-8">
                    {/* Name + desc */}
                    <div className="space-y-4 detail-reveal">
                        <h1 className="font-bebas text-[clamp(48px,7vw,96px)] leading-[0.9] uppercase tracking-tight text-[#4D4D4D]">
                            {product.name}
                        </h1>
                        {product.description && (
                            <p className="text-[#4D4D4D]/75 text-base md:text-lg leading-relaxed max-w-xl">
                                {product.description}
                            </p>
                        )}
                    </div>

                    {/* Price + Stock */}
                    <div className="flex items-center gap-10 detail-reveal">
                        <div>
                            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#4D4D4D]/50 mb-1">
                                Price
                            </p>
                            <p className={`font-bebas text-5xl ${theme.text}`}>
                                ${product.price.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#4D4D4D]/50 mb-1">
                                Availability
                            </p>
                            <p
                                className={`font-bebas text-2xl ${inStock ? "text-emerald-600 font-semibold" : "text-rose-500 font-semibold"
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

                    <div className="h-px w-full bg-[#4D4D4D]/15 detail-reveal" />

                    {/* ── Spec grid ── */}
                    {renderSpecs && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-[#4D4D4D]/15 detail-reveal">
                            {renderSpecs(product)}
                        </div>
                    )}

                    {/* ── Buttons ── */}
                    <div className="flex flex-wrap gap-4 detail-reveal">
                        <button
                            disabled={!inStock}
                            onClick={() => setIsCheckoutOpen(true)}
                            className={`flex-1 min-w-[180px] py-5 font-bebas text-xl tracking-widest transition-all duration-300 ${inStock
                                    ? `${theme.bg} text-white hover:opacity-90 hover:scale-[1.02] active:scale-95`
                                    : "bg-[#4D4D4D]/20 text-[#4D4D4D]/40 cursor-not-allowed"
                                }`}
                        >
                            {inStock ? "Acquire Item" : "Sold Out"}
                        </button>

                        <button className="flex-1 min-w-[180px] py-5 font-bebas text-xl tracking-widest border border-[#4D4D4D]/25 text-[#4D4D4D] hover:border-[#f25623] hover:text-[#f25623] transition-all duration-300">
                            Add to Cart
                        </button>

                        {isAdmin && (
                            <Link
                                href={`/dashboard/edit-product/${product._id}`}
                                className="flex-1 min-w-[180px] py-5 font-bebas text-xl tracking-widest text-center border border-[#4D4D4D]/25 text-[#4D4D4D] hover:border-[#f25623] hover:text-[#f25623] transition-all duration-300"
                            >
                                Edit Product
                            </Link>
                        )}
                    </div>

                    {/* ── Meta cards ── */}
                    <div className="grid grid-cols-2 gap-3 detail-reveal">
                        <div className={`p-5 border ${theme.border} ${theme.bgSoft}`}>
                            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#4D4D4D]/60 mb-1">
                                Authenticity
                            </p>
                            <p className="text-sm font-bebas text-xl tracking-widest text-[#4D4D4D]">
                                100% Official
                            </p>
                        </div>
                        <div className="p-5 border border-[#4D4D4D]/15 bg-[#EAEAEA]">
                            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#4D4D4D]/60 mb-1">
                                Shipping
                            </p>
                            <p className="text-sm font-bebas text-xl tracking-widest text-[#4D4D4D]">
                                Global Express
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Watermark */}
            <div className="fixed bottom-[-3vw] right-[-2vw] opacity-[0.04] font-bebas text-[22vw] italic pointer-events-none select-none text-[#4D4D4D] leading-none -rotate-12">
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
