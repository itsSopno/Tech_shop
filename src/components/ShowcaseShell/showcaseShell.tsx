"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";

/* ────────────────────────── shared helpers ────────────────────────── */

export const CURRENCY = "$"; // BDT chaile "৳" kore din

export const CHAMFER =
  "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))";

// Mouse jekhane, shekhane halka alo
export const spot = (e: React.MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export const getPageList = (current: number, total: number): (number | "gap")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const list = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  list.forEach((p, i) => {
    if (i > 0 && p - list[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
};

export const formatPrice = (n?: number | null) =>
  typeof n === "number" && n > 0 ? `${CURRENCY}${n.toLocaleString()}` : null;

export const discountPct = (price?: number, oldPrice?: number) =>
  price && oldPrice && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0;

/* ────────────────────────── accent themes ──────────────────────────
   Tailwind static class lagbe, tai dynamic string banano jabe na.
   Protita category-r nijer rong.                                       */

export type Accent = "emerald" | "amber" | "indigo" | "cyan";

export interface Theme {
  text: string;
  textSoft: string;
  bg: string;
  bgSoft: string;
  border: string;
  ring: string;
  outline: string;
  hoverBg: string;
  groupHoverBg: string;
  glow: string;
}

export const THEME: Record<Accent, Theme> = {
  emerald: {
    text: "text-emerald-400",
    textSoft: "text-emerald-300",
    bg: "bg-emerald-500",
    bgSoft: "bg-emerald-500/15",
    border: "border-emerald-500",
    ring: "focus:ring-emerald-400",
    outline: "focus-visible:outline-emerald-400",
    hoverBg: "hover:bg-emerald-500",
    groupHoverBg: "group-hover/card:bg-emerald-500",
    glow: "rgba(16,185,129,0.16)",
  },
  amber: {
    text: "text-amber-400",
    textSoft: "text-amber-300",
    bg: "bg-amber-500",
    bgSoft: "bg-amber-500/15",
    border: "border-amber-500",
    ring: "focus:ring-amber-400",
    outline: "focus-visible:outline-amber-400",
    hoverBg: "hover:bg-amber-500",
    groupHoverBg: "group-hover/card:bg-amber-500",
    glow: "rgba(245,158,11,0.16)",
  },
  indigo: {
    text: "text-indigo-400",
    textSoft: "text-indigo-300",
    bg: "bg-indigo-500",
    bgSoft: "bg-indigo-500/15",
    border: "border-indigo-500",
    ring: "focus:ring-indigo-400",
    outline: "focus-visible:outline-indigo-400",
    hoverBg: "hover:bg-indigo-500",
    groupHoverBg: "group-hover/card:bg-indigo-500",
    glow: "rgba(99,102,241,0.16)",
  },
  cyan: {
    text: "text-cyan-400",
    textSoft: "text-cyan-300",
    bg: "bg-cyan-500",
    bgSoft: "bg-cyan-500/15",
    border: "border-cyan-500",
    ring: "focus:ring-cyan-400",
    outline: "focus-visible:outline-cyan-400",
    hoverBg: "hover:bg-cyan-500",
    groupHoverBg: "group-hover/card:bg-cyan-500",
    glow: "rgba(6,182,212,0.16)",
  },
};

/* ────────────────────────── shell ────────────────────────── */

export interface BaseProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock?: number | null;
}

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

interface ShellProps<T extends BaseProduct> {
  id: string;
  eyebrow: string; // "All official products"
  title: string; // "Graphics"
  titleOutline: string; // "Cards"  (outline text)
  accent: Accent;
  endpoint: string; // full API url
  responseKeys?: string[]; // response e kon key-te array ache
  filterLabel: string; // sidebar-er heading, jemon "Brand"
  getFilter: (item: T) => string | undefined;
  getHref: (item: T) => string;
  noun: [string, string]; // ["card", "cards"]
  gridClass?: string;
  skeletonClass?: string;
  renderCard: (item: T, theme: Theme) => React.ReactNode;
}

export function ShowcaseShell<T extends BaseProduct>({
  id,
  eyebrow,
  title,
  titleOutline,
  accent,
  endpoint,
  responseKeys = ["product", "products", "data"],
  filterLabel,
  getFilter,
  getHref,
  noun,
  gridClass = "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
  skeletonClass = "aspect-[4/5]",
  renderCard,
}: ShellProps<T>) {
  const theme = THEME[accent];
  const ITEMS_PER_PAGE = 12;

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [page, setPage] = useState(1);

  const sectionRef = useRef<HTMLElement>(null);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : responseKeys.map((k) => data?.[k]).find((v) => Array.isArray(v)) ?? [];
      setItems(list);
    } catch (err) {
      console.error(`${id} fetch failed:`, err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filters = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((i) => {
      const f = getFilter(i);
      if (f) counts.set(f, (counts.get(f) ?? 0) + 1);
    });
    return [
      { name: "All", count: items.length },
      ...[...counts.entries()].map(([name, count]) => ({ name, count })),
    ];
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = items.filter(
      (i) =>
        (filter === "All" || getFilter(i) === filter) &&
        (!q || i.name.toLowerCase().includes(q))
    );
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [items, filter, search, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

  useEffect(() => {
    if (loading || pageItems.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".card-anim", {
        y: 32,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, page, filter, search, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const goToPage = (p: number) => {
    setPage(p);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearFilters = () => {
    setFilter("All");
    setSearch("");
    setSort("featured");
    setPage(1);
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className="min-h-screen w-full bg-[#09090b] px-3 pb-20 pt-24 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-[1500px]">
        {/* HEADER */}
        <header className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm text-white/50">{eyebrow}</p>
            <h1 className="select-none font-space text-[clamp(44px,8vw,110px)] font-extrabold uppercase italic leading-[0.85] tracking-tighter text-white">
              {title}{" "}
              <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.5)]">
                {titleOutline}
              </span>
            </h1>
          </div>
          {!loading && !error && (
            <p className="font-bebas text-2xl text-white/60">
              <span className={theme.text}>{filtered.length}</span>{" "}
              {filtered.length === 1 ? noun[0] : noun[1]}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          {/* SIDEBAR */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <div className="relative">
              <label htmlFor={`${id}-search`} className="sr-only">
                Search
              </label>
              <svg
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id={`${id}-search`}
                type="text"
                placeholder="Search by name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                style={{ clipPath: CHAMFER }}
                className={`w-full bg-white/[0.04] py-3.5 pl-11 pr-4 text-base text-white outline-none ring-1 ring-inset ring-white/10 transition focus:bg-white/[0.07] ${theme.ring} placeholder:text-white/30`}
              />
            </div>

            {filters.length > 1 && (
              <nav aria-label={filterLabel}>
                <p className="mb-2 hidden text-sm text-white/50 lg:block">{filterLabel}</p>
                <ul className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0">
                  {filters.map((f) => {
                    const active = filter === f.name;
                    return (
                      <li key={f.name} className="shrink-0">
                        <button
                          onClick={() => {
                            setFilter(f.name);
                            setPage(1);
                          }}
                          aria-pressed={active}
                          className={`flex w-full items-center justify-between gap-6 border px-4 py-2.5 text-left font-bebas text-xl transition-colors lg:border-0 lg:border-l-2 lg:py-3 ${
                            active
                              ? `${theme.border} ${theme.bgSoft} text-white`
                              : "border-white/10 text-white/50 hover:text-white lg:border-white/10 lg:hover:border-white/40"
                          }`}
                        >
                          {f.name}
                          <span className={`text-base ${active ? theme.textSoft : "text-white/30"}`}>
                            {f.count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}

            <div>
              <label htmlFor={`${id}-sort`} className="mb-2 block text-sm text-white/50">
                Sort by
              </label>
              <select
                id={`${id}-sort`}
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortKey);
                  setPage(1);
                }}
                className={`w-full cursor-pointer bg-white/[0.04] px-4 py-3 text-base text-white outline-none ring-1 ring-inset ring-white/10 ${theme.ring}`}
              >
                <option className="bg-neutral-900" value="featured">Default</option>
                <option className="bg-neutral-900" value="price-asc">Price, low to high</option>
                <option className="bg-neutral-900" value="price-desc">Price, high to low</option>
                <option className="bg-neutral-900" value="name">Name, A to Z</option>
              </select>
            </div>
          </aside>

          {/* GRID */}
          <div>
            {error ? (
              <div className="flex flex-col items-center gap-5 py-24 text-center">
                <p className="font-bebas text-3xl text-white">Could not load {noun[1]}</p>
                <p className="text-white/50">Check your connection and try again.</p>
                <button
                  onClick={load}
                  className={`bg-white px-8 py-3 font-bebas text-xl text-black transition-colors ${theme.hoverBg} hover:text-white`}
                >
                  Try again
                </button>
              </div>
            ) : loading ? (
              <div className={`grid gap-4 ${gridClass}`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    style={{ clipPath: CHAMFER }}
                    className={`${skeletonClass} animate-pulse bg-white/[0.05]`}
                  />
                ))}
              </div>
            ) : pageItems.length === 0 ? (
              <div className="flex flex-col items-center gap-5 py-24 text-center">
                <p className="font-bebas text-3xl text-white">
                  {items.length === 0 ? `No ${noun[1]} yet` : "Nothing matches your search"}
                </p>
                <p className="text-white/50">
                  {items.length === 0
                    ? "New products will show up here once they are added."
                    : "Try a different name or clear the filters."}
                </p>
                {items.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="border border-white/25 px-8 py-3 font-bebas text-xl text-white transition-colors hover:border-white"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className={`grid gap-4 ${gridClass}`}>
                {pageItems.map((item) => (
                  <Link
                    key={item._id}
                    href={getHref(item)}
                    onMouseMove={spot}
                    style={{ clipPath: CHAMFER }}
                    className={`card-anim group/card relative flex flex-col bg-neutral-900 focus-visible:outline focus-visible:outline-2 ${theme.outline}`}
                  >
                    {renderCard(item, theme)}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                      style={{
                        background: `radial-gradient(380px circle at var(--mx,50%) var(--my,50%), ${theme.glow}, transparent 60%)`,
                      }}
                    />
                  </Link>
                ))}
              </div>
            )}

            {/* PAGINATION */}
            {!loading && !error && totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-14 flex flex-col items-center gap-4 border-t border-white/10 pt-8"
              >
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => goToPage(page - 1)}
                    className="h-11 border border-white/15 px-5 font-bebas text-lg text-white transition-colors hover:border-white disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-white/15"
                  >
                    Prev
                  </button>
                  {getPageList(page, totalPages).map((p, i) =>
                    p === "gap" ? (
                      <span key={`gap-${i}`} className="px-1 text-white/30">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        aria-current={page === p ? "page" : undefined}
                        className={`h-11 w-11 border font-bebas text-xl transition-colors ${
                          page === p
                            ? `${theme.border} ${theme.bg} text-black`
                            : "border-white/15 text-white/60 hover:border-white hover:text-white"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    disabled={page === totalPages}
                    onClick={() => goToPage(page + 1)}
                    className="h-11 border border-white/15 px-5 font-bebas text-lg text-white transition-colors hover:border-white disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-white/15"
                  >
                    Next
                  </button>
                </div>
                <p className="text-sm text-white/40">
                  Showing {start + 1} to {Math.min(start + ITEMS_PER_PAGE, filtered.length)} of{" "}
                  {filtered.length}
                </p>
              </nav>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}