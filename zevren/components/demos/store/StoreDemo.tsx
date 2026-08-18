"use client";

import Image from "next/image";

import { IMAGES } from "@/lib/assets";

import { useMemo, useState } from "react";
import {
  PRODUCTS,
  STORE_CATEGORIES,
  type Product,
} from "@/lib/demos/store-data";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

interface CartLine {
  product: Product;
  variantId: string;
  qty: number;
}

type View = "catalog" | "product" | "checkout" | "confirmed";

interface CustomerForm {
  name: string;
  email: string;
  address: string;
  city: string;
}

const EMPTY_CUSTOMER: CustomerForm = { name: "", email: "", address: "", city: "" };

function lineKey(productId: string, variantId: string) {
  return `${productId}__${variantId}`;
}

/**
 * Nordwave, the audio store concept.
 *
 * Light Nordic direction on purpose: the surrounding site is dark navy, so
 * the shop reads as its own brand rather than a re-skin of ZEVREN. Ice
 * surfaces, one ink, one blue, and the crafted studio renders carrying every
 * page. The interaction flow (catalogue, product, cart, checkout) is
 * unchanged from before the redesign.
 */

const INK = "#10151E";
const ACCENT = "#2E55CE";

interface StoreDemoProps {
  dict: Dictionary["demos"]["store"];
  common: Dictionary["demoCommon"];
}

