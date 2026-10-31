"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────── types ─────────────────────── */
interface Product {
    _id?: string;
    id?: string;
    name: string;
    image: string;
    description?: string;
    brand?: string;
    price: number | string;
    oldPrice?: number | string;
    stock?: number | string;
    isFeatured?: boolean;
}

interface Tab {
    key: string;
    label: string;
    icon: string;
    apiPath: string;
    responseKey: string;
    detailBase: string;
    accentFrom: string;
    accentTo: string;
    tagLine: string;
}

/* ─────────────────────── constants ─────────────────────── */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

const TABS: Tab[] = [
    {
        key: "graphics",
        label: "Graphics Cards",
        icon: "⬡",
        apiPath: "/api/graphics",
        responseKey: "graphicsCards",
        detailBase: "/graphics-cards",
        accentFrom: "#6366f1",
        accentTo: "#8b5cf6",
        tagLine: "Top Picks",
    },
    {
        key: "monitor",
        label: "Monitors",
        icon: "▣",
        apiPath: "/api/monitor",
        responseKey: "monitors",
        detailBase: "/monitors",
        accentFrom: "#0ea5e9",
        accentTo: "#06b6d4",
        tagLine: "Crystal Clear",
    },
    {
        key: "cooler",
        label: "Liquid Coolers",
        icon: "❄",
        apiPath: "/api/liquid-cooler",
        responseKey: "coolers",
        detailBase: "/liquid-coolers",
        accentFrom: "#10b981",
        accentTo: "#14b8a6",
        tagLine: "Stay Frosty",
    },
];

const CHAMFER =
    "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px))";

const slugify = (s: string) =>
    s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const formatPrice = (p: number | string) => {
    const n = Number(p);
    return Number.isFinite(n) ? n.toLocaleString("en-US") : String(p);
};

