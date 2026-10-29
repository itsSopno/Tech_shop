"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import img1 from "./Sinners_ hero.png"; // Poramorsho: file name theke space soriye "Sinners_hero.png" korun
import img2 from "./Sinners_ 2nd.png";
import img3 from "./3rd.png";
import img4 from "./Sinners_3rd.png";

// Component-er baire, tai render-e bar bar toiri hoy na (useMemo lagbe na)
const LOADER_IMAGES = [
  { id: 1, src: img4, alt: "Archive 01" },
  { id: 2, src: img3, alt: "Archive 02" },
  { id: 3, src: img2, alt: "Archive 03" },
  { id: 4, src: img1, alt: "Studio Sinners" },
];

interface LoaderProps {
  onComplete: () => void;
}

const OchiComponentLoader = ({ onComplete }: LoaderProps) => {
  const [percent, setPercent] = useState(0);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Parent inline function dileo timeline restart hobe na
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Loader cholar somoy pichoner page scroll bondho
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const finish = () => {
      if (loaderRef.current) {
        loaderRef.current.style.pointerEvents = "none";
        loaderRef.current.style.display = "none";
      }
      document.body.style.overflow = prevOverflow;
      onCompleteRef.current();
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Reduced motion: animation chhara shudhu halka fade
      if (reduceMotion) {
        gsap.set(".loader-card:last-child", { opacity: 1 });
        setPercent(100);
        gsap.to(loaderRef.current, { opacity: 0, duration: 0.4, delay: 0.4, onComplete: finish });
        return;
      }

      const counter = { value: 0 };
      const tl = gsap.timeline({ defaults: { ease: "expo.inOut", force3D: true } });

      // Percent counter: linear (agey expo ease chhilo, tai 0% ar 100%-e atke thakto)
      tl.to(counter, {
        value: 100,
        duration: 3,
        ease: "none",
        onUpdate: () => setPercent(Math.round(counter.value)),
      });

      // Card gulo niche theke uthe ashe
      tl.fromTo(
        ".loader-card",
        { y: "100vh", rotationX: 10, opacity: 0 },
        {
          y: (i: number) => `${i * -5}px`,
          rotationX: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.25,
        },
        0
      );

      // Baki card gulo niche chole jay
      tl.to(
        ".loader-card:not(:last-child)",
        { y: "100vh", opacity: 0, duration: 0.8, stagger: 0.04 },
        "+=0.2"
      );

      // Shesh card full screen hoy (y: 0 diye 15px gap fix)
      tl.to(
        ".loader-card:last-child",
        { width: "100vw", height: "100vh", borderRadius: 0, y: 0, duration: 1 },
        "-=0.5"
      );

      tl.to(loaderRef.current, { opacity: 0, duration: 0.4, onComplete: finish }, "+=0.1");
    }, loaderRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div
      ref={loaderRef}
      role="status"
      aria-label="Loading Sinners Tech"
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-black [perspective:2000px]"
    >
      <div className="relative flex h-full w-full items-center justify-center">
        {LOADER_IMAGES.map((image, index) => {
          const isLast = index === LOADER_IMAGES.length - 1;
          return (
            <div
              key={image.id}
              // opacity: 0 shuru thekei, jate animation shuru hobar agey card ekbar jhalke na ashe
              style={{ zIndex: index + 1, opacity: 0 }}
              className="loader-card absolute h-[50%] w-[80%] overflow-hidden rounded-[20px] bg-neutral-950 will-change-transform [backface-visibility:hidden] md:h-[70%] md:w-[60%] md:rounded-[40px]"
            >
              {/* Agey p-4/p-12 chhilo kintu fill image padding mane na, tai inset diye fix */}
              <div className="absolute inset-4 md:inset-12">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 80vw, 60vw"
                  className="object-contain"
                  priority
                  quality={60}
                />
              </div>

              {isLast && (
                <div
                  aria-hidden="true"
                  className="absolute bottom-6 right-8 z-[100] font-bebas text-[20vw] leading-none tracking-tighter text-indigo-500/20 tabular-nums md:bottom-12 md:right-12 md:text-[10vw]"
                >
                  {percent}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OchiComponentLoader;