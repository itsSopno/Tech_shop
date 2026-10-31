"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface FormState {
    name: string;
    brand: string;
    price: string;
    oldPrice: string;
    stock: string;
    image: string;
    images: string;
    description: string;
    radiatorSize: string;
    fanCount: string;
    fanSize: string;
    fanRPM: string;
    pumpSpeed: string;
    noise: string;
    socketSupport: string;
    tubingLength: string;
    warranty: string;
    rgbLighting: boolean;
    isFeatured: boolean;
}

type StrKey = Exclude<keyof FormState, "rgbLighting" | "isFeatured">;
type Errors = Partial<Record<StrKey, string>>;

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/liquid-cooler`;

const CHAMFER =
    "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))";

const getInitialState = (): FormState => ({
    name: "",
    brand: "",
    price: "",
    oldPrice: "",
    stock: "10",
    image: "",
    images: "",
    description: "",
    radiatorSize: "360mm",
    fanCount: "3",
    fanSize: "120mm",
    fanRPM: "",
    pumpSpeed: "",
    noise: "",
    socketSupport: "",
    tubingLength: "",
    warranty: "2 Years",
    rgbLighting: true,
    isFeatured: false,
});

const isUrl = (v: string) => {
    try {
        const u = new URL(v);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
};

const inputCls =
    "h-11 w-full min-w-0 bg-white/[0.04] px-4 text-base text-white outline-none ring-1 ring-inset ring-white/10 transition placeholder:text-white/30 focus:bg-white/[0.07] focus:ring-[#D9FF00] aria-[invalid=true]:ring-red-400";

const Section = ({
    index,
    title,
    children,
}: {
    index: number;
    title: string;
    children: React.ReactNode;
}) => (
    <section
        style={{ clipPath: CHAMFER }}
        className="min-w-0 bg-white/[0.03] p-5 ring-1 ring-inset ring-white/10 @md:p-8"
    >
        <h3 className="mb-6 flex items-center gap-3 font-bebas text-3xl text-white">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#D9FF00] text-black text-lg">
                {index}
            </span>
            {title}
        </h3>
        <div className="grid grid-cols-1 gap-5 @md:grid-cols-2">{children}</div>
    </section>
);

const Field = ({
    label,
    name,
    error,
    hint,
    required,
    full,
    children,
}: {
    label: string;
    name: string;
    error?: string;
    hint?: string;
    required?: boolean;
    full?: boolean;
    children: React.ReactNode;
}) => (
    <div className={`min-w-0 ${full ? "@md:col-span-2" : ""}`}>
        <label htmlFor={name} className="mb-2 block text-sm text-white/60">
            {label}
            {required && <span className="text-[#D9FF00]"> *</span>}
        </label>
        {children}
        {error ? (
            <p id={`${name}-error`} role="alert" className="mt-1.5 text-sm text-red-400">
                {error}
            </p>
        ) : hint ? (
            <p className="mt-1.5 text-sm text-white/35">{hint}</p>
        ) : null}
    </div>
);

const Toggle = ({
    label,
    hint,
    checked,
    onChange,
}: {
    label: string;
    hint: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`flex min-w-0 items-center justify-between gap-4 p-4 text-left ring-1 ring-inset transition-colors ${checked ? "bg-[#D9FF00]/10 ring-[#D9FF00]/60" : "bg-white/[0.03] ring-white/10 hover:ring-white/25"
            }`}
    >
        <span className="min-w-0">
            <span className="block font-bebas text-xl text-white">{label}</span>
            <span className="block text-sm text-white/45">{hint}</span>
        </span>
        <span className={`relative h-6 w-11 shrink-0 transition-colors ${checked ? "bg-[#D9FF00]" : "bg-white/20"}`}>
            <span
                className={`absolute top-0.5 h-5 w-5 bg-black transition-all ${checked ? "left-[22px]" : "left-0.5 bg-white"}`}
            />
        </span>
    </button>
);

const LiquidCoolerForm = () => {
    const router = useRouter();
    const [form, setForm] = useState<FormState>(getInitialState);
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState(false);
    const [imgFailed, setImgFailed] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => setImgFailed(false), [form.image]);
    useEffect(
        () => () => {
            if (redirectTimer.current) clearTimeout(redirectTimer.current);
        },
        []
    );

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => (prev[name as StrKey] ? { ...prev, [name]: undefined } : prev));
    };

    const bind = (name: StrKey) => ({
        id: name,
        name,
        value: form[name] as string,
        onChange: handleChange,
        "aria-invalid": !!errors[name],
        "aria-describedby": errors[name] ? `${name}-error` : undefined,
    });

    const validate = (): Errors => {
        const e: Errors = {};
        if (!form.name.trim()) e.name = "Product name is required";
        if (!form.price || !(Number(form.price) > 0)) e.price = "Enter a price greater than 0";
        if (!isUrl(form.image.trim())) e.image = "Enter a valid image URL (https://...)";
        if (!form.description.trim()) e.description = "Description is required";
        const extra = form.images.split("\n").map((s) => s.trim()).filter(Boolean);
        if (extra.some((u) => !isUrl(u))) e.images = "Every line must be a valid URL";
        return e;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        const found = validate();
        setErrors(found);
        if (Object.values(found).some(Boolean)) {
            setMessage({ type: "error", text: "Please fix the highlighted fields." });
            return;
        }

        const payload = {
            name: form.name.trim(),
            brand: form.brand.trim() || undefined,
            price: Number(form.price),
            oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
            stock: Number(form.stock),
            image: form.image.trim(),
            images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
            description: form.description.trim(),
            radiatorSize: form.radiatorSize || undefined,
            fanCount: form.fanCount ? Number(form.fanCount) : undefined,
            fanSize: form.fanSize || undefined,
            fanRPM: form.fanRPM || undefined,
            pumpSpeed: form.pumpSpeed || undefined,
            noise: form.noise || undefined,
            socketSupport: form.socketSupport || undefined,
            tubingLength: form.tubingLength || undefined,
            warranty: form.warranty || undefined,
            rgbLighting: form.rgbLighting,
            isFeatured: form.isFeatured,
        };

        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setMessage({ type: "success", text: "Liquid cooler added. Redirecting to dashboard..." });
                redirectTimer.current = setTimeout(() => router.push("/dashboard"), 1500);
            } else {
                const body = await response.json().catch(() => null);
                setMessage({
                    type: "error",
                    text: body?.message || `Server rejected the request (${response.status}).`,
                });
            }
        } catch {
            setMessage({ type: "error", text: "Connection error. Check your internet and try again." });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setForm(getInitialState());
        setErrors({});
        setMessage(null);
    };

    const price = Number(form.price) || 0;
    const oldPrice = Number(form.oldPrice) || 0;
    const discount = oldPrice > price && price > 0 ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

    return (
        <div className="@container w-full py-2">
            <div className="mx-auto w-full max-w-[1300px]">
                <header className="mb-8 border-b border-white/10 pb-6">
                    <p className="mb-3 text-sm text-white/50">Dashboard / Products</p>
                    <h2 className="font-bebas text-[clamp(32px,6vw,72px)] font-extrabold uppercase italic leading-[0.9] tracking-tighter text-white">
                        New{" "}
                        <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.5)]">
                            Liquid Cooler
                        </span>
                    </h2>
                </header>

                <div className="grid gap-8 @4xl:grid-cols-[minmax(0,1fr)_360px]">
                    {/* ═════ FORM ═════ */}
                    <form onSubmit={handleSubmit} noValidate className="flex min-w-0 flex-col gap-5">

                        <Section index={1} title="Basics">
                            <Field label="Product name" name="name" required error={errors.name} full>
                                <input {...bind("name")} placeholder="Corsair iCUE H150i Elite LCD XT" className={inputCls} />
                            </Field>
                            <Field label="Brand" name="brand" error={errors.brand}>
                                <input {...bind("brand")} placeholder="Corsair" className={inputCls} />
                            </Field>
                            <Field label="Description" name="description" required error={errors.description} full>
                                <textarea
                                    {...bind("description")}
                                    rows={4}
                                    placeholder="Short summary shown on the product page"
                                    className={`${inputCls} h-auto resize-y py-3`}
                                />
                            </Field>
                        </Section>

                        <Section index={2} title="Price & Stock">
                            <Field label="Price (USD)" name="price" required error={errors.price}>
                                <input {...bind("price")} type="number" min="0" step="any" placeholder="179" className={inputCls} />
                            </Field>
                            <Field label="Old price (USD)" name="oldPrice" error={errors.oldPrice} hint="Optional — shows a discount badge.">
                                <input {...bind("oldPrice")} type="number" min="0" step="any" placeholder="199" className={inputCls} />
                            </Field>
                            <Field label="Stock" name="stock" error={errors.stock}>
                                <input {...bind("stock")} type="number" min="0" step="1" className={inputCls} />
                            </Field>
                            <Field label="Warranty" name="warranty">
                                <input {...bind("warranty")} placeholder="2 Years" className={inputCls} />
                            </Field>
                        </Section>

                        <Section index={3} title="Images">
                            <Field label="Main image URL" name="image" required error={errors.image} full>
                                <input {...bind("image")} type="url" placeholder="https://..." className={inputCls} />
                            </Field>
                            <Field label="More images" name="images" error={errors.images} hint="One URL per line." full>
                                <textarea
                                    {...bind("images")}
                                    rows={3}
                                    placeholder={"https://...\nhttps://..."}
                                    className={`${inputCls} h-auto resize-y py-3`}
                                />
                            </Field>
                        </Section>

                        <Section index={4} title="Specifications">
                            <Field label="Radiator size" name="radiatorSize">
                                <select {...bind("radiatorSize")} className={`${inputCls} cursor-pointer`}>
                                    {["120mm", "240mm", "280mm", "360mm", "420mm"].map((v) => (
                                        <option key={v} value={v} className="bg-neutral-900">{v}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Fan count" name="fanCount">
                                <select {...bind("fanCount")} className={`${inputCls} cursor-pointer`}>
                                    {["1", "2", "3"].map((v) => (
                                        <option key={v} value={v} className="bg-neutral-900">{v} Fan{v !== "1" ? "s" : ""}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Fan size" name="fanSize">
                                <select {...bind("fanSize")} className={`${inputCls} cursor-pointer`}>
                                    {["80mm", "92mm", "120mm", "140mm"].map((v) => (
                                        <option key={v} value={v} className="bg-neutral-900">{v}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Fan RPM" name="fanRPM" hint="e.g. 500–2000 RPM">
                                <input {...bind("fanRPM")} placeholder="500-2000 RPM" className={inputCls} />
                            </Field>
                            <Field label="Pump speed" name="pumpSpeed" hint="e.g. 800–2800 RPM">
                                <input {...bind("pumpSpeed")} placeholder="800-2800 RPM" className={inputCls} />
                            </Field>
                            <Field label="Noise level" name="noise" hint="e.g. ≤36 dBa">
                                <input {...bind("noise")} placeholder="≤ 36 dBa" className={inputCls} />
                            </Field>
                            <Field label="Socket support" name="socketSupport" full>
                                <input {...bind("socketSupport")} placeholder="LGA1700, AM5, AM4, LGA1200..." className={inputCls} />
                            </Field>
                            <Field label="Tubing length" name="tubingLength">
                                <input {...bind("tubingLength")} placeholder="380mm" className={inputCls} />
                            </Field>
                        </Section>

                        <Section index={5} title="Options">
                            <Toggle
                                label="RGB Lighting"
                                hint="Includes addressable RGB on pump/fans"
                                checked={form.rgbLighting}
                                onChange={(v) => setForm((p) => ({ ...p, rgbLighting: v }))}
                            />
                            <Toggle
                                label="Featured"
                                hint="Show on the home page"
                                checked={form.isFeatured}
                                onChange={(v) => setForm((p) => ({ ...p, isFeatured: v }))}
                            />
                        </Section>

                        {/* Action bar */}
                        <div className="sticky bottom-0 border-t border-white/10 bg-[#09090b]/90 py-4 backdrop-blur-xl">
                            {message && (
                                <p
                                    role="status"
                                    className={`mb-3 border-l-2 px-4 py-2.5 text-sm ${message.type === "success"
                                            ? "border-[#D9FF00] bg-[#D9FF00]/10 text-[#D9FF00]"
                                            : "border-red-400 bg-red-500/10 text-red-300"
                                        }`}
                                >
                                    {message.text}
                                </p>
                            )}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    disabled={loading}
                                    className="shrink-0 border border-white/20 px-6 py-3 font-bebas text-xl text-white/80 transition-colors hover:border-white hover:text-white disabled:opacity-40"
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="min-w-0 flex-1 bg-[#D9FF00] py-3 font-bebas text-2xl tracking-wide text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Add Liquid Cooler"}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* ═════ LIVE PREVIEW ═════ */}
                    <aside className="min-w-0 @4xl:sticky @4xl:top-6 @4xl:self-start" aria-label="Live preview">
                        <p className="mb-3 text-sm text-white/50">Live preview</p>
                        <div style={{ clipPath: CHAMFER }} className="bg-neutral-900 ring-1 ring-inset ring-white/10">
                            <div className="relative aspect-[4/3] overflow-hidden bg-neutral-800">
                                {form.image && isUrl(form.image.trim()) && !imgFailed ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={form.image.trim()}
                                        alt=""
                                        onError={() => setImgFailed(true)}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-white/30">
                                        {imgFailed ? "Image could not be loaded" : "Image preview"}
                                    </div>
                                )}
                                <div className="absolute left-4 top-4 flex gap-2">
                                    {discount > 0 && (
                                        <span className="bg-[#D9FF00] px-3 py-1 font-bebas text-base text-black">-{discount}%</span>
                                    )}
                                    {form.isFeatured && (
                                        <span className="bg-white px-3 py-1 font-bebas text-base text-black">Featured</span>
                                    )}
                                    {form.rgbLighting && (
                                        <span className="bg-purple-500 px-3 py-1 font-bebas text-base text-white">RGB</span>
                                    )}
                                </div>
                            </div>

                            <div className="p-5">
                                <p className="text-sm text-[#D9FF00]">{form.brand || "Brand"}</p>
                                <h3 className="mt-1 line-clamp-2 font-bebas text-3xl leading-tight text-white">
                                    {form.name || "Product name"}
                                </h3>
                                <div className="mt-3 flex items-baseline gap-3">
                                    <span className="font-bebas text-4xl text-white">${price || 0}</span>
                                    {discount > 0 && <span className="text-white/35 line-through">${oldPrice}</span>}
                                </div>
                                <dl className="mt-5 divide-y divide-white/10 border-t border-white/10 text-sm">
                                    {[
                                        ["Radiator", form.radiatorSize],
                                        ["Fans", form.fanCount ? `${form.fanCount}x ${form.fanSize}` : ""],
                                        ["Fan RPM", form.fanRPM],
                                        ["Pump", form.pumpSpeed],
                                        ["Noise", form.noise],
                                        ["Sockets", form.socketSupport],
                                    ]
                                        .filter(([, v]) => v)
                                        .map(([k, v]) => (
                                            <div key={k} className="flex justify-between gap-4 py-2">
                                                <dt className="text-white/45">{k}</dt>
                                                <dd className="text-right text-white/85">{v}</dd>
                                            </div>
                                        ))}
                                </dl>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default LiquidCoolerForm;
