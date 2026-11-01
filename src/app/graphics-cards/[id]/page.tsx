"use client";

import React from "react";
import ProductDetailShell, {
    SpecCell,
    DetailProduct,
} from "@/components/ProductDetailShell/ProductDetailShell";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function GraphicsCardDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <ProductDetailShell
            params={params}
            endpoint={`${API}/api/graphics`}
            responseKey="graphicsCard"
            backHref="/Graphics"
            backLabel="Back to Graphics Cards"
            accent="emerald"
            renderSpecs={(p: DetailProduct) => (
                <>
                    <SpecCell label="VRAM" value={p.vramSize as number} unit="GB" />
                    <SpecCell label="VRAM Type" value={p.vramType as string} />
                    <SpecCell label="Core Clock" value={p.coreClock as number} unit="MHz" />
                    <SpecCell label="Boost Clock" value={p.boostClock as number} unit="MHz" />
                    <SpecCell
                        label="Interface"
                        value={(p.port as string)
                            ?.replace("PCI Express", "PCIe")
                            .replace("PCI-E", "PCIe")}
                    />
                    <SpecCell label="Ray Tracing" value={p.rayTracing as boolean} />
                    {p.dlss && <SpecCell label="DLSS" value={p.dlss as string} />}
                    <SpecCell label="Brand" value={p.brand as string} />
                    <SpecCell label="Model" value={p.model as string} />
                </>
            )}
        />
    );
}
