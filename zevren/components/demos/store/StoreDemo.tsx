"use client";

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

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-300 bg-stone-50 text-stone-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-stone-200 bg-stone-50/95 px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={backToCatalog}
          className="font-heading text-lg font-semibold tracking-wide text-stone-900"
        >
          MAREN <span className="font-normal text-orange-800">HOME</span>
        </button>
        <div className="hidden items-center gap-6 text-sm text-stone-500 sm:flex">
          <span>{dict.navShop}</span>
          <span>Lighting</span>
          <span>Textiles</span>
          <span>Kitchen</span>
        </div>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-700 transition-colors hover:border-orange-800/60"
        >
          {dict.cart}
          {cartCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-800 text-[10px] font-semibold text-white">
              {cartCount}
            </span>
          )}
        </button>
      </nav>

      {view === "catalog" && (
        <>
          {/* Hero */}
          <section className="border-b border-stone-200 bg-gradient-to-br from-stone-100 to-stone-50 px-5 py-14 sm:px-8 sm:py-20">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-800">
              {dict.newSeason}
            </span>
            <h2 className="mt-4 max-w-lg font-heading text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl">
              {dict.heroHeading}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-600">
              {dict.heroSubtitle}
            </p>
          </section>

          {/* Categories + product grid */}
          <section className="px-5 py-12 sm:px-8">
            <div className="flex flex-wrap gap-2">
              {STORE_CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                    category === c
                      ? "border-orange-800 bg-orange-800 text-white"
                      : "border-stone-300 text-stone-600 hover:border-orange-800/50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => openProduct(p)}
                  className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white text-left transition-shadow hover:shadow-lg"
                >
                  <div className={`h-36 bg-gradient-to-br ${p.swatch}`} />
                  <div className="flex flex-1 flex-col gap-1 p-4">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      {p.category}
                    </span>
                    <span className="text-sm font-medium text-stone-900">{p.name}</span>
                    <span className="mt-1 text-sm font-semibold text-orange-800">
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
        <section className="px-5 py-12 sm:px-8">
          <button
            type="button"
            onClick={backToCatalog}
            className="mb-6 text-xs font-medium text-stone-500 hover:text-orange-800"
          >
            &larr; {dict.backToShop}
          </button>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className={`h-64 rounded-xl bg-gradient-to-br sm:h-80 ${activeProduct.swatch}`} />
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                {activeProduct.category}
              </span>
              <h2 className="font-heading text-2xl font-semibold text-stone-900">
                {activeProduct.name}
              </h2>
              <span className="text-xl font-semibold text-orange-800">
                &euro;{activeProduct.price}
              </span>
              <p className="text-sm leading-relaxed text-stone-600">
                {activeProduct.description}
              </p>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  {activeProduct.variantLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeProduct.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setActiveVariant(v.id)}
                      className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                        activeVariant === v.id
                          ? "border-orange-800 bg-orange-800 text-white"
                          : "border-stone-300 text-stone-600 hover:border-orange-800/50"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={addToCart}
                className="mt-2 w-fit rounded-full bg-orange-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
              >
                {dict.addToCart}
              </button>
            </div>
          </div>
        </section>
      )}

      {view === "checkout" && (
        <section className="px-5 py-12 sm:px-8">
          <button
            type="button"
            onClick={() => setView("catalog")}
            className="mb-6 text-xs font-medium text-stone-500 hover:text-orange-800"
          >
            &larr; {dict.backToShop}
          </button>
          <h2 className="font-heading text-2xl font-semibold text-stone-900">{dict.checkoutHeading}</h2>
          <div className="mt-6 grid gap-10 sm:grid-cols-[1.2fr_1fr]">
            <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone-500">
                  {dict.fullName}
                </label>
                <input
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-orange-800"
                  placeholder={common.namePlaceholder}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone-500">
                  {common.email}
                </label>
                <input
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-orange-800"
                  placeholder={common.emailPlaceholder}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone-500">
                  {dict.address}
                </label>
                <input
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-orange-800"
                  placeholder={dict.addressPlaceholder}
                />
                {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone-500">
                  {dict.city}
                </label>
                <input
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-orange-800"
                  placeholder="Maastricht"
                />
                {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
              </div>
              <button
                type="submit"
                className="mt-2 w-fit rounded-full bg-orange-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
              >
                {dict.placeOrder}
              </button>
            </form>
            <div className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-5 h-fit">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                {dict.orderSummary}
              </p>
              {cart.map((l) => (
                <div
                  key={lineKey(l.product.id, l.variantId)}
                  className="flex items-center justify-between text-sm text-stone-700"
                >
                  <span>
                    {l.product.name} &times; {l.qty}
                  </span>
                  <span>&euro;{l.product.price * l.qty}</span>
                </div>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-stone-200 pt-3 text-sm font-semibold text-stone-900">
                <span>{dict.subtotal}</span>
                <span>&euro;{subtotal}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {view === "confirmed" && (
        <section className="flex flex-col items-center gap-4 px-5 py-20 text-center sm:px-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-800/10 text-orange-800">
            <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-xl font-semibold text-stone-900">{dict.orderConfirmedTitle}</p>
          <p className="max-w-sm text-sm leading-relaxed text-stone-600">
            {dict.orderConfirmedBody}
          </p>
          <p className="text-sm text-stone-500">
            {dict.orderNumber} <span className="font-semibold text-stone-900">#ZEV-1024</span>
          </p>
          <button
            type="button"
            onClick={backToCatalog}
            className="mt-2 rounded-full border border-stone-300 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-stone-700 transition-colors hover:border-orange-800/60"
          >
            {dict.backToShop}
          </button>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200 px-5 py-6 text-center text-xs text-stone-400 sm:px-8">
        Maren Home &middot; {common.footerTagline}
      </footer>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="absolute inset-0 z-10 flex justify-end bg-stone-900/40">
          <div className="flex h-full w-full max-w-sm flex-col bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wider text-stone-900">
                {dict.yourCart}
              </p>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="text-stone-400 hover:text-stone-900"
                aria-label="Close cart"
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="mt-8 text-sm text-stone-500">{dict.cartEmpty}</p>
            ) : (
              <div className="mt-6 flex flex-1 flex-col gap-4 overflow-y-auto">
                {cart.map((l) => {
                  const key = lineKey(l.product.id, l.variantId);
                  const variant = l.product.variants.find((v) => v.id === l.variantId);
                  return (
                    <div key={key} className="flex gap-3">
                      <div className={`h-16 w-16 shrink-0 rounded-lg bg-gradient-to-br ${l.product.swatch}`} />
                      <div className="flex flex-1 flex-col gap-1">
                        <span className="text-sm font-medium text-stone-900">{l.product.name}</span>
                        <span className="text-xs text-stone-500">{variant?.label}</span>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => changeQty(key, -1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-300 text-xs text-stone-600 hover:border-orange-800/60"
                          >
                            -
                          </button>
                          <span className="text-xs text-stone-700">{l.qty}</span>
                          <button
                            type="button"
                            onClick={() => changeQty(key, 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-300 text-xs text-stone-600 hover:border-orange-800/60"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => removeLine(key)}
                            className="ml-2 text-xs text-stone-400 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-stone-900">
                        &euro;{l.product.price * l.qty}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 border-t border-stone-200 pt-4">
              <div className="flex items-center justify-between text-sm font-semibold text-stone-900">
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
                className="mt-4 w-full rounded-full bg-orange-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
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
