"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

export type ItemType = "keycap" | "keyboard" | "product";

const EditKeycap = () => {
    const router = useRouter();
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const getInitialState = () => ({
        name: "", price: "", image: "", description: "", brand: ""
    });

    const [formData, setFormData] = useState(getInitialState());

    useEffect(() => {
        if (!id) return;
        setFetchLoading(true);
        const baseUrl = "https://t-mark-4.vercel.app";
        // Keycaps have their own API endpoint
        fetch(`${baseUrl}/api/keycaps/${id}`)
            .then(res => res.json())
            .then(data => {
                // keycap controller returns { success: true, keycap: {...} }
                if (data.success && data.keycap) {
                    const keycapData = data.keycap;
                    setFormData({
                        name: keycapData.name || "",
                        price: keycapData.price || "",
                        image: keycapData.image || "",
                        description: keycapData.description || "",
                        brand: keycapData.brand || "",
                    });
                } else {
                    setMessage({ type: "error", text: "Keycap not found." });
                }
            })
            .catch(() => {
                setMessage({ type: "error", text: "Error fetching keycap details." });
            })
            .finally(() => {
                setFetchLoading(false);
            });
    }, [id]);
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dhkdtyjsr";
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!uploadPreset) {
            setMessage({ type: "error", text: "Cloudinary upload preset missing." });
            return;
        }

        setUploadingImage(true);
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("upload_preset", uploadPreset);
        
        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: uploadData,
            });
            const data = await response.json();
            if (data.secure_url) {
                setFormData((prev) => ({ ...prev, image: data.secure_url }));
                setMessage({ type: "success", text: "Image uploaded successfully via Cloudinary." });
            } else {
                setMessage({ type: "error", text: "Failed to process image upload." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Upload connection error." });
        } finally {
            setUploadingImage(false);
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const baseUrl = "https://t-mark-4.vercel.app";
        // Keycaps update endpoint
        const endpoint = `/api/keycaps/${id}`;

        try {
            const token = document.cookie.split("; ").find(c => c.startsWith("token="))?.split("=")[1] || "";

            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setMessage({ type: "success", text: "Keycap updated successfully." });
                // Redirect back to the keycap details page
                setTimeout(() => router.push(`/keycaps/${id}`), 1500);
            } else {
                setMessage({ type: "error", text: "Check server configuration or permissions." });
            }
        } catch {
            setMessage({ type: "error", text: "Connection error." });
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-2 border-[#D9FF00]/20 border-t-[#D9FF00] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <section className="relative min-h-screen overflow-hidden">
            {/* Background Layer */}
            <div className="fixed inset-0 z-0 grayscale pointer-events-none">
                <Image
                    src="https://i.pinimg.com/1200x/27/24/20/272420ca80feed08e869dfe6e08274dd.jpg"
                    alt="Studio Sinners Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                {/* Deep Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center p-6 selection:bg-[#D9FF00] selection:text-black mt-20 pt-[100px]">

                {/* Header Area */}
                <div className="text-center mb-12">
                    <span className="text-[10px] text-[#D9FF00] font-mono tracking-[0.5em] uppercase mb-2 block">
                        System_Uplink // Inventory
                    </span>
                    <h2 className="text-white font-bebas text-6xl tracking-tight uppercase">
                        Edit <span className="text-[#D9FF00]">Keycap</span>
                    </h2>
                    <div className="h-[1px] w-24 bg-white/20 mx-auto mt-4 relative">
                        <div className="absolute inset-0 bg-[#D9FF00] w-1/2 mx-auto" />
                    </div>
                </div>

                {/* Form Container */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-2xl p-8 md:p-12 items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 rounded-none shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                >
                    {message && (
                        <div className={`mb-8 p-4 text-[10px] font-bold tracking-[0.2em] uppercase border transition-all ${message.type === "success"
                            ? "border-[#D9FF00] text-[#D9FF00] bg-[#D9FF00]/5"
                            : "border-red-500 text-red-500 bg-red-500/5"
                            }`}>
                            [{message.type === "success" ? "STATUS_OK" : "SYSTEM_ERR"}]: {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        {/* Keycap Name */}
                        <div className="group flex flex-col gap-2">
                            <label className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] group-focus-within:text-[#D9FF00] transition-colors">
                                Keycap Name
                            </label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="bg-transparent border-b border-white/10 p-2 text-white font-light outline-none focus:border-[#D9FF00] transition-all duration-500"
                                placeholder="e.g. Apollo Artisan"
                            />
                        </div>

                        {/* Price */}
                        <div className="group flex flex-col gap-2">
                            <label className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] group-focus-within:text-[#D9FF00] transition-colors">
                                Price (USD)
                            </label>
                            <input
                                required
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="bg-transparent border-b border-white/10 p-2 text-white font-light outline-none focus:border-[#D9FF00] transition-all duration-500"
                            />
                        </div>

                        {/* Image URL / Upload */}
                        <div className="md:col-span-2 group flex flex-col gap-3">
                            <label className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] group-focus-within:text-[#D9FF00] transition-colors">
                                Image Source (Upload or URL)
                            </label>
                            
                            <div className="flex flex-col gap-4">
                                {/* Upload Button */}
                                <label className="cursor-pointer bg-white/5 border border-white/10 p-4 text-center text-[10px] text-white/80 font-bold uppercase tracking-[0.2em] hover:bg-[#D9FF00]/10 hover:text-[#D9FF00] hover:border-[#D9FF00]/50 transition-all duration-300">
                                    {uploadingImage ? "UPLOADING TO MAINFRAME..." : "SELECT FILE TO UPLOAD"}
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleImageUpload} 
                                        disabled={uploadingImage}
                                    />
                                </label>
                                
                                {/* URL Input Fallback */}
                                <input
                                    required
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="Or paste an image URL directly"
                                    className="bg-transparent border-b border-white/10 p-2 text-white font-light outline-none focus:border-[#D9FF00] transition-all duration-500"
                                />

                                {/* Preview Wrapper */}
                                {formData.image && (
                                    <div className="relative w-full h-40 mt-2 border border-white/10 bg-black/50 overflow-hidden group-hover:border-[#D9FF00]/30 transition-colors">
                                        <Image src={formData.image} alt="Preview" fill className="object-contain p-4" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2 group flex flex-col gap-2">
                            <label className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] group-focus-within:text-[#D9FF00] transition-colors">
                                Unit Description
                            </label>
                            <textarea
                                required
                                name="description"
                                rows={2}
                                value={formData.description}
                                onChange={handleChange}
                                className="bg-transparent border-b border-white/10 p-2 text-white font-light outline-none focus:border-[#D9FF00] transition-all duration-500 resize-none"
                            />
                        </div>

                        {/* Brand */}
                        <div className="group flex flex-col gap-2">
                            <label className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] group-focus-within:text-[#D9FF00] transition-colors">
                                Manufacturer / Brand
                            </label>
                            <input
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className="bg-transparent border-b border-white/10 p-2 text-white font-light outline-none focus:border-[#D9FF00] transition-all duration-500"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-12 py-5 bg-[#D9FF00] text-black font-black text-[11px] tracking-[0.3em] uppercase hover:bg-white hover:tracking-[0.4em] transition-all duration-500 disabled:opacity-50 relative overflow-hidden group"
                    >
                        <span className="relative z-10">
                            {loading ? "INITIALIZING_UPLINK..." : "COMMIT_CHANGES"}
                        </span>
                        {/* Button Decoration */}
                        <div className="absolute top-0 left-[-100%] w-full h-full bg-white/20 skew-x-[-20deg] group-hover:left-[100%] transition-all duration-1000" />
                    </button>
                </form>
            </div>
        </section>
    );
};

export default EditKeycap;