"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";

interface Keycap {
  _id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  quantity: number;
  stock: number;
  category: string;
}

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/all-products/getAll`;
const CURRENCY = "$"; // BDT chaile "৳" kore din
const ITEMS_PER_PAGE = 12;

const CHAMFER =
  "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))";

// Mouse jekhane, shekhane halka indigo alo
const spot = (e: React.MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

// 1 ... 4 5 6 ... 20 moto page list
const getPageList = (current: number, total: number): (number | "gap")[] => {
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

const StoreSection = () => {
  const [items, setItems] = useState<Keycap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [page, setPage] = useState(1);

  const sectionRef = useRef<HTMLElement>(null);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setItems(data?.product ?? []);
    } catch (err) {
      console.error("Store fetch failed:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Category list + count
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((i) => counts.set(i.category, (counts.get(i.category) ?? 0) + 1));
    return [
      { name: "All", count: items.length },
      ...[...counts.entries()].map(([name, count]) => ({ name, count })),
    ];
  }, [items]);

  // Filter + sort
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = items.filter(
      (i) =>
        (category === "All" || i.category === category) &&
        (!q || i.name.toLowerCase().includes(q))
    );
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [items, category, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

  // Page change / filter change hole card gulo ekshathe uthe ashe
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
  }, [loading, page, category, search, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const goToPage = (p: number) => {
    setPage(p);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearFilters = () => {
    setCategory("All");
    setSearch("");
    setSort("featured");
    setPage(1);
  };

  return (
    <section
      ref={sectionRef}
      id="keycaps"
      className="min-h-screen w-full bg-[#09090b] px-3 pb-20 pt-24 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-[1500px]">
        {/* ── HEADER ── */}
        <header className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm text-white/50">All official products</p>
            <h1 className="select-none font-space text-[clamp(44px,8vw,110px)] font-extrabold uppercase italic leading-[0.85] tracking-tighter text-white">
              Sinners
              <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.5)]">
                Tech
              </span>
            </h1>
          </div>
          {!loading && !error && (
            <p className="font-bebas text-2xl text-white/60">
              <span className="text-white">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "product" : "products"}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          {/* ── FILTER SIDEBAR ── */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            {/* Search */}
            <div className="relative">
              <label htmlFor="store-search" className="sr-only">
                Search products
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
                id="store-search"
                type="text"
                placeholder="Search by name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                style={{ clipPath: CHAMFER }}
                className="w-full bg-white/[0.04] py-3.5 pl-11 pr-4 text-base text-white outline-none ring-1 ring-inset ring-white/10 transition focus:bg-white/[0.07] focus:ring-indigo-400 placeholder:text-white/30"
              />
            </div>

            {/* Categories */}
            <nav aria-label="Categories">
              <ul className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0">
                {categories.map((cat) => {
                  const active = category === cat.name;
                  return (
                    <li key={cat.name} className="shrink-0">
                      <button
                        onClick={() => {
                          setCategory(cat.name);
                          setPage(1);
                        }}
                        aria-pressed={active}
                        className={`flex w-full items-center justify-between gap-6 border px-4 py-2.5 text-left font-bebas text-xl transition-colors lg:border-0 lg:border-l-2 lg:py-3 ${
                          active
                            ? "border-indigo-500 bg-indigo-500/15 text-white"
                            : "border-white/10 text-white/50 hover:text-white lg:border-white/10 lg:hover:border-white/40"
                        }`}
                      >
                        {cat.name}
                        <span className={`text-base ${active ? "text-indigo-300" : "text-white/30"}`}>
                          {cat.count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Sort */}
            <div>
              <label htmlFor="store-sort" className="mb-2 block text-sm text-white/50">
                Sort by
              </label>
              <select
                id="store-sort"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortKey);
                  setPage(1);
                }}
                className="w-full cursor-pointer bg-white/[0.04] px-4 py-3 text-base text-white outline-none ring-1 ring-inset ring-white/10 focus:ring-indigo-400"
              >
                <option className="bg-neutral-900" value="featured">Default</option>
                <option className="bg-neutral-900" value="price-asc">Price, low to high</option>
                <option className="bg-neutral-900" value="price-desc">Price, high to low</option>
                <option className="bg-neutral-900" value="name">Name, A to Z</option>
              </select>
            </div>
          </aside>

          {/* ── PRODUCT GRID ── */}
          <div>
            {error ? (
              <div className="flex flex-col items-center gap-5 py-24 text-center">
                <p className="font-bebas text-3xl text-white">Could not load products</p>
                <p className="text-white/50">Check your connection and try again.</p>
                <button
                  onClick={load}
                  className="bg-white px-8 py-3 font-bebas text-xl text-black transition-colors hover:bg-indigo-500 hover:text-white"
                >
                  Try again
                </button>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    style={{ clipPath: CHAMFER }}
                    className="aspect-[4/5] animate-pulse bg-white/[0.05]"
                  />
                ))}
              </div>
            ) : pageItems.length === 0 ? (
              <div className="flex flex-col items-center gap-5 py-24 text-center">
                <p className="font-bebas text-3xl text-white">Nothing matches your search</p>
                <p className="text-white/50">Try a different name or clear the filters.</p>
                <button
                  onClick={clearFilters}
                  className="border border-white/25 px-8 py-3 font-bebas text-xl text-white transition-colors hover:border-white"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {pageItems.map((item) => {
                  const soldOut = item.stock <= 0;
                  const low = !soldOut && item.stock <= 5;
                  return (
                    <Link
                      key={item._id}
                      href={`/Store/${item._id}`}
                      onMouseMove={spot}
                      style={{ clipPath: CHAMFER }}
                      className="card-anim group/card relative flex flex-col bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
                    >
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-neutral-800">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                          className={`object-cover transition-all duration-700 group-hover/card:scale-105 ${
                            soldOut ? "grayscale" : "grayscale-[60%] group-hover/card:grayscale-0"
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />

                        {(soldOut || low) && (
                          <span
                            className={`absolute left-4 top-4 px-3 py-1 font-bebas text-base ${
                              soldOut ? "bg-white text-black" : "bg-indigo-500 text-white"
                            }`}
                          >
                            {soldOut ? "Sold out" : `Only ${item.stock} left`}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex flex-1 flex-col gap-2 p-5">
                        <p className="text-sm text-indigo-300">{item.category}</p>
                        <h3 className="line-clamp-2 font-bebas text-2xl leading-tight text-white">
                          {item.name}
                        </h3>
                        <p className="line-clamp-2 text-sm text-white/50">{item.description}</p>

                        <div className="mt-auto flex items-center justify-between pt-4">
                          <span className="font-bebas text-3xl text-white">
                            {CURRENCY}
                            {item.price}
                          </span>
                          <span className="bg-white px-4 py-1.5 font-bebas text-lg text-black transition-colors group-hover/card:bg-indigo-500 group-hover/card:text-white">
                            Details
                          </span>
                        </div>
                      </div>

                      {/* Spotlight */}
                      <div
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                        style={{
                          background:
                            "radial-gradient(380px circle at var(--mx,50%) var(--my,50%), rgba(99,102,241,0.16), transparent 60%)",
                        }}
                      />
                    </Link>
                  );
                })}
              </div>
            )}

            {/* ── PAGINATION ── */}
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
                            ? "border-indigo-500 bg-indigo-500 text-white"
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
};

export default StoreSection;