const fetchJson = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} → ${res.status}`);
    return res.json();
};

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─────────────────────── component ─────────────────────── */
const ProductShowcase = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [items, setItems] = useState<Product[]>([]);
    const [activeItem, setActiveItem] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const mounted = useRef(true);

    const tab = TABS[activeTab];

    /* ── fetch ── */
    const load = useCallback(
        async (tabIdx: number) => {
            const t = TABS[tabIdx];
            setLoading(true);
            setError(false);
            setItems([]);
            setActiveItem(0);
            try {
                const data = await fetchJson(`${API_BASE}${t.apiPath}`);
                const raw = data[t.responseKey] ?? data;
                const list: Product[] = Array.isArray(raw) ? raw : [];
                if (mounted.current) {
                    setItems(list);
                    setActiveItem(0);
                }
            } catch (err) {
                console.error(`[ProductShowcase] fetch failed for ${t.key}:`, err);
                if (mounted.current) setError(true);
            } finally {
                if (mounted.current) setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        mounted.current = true;
        load(activeTab);
        return () => {
            mounted.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── tab switch ── */
    const switchTab = (idx: number) => {
        if (idx === activeTab) return;
        setActiveTab(idx);
        load(idx);
    };

    /* ── entrance animation ── */
    useEffect(() => {
        if (loading || items.length === 0 || prefersReducedMotion()) return;
        const ctx = gsap.context(() => {
            gsap.from(".ps-anim", {
                y: 48,
                opacity: 0,
                duration: 0.9,
                stagger: 0.07,
                ease: "power4.out",
                clearProps: "all",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    once: true,
                },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, [loading, items.length, activeTab]);

    /* ── stage change animation ── */
    useEffect(() => {
        if (loading || !stageRef.current || prefersReducedMotion()) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                stageRef.current,
                { opacity: 0, scale: 1.05 },
                { opacity: 1, scale: 1, duration: 0.65, ease: "power3.out" }
            );
            gsap.fromTo(
                ".ps-stage-text",
                { y: 14, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, [activeItem, loading, activeTab]);

    const current = items[activeItem];

    const hrefFor = (item: Product) => {
        const id = item._id || item.id;
        return `${tab.detailBase}/${id ?? slugify(item.name)}`;
    };

    /* ─────── skeleton ─────── */
    const Skeleton = () => (
        <div className="mx-auto grid max-w-[1500px] gap-4 lg:grid-cols-12">
            <div
                style={{ clipPath: CHAMFER }}
                className="h-[420px] animate-pulse bg-white/[0.05] lg:col-span-7 lg:h-[560px]"
            />
            <div className="flex flex-col gap-2 lg:col-span-5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-24 animate-pulse bg-white/[0.04]" />
                ))}
            </div>
        </div>
    );

    /* ─────── render ─────── */
    return (
        <section
            ref={sectionRef}
            id="product-showcase"
            className="w-full bg-[#09090b] px-3 py-20 sm:px-6 lg:px-10"
        >
            <div className="mx-auto max-w-[1500px]">

                {/* ── TAB BAR ── */}
                <div className="ps-anim mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p
                            className="mb-3 text-sm font-mono tracking-widest uppercase"
                            style={{ color: tab.accentFrom }}
                        >
                            {tab.tagLine}
                        </p>
                        <h2 className="select-none font-space text-[clamp(36px,6vw,88px)] font-extrabold uppercase italic leading-[0.88] tracking-tighter text-white">
                            {tab.label.split(" ")[0]}{" "}
                            <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.45)]">
                                {tab.label.split(" ").slice(1).join(" ")}
                            </span>
                        </h2>
                    </div>

                    {/* tab pills */}
                    <div className="flex shrink-0 gap-1 rounded-none border border-white/10 p-1">
                        {TABS.map((t, i) => {
                            const isActive = i === activeTab;
                            return (
                                <button
                                    key={t.key}
                                    type="button"
                                    onClick={() => switchTab(i)}
                                    style={
                                        isActive
                                            ? {
                                                background: `linear-gradient(135deg, ${t.accentFrom}22, ${t.accentTo}22)`,
                                                borderColor: t.accentFrom,
                                                color: t.accentFrom,
                                            }
                                            : {}
                                    }
                                    className={`flex items-center gap-2 border px-4 py-2 font-bebas text-lg transition-all duration-300 ${isActive
                                            ? "border-current"
                                            : "border-transparent text-white/40 hover:text-white/70"
                                        }`}
                                >
                                    <span className="text-sm">{t.icon}</span>
                                    <span className="hidden sm:inline">{t.label}</span>
                                    <span className="sm:hidden">{t.label.split(" ")[0]}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── BODY ── */}
                {loading ? (
                    <Skeleton />
                ) : error || !current ? (
                    <div className="py-24 text-center">
                        <p className="font-bebas text-3xl text-white">
                            {error
                                ? `Could not load ${tab.label}`
                                : `No ${tab.label} available yet`}
                        </p>
                        {error && (
                            <button
                                onClick={() => load(activeTab)}
                                className="mt-6 border border-white/20 px-8 py-3 font-bebas text-xl text-white/80 transition-colors hover:border-white hover:text-white"
                            >
                                Try again
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4 lg:grid-cols-12">

                        {/* ── STAGE ── */}
                        <div
                            style={{ clipPath: CHAMFER }}
                            className="ps-anim relative min-h-[460px] overflow-hidden bg-neutral-900 lg:col-span-7 lg:min-h-[600px]"
                        >
                            <div ref={stageRef} className="absolute inset-0">
                                {current.image && (
                                    <Image
                                        key={`${activeTab}-${current._id || current.id || activeItem}`}
                                        src={current.image}
                                        alt={current.name}
                                        fill
                                        priority={activeItem === 0}
                                        sizes="(min-width: 1024px) 55vw, 100vw"
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                            {/* accent gradient overlay */}
                            <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                    background: `radial-gradient(ellipse at 70% 20%, ${tab.accentFrom}55 0%, transparent 60%)`,
                                }}
                            />

                            {current.brand && (
                                <span
                                    className="ps-stage-text absolute left-6 top-6 px-3 py-1 font-bebas text-lg text-white"
                                    style={{ background: tab.accentFrom }}
                                >
                                    {current.brand}
                                </span>
                            )}

                            <div className="absolute inset-x-6 bottom-6 sm:inset-x-10 sm:bottom-10">
                                <h3 className="ps-stage-text max-w-2xl font-space text-[clamp(28px,4.5vw,60px)] font-extrabold uppercase italic leading-[0.95] tracking-tight text-white">
                                    {current.name}
                                </h3>
                                {current.description && (
                                    <p className="ps-stage-text mt-4 line-clamp-2 max-w-lg text-base text-white/65">
                                        {current.description}
                                    </p>
                                )}

                                <div className="ps-stage-text mt-6 flex flex-wrap items-center gap-5">
                                    <span className="font-bebas text-5xl leading-none text-white">
                                        ${formatPrice(current.price)}
                                    </span>
                                    <Link
                                        href={hrefFor(current)}
                                        className="px-8 py-3 font-bebas text-2xl text-white transition-all hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                        style={{ background: tab.accentFrom }}
                                    >
                                        View details
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* ── SELECTOR LIST ── */}
                        <div
                            role="list"
                            aria-label={tab.label}
                            className="ps-anim -mx-3 flex gap-2 overflow-x-auto px-3 pb-2 sm:-mx-6 sm:px-6 lg:col-span-5 lg:mx-0 lg:max-h-[600px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:px-0 lg:pb-0 lg:pr-2"
                        >
                            {items.map((item, i) => {
                                const isActive = i === activeItem;
                                return (
                                    <div
                                        role="listitem"
                                        key={item._id || item.id || i}
                                        className="shrink-0 lg:shrink"
                                    >
                                        <button
                                            type="button"
                                            onMouseEnter={() => setActiveItem(i)}
                                            onFocus={() => setActiveItem(i)}
                                            onClick={() => setActiveItem(i)}
                                            aria-current={isActive ? "true" : undefined}
                                            style={
                                                isActive
                                                    ? {
                                                        borderLeftColor: tab.accentFrom,
                                                        background: `${tab.accentFrom}18`,
                                                    }
                                                    : {}
                                            }
                                            className={`flex w-full min-w-[250px] items-center gap-4 border-l-2 p-3 text-left transition-all duration-300 lg:min-w-0 ${isActive
                                                    ? ""
                                                    : "border-white/10 hover:bg-white/[0.04]"
                                                }`}
                                        >
                                            <span className="relative h-16 w-16 shrink-0 overflow-hidden bg-neutral-800">
                                                {item.image && (
                                                    <Image
                                                        src={item.image}
                                                        alt=""
                                                        fill
                                                        sizes="64px"
                                                        className={`object-cover transition-all duration-500 ${isActive ? "grayscale-0" : "grayscale"
                                                            }`}
                                                    />
                                                )}
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                {item.brand && (
                                                    <span
                                                        className="block text-sm"
                                                        style={{ color: isActive ? tab.accentFrom : undefined }}
                                                    >
                                                        {item.brand}
                                                    </span>
                                                )}
                                                <span
                                                    className={`block truncate font-bebas text-2xl leading-tight ${isActive ? "text-white" : "text-white/60"
                                                        }`}
                                                >
                                                    {item.name}
                                                </span>
                                            </span>
                                            <span className="font-bebas text-2xl text-white/70">
                                                ${formatPrice(item.price)}
                                            </span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── counter ── */}
                {!loading && !error && items.length > 0 && (
                    <p className="mt-6 text-right font-bebas text-2xl text-white/40">
                        <span className="text-white">{activeItem + 1}</span> of {items.length}
                    </p>
                )}
            </div>
        </section>
    );
};

export default ProductShowcase;
