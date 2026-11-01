"use client";

import React from "react";
import ProductDetailShell, {
  SpecCell,
  DetailProduct,
} from "@/components/ProductDetailShell/ProductDetailShell";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function KeycapDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <ProductDetailShell
      params={params}
      endpoint={`${API}/api/keycaps`}
      responseKey="keycap"
      backHref="/Keycap"
      backLabel="Back to Keycaps"
      accent="indigo"
      renderSpecs={(p: DetailProduct) => (
        <>
          <SpecCell label="Brand" value={p.brand as string} />
          <SpecCell label="Material" value={p.material as string} />
          <SpecCell label="Profile" value={p.profile as string} />
          <SpecCell label="Legends" value={p.legends as string} />
        </>
      )}
    />
  );
}