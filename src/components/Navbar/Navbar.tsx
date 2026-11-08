"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

interface NavbarProps {
  cartCount?: number; // Cart state thakle pass korben, na hole badge dekhabe na
}

const CHAMFER =
  "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))";

const NAV_ITEMS = [
  { key: "keyboards", label: "Keyboards", href: "/Keboardds" },
  { key: "GraphicsCard", label: "Graphics Cards", href: "/Graphics" },
  { key: "controller", label: "Controller", href: "/Store?category=controller" },
  { key: "keycaps", label: "KeyCaps", href: "/Keycap" },
  { key: "gaming", label: "Gaming", href: "/Store?category=gaming" },
  { key: "story", label: "Story", href: "/Story", gapBefore: true },
  { key: "archive", label: "Archive", href: "/Caps" },
];

/* ───────── small icons ───────── */
const Icon = ({ children, size = 20 }: { children: React.ReactNode; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);
const SearchIcon = () => (
  <Icon>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Icon>
);
const BagIcon = () => (
  <Icon>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </Icon>
);
const MenuIcon = () => (
  <Icon size={24}>
    <path d="M4 8h16M4 16h10" />
  </Icon>
);
const CloseIcon = () => (
  <Icon size={24}>
    <path d="M18 6L6 18M6 6l12 12" />
  </Icon>
);

/* ───────── logo ───────── */
const Logo = () => (
  <Link href="/" aria-label="Sinners Tech home" className="flex items-center gap-3">
    <svg width="30" height="30" viewBox="0 0 40 40" aria-hidden="true">
      <path d="M8 34 L19 6 H25 L14 34 Z" fill="#f25623" />
      <path d="M20 34 L31 6 H37 L26 34 Z" fill="#4D4D4D" />
    </svg>
    <span className="font-space text-xl font-extrabold uppercase italic leading-none tracking-tighter text-[#4D4D4D]">
      Sinners
      <span className="text-transparent [-webkit-text-stroke:1px_rgba(77,77,77,0.6)]">Tech</span>
    </span>
  </Link>
);

const Navbar = ({ cartCount = 0 }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [collapsed, setCollapsed] = useState(false); // scroll down hole menu row lukay
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); // mobile search
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [bar, setBar] = useState({ left: 0, width: 0, show: false });

  const lastY = useRef(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const isAdmin = session?.user?.email === "admin@user";
  const initial = (session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? "U").toUpperCase();

  // Query chhara link (Story, Archive) hole active dhorbo
  const activeKey = NAV_ITEMS.find((i) => !i.href.includes("?") && pathname === i.href)?.key ?? null;

  /* ── sliding indicator ── */
  const moveTo = useCallback((key: string | null) => {
    const el = key ? itemRefs.current[key] : null;
    if (!el) return setBar((b) => ({ ...b, show: false }));
    setBar({ left: el.offsetLeft, width: el.offsetWidth, show: true });
  }, []);

  useEffect(() => {
    moveTo(activeKey);
  }, [activeKey, moveTo]);

  /* ── scroll: niche gele menu row collapse, upore gele abar ashe ── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY.current) < 3) return;
      if (y < 80) setCollapsed(false);
      else setCollapsed(y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── "/" chaple search focus ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setSearchOpen(false);
        setAccountOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── account dropdown-er baire click ── */
  useEffect(() => {
    if (!accountOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!accountRef.current?.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [accountOpen]);

  /* ── drawer cholar somoy page scroll bondho ── */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  /* ── page change hole sob bondho ── */
  useEffect(() => {
    setDrawerOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) mobileSearchRef.current?.focus();
  }, [searchOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/Store?search=${encodeURIComponent(q)}` : "/Store");
    setSearchOpen(false);
    searchRef.current?.blur();
  };

  const handleLogout = async () => {
    try {
      await Promise.allSettled([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, { method: "GET", credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/google/logout`, { method: "GET", credentials: "include" }),
      ]);
    } catch (e) {
      console.error("Backend logout error", e);
    }
    setAccountOpen(false);
    setDrawerOpen(false);
    signOut();
  };

  // Hook gulo sob upore, tai early return ekhane
  if (pathname?.startsWith("/Community") || pathname?.startsWith("/dashboard")) return null;

  const cartBadge =
    cartCount > 0 ? (
      <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center bg-[#f25623] px-1 text-xs font-bold text-white">
        {cartCount}
      </span>
    ) : null;

  const iconBtn =
    "relative flex h-11 w-11 items-center justify-center text-[#4D4D4D]/75 transition-colors hover:text-[#4D4D4D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f25623]";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] border-b border-[#4D4D4D]/15 bg-[#DEDEDE]/90 backdrop-blur-xl">
        {/* ═════ ROW 1: logo, search, actions ═════ */}
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-2 px-4 sm:px-6 lg:grid lg:h-[72px] lg:grid-cols-[auto_1fr_auto] lg:gap-10 lg:px-10">
          <Logo />

          {/* Desktop search */}
          <form onSubmit={submitSearch} role="search" className="relative mx-auto hidden w-full max-w-2xl lg:block">
            <label htmlFor="nav-search" className="sr-only">
              Search products
            </label>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4D4D4D]/40">
              <SearchIcon />
            </span>
            <input
              id="nav-search"
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search keyboards, mice, keycaps"
              style={{ clipPath: CHAMFER }}
              className="peer h-11 w-full bg-[#4D4D4D]/[0.06] pl-12 pr-14 text-base text-[#4D4D4D] outline-none ring-1 ring-inset ring-[#4D4D4D]/15 transition placeholder:text-[#4D4D4D]/40 focus:bg-[#4D4D4D]/[0.08] focus:ring-[#f25623]"
            />
            <kbd className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border border-[#4D4D4D]/25 px-2 py-0.5 text-xs text-[#4D4D4D]/50 peer-focus:hidden">
              /
            </kbd>
          </form>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1 lg:gap-2">
            <button
              className={`${iconBtn} lg:hidden`}
              aria-label="Search"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
            >
              <SearchIcon />
            </button>

            {session && (
              <Link href="/Payment" aria-label="Payment and cart" className={iconBtn}>
                <BagIcon />
                {cartBadge}
              </Link>
            )}

            {/* Desktop account */}
            <div className="hidden lg:block">
              {status === "loading" ? (
                <div className="h-11 w-36 animate-pulse bg-[#4D4D4D]/10" />
              ) : session ? (
                <div ref={accountRef} className="relative">
                  <button
                    onClick={() => setAccountOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={accountOpen}
                    className="flex h-11 items-center gap-3 pl-1 pr-3 text-[#4D4D4D]/80 transition-colors hover:text-[#4D4D4D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f25623]"
                  >
                    <span
                      style={{ clipPath: CHAMFER }}
                      className="flex h-9 w-9 items-center justify-center bg-[#f25623] font-bebas text-xl text-white"
                    >
                      {initial}
                    </span>
                    <span className="max-w-[120px] truncate font-bebas text-xl text-[#4D4D4D]">
                      {session.user?.name ?? "Account"}
                    </span>
                  </button>

                  {accountOpen && (
                    <div
                      role="menu"
                      style={{ clipPath: CHAMFER }}
                      className="absolute right-0 top-full mt-3 w-56 bg-[#EAEAEA] py-2 ring-1 ring-[#4D4D4D]/15 shadow-xl"
                    >
                      {[
                        { label: "Profile", href: "/Profile" },
                        { label: "Payment", href: "/Payment" },
                        ...(isAdmin ? [{ label: "Dashboard", href: "/dashboard" }] : []),
                      ].map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          role="menuitem"
                          className="block px-5 py-2.5 font-bebas text-xl text-[#4D4D4D]/75 transition-colors hover:bg-[#4D4D4D]/10 hover:text-[#4D4D4D]"
                        >
                          {l.label}
                        </Link>
                      ))}
                      <div className="my-2 h-px bg-[#4D4D4D]/15" />
                      <button
                        role="menuitem"
                        onClick={handleLogout}
                        className="block w-full px-5 py-2.5 text-left font-bebas text-xl text-[#4D4D4D]/75 transition-colors hover:bg-[#4D4D4D]/10 hover:text-[#4D4D4D]"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 font-bebas text-xl text-[#4D4D4D]/80 transition-colors hover:text-[#4D4D4D]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    style={{ clipPath: CHAMFER }}
                    className="bg-[#f25623] px-6 py-2.5 font-bebas text-xl text-white transition-colors hover:bg-[#d94514]"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button className={`${iconBtn} lg:hidden`} aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* ═════ Mobile search row ═════ */}
        {searchOpen && (
          <form onSubmit={submitSearch} role="search" className="border-t border-white/10 px-4 py-3 sm:px-6 lg:hidden">
            <input
              ref={mobileSearchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search keyboards, mice, keycaps"
              aria-label="Search products"
              style={{ clipPath: CHAMFER }}
              className="h-11 w-full bg-[#4D4D4D]/[0.06] px-4 text-base text-[#4D4D4D] outline-none ring-1 ring-inset ring-[#4D4D4D]/15 placeholder:text-[#4D4D4D]/40 focus:ring-[#f25623]"
            />
          </form>
        )}

        {/* ═════ ROW 2: category menu (desktop), scroll-e collapse ═════ */}
        <div
          className={`hidden grid-cols-1 transition-[grid-template-rows] duration-300 lg:grid ${
            collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="mx-auto flex h-11 max-w-[1500px] items-stretch justify-between border-t border-[#4D4D4D]/15 px-10">
              <ul className="relative flex items-stretch" onMouseLeave={() => moveTo(activeKey)}>
                {NAV_ITEMS.map((item) => (
                  <React.Fragment key={item.key}>
                    {item.gapBefore && (
                      <li aria-hidden="true" className="mx-3 h-4 w-px -skew-x-[20deg] self-center bg-[#4D4D4D]/25" />
                    )}
                    <li>
                      <Link
                        href={item.href}
                        ref={(el) => {
                          itemRefs.current[item.key] = el;
                        }}
                        onMouseEnter={() => moveTo(item.key)}
                        onFocus={() => moveTo(item.key)}
                        onBlur={() => moveTo(activeKey)}
                        aria-current={activeKey === item.key ? "page" : undefined}
                        className={`flex h-11 items-center px-4 font-bebas text-xl tracking-wide transition-colors ${
                          activeKey === item.key ? "text-[#f25623]" : "text-[#4D4D4D]/70 hover:text-[#4D4D4D]"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  </React.Fragment>
                ))}

                {/* Ekta indicator, hover onujayi slide kore */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 h-[3px] -skew-x-[20deg] bg-[#f25623] shadow-[0_0_12px_rgba(242,86,35,0.7)] transition-all duration-300 ease-out"
                  style={{ left: bar.left, width: bar.width, opacity: bar.show ? 1 : 0 }}
                />
              </ul>

              <p className="hidden items-center gap-2.5 text-sm text-[#4D4D4D]/60 xl:flex">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#f25623]" />
                Shipping all over Bangladesh
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Header fixed, tai niche-r content jate dhaka na pore */}
      <div aria-hidden="true" className="h-16 lg:h-[117px]" />

      {/* ═════ MOBILE DRAWER ═════ */}
      <div
        className={`fixed inset-0 z-[200] lg:hidden ${drawerOpen ? "visible" : "invisible"}`}
        aria-hidden={!drawerOpen}
      >
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          style={{ clipPath: "polygon(28px 0, 100% 0, 100% 100%, 0 100%, 0 28px)" }}
          className={`absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col overflow-y-auto bg-[#DEDEDE] border-l border-[#4D4D4D]/15 transition-transform duration-300 ease-out ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between px-5">
            <span className="font-bebas text-2xl text-[#4D4D4D]/60">Menu</span>
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center text-[#4D4D4D] hover:text-[#f25623]"
            >
              <CloseIcon />
            </button>
          </div>

          <nav aria-label="Main" className="px-5">
            <ul>
              <li>
                <Link
                  href="/Store"
                  className="flex items-center justify-between border-b border-[#4D4D4D]/15 py-4 font-bebas text-3xl text-[#4D4D4D]"
                >
                  All products
                </Link>
              </li>
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between border-b border-[#4D4D4D]/15 py-4 font-bebas text-3xl transition-colors hover:text-[#4D4D4D] ${
                      activeKey === item.key ? "text-[#f25623]" : "text-[#4D4D4D]/70"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Auth */}
          <div className="mt-auto space-y-3 p-5 pt-8">
            {session ? (
              <>
                <p className="truncate text-sm text-[#4D4D4D]/70">
                  Signed in as {session.user?.name ?? session.user?.email}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/Profile" className="border border-[#4D4D4D]/20 py-3 text-center font-bebas text-xl text-[#4D4D4D]">
                    Profile
                  </Link>
                  <Link href="/Payment" className="border border-[#4D4D4D]/20 py-3 text-center font-bebas text-xl text-[#4D4D4D]">
                    Payment
                  </Link>
                </div>
                {isAdmin && (
                  <Link href="/dashboard" className="block border border-[#f25623]/60 py-3 text-center font-bebas text-xl text-[#f25623]">
                    Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="w-full bg-[#f25623] py-3 font-bebas text-xl text-white hover:bg-[#d94514]">
                  Log out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/login" className="border border-[#4D4D4D]/25 py-3 text-center font-bebas text-xl text-[#4D4D4D]">
                  Login
                </Link>
                <Link href="/register" className="bg-[#f25623] py-3 text-center font-bebas text-xl text-white hover:bg-[#d94514]">
                  Register
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;