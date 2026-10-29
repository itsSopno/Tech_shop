"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import styles from "./KeycapsSection.module.scss";

gsap.registerPlugin(ScrollTrigger);

interface Keycap {
  _id?: string;
  id?: string;
  name: string;
  image: string;
  description: string;
  price: number | string;
  brand: string;
}

const KeycapsSection = () => {
  const [keycaps, setKeycaps] = useState<Keycap[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://t-mark-4.vercel.app/api/keycaps");
        const data = await response.json();
        const list = data.keycaps || data;
        if (Array.isArray(list) && list.length > 0) {
          setKeycaps(list);
        } else {
          const local = await fetch("/key.json");
          const localData = await local.json();
          setKeycaps(localData);
        }
      } catch {
        try {
          const local = await fetch("/key.json");
          const localData = await local.json();
          setKeycaps(localData);
        } catch (e) {
          console.error("Local fallback failed:", e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && keycaps.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from(".card_anim", {
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
          },
        });
        ScrollTrigger.refresh();
      }, sectionRef);

      return () => ctx.revert();
    }
  }, [loading, keycaps]);

  const handleCardClick = (item: Keycap) => {
    const id = item._id || item.id;
    console.log("CARD CLICKED:", item.name, "| ID:", id);
    const destination = id
      ? `/keycaps/${id}`
      : `/keycaps/${item.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
    console.log("Navigating to:", destination);
    router.push(destination);
  };

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
        <span className={styles.subtitle}>Limited Edition</span>
        <h2 className="font-space font-bold uppercase italic text-silver">Artisan Keycaps</h2>
      </div>

      <div ref={gridRef} className={styles.grid}>
        {keycaps.map((item, index) => (
          <div
            key={item._id || item.id || index}
            className={`${styles.card} card_anim`}
            onClick={() => handleCardClick(item)}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleCardClick(item)}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={item.image}
                alt={item.name}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className={styles.content}>
              <span className={styles.brand}>{item.brand}</span>
              <h3 className="font-space font-bold uppercase italic text-silver">{item.name}</h3>
              <p className={styles.description}>{item.description}</p>

              <div className={styles.footer}>
                <span className={styles.price}>${item.price}</span>
                <button
                  className={styles.viewBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(item);
                  }}
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KeycapsSection;