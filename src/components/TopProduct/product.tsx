import React from "react";
import Image from "next/image";
import styles from "./topProduct.module.scss";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    brand: string;
    stock: number;
    tag?: string;
}

const products: Product[] = [
    {
        id: 1,
        name: "Pwnage Custom Ergo Grips",
        category: "Mouse Accessories",
        price: 19.99,
        image: "https://i.postimg.cc/fW5dvcfr/5f99918f258943818d64c6fa33bcd2ad.jpg",
        description: "Pre-cut, anti-slip textured grip tape for Pwnage Ultra Custom Ergo. Black with unique red spackle pattern for style and grip.",
        brand: "Pwnage",
        stock: 150,
        tag: "BEST SELLER"
    },
    {
        id: 2,
        name: "Custom 75% Mechanical Keyboard",
        category: "Mechanical Keyboards",
        price: 249.99,
        image: "https://i.postimg.cc/QdKWsRZd/e57a55b3b1652c1a400372d0311cd6eb.jpg",
        description: "Custom built keyboard with frosted acrylic case, hot-swappable switches, and a distinct cyan/brown/orange keycap set (e.g., GMK pulse & some modifier), features an accent orange keycap.",
        brand: "Custom Build",
        stock: 1,
        tag: "CUSTOM BUILD"
    },
    {
        id: 3,
        name: "Artisan Keycap Macropad - Mythical Creature Edition",
        category: "Keycaps & Macropads",
        price: 350.00,
        image: "https://i.postimg.cc/HxdJwncc/e6c340c29a57f4010c69b26cc597e29f.jpg",
        description: "A unique custom macropad featuring fully detailed mythical creature artisan keycaps like dragons and gargoyles, with integrated RGB underglow and a knurled gold knob.",
        brand: "Artisan Guild / Custom",
        stock: 3,
        tag: "RARE"
    }
];


const TopProducts: React.FC = () => {
    return (
        <section className={styles.productSection}>
            <div className="container mx-auto px-6 md:px-16">

                {/* Section Header */}
                <div className={styles.header}>
                    <h2 className="font-space font-bold text-5xl md:text-8xl text-silver uppercase italic">
                        Top <br /> <span className="text-indigo-500">Picks.</span>
                    </h2>
                    <p className={styles.description}>
                        Engineered for speed. Built for precision. The ultimate desk setup starts here.
                    </p>
                </div>

                {/* Product Grid */}
                <div className={styles.gridContainer}>
                    {products.map((product) => (
                        <div key={product.id} className={styles.productCard}>

                            {/* Badge */}
                            <span className={styles.badge}>{product.tag}</span>

                            {/* Product Image */}
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    className={styles.mainImg}
                                />
                            </div>

                            {/* Card Content */}
                            <div className="relative z-10">
                                <span className="text-neon-lime font-mono text-xs mb-2 block">{product.id} {'// LOG'}</span>
                                <h3 className="text-4xl font-space font-bold tracking-wider group-hover:italic transition-all uppercase">{product.name}</h3>
                            </div>
                            <p className={styles.price}>{product.price}</p>

                            {/* Action Button */}
                            <button className={styles.buyBtn}>
                                Add to Setup
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopProducts;