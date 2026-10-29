import React from "react";
import Image from "next/image";
import styles from "./about.module.scss";

interface Stat {
    label: string;
    value: string;
}

const stats: Stat[] = [
    { label: "Products Launched", value: "24+" },
    { label: "Community Members", value: "10K" },
    { label: "Global Partners", value: "08" },
];

const AboutPage: React.FC = () => {
    return (
        <main className={styles.aboutWrapper}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container mx-auto px-6 md:px-16">
                    <div className={styles.heroContent}>
                        <span className={styles.subtitle}>Our Story</span>
                        <h1 className={styles.title}>
                            Engineering <br />
                            <span className="text-black">Performance</span> <br />
                            Through <span className={styles.italic}>Design.</span>
                        </h1>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className={styles.philosophy}>
                <div className="container mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-20">
                    <div className={styles.imageBox}>
                        <Image
                            src="https://i.pinimg.com/1200x/0b/38/24/0b3824e02cd454af2df5f78c623585bc.jpg" // Use one of your high-res setup shots here
                            alt="Our Workshop"
                            fill
                            className={styles.mainImg}
                        />
                        <div className={styles.signatureOverlay}><span className="font-creme text-9xl">SINNERS</span></div>
                    </div>

                    <div className={styles.textContent}>
                        <h2 className={styles.secTitle}>The Philosophy</h2>
                        <p className={styles.lead}>
                            We don't just build peripherals; we craft tools for those who refuse to settle for the ordinary.
                            Born from a passion for racing and precision engineering.
                        </p>
                        <p className={styles.body}>
                            Every keypress matters. Every millisecond counts. Our mission is to bridge the gap between
                            human intent and digital execution, using materials that feel as good as they perform.
                        </p>

                        <div className={styles.statsGrid}>
                            {stats.map((stat, i) => (
                                <div key={i} className={styles.statItem}>
                                    <span className={styles.statValue}>{stat.value}</span>
                                    <span className={styles.statLabel}>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AboutPage;