export function StoreDemo({ dict, common }: StoreDemoProps) {
  const [view, setView] = useState<View>("catalog");
  const [category, setCategory] = useState("All");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [activeVariant, setActiveVariant] = useState<string | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [customer, setCustomer] = useState<CustomerForm>(EMPTY_CUSTOMER);
  const [errors, setErrors] = useState<Partial<CustomerForm>>({});

  const filtered = useMemo(
    () =>
      category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category),
    [category]
  );

  const cartCount = cart.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = cart.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  function openProduct(p: Product) {
    setActiveProduct(p);
    setActiveVariant(p.variants[0]?.id ?? null);
    setView("product");
  }

  function addToCart() {
    if (!activeProduct || !activeVariant) return;
    setCart((prev) => {
      const key = lineKey(activeProduct.id, activeVariant);
      const existing = prev.find((l) => lineKey(l.product.id, l.variantId) === key);
      if (existing) {
        return prev.map((l) =>
          lineKey(l.product.id, l.variantId) === key ? { ...l, qty: l.qty + 1 } : l
        );
      }
      return [...prev, { product: activeProduct, variantId: activeVariant, qty: 1 }];
    });
    setCartOpen(true);
  }

  function changeQty(key: string, delta: number) {
    setCart((prev) =>
      prev
        .map((l) =>
          lineKey(l.product.id, l.variantId) === key
            ? { ...l, qty: Math.max(1, l.qty + delta) }
            : l
        )
        .filter((l) => l.qty > 0)
    );
  }

  function removeLine(key: string) {
    setCart((prev) => prev.filter((l) => lineKey(l.product.id, l.variantId) !== key));
  }

  function handleCheckoutSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors: Partial<CustomerForm> = {};
    if (customer.name.trim().length < 2) nextErrors.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(customer.email)) nextErrors.email = "Enter a valid email address.";
    if (customer.address.trim().length < 3) nextErrors.address = "Enter your address.";
    if (customer.city.trim().length < 2) nextErrors.city = "Enter your city.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setView("confirmed");
      setCart([]);
      setCartOpen(false);
    }
  }

  function backToCatalog() {
    setView("catalog");
    setActiveProduct(null);
    setCustomer(EMPTY_CUSTOMER);
    setErrors({});
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-[#2E55CE]";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#F5F7FA] text-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={backToCatalog}
          className="font-heading text-lg font-bold tracking-[0.08em]"
          style={{ color: INK }}
        >
          NORD<span className="font-light" style={{ color: ACCENT }}>WAVE</span>
        </button>
        <div className="hidden items-center gap-6 text-sm text-slate-500 sm:flex">
          {/* Driven by the catalogue rather than hardcoded, so the header can
              never advertise a category the shop does not stock. */}
          {STORE_CATEGORIES.filter((c) => c !== "All").map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-700 transition-colors hover:border-[#2E55CE] hover:text-[#2E55CE]"
        >
          {dict.cart}
          {cartCount > 0 && (
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-white"
              style={{ backgroundColor: ACCENT }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </nav>

      {view === "catalog" && (
        <>
          {/* Hero: typography left, the flagship render right. */}
          <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white to-[#EAEFF5]">
            <div className="grid items-center gap-2 px-5 py-10 sm:grid-cols-[1.1fr_0.9fr] sm:gap-6 sm:px-8 sm:py-12">
              <div>
                <span
                  className="text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ color: ACCENT }}
                >
                  {dict.newSeason}
                </span>
                <h2
                  className="mt-4 max-w-md font-heading text-3xl font-bold leading-[1.05] tracking-[-0.02em] sm:text-5xl"
                  style={{ color: INK }}
                >
                  {dict.heroHeading}
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
                  {dict.heroSubtitle}
                </p>
                <button
                  type="button"
                  onClick={() => openProduct(PRODUCTS[0]!)}
                  className="mt-6 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85"
                  style={{ backgroundColor: INK }}
                >
                  Arc One &rarr;
                </button>
              </div>
              <div className="relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-[340px]">
                <Image
                  src={IMAGES["nordwave-arc-one"].src}
                  alt="Nordwave Arc One"
                  fill
                  priority
                  sizes="(max-width: 640px) 280px, 340px"
                  placeholder="blur"
                  blurDataURL={IMAGES["nordwave-arc-one"].blurDataURL}
                  className="rounded-2xl object-cover shadow-[0_24px_60px_-24px_rgba(16,21,30,0.35)]"
                />
              </div>
            </div>
          </section>

          {/* Categories + product grid */}
          <section className="px-5 py-10 sm:px-8">
            <div className="flex flex-wrap gap-2">
              {STORE_CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    category === c
                      ? "border-transparent text-white"
                      : "border-slate-300 text-slate-600 hover:border-[#2E55CE] hover:text-[#2E55CE]"
                  }`}
                  style={category === c ? { backgroundColor: INK } : undefined}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => openProduct(p)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_44px_-18px_rgba(16,21,30,0.25)]"
                >
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <Image
                      src={IMAGES[p.image].src}
                      alt={p.name}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, 33vw"
                      placeholder="blur"
                      blurDataURL={IMAGES[p.image].blurDataURL}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 items-end justify-between gap-2 p-4">
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {p.category}
                      </span>
                      <span className="font-heading text-base font-bold" style={{ color: INK }}>
                        {p.name}
                      </span>
                    </span>
                    <span className="text-sm font-semibold" style={{ color: ACCENT }}>
                      &euro;{p.price}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {view === "product" && activeProduct && (
        <section className="px-5 py-10 sm:px-8">
          <button
            type="button"
            onClick={backToCatalog}
            className="mb-6 text-xs font-medium text-slate-500 hover:text-[#2E55CE]"
          >
            &larr; {dict.backToShop}
          </button>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200">
              <Image
                src={IMAGES[activeProduct.image].src}
                alt={activeProduct.name}
                fill
                sizes="(max-width: 640px) 100vw, 45vw"
                placeholder="blur"
                blurDataURL={IMAGES[activeProduct.image].blurDataURL}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {activeProduct.category}
              </span>
              <h2 className="font-heading text-3xl font-bold" style={{ color: INK }}>
                {activeProduct.name}
              </h2>
              <span className="text-xl font-semibold" style={{ color: ACCENT }}>
                &euro;{activeProduct.price}
              </span>
              <p className="text-sm leading-relaxed text-slate-600">
                {activeProduct.description}
              </p>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {activeProduct.variantLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeProduct.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setActiveVariant(v.id)}
                      className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                        activeVariant === v.id
                          ? "border-transparent text-white"
                          : "border-slate-300 text-slate-600 hover:border-[#2E55CE] hover:text-[#2E55CE]"
                      }`}
                      style={activeVariant === v.id ? { backgroundColor: INK } : undefined}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={addToCart}
                className="mt-2 w-fit rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85"
                style={{ backgroundColor: ACCENT }}
              >
                {dict.addToCart}
              </button>
            </div>
          </div>
        </section>
      )}

      {view === "checkout" && (
        <section className="px-5 py-10 sm:px-8">
          <button
            type="button"
            onClick={() => setView("catalog")}
            className="mb-6 text-xs font-medium text-slate-500 hover:text-[#2E55CE]"
          >
            &larr; {dict.backToShop}
          </button>
          <h2 className="font-heading text-2xl font-bold" style={{ color: INK }}>
            {dict.checkoutHeading}
          </h2>
          <div className="mt-6 grid gap-10 sm:grid-cols-[1.2fr_1fr]">
            <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  {dict.fullName}
                </label>
                <input
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className={inputClass}
                  placeholder={common.namePlaceholder}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  {common.email}
                </label>
                <input
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className={inputClass}
                  placeholder={common.emailPlaceholder}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  {dict.address}
                </label>
                <input
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className={inputClass}
                  placeholder={dict.addressPlaceholder}
                />
                {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  {dict.city}
                </label>
                <input
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className={inputClass}
                  placeholder="Maastricht"
                />
                {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
              </div>
              <button
                type="submit"
                className="mt-2 w-fit rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85"
                style={{ backgroundColor: ACCENT }}
              >
                {dict.placeOrder}
              </button>
            </form>
            <div className="flex h-fit flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {dict.orderSummary}
              </p>
              {cart.map((l) => (
                <div
                  key={lineKey(l.product.id, l.variantId)}
                  className="flex items-center justify-between text-sm text-slate-600"
                >
                  <span>
                    {l.product.name} &times; {l.qty}
                  </span>
                  <span>&euro;{l.product.price * l.qty}</span>
                </div>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-3 text-sm font-semibold" style={{ color: INK }}>
                <span>{dict.subtotal}</span>
                <span>&euro;{subtotal}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {view === "confirmed" && (
        <section className="flex flex-col items-center gap-4 px-5 py-20 text-center sm:px-8">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: "#E3EAFB", color: ACCENT }}
          >
            <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-xl font-bold" style={{ color: INK }}>{dict.orderConfirmedTitle}</p>
          <p className="max-w-sm text-sm leading-relaxed text-slate-600">
            {dict.orderConfirmedBody}
          </p>
          <p className="text-sm text-slate-500">
            {dict.orderNumber} <span className="font-semibold" style={{ color: INK }}>#ZEV-1024</span>
          </p>
          <button
            type="button"
            onClick={backToCatalog}
            className="mt-2 rounded-full border border-slate-300 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-700 transition-colors hover:border-[#2E55CE] hover:text-[#2E55CE]"
          >
            {dict.backToShop}
          </button>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-5 py-6 text-center text-xs text-slate-500 sm:px-8">
        Nordwave &middot; {common.footerTagline}
      </footer>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="absolute inset-0 z-10 flex justify-end bg-slate-900/40">
          <div className="flex h-full w-full max-w-sm flex-col bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-wider" style={{ color: INK }}>
                {dict.yourCart}
              </p>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="text-slate-400 hover:text-slate-900"
                aria-label="Close cart"
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="mt-8 text-sm text-slate-500">{dict.cartEmpty}</p>
            ) : (
              <div className="mt-6 flex flex-1 flex-col gap-4 overflow-y-auto">
                {cart.map((l) => {
                  const key = lineKey(l.product.id, l.variantId);
                  const variant = l.product.variants.find((v) => v.id === l.variantId);
                  return (
                    <div key={key} className="flex gap-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200">
                        <Image
                          src={IMAGES[l.product.image].src}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <span className="text-sm font-semibold" style={{ color: INK }}>
                          {l.product.name}
                        </span>
                        <span className="text-xs text-slate-500">{variant?.label}</span>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => changeQty(key, -1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-xs text-slate-600 hover:border-[#2E55CE] hover:text-[#2E55CE]"
                          >
                            -
                          </button>
                          <span className="text-xs text-slate-700">{l.qty}</span>
                          <button
                            type="button"
                            onClick={() => changeQty(key, 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-xs text-slate-600 hover:border-[#2E55CE] hover:text-[#2E55CE]"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => removeLine(key)}
                            className="ml-2 text-xs text-slate-400 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: INK }}>
                        &euro;{l.product.price * l.qty}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between text-sm font-semibold" style={{ color: INK }}>
                <span>{dict.subtotal}</span>
                <span>&euro;{subtotal}</span>
              </div>
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => {
                  setCartOpen(false);
                  setView("checkout");
                }}
                className="mt-4 w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ backgroundColor: ACCENT }}
              >
                {dict.continueToCheckout}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
