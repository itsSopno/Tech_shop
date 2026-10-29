
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type ItemType = "keycap" | "keyboard" | "product";

interface ItemFormProps {
  type: ItemType;
}

const ItemForm = ({ type }: ItemFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const getInitialState = () => ({
    name: "", price: "", image: "", description: "", brand: "",
    stock: "", category: "Keyboards", layout: "75%", switchType: "Mechanical"
  });

  const [formData, setFormData] = useState(getInitialState());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const baseUrl = "https://t-mark-4.vercel.app";
    const endpoint = type === "keycap" ? "/api/keycaps/create" : type === "keyboard" ? "/api/keyboard/create" : "/api/all-products/create";

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setMessage({ type: "success", text: "Product added to registry." });
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setMessage({ type: "error", text: "Check server configuration." });
      }
    } catch {
      setMessage({ type: "error", text: "Connection error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 selection:text-black">

      {/* Header Area */}
      <div className="text-center mb-12">
        <h2 className="text-white font-display text-4xl font-bold tracking-tight uppercase">
          New {type}
        </h2>
        <div className="h-[2px] w-12 bg-[#D9FF00] mx-auto mt-4" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl p-10 border border-white/5 rounded-none shadow-2xl"
      >
        {message && (
          <div className={`mb-8 p-4 text-xs font-bold tracking-widest uppercase border ${message.type === "success" ? "border-[#D9FF00] text-[#D9FF00]" : "border-red-500 text-red-500"
            }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Inputs */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Product Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-[#D9FF00] transition-colors" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Price (USD)</label>
            <input required type="number" name="price" value={formData.price} onChange={handleChange} className="bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-[#D9FF00] transition-colors" />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Image URL</label>
            <input required name="image" value={formData.image} onChange={handleChange} className="bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-[#D9FF00] transition-colors" />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Description</label>
            <textarea required name="description" rows={2} value={formData.description} onChange={handleChange} className="bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-[#D9FF00] transition-colors resize-none" />
          </div>

          {type === "keyboard" && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Layout</label>
              <select name="layout" value={formData.layout} onChange={handleChange} className="bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-[#D9FF00] transition-colors cursor-pointer">
                <option value="60%" className="bg-[#121212]">60%</option>
                <option value="75%" className="bg-[#121212]">75%</option>
                <option value="TKL" className="bg-[#121212]">TKL</option>
              </select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Brand</label>
            <input name="brand" value={formData.brand} onChange={handleChange} className="bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-[#D9FF00] transition-colors" />
          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-12 py-4 bg-[#D9FF00] text-black font-bold text-xs tracking-[0.2em] uppercase hover:bg-white transition-all disabled:opacity-50"
        >
          {loading ? "Processing..." : `Register ${type}`}
        </button>
      </form>
    </div>
  );
};

export default ItemForm;