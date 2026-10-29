
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
    const [searchTerm, setSearchTerm] = useState(""); // নতুন সার্চ স্টেট
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const sectionRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

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

    // ফিল্টার লজিক: ক্যাটাগরি + সার্চ টার্ম
    const filteredKeycaps = keycaps.filter(item => {
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const totalPages = Math.ceil(filteredKeycaps.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredKeycaps.slice(indexOfFirstItem, indexOfLastItem);

    const categories = ["All", ...Array.from(new Set(keycaps.map(item => item.category)))];

    useEffect(() => {
        if (!loading && currentItems.length > 0) {
            const ctx = gsap.context(() => {
                gsap.from(".card_anim", {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                });
                ScrollTrigger.refresh();
            }, sectionRef);
            return () => ctx.revert();
        }
    }, [loading, currentPage, selectedCategory, searchTerm]); // searchTerm অ্যাড করা হয়েছে

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
        <>
            <section ref={sectionRef} className={styles.section} id="keycaps">
                <div className={styles.titleWrapper}>
                    <span className={styles.subtitle}>All Official Products</span>
                    <h2 className="font-bebas text-5xl font-crenzo">SINNERS-TECH</h2>
                </div>


                <div className="flex flex-col items-center gap-8 mb-14 w-full max-w-4xl mx-auto px-6">


                    <div className="relative w-full group">
                        <input
                            type="text"
                            placeholder="Search items by name..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full bg-black/20 border border-white/10 p-4 pl-12 font-bebas text-xl tracking-[2px] text-white outline-none focus:border-white transition-all duration-500 placeholder:text-white/20"
                        />
                        <svg
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors"
                            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>

                        <div className="absolute bottom-0 left-0 h-[1px] bg-white w-0 group-focus-within:w-full transition-all duration-700"></div>
                    </div>


                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setCurrentPage(1);
                                }}
                                className={`px-5 py-2 font-bebas text-sm tracking-[2px] transition-all duration-500 border
                                ${selectedCategory === cat
                                        ? "bg-white text-black border-white"
                                        : "bg-transparent text-white/40 border-white/5 hover:border-white/30"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>


                <div ref={gridRef} className={styles.grid}>
                    {currentItems.length > 0 ? (
                        currentItems.map((item) => (
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
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="font-bebas text-2xl text-white/20 tracking-widest uppercase italic">
                                No artifacts found in this sector.
                            </p>
                        </div>
                    )}
                </div>
            </section>
            <div>

                {totalPages > 1 && (
                    <div className="flex flex-col items-center gap-8 mt-20 pb-16 pt-[30px]">

                        <div className="flex items-center gap-4">

                            <button
                                disabled={currentPage === 1}
                                onClick={() => {
                                    setCurrentPage(prev => prev - 1);
                                    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="group relative flex items-center justify-center w-12 h-12 border border-indigo-500/20 rounded-full transition-all duration-500 hover:border-indigo-500 disabled:opacity-10 disabled:cursor-not-allowed overflow-hidden"
                            >
                                <span className="relative z-10 text-white group-hover:text-black transition-colors duration-300">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M19 12H5M5 12L12 19M5 12L12 5" />
                                    </svg>
                                </span>
                                <span className="absolute inset-0 bg-indigo-500 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full origin-center"></span>
                            </button>
                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => {
                                            setCurrentPage(page);
                                            sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className={`w-10 h-10 font-bebas text-xl border transition-all duration-300 ${currentPage === page
                                            ? "bg-white text-black border-white"
                                            : "bg-transparent text-white/30 border-white/5 hover:border-white/20 hover:text-white"
                                            }`}
                                    >
                                        {page.toString().padStart(2, '0')}
                                    </button>
                                ))}
                            </div>

                            {/* Next Button */}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => {
                                    setCurrentPage(prev => prev + 1);
                                    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="group relative flex items-center justify-center w-12 h-12 border border-white/10 rounded-full transition-all duration-500 hover:border-indigo-500/20 disabled:opacity-10 disabled:cursor-not-allowed overflow-hidden"
                            >
                                <span className="relative z-10 text-white group-hover:text-black transition-colors duration-300">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                                    </svg>
                                </span>
                                <span className="absolute inset-0 bg-indigo-500 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full origin-center"></span>
                            </button>
                        </div>
                        <p className="text-[10px] font-mono tracking-[4px] text-white/20 uppercase">
                            Displaying sector {indexOfFirstItem + 1} — {Math.min(indexOfLastItem, filteredKeycaps.length)} of {filteredKeycaps.length} units
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default StoreSection;