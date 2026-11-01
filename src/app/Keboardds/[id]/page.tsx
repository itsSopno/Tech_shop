"use client";

import React from "react";
import ProductDetailShell, {
    SpecCell,
    DetailProduct,
} from "@/components/ProductDetailShell/ProductDetailShell";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function KeyboardDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <ProductDetailShell
            params={params}
            endpoint={`${API}/api/keyboard`}
            responseKey="keyboard"
            backHref="/Keboardds"
            backLabel="Back to Keyboards"
            accent="amber"
            renderSpecs={(p: DetailProduct) => (
                <>
                    <SpecCell label="Brand" value={p.brand as string} />
                    <SpecCell label="Layout" value={p.layout as string} />
                    <SpecCell label="Switch Type" value={p.switchType as string} />
                    <SpecCell label="Category" value={p.category as string} />
                    <SpecCell label="Featured" value={p.isFeatured as boolean} />
                </>
            )}
        />
    );
}
