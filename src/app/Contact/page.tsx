"use client";
import React, { useEffect } from "react";
import { gsap } from "gsap";

const ContactPage = () => {
    useEffect(() => {
        // মাউস মুভমেন্টের সাথে ব্যাকগ্রাউন্ডে একটা হালকা গ্লো ফলো করবে
        const blob = document.getElementById("blob");
        window.onpointermove = (event) => {
            const { clientX, clientY } = event;
            blob?.animate({
                left: `${clientX}px`,
                top: `${clientY}px`
            }, { duration: 3000, fill: "forwards" });
        }

        gsap.from(".char", {
            y: 150,
            stagger: 0.05,
            duration: 1,
            ease: "power4.out"
        });
    }, []);

    return (
        <main className="min-h-screen text-black pt-40 pb-20 px-6 md:px-12 relative overflow-hidden flex flex-col justify-between">
            {/* Interactive Background Blob */}
            <div id="blob" className="absolute w-[400px] h-[400px] bg-white opacity-[0.03] rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

            {/* Hero Header */}
            <section className="relative z-10 w-full">
                <h1 className="font-bebas text-[18vw] leading-[0.8] tracking-tighter uppercase overflow-hidden">
                    <span className="char inline-block">SAY</span> <br />
                    <span className="char inline-block text-transparent stroke-text">HELLO</span>
                </h1>
            </section>

            {/* Contact Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mt-20 relative z-10">
                {/* Info Side */}
                <div className="flex flex-col justify-end gap-12 border-l border-white/10 pl-8">
                    <div>
                        <p className="font-bebas text-white/30 text-xl tracking-[5px] mb-4">SOCIALS</p>
                        <div className="flex flex-col gap-2">
                            {['Instagram', 'Discord', 'Behance', 'Twitter'].map(link => (
                                <a key={link} href="#" className="font-bebas text-4xl hover:italic hover:pl-4 transition-all duration-300 uppercase tracking-wide w-fit">
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="font-bebas text-white/30 text-xl tracking-[5px] mb-4">LOCATION</p>
                        <p className="font-bebas text-4xl uppercase">Dhaka // Bangladesh</p>
                    </div>
                </div>

                {/* Minimal Form */}
                <div className="flex flex-col justify-end">
                    <form className="space-y-12">
                        <div className="group relative">
                            <input
                                type="text"
                                placeholder="YOUR NAME"
                                className="w-full bg-transparent border-b-2 border-black/10 py-6 font-bebas text-3xl md:text-5xl outline-none focus:border-black transition-all placeholder:text-black/5 uppercase"
                            />
                        </div>

                        <div className="group relative">
                            <input
                                type="email"
                                placeholder="YOUR EMAIL"
                                className="w-full bg-transparent border-b-2 border-black/10 py-6 font-bebas text-3xl md:text-5xl outline-none focus:border-black transition-all placeholder:text-black/5 uppercase"
                            />
                        </div>

                        <button className="w-full py-8 bg-white text-black font-bebas text-4xl tracking-widest hover:bg-[#ff0000] hover:text-white transition-all duration-500 uppercase">
                            Send Mission
                        </button>
                    </form>
                </div>
            </div>

            <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
        }
        .stroke-text:hover {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 1);
          color: white;
          transition: 0.5s ease;
        }
      `}</style>
        </main>
    );
};

export default ContactPage;