
"use client";
import React, { useEffect, useState, useRef, use } from "react"; // 'use' ইমপোর্ট করুন

import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import styles from "./details.module.scss";
import CheckoutModal from "@/components/CheckoutModal/CheckoutModal";
import { useSession } from "next-auth/react";

// টাইপ ডিফাইন করুন
interface Product {
    _id: string;
    name: string;
    image: string;
    description: string;
    price: number;
    category: string;
    stock: number;
}

const ProductDetails = ({ params }: { params: Promise<{ id: string }> }) => {
    // ১. params-কে Unwrap করুন React.use() দিয়ে
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const imgRef = useRef(null);
    const infoRef = useRef(null);
    const { data: session } = useSession();
    const email = session?.user?.email === "admin@user"
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // ২. এখন 'id' ব্যবহার করুন সরাসরি
                const response = await fetch(`https://t-mark-4.vercel.app/api/all-products/getSingle/${id}`);
                const data = await response.json();
                if (data && data.product) {
                    setProduct(data.product);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]); // ডিপেন্ডেন্সিতে 'id' দিন
    // GSAP এনিমেশন
    useEffect(() => {
        if (!loading && product) {
            const tl = gsap.timeline();
            tl.fromTo(imgRef.current,
                { x: -100, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, ease: "power4.out" }
            );
            tl.fromTo(".reveal",
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" },
                "-=0.5"
            );
        }
    }, [loading, product]);

    if (loading) return <div className="h-screen flex items-center justify-center font-bebas text-3xl tracking-widest animate-pulse">Scanning Arsenal...</div>;
    if (!product) return <div className="h-screen flex items-center justify-center font-bebas text-3xl">Product Not Found.</div>;

    return (
        <main className="min-h-screen text-black pt-32 pb-20 px-6 md:px-20 overflow-hidden">
            {/* Back Button */}
            <Link href="/Store" className="inline-flex items-center gap-2 mb-10 text-white/50 hover:text-white transition-colors group">
                <span className="group-hover:-translate-x-2 transition-transform">←</span>
                <span className="font-bebas tracking-widest text-lg">Back to Arsenal</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Product Image Box */}
                <div ref={imgRef} className="relative aspect-square w-full bg-[#0a0a0a] border border-white/5 overflow-hidden group">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority
                    />
                    <div className="absolute top-6 left-6 bg-white text-black px-4 py-1 font-bebas text-lg">
                        {product.category}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-8" ref={infoRef}>
                    <div className="space-y-4">
                        <h1 className="font-bebas text-6xl md:text-8xl leading-none reveal">{product.name}</h1>
                        <p className="text-black/40 text-lg md:text-xl max-w-xl leading-relaxed reveal">
                            {product.description}
                        </p>
                    </div>

                    <div className="flex items-center gap-10 reveal">
                        <div className="space-y-1">
                            <p className="text-black/30 font-bebas tracking-widest">Price</p>
                            <p className="text-5xl font-bebas text-white">${product.price}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-black/30 font-bebas tracking-widest">Availability</p>
                            <p className={`text-xl font-bebas ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {product.stock > 0 ? `In Stock (${product.stock})` : 'Sold Out'}
                            </p>
                        </div>
                    </div>

                    <div className="h-[1px] w-full bg-white/5 reveal" />

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-6 reveal">
                        <button
                            onClick={() => setIsCheckoutOpen(true)}
                            className="flex-1 min-w-[200px] bg-white text-black py-5 font-bebas text-2xl hover:bg-[#e0e0e0] transition-all transform hover:scale-[1.02] active:scale-95"
                        >
                            Acquire Item
                        </button>
                        {email && (
                            <Link
                                href={`/dashboard/edit-product/${product._id}`}
                                className="flex-1 min-w-[200px] bg-white text-black py-5 font-bebas text-2xl hover:bg-[#e0e0e0] transition-all transform hover:scale-[1.02] active:scale-95"
                            >
                                EDIT PRODUCT
                            </Link>
                        )}
                        <button className="flex-1 min-w-[200px] border border-white/20 py-5 font-bebas text-2xl hover:bg-white hover:text-black transition-all">
                            Add to Cart
                        </button>
                    </div>

                    {/* Specs / Details */}
                    <div className="mt-10 grid grid-cols-2 gap-8 reveal">
                        <div className="p-6 border border-white/5 bg-white/[0.02]">
                            <h4 className="font-bebas text-black/30 mb-2">Authenticity</h4>
                            <p className="text-sm uppercase tracking-widest">100% Official Merchandise</p>
                        </div>
                        <div className="p-6 border border-white/5 bg-white/[0.02]">
                            <h4 className="font-bebas text-black/30 mb-2">Shipping</h4>
                            <p className="text-sm uppercase tracking-widest">Global Express Delivery</p>
                        </div>
                    </div>
                </div>
            </div>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                product={product}
            />
        </main>
    );
};

export default ProductDetails;