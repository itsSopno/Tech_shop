"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CheckoutModal from "@/components/CheckoutModal/CheckoutModal";
import { useSession } from "next-auth/react";
interface Keycap {
  _id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  brand: string;
}

const KeycapDetail = () => {
  const { id } = useParams();
  const [keycap, setKeycap] = useState<Keycap | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { data: session } = useSession();
  const email = session?.user?.email === "admin@user"
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch("https://t-mark-4.vercel.app/api/keycaps")
      .then((res) => res.json())
      .then((data) => {
        const items: Keycap[] = data.keycaps || data;
        const found = items.find((item) => String(item._id) === String(id)) || null;
        setKeycap(found);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  // Always render the same root element — this prevents reconciliation crashes
  return (
    <div className="min-h-screen text-black selection:bg-[#D9FF00] selection:text-black">

      {/* Loading State */}
      {(!mounted || loading) && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-2 border-[#D9FF00]/20 border-t-[#D9FF00] rounded-full animate-spin" />
        </div>
      )}

      {/* Not Found State */}
      {mounted && !loading && !keycap && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <h1 className="font-bebas text-5xl mb-6 tracking-tighter text-red-500">404: ARTEFACT_LOST</h1>
          <Link href="/" className="px-10 py-4 bg-[#D9FF00] text-white font-bebas text-xl hover:bg-white transition-all">
            RETURN TO COLLECTION
          </Link>
        </div>
      )}

      {/* Data State */}
      {mounted && !loading && keycap && (
        <>
          {/* Background Decor */}
          <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#D9FF00]/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto min-h-screen flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 gap-12 lg:gap-24">

            {/* LEFT: IMAGE */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-[550px] bg-[#111] rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center p-12 transition-transform duration-500 hover:scale-[1.02]">
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#D9FF00]/50" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#D9FF00]/50" />
                <div className="relative w-full h-full">
                  <Image
                    src={keycap.image}
                    alt={keycap.name}
                    fill
                    className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    priority
                  />
                </div>
                <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-3 py-1 rounded border border-white/10">
                  <p className="text-[10px] font-mono tracking-tighter text-white/40">
                    SERIAL: 0x{id?.toString().slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: INFO */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <Link href="/" className="group mb-12 flex items-center gap-2 text-white/40 hover:text-[#D9FF00] transition-colors font-bebas text-lg tracking-widest">
                <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK_TO_BASE
              </Link>

              <header className="mb-8">
                <p className="text-[#D9FF00] font-bebas text-2xl tracking-[0.4em] mb-3 opacity-80 uppercase italic">
                  {keycap.brand || "Sinners Studio"}
                </p>
                <h1 className="font-bebas text-6xl lg:text-8xl leading-[0.9] uppercase italic mb-6">
                  {keycap.name}
                </h1>
                <div className="h-1 w-24 bg-[#D9FF00] mb-8" />
                <p className="text-black/60 text-lg leading-relaxed max-w-lg font-light">
                  {keycap.description}
                </p>
              </header>

              <section className="grid grid-cols-2 gap-8 mb-12 py-8 border-y border-white/5">
                <div>
                  <p className="text-white/20 uppercase text-[10px] font-black tracking-widest mb-2">Price Units</p>
                  <p className="text-5xl font-bold text-white tracking-tighter">${keycap.price}</p>
                </div>
                <div>
                  <p className="text-white/20 uppercase text-[10px] font-black tracking-widest mb-2">Availability</p>
                  <p className="text-2xl font-bebas text-[#D9FF00] uppercase italic">In Arsenal</p>
                </div>
              </section>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-[#D9FF00] text-black font-bebas text-3xl py-6 italic hover:bg-white hover:scale-[0.99] active:scale-95 transition-all"
                >
                  BUY NOW
                </button>
                {email && (
                  <Link href={`/Edit-keycaps/${id}`}
                    className="w-full bg-[#D9FF00] text-black font-bebas text-3xl py-6 italic hover:bg-white hover:scale-[0.99] active:scale-95 transition-all flex items-center justify-center"
                  >
                    EDIT PRODUCT
                  </Link>
                )}
                <p className="text-center text-[10px] text-white/20 font-bold tracking-[0.3em] uppercase">
                  Limited Edition Artisan Peripheral
                </p>
              </div>
            </div>

          </div>

          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            product={{
              name: keycap.name,
              price: keycap.price,
              image: keycap.image,
              _id: keycap._id
            }}
          />
        </>
      )}
    </div>
  );
};

export default KeycapDetail;