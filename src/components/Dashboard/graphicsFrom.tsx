"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type GraphicsType = "Graphics Card";

interface GraphicsFormProps {
  type?: GraphicsType;
}

interface FormState {
  name: string;
  brand: string;
  model: string;
  price: string;
  oldPrice: string;
  stock: string;
  image: string;
  images: string; // ek line-e ekta URL
  description: string;
  vramSize: string;
  vramType: string;
  coreClock: string;
  boostClock: string;
  powerConnectors: string;
  displayOutputs: string;
  port: string;
  dlss: string;
  rayTracing: boolean;
  isFeatured: boolean;
}

type StrKey = Exclude<keyof FormState, "rayTracing" | "isFeatured">;
type Errors = Partial<Record<StrKey, string>>;

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/graphics`;
const CHAMFER =
  "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))";

const getInitialState = (): FormState => ({
  name: "",
  brand: "",
  model: "",
  price: "",
  oldPrice: "",
  stock: "10",
  image: "",
  images: "",
  description: "",
  vramSize: "",
  vramType: "GDDR6",
  coreClock: "",
  boostClock: "",
  powerConnectors: "",
  displayOutputs: "",
  port: "",
  dlss: "None",
  rayTracing: true,
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

const num = (v: string) => (v.trim() === "" ? undefined : Number(v));

// min-w-0 => grid/flex child-er bhetore input ar shrink korte pare
const inputCls =
  "h-11 w-full min-w-0 bg-white/[0.04] px-4 text-base text-white outline-none ring-1 ring-inset ring-white/10 transition placeholder:text-white/30 focus:bg-white/[0.07] focus:ring-indigo-400 aria-[invalid=true]:ring-red-400";

/* ───────── chhoto reusable part (component-er baire, tai type korle focus hare na) ───────── */
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
      <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-indigo-500 text-lg">
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
      {required && <span className="text-indigo-300"> *</span>}
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
    className={`flex min-w-0 items-center justify-between gap-4 p-4 text-left ring-1 ring-inset transition-colors ${
      checked ? "bg-indigo-500/10 ring-indigo-500/60" : "bg-white/[0.03] ring-white/10 hover:ring-white/25"
    }`}
  >
    <span className="min-w-0">
      <span className="block font-bebas text-xl text-white">{label}</span>
      <span className="block text-sm text-white/45">{hint}</span>
    </span>
    <span className={`relative h-6 w-11 shrink-0 transition-colors ${checked ? "bg-indigo-500" : "bg-white/20"}`}>
      <span
        className={`absolute top-0.5 h-5 w-5 bg-white transition-all ${checked ? "left-[22px]" : "left-0.5"}`}
      />
    </span>
  </button>
);

/* ───────── main ───────── */
const GraphicsForm = ({ type = "Graphics Card" }: GraphicsFormProps) => {
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
    value: form[name],
    onChange: handleChange,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  const validate = (): Errors => {
    const e: Errors = {};
    const price = Number(form.price);
    const oldPrice = Number(form.oldPrice);
    const stock = Number(form.stock);

    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.brand.trim()) e.brand = "Brand is required";
    if (!form.price || !(price > 0)) e.price = "Enter a price greater than 0";
    if (form.oldPrice && !(oldPrice >= price)) e.oldPrice = "Old price must be higher than the current price";
    if (form.stock === "" || !Number.isInteger(stock) || stock < 0) e.stock = "Enter a whole number, 0 or more";
    if (!isUrl(form.image.trim())) e.image = "Enter a valid image URL (https://...)";
    const extra = form.images.split("\n").map((s) => s.trim()).filter(Boolean);
    if (extra.some((u) => !isUrl(u))) e.images = "Every line must be a valid URL";
    if (!form.description.trim()) e.description = "Description is required";
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
      brand: form.brand.trim(),
      model: form.model.trim(),
      price: Number(form.price),
      oldPrice: num(form.oldPrice),
      stock: Number(form.stock),
      image: form.image.trim(),
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      description: form.description.trim(),
      vramSize: num(form.vramSize),
      vramType: form.vramType,
      coreClock: num(form.coreClock),
      boostClock: num(form.boostClock),
      powerConnectors: form.powerConnectors.trim(),
      displayOutputs: form.displayOutputs.trim(),
      port: form.port.trim(),
      dlss: form.dlss,
      rayTracing: form.rayTracing,
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
        setMessage({ type: "success", text: "Product added. Redirecting to the dashboard..." });
        redirectTimer.current = setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        const body = await response.json().catch(() => null);
        setMessage({
          type: "error",
          text: body?.message || body?.error || `Server rejected the request (${response.status}).`,
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

  /* ── live preview-er value ── */
  const price = Number(form.price) || 0;
  const oldPrice = Number(form.oldPrice) || 0;
  const stock = Number(form.stock) || 0;
  const discount = oldPrice > price && price > 0 ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const previewSpecs: [string, string][] = [
    ["VRAM", [form.vramSize && `${form.vramSize} GB`, form.vramType].filter(Boolean).join(" ")],
    ["Core clock", form.coreClock && `${form.coreClock} MHz`],
    ["Boost clock", form.boostClock && `${form.boostClock} MHz`],
    ["Ray tracing", form.rayTracing ? "Yes" : "No"],
    ["Upscaling", form.dlss !== "None" ? form.dlss : ""],
  ].filter(([, v]) => v) as [string, string][];

  return (
    // @container => responsive class-gulo viewport na, ei wrapper-er width dhore kaj korbe
    <div className="@container w-full py-2">
      <div className="mx-auto w-full max-w-[1300px]">
        <header className="mb-8 border-b border-white/10 pb-6">
          <p className="mb-3 text-sm text-white/50">Dashboard / Products</p>
          <h2 className="font-space text-[clamp(32px,6vw,72px)] font-extrabold uppercase italic leading-[0.9] tracking-tighter text-white">
            New{" "}
            <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.5)]">{type}</span>
          </h2>
        </header>

        <div className="grid gap-8 @4xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* ═════ FORM ═════ */}
          <form onSubmit={handleSubmit} noValidate className="flex min-w-0 flex-col gap-5">
            <Section index={1} title="Basics">
              <Field label="Product name" name="name" required error={errors.name} full>
                <input {...bind("name")} placeholder="ASUS TUF Gaming GeForce RTX 4070 Super" className={inputCls} />
              </Field>
              <Field label="Brand" name="brand" required error={errors.brand}>
                <input {...bind("brand")} placeholder="ASUS" className={inputCls} />
              </Field>
              <Field label="Model" name="model">
                <input {...bind("model")} placeholder="TUF-RTX4070S-O12G" className={inputCls} />
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

            <Section index={2} title="Price and stock">
              <Field label="Price (USD)" name="price" required error={errors.price}>
                <input {...bind("price")} type="number" min="0" step="any" placeholder="599" className={inputCls} />
              </Field>
              <Field
                label="Old price (USD)"
                name="oldPrice"
                error={errors.oldPrice}
                hint="Optional. Shows a discount badge."
              >
                <input {...bind("oldPrice")} type="number" min="0" step="any" placeholder="649" className={inputCls} />
              </Field>
              <Field label="Stock" name="stock" required error={errors.stock}>
                <input {...bind("stock")} type="number" min="0" step="1" className={inputCls} />
              </Field>
            </Section>

            <Section index={3} title="Images">
              <Field label="Main image URL" name="image" required error={errors.image} full>
                <input {...bind("image")} type="url" placeholder="https://..." className={inputCls} />
              </Field>
              <Field
                label="More images"
                name="images"
                error={errors.images}
                hint="One URL per line."
                full
              >
                <textarea
                  {...bind("images")}
                  rows={3}
                  placeholder={"https://...\nhttps://..."}
                  className={`${inputCls} h-auto resize-y py-3`}
                />
              </Field>
            </Section>

            <Section index={4} title="Specifications">
              <Field label="VRAM size (GB)" name="vramSize">
                <input {...bind("vramSize")} type="number" min="0" placeholder="12" className={inputCls} />
              </Field>
              <Field label="VRAM type" name="vramType">
                <select {...bind("vramType")} className={`${inputCls} cursor-pointer`}>
                  {["GDDR5", "GDDR6", "GDDR6X", "GDDR7", "HBM2", "HBM3"].map((v) => (
                    <option key={v} value={v} className="bg-neutral-900">
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Core clock (MHz)" name="coreClock">
                <input {...bind("coreClock")} type="number" min="0" placeholder="1980" className={inputCls} />
              </Field>
              <Field label="Boost clock (MHz)" name="boostClock">
                <input {...bind("boostClock")} type="number" min="0" placeholder="2565" className={inputCls} />
              </Field>
              <Field label="Power connectors" name="powerConnectors">
                <input {...bind("powerConnectors")} placeholder="1 x 16-pin" className={inputCls} />
              </Field>
              <Field label="Port / interface" name="port">
                <input {...bind("port")} placeholder="PCIe 4.0 x16" className={inputCls} />
              </Field>
              <Field label="Display outputs" name="displayOutputs" full>
                <input
                  {...bind("displayOutputs")}
                  placeholder="3 x DisplayPort 1.4a, 1 x HDMI 2.1"
                  className={inputCls}
                />
              </Field>
              <Field label="Upscaling (DLSS / FSR)" name="dlss">
                <select {...bind("dlss")} className={`${inputCls} cursor-pointer`}>
                  {["None", "DLSS 3", "DLSS 3.5", "DLSS 4", "FSR 3", "FSR 4"].map((v) => (
                    <option key={v} value={v} className="bg-neutral-900">
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
            </Section>

            <Section index={5} title="Options">
              <Toggle
                label="Ray tracing"
                hint="Card supports hardware ray tracing"
                checked={form.rayTracing}
                onChange={(v) => setForm((p) => ({ ...p, rayTracing: v }))}
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
                  className={`mb-3 border-l-2 px-4 py-2.5 text-sm ${
                    message.type === "success"
                      ? "border-indigo-400 bg-indigo-500/10 text-indigo-200"
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
                  className="min-w-0 flex-1 bg-white py-3 font-bebas text-2xl tracking-wide text-black transition-colors hover:bg-indigo-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Saving..." : `Add ${type.toLowerCase()}`}
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
                    <span className="bg-indigo-500 px-3 py-1 font-bebas text-base text-white">-{discount}%</span>
                  )}
                  {form.isFeatured && (
                    <span className="bg-white px-3 py-1 font-bebas text-base text-black">Featured</span>
                  )}
                </div>
                {stock <= 5 && form.stock !== "" && (
                  <span className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 text-sm text-white">
                    {stock === 0 ? "Sold out" : `Only ${stock} left`}
                  </span>
                )}
              </div>

              <div className="p-5">
                <p className="text-sm text-indigo-300">
                  {[form.brand, form.model].filter(Boolean).join(" / ") || "Brand / model"}
                </p>
                <h3 className="mt-1 line-clamp-2 font-bebas text-3xl leading-tight text-white">
                  {form.name || "Product name"}
                </h3>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-bebas text-4xl text-white">${price || 0}</span>
                  {discount > 0 && <span className="text-white/35 line-through">${oldPrice}</span>}
                </div>

                {previewSpecs.length > 0 && (
                  <dl className="mt-5 divide-y divide-white/10 border-t border-white/10 text-sm">
                    {previewSpecs.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 py-2">
                        <dt className="text-white/45">{k}</dt>
                        <dd className="text-right text-white/85">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default GraphicsForm;