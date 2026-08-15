"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ELLEZONE_FEATURES,
  ELLEZONE_PRODUCTS,
  type EllezoneProduct,
} from "@/lib/demos/ellezone-data";

interface CartLine {
  product: EllezoneProduct;
  colorId: string;
  qty: number;
}

type View = "home" | "shop" | "product" | "wishlist" | "checkout" | "confirmed" | "account";

interface CustomerForm {
  name: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
}

const EMPTY_CUSTOMER: CustomerForm = {
  name: "",
  email: "",
  address: "",
  postalCode: "",
  city: "",
  country: "Netherlands",
};

const SHIPPING_COST = 4.95;
const FREE_SHIPPING_THRESHOLD = 35;

function lineKey(productId: string, colorId: string) {
  return `${productId}__${colorId}`;
}

export function EllezoneDemo() {
  const [view, setView] = useState<View>("home");
  const [query, setQuery] = useState("");
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [activeProduct, setActiveProduct] = useState<EllezoneProduct | null>(null);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [customer, setCustomer] = useState<CustomerForm>(EMPTY_CUSTOMER);
  const [errors, setErrors] = useState<Partial<CustomerForm>>({});
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [orderHistory, setOrderHistory] = useState<
    { number: string; items: string; total: number }[]
  >([]);

  const filteredProducts = useMemo(() => {
    return ELLEZONE_PRODUCTS.filter((p) => {
      if (colorFilter !== "all" && !p.variants.some((v) => v.id === colorFilter)) {
        return false;
      }
      if (query.trim() && !p.name.toLowerCase().includes(query.trim().toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [query, colorFilter]);

  const cartCount = cart.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = cart.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  function openProduct(p: EllezoneProduct) {
    setActiveProduct(p);
    setActiveColor(p.variants[0]?.id ?? null);
    setView("product");
  }

  function addToCart() {
    if (!activeProduct || !activeColor) return;
    setCart((prev) => {
      const key = lineKey(activeProduct.id, activeColor);
      const existing = prev.find((l) => lineKey(l.product.id, l.colorId) === key);
      if (existing) {
        return prev.map((l) =>
          lineKey(l.product.id, l.colorId) === key ? { ...l, qty: l.qty + 1 } : l
        );
      }
      return [...prev, { product: activeProduct, colorId: activeColor, qty: 1 }];
    });
    setCartOpen(true);
  }

  function changeQty(key: string, delta: number) {
    setCart((prev) =>
      prev
        .map((l) =>
          lineKey(l.product.id, l.colorId) === key
            ? { ...l, qty: Math.max(1, l.qty + delta) }
            : l
        )
        .filter((l) => l.qty > 0)
    );
  }

  function removeLine(key: string) {
    setCart((prev) => prev.filter((l) => lineKey(l.product.id, l.colorId) !== key));
  }

  function toggleWishlist(productId: string) {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }

  function handleCheckoutSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors: Partial<CustomerForm> = {};
    if (customer.name.trim().length < 2) nextErrors.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(customer.email)) nextErrors.email = "Enter a valid email address.";
    if (customer.address.trim().length < 3) nextErrors.address = "Enter your address.";
    if (customer.postalCode.trim().length < 4) nextErrors.postalCode = "Enter a valid postal code.";
    if (customer.city.trim().length < 2) nextErrors.city = "Enter your city.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      const number = `#ELZ-${1000 + orderHistory.length + 1}`;
      setOrderNumber(number);
      setOrderHistory((prev) => [
        ...prev,
        {
          number,
          items: cart.map((l) => `${l.product.name} x${l.qty}`).join(", "),
          total,
        },
      ]);
      setCart([]);
      setCartOpen(false);
      setView("confirmed");
    }
  }

  function backToShop() {
    setView("shop");
    setActiveProduct(null);
    setCustomer(EMPTY_CUSTOMER);
    setErrors({});
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-200 bg-white text-stone-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-violet-100 bg-white/95 px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={() => setView("home")}
          className="flex items-center gap-2"
        >
          <span className="font-heading text-lg font-semibold tracking-wide text-violet-700">
            ElleZone
          </span>
        </button>
        <div className="hidden items-center gap-6 text-sm text-stone-500 sm:flex">
          <button type="button" onClick={() => setView("shop")} className="hover:text-violet-700">
            Shop
          </button>
          <button type="button" onClick={() => setView("wishlist")} className="hover:text-violet-700">
            Wishlist ({wishlist.length})
          </button>
          <button type="button" onClick={() => setView("account")} className="hover:text-violet-700">
            My Account
          </button>
        </div>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 rounded-full border border-violet-200 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-violet-700 transition-colors hover:border-violet-400"
        >
          Cart
          {cartCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-semibold text-white">
              {cartCount}
            </span>
          )}
        </button>
      </nav>

      {view === "home" && (
        <>
          <section className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-br from-violet-50 via-white to-rose-50 px-5 py-14 sm:px-8 sm:py-20">
            <div className="grid items-center gap-10 sm:grid-cols-2">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-600">
                  Power of Possibility
                </span>
                <h2 className="mt-4 max-w-md font-heading text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl">
                  Make cooking easier, one jar at a time.
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-600">
                  A portion-control glass spice jar with a built-in scoop.
                  BPA-free, food-safe, and made to keep your spices within
                  reach.
                </p>
                <button
                  type="button"
                  onClick={() => setView("shop")}
                  className="mt-6 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
                >
                  Shop the spice jar
                </button>
              </div>
              <div className="relative h-56 overflow-hidden rounded-2xl sm:h-72">
                <Image
                  src="/ellezone/spice-jar-lifestyle.jpg"
                  alt="ElleZone spice jar on a kitchen counter"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 480px"
                />
              </div>
            </div>
          </section>

          <section className="border-b border-violet-100 px-5 py-12 sm:px-8">
            <div className="grid gap-6 sm:grid-cols-3">
              {ELLEZONE_FEATURES.map((f) => (
                <div key={f.title} className="rounded-xl border border-violet-100 bg-violet-50/40 p-5">
                  <p className="text-sm font-semibold text-stone-900">{f.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{f.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="px-5 py-12 sm:px-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-600">
              Shop by pack
            </h3>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {ELLEZONE_PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => openProduct(p)}
                  className="group flex flex-col overflow-hidden rounded-xl border border-violet-100 bg-white text-left transition-shadow hover:shadow-lg"
                >
                  <div className="relative h-40">
                    <Image
                      src="/ellezone/spice-jar-product-box.jpg"
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 320px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 p-4">
                    <span className="text-sm font-medium text-stone-900">{p.name}</span>
                    <span className="text-xs text-stone-500">{p.tagline}</span>
                    <span className="mt-1 text-sm font-semibold text-violet-700">
                      &euro;{p.price.toFixed(2)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {view === "shop" && (
        <section className="px-5 py-12 sm:px-8">
          <h2 className="font-heading text-2xl font-semibold text-stone-900">
            Kitchen Storage
          </h2>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="flex-1 rounded-md border border-violet-200 px-3 py-2 text-sm text-stone-900 outline-none focus:border-violet-500"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setColorFilter("all")}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                  colorFilter === "all"
                    ? "border-violet-600 bg-violet-600 text-white"
                    : "border-violet-200 text-stone-600 hover:border-violet-400"
                }`}
              >
                All colours
              </button>
              {["white", "charcoal"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColorFilter(c)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
                    colorFilter === c
                      ? "border-violet-600 bg-violet-600 text-white"
                      : "border-violet-200 text-stone-600 hover:border-violet-400"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-violet-100 bg-white transition-shadow hover:shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => toggleWishlist(p.id)}
                  aria-label={wishlist.includes(p.id) ? "Remove from wishlist" : "Add to wishlist"}
                  className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 ${
                    wishlist.includes(p.id) ? "text-rose-500" : "text-stone-400"
                  }`}
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill={wishlist.includes(p.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.6}>
                    <path d="M10 17s-6-4-6-8.5A3.5 3.5 0 0 1 10 6a3.5 3.5 0 0 1 6 2.5C16 13 10 17 10 17Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button type="button" onClick={() => openProduct(p)} className="relative h-40 text-left">
                  <Image
                    src="/ellezone/spice-jar-product-box.jpg"
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 320px"
                  />
                </button>
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <span className="text-sm font-medium text-stone-900">{p.name}</span>
                  <span className="text-xs text-stone-500">{p.tagline}</span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-semibold text-violet-700">
                      &euro;{p.price.toFixed(2)}
                    </span>
                    {p.compareAtPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        &euro;{p.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => openProduct(p)}
                    className="mt-2 w-fit text-xs font-semibold text-violet-700 hover:text-violet-600"
                  >
                    View product
                  </button>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <p className="col-span-full text-sm text-stone-500">
                No products match your search.
              </p>
            )}
          </div>
        </section>
      )}

      {view === "product" && activeProduct && (
        <section className="px-5 py-12 sm:px-8">
          <button
            type="button"
            onClick={backToShop}
            className="mb-6 text-xs font-medium text-stone-500 hover:text-violet-700"
          >
            &larr; Back to shop
          </button>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative col-span-2 h-56 overflow-hidden rounded-xl sm:h-72">
                <Image
                  src="/ellezone/spice-jar-product-box.jpg"
                  alt={activeProduct.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 480px"
                />
              </div>
              <div className="relative col-span-2 h-40 overflow-hidden rounded-xl">
                <Image
                  src="/ellezone/spice-jar-lifestyle.jpg"
                  alt={`${activeProduct.name} in a kitchen`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 480px"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                {activeProduct.jarCount === 1 ? "Single jar" : `${activeProduct.jarCount} jars`}
              </span>
              <h2 className="font-heading text-2xl font-semibold text-stone-900">
                {activeProduct.name}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-violet-700">
                  &euro;{activeProduct.price.toFixed(2)}
                </span>
                {activeProduct.compareAtPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    &euro;{activeProduct.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-stone-600">
                {activeProduct.description}
              </p>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Colour
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeProduct.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setActiveColor(v.id)}
                      className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                        activeColor === v.id
                          ? "border-violet-600 bg-violet-600 text-white"
                          : "border-violet-200 text-stone-600 hover:border-violet-400"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={addToCart}
                  className="rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(activeProduct.id)}
                  className={`rounded-full border px-6 py-3 text-sm font-semibold transition-colors ${
                    wishlist.includes(activeProduct.id)
                      ? "border-rose-300 text-rose-600"
                      : "border-violet-200 text-stone-600 hover:border-violet-400"
                  }`}
                >
                  {wishlist.includes(activeProduct.id) ? "Saved" : "Save to wishlist"}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {view === "wishlist" && (
        <section className="px-5 py-12 sm:px-8">
          <h2 className="font-heading text-2xl font-semibold text-stone-900">Wishlist</h2>
          {wishlist.length === 0 ? (
            <p className="mt-4 text-sm text-stone-500">
              Nothing saved yet. Browse the shop and tap the heart icon to save a product.
            </p>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {ELLEZONE_PRODUCTS.filter((p) => wishlist.includes(p.id)).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => openProduct(p)}
                  className="flex flex-col overflow-hidden rounded-xl border border-violet-100 bg-white text-left transition-shadow hover:shadow-lg"
                >
                  <div className="relative h-32">
                    <Image
                      src="/ellezone/spice-jar-product-box.jpg"
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <span className="text-sm font-medium text-stone-900">{p.name}</span>
                    <span className="text-sm font-semibold text-violet-700">
                      &euro;{p.price.toFixed(2)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {view === "account" && (
        <section className="px-5 py-12 sm:px-8">
          <h2 className="font-heading text-2xl font-semibold text-stone-900">My Account</h2>
          <p className="mt-2 text-xs text-stone-400">
            Demo account view, not connected to a real login system.
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Profile
              </h3>
              <div className="mt-3 flex flex-col gap-2 text-sm text-stone-600">
                <span>{customer.name || "No name saved yet"}</span>
                <span>{customer.email || "No email saved yet"}</span>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Order history
              </h3>
              {orderHistory.length === 0 ? (
                <p className="mt-3 text-sm text-stone-500">No orders yet.</p>
              ) : (
                <div className="mt-3 flex flex-col gap-3">
                  {orderHistory.map((order) => (
                    <div key={order.number} className="rounded-lg border border-violet-100 p-3 text-sm">
                      <p className="font-semibold text-stone-900">{order.number}</p>
                      <p className="text-stone-500">{order.items}</p>
                      <p className="text-stone-500">&euro;{order.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {view === "checkout" && (
        <section className="px-5 py-12 sm:px-8">
          <button
            type="button"
            onClick={() => setView("shop")}
            className="mb-6 text-xs font-medium text-stone-500 hover:text-violet-700"
          >
            &larr; Continue shopping
          </button>
          <h2 className="font-heading text-2xl font-semibold text-stone-900">Checkout</h2>
          <p className="mt-1 text-xs text-stone-400">
            This is a demo checkout. No payment is collected and no real card
            information should be entered.
          </p>
          <div className="mt-6 grid gap-10 sm:grid-cols-[1.2fr_1fr]">
            <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone-500">
                  Full name
                </label>
                <input
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full rounded-md border border-violet-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-violet-500"
                  placeholder="Jane Doe"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone-500">
                  Email address
                </label>
                <input
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full rounded-md border border-violet-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-violet-500"
                  placeholder="jane@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone-500">
                  Address
                </label>
                <input
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full rounded-md border border-violet-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-violet-500"
                  placeholder="Street and house number"
                />
                {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-500">
                    Postal code
                  </label>
                  <input
                    value={customer.postalCode}
                    onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                    className="w-full rounded-md border border-violet-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-violet-500"
                    placeholder="1234 AB"
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-xs text-red-600">{errors.postalCode}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-500">
                    City
                  </label>
                  <input
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full rounded-md border border-violet-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-violet-500"
                    placeholder="Maastricht"
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone-500">
                  Country
                </label>
                <select
                  value={customer.country}
                  onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                  className="w-full rounded-md border border-violet-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-violet-500"
                >
                  {["Netherlands", "Belgium", "Germany", "France", "Spain"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="mt-2 w-fit rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
              >
                Place order (demo)
              </button>
            </form>
            <div className="flex flex-col gap-3 rounded-xl border border-violet-100 bg-violet-50/30 p-5 h-fit">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Order summary
              </p>
              {cart.map((l) => (
                <div
                  key={lineKey(l.product.id, l.colorId)}
                  className="flex items-center justify-between text-sm text-stone-700"
                >
                  <span>
                    {l.product.name} &times; {l.qty}
                  </span>
                  <span>&euro;{(l.product.price * l.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-violet-100 pt-3 text-sm text-stone-700">
                <span>Subtotal</span>
                <span>&euro;{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-stone-700">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `€${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex items-center justify-between border-t border-violet-100 pt-3 text-sm font-semibold text-stone-900">
                <span>Total</span>
                <span>&euro;{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {view === "confirmed" && (
        <section className="flex flex-col items-center gap-4 px-5 py-20 text-center sm:px-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
            <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-xl font-semibold text-stone-900">Order confirmed</p>
          <p className="max-w-sm text-sm leading-relaxed text-stone-600">
            Thank you for your order. This was a demo checkout, no payment was
            taken.
          </p>
          {orderNumber && (
            <p className="text-sm text-stone-500">
              Order number: <span className="font-semibold text-stone-900">{orderNumber}</span>
            </p>
          )}
          <button
            type="button"
            onClick={backToShop}
            className="mt-2 rounded-full border border-violet-200 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-stone-700 transition-colors hover:border-violet-400"
          >
            Back to shop
          </button>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-violet-100 px-5 py-6 text-center text-xs text-stone-400 sm:px-8">
        ElleZone &middot; a website concept by ZEVREN
      </footer>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="absolute inset-0 z-10 flex justify-end bg-stone-900/40">
          <div className="flex h-full w-full max-w-sm flex-col bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wider text-stone-900">
                Your cart
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
              <p className="mt-8 text-sm text-stone-500">Your cart is empty.</p>
            ) : (
              <div className="mt-6 flex flex-1 flex-col gap-4 overflow-y-auto">
                {cart.map((l) => {
                  const key = lineKey(l.product.id, l.colorId);
                  const variant = l.product.variants.find((v) => v.id === l.colorId);
                  return (
                    <div key={key} className="flex gap-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src="/ellezone/spice-jar-product-box.jpg"
                          alt={l.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <span className="text-sm font-medium text-stone-900">{l.product.name}</span>
                        <span className="text-xs text-stone-500">{variant?.label}</span>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => changeQty(key, -1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-violet-200 text-xs text-stone-600 hover:border-violet-400"
                          >
                            -
                          </button>
                          <span className="text-xs text-stone-700">{l.qty}</span>
                          <button
                            type="button"
                            onClick={() => changeQty(key, 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-violet-200 text-xs text-stone-600 hover:border-violet-400"
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
                        &euro;{(l.product.price * l.qty).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 border-t border-violet-100 pt-4">
              <div className="flex items-center justify-between text-sm font-semibold text-stone-900">
                <span>Subtotal</span>
                <span>&euro;{subtotal.toFixed(2)}</span>
              </div>
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => {
                  setCartOpen(false);
                  setView("checkout");
                }}
                className="mt-4 w-full rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue to checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
