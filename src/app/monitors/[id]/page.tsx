"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CheckoutModal from "@/components/CheckoutModal/CheckoutModal";
import { useSession } from "next-auth/react";

interface Monitor {
    _id: string;
    name: string;
    image: string;
    description: string;
    price: number;
    oldPrice?: number;
    brand?: string;
    stock?: number;
    panelSize?: number;
    panelType?: string;
    resolution?: string;
    refreshRate?: number;
    responseTime?: number;
    colorGamut?: string;
    brightness?: number;
    contrastRatio?: string;
    viewingAngle?: string;
    hdr?: string;
    syncTechnology?: string;
    ports?: string[];
    vesaMount?: string;
    standAdjustment?: string;
    warranty?: string;
}

const ACCENT = "#0ea5e9";
const ACCENT_DARK = "#0284c7";

const MonitorDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Monitor | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const { data: session } = useSession();
    const isAdmin = session?.user?.email === "admin@user";

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/monitor`)
            .then((r) => r.json())
            .then((data) => {
                const list: Monitor[] = data.monitors || data;
                setProduct(list.find((item) => String(item._id) === String(id)) || null);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const specs: [string, string][] = product
        ? [
            product.panelSize ? ["Panel Size", `${product.panelSize}"`] : null,
            product.panelType ? ["Panel Type", product.panelType] : null,
            product.resolution ? ["Resolution", product.resolution] : null,
            product.refreshRate ? ["Refresh Rate", `${product.refreshRate} Hz`] : null,
            product.responseTime ? ["Response Time", `${product.responseTime} ms`] : null,
            product.colorGamut ? ["Color Gamut", product.colorGamut] : null,
            product.brightness ? ["Brightness", `${product.brightness} nits`] : null,
            product.contrastRatio ? ["Contrast Ratio", product.contrastRatio] : null,
            product.hdr ? ["HDR", product.hdr] : null,
            product.syncTechnology ? ["Sync", product.syncTechnology] : null,
            product.vesaMount ? ["VESA Mount", product.vesaMount] : null,
            product.warranty ? ["Warranty", product.warranty] : null,
            product.stock !== undefined ? ["Stock", `${product.stock} units`] : null,
        ].filter(Boolean) as [string, string][]
        : [];

    return (
        <div className="min-h-screen bg-[#09090b] text-white selection:bg-sky-500 selection:text-white">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute right-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full blur-[140px]" style={{ background: `${ACCENT}1a` }} />
                <div className="absolute bottom-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full blur-[140px] bg-cyan-800/10" />
            </div>
            <div className="pointer-events-none fixed bottom-[-2vw] right-[-2vw] select-none font-bebas text-[22vw] italic leading-none text-white opacity-[0.025] -rotate-12">
                SINNERS
            </div>

            {(!mounted || loading) && (
                <div className="flex min-h-screen items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-2 border-sky-500/20 border-t-sky-500" />
                </div>
            )}

            {mounted && !loading && !product && (
                <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
                    <h1 className="mb-6 font-bebas text-5xl tracking-tighter text-red-500">404: DISPLAY_NOT_FOUND</h1>
                    <Link href="/#product-showcase" className="px-10 py-4 font-bebas text-xl text-white transition-all" style={{ background: ACCENT }}>
                        BACK TO SHOWCASE
                    </Link>
                </div>
            )}

            {mounted && !loading && product && (
                <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col items-center justify-center gap-12 p-6 lg:flex-row lg:gap-24 lg:p-12">

                    {/* LEFT: IMAGE */}
                    <div className="flex w-full items-center justify-center lg:w-1/2">
                        <div className="relative aspect-square w-full max-w-[550px] overflow-hidden rounded-2xl border border-white/5 bg-neutral-900 p-10 transition-transform duration-500 hover:scale-[1.02]">
                            <div className="absolute left-4 top-4 h-5 w-5 border-l border-t" style={{ borderColor: `${ACCENT}80` }} />
                            <div className="absolute bottom-4 right-4 h-5 w-5 border-b border-r" style={{ borderColor: `${ACCENT}80` }} />
                            <div className="relative h-full w-full">
                                <Image src={product.image} alt={product.name} fill className="object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)]" priority />
                            </div>
                            <div className="absolute bottom-5 left-5 rounded border border-white/10 bg-black/60 px-3 py-1 backdrop-blur-md">
                                <p className="font-mono text-[10px] tracking-tighter text-white/40">
                                    SERIAL: 0x{id?.toString().slice(-6).toUpperCase()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: INFO */}
                    <div className="flex w-full flex-col lg:w-1/2">
                        <Link href="/#product-showcase" className="group mb-12 flex items-center gap-2 font-bebas text-lg tracking-widest text-white/40 transition-colors hover:text-sky-400">
                            <span className="transition-transform group-hover:-translate-x-1">←</span> BACK_TO_BASE
                        </Link>

                        <header className="mb-8">
                            <p className="mb-3 font-bebas text-2xl italic tracking-[0.4em] opacity-80 uppercase" style={{ color: ACCENT }}>
                                {product.brand ?? "Sinners Studio"}
                            </p>
                            <h1 className="mb-6 font-bebas text-6xl uppercase italic leading-[0.9] lg:text-8xl">
                                {product.name}
                            </h1>
                            <div className="mb-8 h-1 w-24" style={{ background: ACCENT }} />
                            <p className="max-w-lg text-lg font-light leading-relaxed text-white/60">
                                {product.description}
                            </p>
                        </header>

                        <div className="mb-8 grid grid-cols-2 gap-8 border-y border-white/10 py-8">
                            <div>
                                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-white/30">Price</p>
                                <div className="flex items-baseline gap-3">
                                    <p className="font-bebas text-5xl tracking-tighter text-white">${product.price}</p>
                                    {product.oldPrice && product.oldPrice > product.price && (
                                        <p className="font-bebas text-2xl text-white/30 line-through">${product.oldPrice}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-white/30">Availability</p>
                                <p className="font-bebas text-2xl italic uppercase" style={{ color: ACCENT }}>
                                    {(product.stock ?? 1) > 0 ? "In Stock" : "Sold Out"}
                                </p>
                            </div>
                        </div>

                        {specs.length > 0 && (
                            <dl className="mb-10 divide-y divide-white/[0.06] rounded-xl border border-white/10 bg-white/[0.03]">
                                {specs.map(([k, v]) => (
                                    <div key={k} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                                        <dt className="text-white/40">{k}</dt>
                                        <dd className="text-right font-medium text-white/90">{v}</dd>
                                    </div>
                                ))}
                            </dl>
                        )}

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => setIsCheckoutOpen(true)}
                                disabled={(product.stock ?? 1) <= 0}
                                className="w-full py-6 font-bebas text-3xl italic text-white transition-all hover:brightness-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                                style={{ background: ACCENT }}
                            >
                                BUY NOW
                            </button>
                            {isAdmin && (
                                <Link
                                    href={`/dashboard/edit-monitor/${id}`}
                                    className="flex w-full items-center justify-center py-5 font-bebas text-2xl italic text-white transition-all hover:brightness-90"
                                    style={{ background: ACCENT_DARK }}
                                >
                                    EDIT PRODUCT
                                </Link>
                            )}
                            <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
                                Premium Display Hardware · Sinners Tech
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {product && (
                <CheckoutModal
                    isOpen={isCheckoutOpen}
                    onClose={() => setIsCheckoutOpen(false)}
                    product={{ name: product.name, price: product.price, image: product.image, _id: product._id }}
                />
            )}
        </div>
    );
};

export default MonitorDetail;
