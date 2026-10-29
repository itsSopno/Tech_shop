
"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import styles from "./store.module.scss";

gsap.registerPlugin(ScrollTrigger);

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

const StoreSection = () => {
    const [keycaps, setKeycaps] = useState<Keycap[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const sectionRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // ১. ডাটা ফেচ করা
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://t-mark-4.vercel.app/api/all-products/getAll");
                const data = await response.json();
                if (data && data.product) {
                    setKeycaps(data.product);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ২. ফিল্টার এবং প্যাগিনেশন লজিক
    const filteredKeycaps = selectedCategory === "All"
        ? keycaps
        : keycaps.filter(item => item.category === selectedCategory);

    const totalPages = Math.ceil(filteredKeycaps.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // ম্যাপ করার জন্য এই ভেরিয়েবলটি ব্যবহার করতে হবে
    const currentItems = filteredKeycaps.slice(indexOfFirstItem, indexOfLastItem);

    const categories = ["All", ...Array.from(new Set(keycaps.map(item => item.category)))];

    // ৩. GSAP এনিমেশন (পেজ বা ক্যাটাগরি চেঞ্জ হলে রি-রান হবে)
    useEffect(() => {
        if (!loading && currentItems.length > 0) {
            const ctx = gsap.context(() => {
                gsap.from(".card_anim", {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    // scrollTrigger: {
                    //     trigger: gridRef.current,
                    //     start: "top 85%",
                    // },
                });
                ScrollTrigger.refresh();
            }, sectionRef);

            return () => ctx.revert();
        }
    }, [loading, currentPage, selectedCategory]); // Dependency আপডেট করা হয়েছে

    if (loading) {
        return (
            <section className={styles.section}>
                <div className={styles.loadingWrapper}>
                    <div className={styles.spinner}></div>
                    <p className="font-bebas text-white/50 tracking-widest">Loading Arsenal...</p>
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} className={styles.section} id="keycaps">
            <div className={styles.titleWrapper}>
                <span className={styles.subtitle}>All Official Products</span>
                <h2 className="font-bebas text-5xl">Products</h2>
            </div>

            {/* ক্যাটাগরি ফিল্টার বাটন */}
            {/* <div className="flex flex-wrap gap-3 mb-10 justify-center">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                        className={`px-5 py-2 rounded-md font-bebas tracking-wider transition-all border ${selectedCategory === cat
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-white border-white/20 hover:border-white'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div> */}
            <div className="flex flex-wrap gap-4 mb-14 justify-center items-center">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => {
                            setSelectedCategory(cat);
                            setCurrentPage(1);
                        }}
                        className={`relative px-6 py-2.5 font-bebas text-lg tracking-[2px] transition-all duration-500 group overflow-hidden border
        ${selectedCategory === cat
                                ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105"
                                : "bg-black/40 text-white/60 border-white/10 hover:border-white hover:text-white"
                            }`}
                    >
                        {/* অ্যাক্টিভ বাটন গ্লো ইফেক্ট (পেছনের হালকা লেয়ার) */}
                        {selectedCategory === cat && (
                            <span className="absolute inset-0 bg-white/10 blur-sm animate-pulse"></span>
                        )}

                        {/* হোভার এনিমেশন লাইন (নিচে ছোট একটা স্লাইড) */}
                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>

                        <span className="relative z-10">{cat}</span>
                    </button>
                ))}
            </div>

            {/* প্রোডাক্ট গ্রিড - এখানে currentItems ব্যবহার করা হয়েছে */}
            <div ref={gridRef} className={styles.grid}>
                {currentItems.map((item) => (
                    <div key={item._id} className={`${styles.card} card_anim`}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className={styles.image}
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        </div>
                        <div className={styles.content}>
                            <span className={styles.brand}>{item.category}</span>
                            <h3 className="font-bebas text-2xl">{item.name}</h3>
                            <p className={styles.description}>{item.description.slice(0, 60)}...</p>

                            <div className={styles.footer}>
                                <span className={styles.price}>${item.price}</span>
                                <Link href={`/Store/${item._id}`} className={styles.viewBtn}>
                                    Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* প্যাগিনেশন কন্ট্রোল */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-10 mt-20 pb-16">
                    {/* Previous Button */}
                    <button
                        disabled={currentPage === 1}
                        onClick={() => {
                            setCurrentPage(prev => prev - 1);
                            sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group relative flex items-center justify-center w-12 h-12 border border-white/10 rounded-full transition-all duration-500 hover:border-white disabled:opacity-10 disabled:cursor-not-allowed overflow-hidden"
                    >
                        <span className="relative z-10 text-white transition-transform duration-300 group-hover:-translate-x-1">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M19 12H5M5 12L12 19M5 12L12 5" />
                            </svg>
                        </span>
                        <span className="absolute inset-0 bg-white scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full origin-center mix-blend-difference"></span>
                    </button>

                    {/* Page Indicator */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <span className="font-bebas text-4xl text-white tracking-tighter">
                                {currentPage.toString().padStart(2, '0')}
                            </span>
                            <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-white/20"></span>
                        </div>

                        <span className="font-bebas text-xl text-white/20 rotate-12">/</span>

                        <span className="font-bebas text-2xl text-white/30">
                            {totalPages.toString().padStart(2, '0')}
                        </span>
                    </div>

                    {/* Next Button */}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => {
                            setCurrentPage(prev => prev + 1);
                            sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group relative flex items-center justify-center w-12 h-12 border border-white/10 rounded-full transition-all duration-500 hover:border-white disabled:opacity-10 disabled:cursor-not-allowed overflow-hidden"
                    >
                        <span className="relative z-10 text-white transition-transform duration-300 group-hover:translate-x-1">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                            </svg>
                        </span>
                        {/* Hover Fill Effect */}
                        <span className="absolute inset-0 bg-white scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full origin-center mix-blend-difference"></span>
                    </button>
                </div>
            )}
        </section>
        // <section ref={sectionRef} className={styles.section} id="keycaps">
        //     <div className={styles.titleWrapper}>
        //         <span className={styles.subtitle}>All Official Products</span>
        //         <h2 className="font-bebas text-6xl mb-4">The Arsenal</h2>
        //     </div>

        //     {/* --- ক্যাটাগরি ফিল্টার --- */}
        //     <div className={styles.filterWrapper}>
        //         {categories.map((cat) => (
        //             <button
        //                 key={cat}
        //                 onClick={() => {
        //                     setSelectedCategory(cat);
        //                     setCurrentPage(1);
        //                 }}
        //                 className={`${styles.filterBtn} ${selectedCategory === cat ? styles.active : ""}`}
        //             >
        //                 {cat}
        //             </button>
        //         ))}
        //     </div>

        //     {/* --- প্রোডাক্ট গ্রিড --- */}
        //     <div ref={gridRef} className={styles.grid}>
        //         {currentItems.map((item) => (
        //             <div key={item._id} className={`${styles.card} card_anim`}>
        //                 {/* আপনার কার্ডের কোড এখানে থাকবে */}
        //             </div>
        //         ))}
        //     </div>

        //     {/* --- প্যাগিনেশন কন্ট্রোল --- */}
        //     {totalPages > 1 && (
        //         <div className={styles.pagination}>
        //             <button
        //                 disabled={currentPage === 1}
        //                 onClick={() => {
        //                     setCurrentPage((prev) => prev - 1);
        //                     sectionRef.current?.scrollIntoView({ behavior: "smooth" });
        //                 }}
        //                 className={styles.navBtn}
        //             >
        //                 ←
        //             </button>

        //             <div className={styles.pageInfo}>
        //                 <span>{currentPage.toString().padStart(2, '0')}</span> / {totalPages.toString().padStart(2, '0')}
        //             </div>

        //             <button
        //                 disabled={currentPage === totalPages}
        //                 onClick={() => {
        //                     setCurrentPage((prev) => prev + 1);
        //                     sectionRef.current?.scrollIntoView({ behavior: "smooth" });
        //                 }}
        //                 className={styles.navBtn}
        //             >
        //                 →
        //             </button>
        //         </div>
        //     )}
        // </section>
    );
};

export default StoreSection;