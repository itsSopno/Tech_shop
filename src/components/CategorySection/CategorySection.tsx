"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import styles from "./CategorySection.module.scss";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 1,
    title: "Keyboards",
    description: "Custom built mechanical masterpieces.",
    image: "https://i.pinimg.com/736x/16/c2/e8/16c2e88dac825e3d1c74bd05c8ace463.jpg",
    color: "#050505"
  },
  {
    id: 2,
    title: "Controller",
    description: "Controller for elite gaming.",
    image: "https://i.pinimg.com/1200x/f9/15/4c/f9154c3575600da57660c9b719a9d6bc.jpg",
    color: "#050505"
  },
  {
    id: 3,
    title: "Mouse",
    description: "Ultra-lightweight speed and accuracy.",
    image: "https://i.pinimg.com/1200x/fc/51/78/fc5178b63e4d793742daeda6685661c9.jpg",
    color: "#050505"
  }
];

const CategorySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        gsap.from(item, {
          x: index % 2 === 0 ? -100 : 100,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        });

        // Parallax Effect on scroll
        gsap.to(item.querySelector(`.${styles.image}`), {
          y: -50,
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.section}>
      <div className={styles.grid}>
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            ref={(el) => { itemsRef.current[index] = el; }}
            className={`${styles.item} ${index === 1 ? styles.light : styles.dark}`}
          >
            <div className={styles.content}>
              <span className={styles.index}>0{index + 1}</span>
              <h2 className="font-bebas">{cat.title}</h2>
              <p>{cat.description}</p>
              <Link href="/Store" className={styles.exploreBtn}>Explore Category</Link>
            </div>
            <div className={styles.imageWrapper}>
              <div
                className={styles.image}
                style={{ backgroundImage: `url(${cat.image})` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
