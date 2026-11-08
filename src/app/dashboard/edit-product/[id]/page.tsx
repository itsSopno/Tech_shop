"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
export type ItemType = "keycap" | "keyboard" | "product";

const EditProduct = () => {
    const router = useRouter();
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [uploadingImage, SetImageUpload] = useState(false)
    const getInitialState = () => ({
        name: "", price: "", image: "", description: "",
        quantity: "", category: "Keyboards"
    });

    const [formData, setFormData] = useState(getInitialState());

    useEffect(() => {
        if (!id) return;
        setFetchLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        fetch(`${baseUrl}/api/all-products/getSingle/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.product) {
                    const product = data.product;
                    setFormData({
                        name: product.name || "",
                        price: product.price || "",
                        image: product.image || "",
                        description: product.description || "",
                        quantity: product.quantity || "",
                        category: product.category || "Keyboards",
                    });
                } else {
                    setMessage({ type: "error", text: "Product not found." });
                }
            })
            .catch(() => {
                setMessage({ type: "error", text: "Error fetching product details." });
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

        SetImageUpload(true);
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
                setMessage({ type: "success", text: "Image uploaded successfully." });
            } else {
                setMessage({ type: "error", text: "Image upload failed." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Image upload failed." });
        } finally {
            SetImageUpload(false);
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const endpoint = `/api/all-products/update/${id}`;

        try {
            // Attempt to read token from document.cookie in case admin relies on it
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
                setMessage({ type: "success", text: "Product updated successfully." });
                setTimeout(() => router.push("/dashboard"), 1500);
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
            <div className="flex items-center justify-center min-h-screen bg-[#DEDEDE]">
                <div className="w-12 h-12 border-2 border-[#f25623]/20 border-t-[#f25623] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-[#DEDEDE] min-h-screen selection:text-white selection:bg-[#f25623] mt-20">
            {/* Header Area */}
            <div className="text-center mb-12">
                <h2 className="text-[#4D4D4D] font-display text-4xl font-bold tracking-tight uppercase">
                    Edit Product
                </h2>
                <div className="h-[2px] w-12 bg-[#f25623] mx-auto mt-4" />
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl p-10 border border-[#4D4D4D]/10 bg-[#EAEAEA] rounded-none shadow-2xl"
            >
                {message && (
                    <div className={`mb-8 p-4 text-xs font-bold tracking-widest uppercase border ${message.type === "success" ? "border-[#f25623] text-[#f25623]" : "border-red-500 text-red-500"
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Inputs */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-[#4D4D4D]/50 font-bold uppercase tracking-widest">Product Name</label>
                        <input required name="name" value={formData.name} onChange={handleChange} className="bg-transparent border-b border-[#4D4D4D]/20 p-2 text-[#4D4D4D] outline-none focus:border-[#f25623] transition-colors" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-[#4D4D4D]/50 font-bold uppercase tracking-widest">Price (USD)</label>
                        <input required type="number" name="price" value={formData.price} onChange={handleChange} className="bg-transparent border-b border-[#4D4D4D]/20 p-2 text-[#4D4D4D] outline-none focus:border-[#f25623] transition-colors" />
                    </div>

                    {/* <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="text-[10px] text-[#4D4D4D]/50 font-bold uppercase tracking-widest">Image URL</label>
                        <input required name="image" value={formData.image} onChange={handleChange} className="bg-transparent border-b border-[#4D4D4D]/20 p-2 text-[#4D4D4D] outline-none focus:border-[#f25623] transition-colors" />
                    </div> */}
                    <div className="md:col-span-2 group flex flex-col gap-3">
                        <label className="text-[10px] text-[#4D4D4D]/50 font-bold uppercase tracking-[0.2em] group-focus-within:text-[#f25623] transition-colors">
                            Image Source (Upload or URL)
                        </label>

                        <div className="flex flex-col gap-4">
                            {/* Upload Button */}
                            <label className="cursor-pointer bg-[#DEDEDE] border border-[#4D4D4D]/10 p-4 text-center text-[10px] text-[#4D4D4D]/60 font-bold uppercase tracking-[0.2em] hover:bg-[#f25623]/10 hover:text-[#f25623] hover:border-[#f25623]/50 transition-all duration-300">
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
                                className="bg-transparent border-b border-[#4D4D4D]/20 p-2 text-[#4D4D4D] font-light outline-none focus:border-[#f25623] transition-all duration-500"
                            />

                            {/* Preview Wrapper */}
                            {formData.image && (
                                <div className="relative w-full h-40 mt-2 border border-[#4D4D4D]/10 bg-[#DEDEDE] overflow-hidden group-hover:border-[#f25623]/30 transition-colors">
                                    <Image src={formData.image} alt="Preview" fill className="object-contain p-4" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="text-[10px] text-[#4D4D4D]/50 font-bold uppercase tracking-widest">Description</label>
                        <textarea required name="description" rows={2} value={formData.description} onChange={handleChange} className="bg-transparent border-b border-[#4D4D4D]/20 p-2 text-[#4D4D4D] outline-none focus:border-[#f25623] transition-colors resize-none" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-[#4D4D4D]/50 font-bold uppercase tracking-widest">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="bg-transparent border-b border-[#4D4D4D]/20 p-2 text-[#4D4D4D] outline-none focus:border-[#f25623] transition-colors cursor-pointer">
                            <option value="Keyboards" className="bg-[#EAEAEA]">Keyboards</option>
                            <option value="Keycaps" className="bg-[#EAEAEA]">Keycaps</option>
                            <option value="Switches" className="bg-[#EAEAEA]">Switches</option>
                            <option value="Accessories" className="bg-[#EAEAEA]">Accessories</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-[#4D4D4D]/50 font-bold uppercase tracking-widest">Stock/Quantity</label>
                        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="bg-transparent border-b border-[#4D4D4D]/20 p-2 text-[#4D4D4D] outline-none focus:border-[#f25623] transition-colors" />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-12 py-4 bg-[#f25623] text-white font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#d94514] transition-all disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Update Product"}
                </button>
            </form>
        </div>
    );
};

export default EditProduct;
