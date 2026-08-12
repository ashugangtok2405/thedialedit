"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabasePublic } from "@/lib/supabasePublic";
import { getCart, updateCartQty, removeFromCart, subscribeToCart } from "@/lib/cart";
import { productImage } from "@/lib/placeholder";
import { formatINR, buildWhatsAppCheckoutUrl } from "@/lib/format";

export default function CartPage() {
  const [lineItems, setLineItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadCart() {
    const cart = getCart();
    if (!cart.length) {
      setLineItems([]);
      setLoading(false);
      return;
    }
    const ids = cart.map((i) => i.id);
    const { data } = await supabasePublic.from("products").select("*").in("id", ids);
    const items = cart
      .map((c) => {
        const product = (data || []).find((p) => p.id === c.id);
        if (!product) return null;
        return { product, qty: c.qty, lineTotal: product.price * c.qty };
      })
      .filter(Boolean);
    setLineItems(items);
    setLoading(false);
  }

  useEffect(() => {
    loadCart();
    return subscribeToCart(loadCart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = lineItems.reduce((sum, li) => sum + li.lineTotal, 0);

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p style={{ color: "var(--muted)" }}>Loading…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h2 style={{ marginTop: 0 }}>Your Cart</h2>
        {!lineItems.length ? (
          <div className="empty-state">
            Your cart is empty.{" "}
            <Link href="/shop" style={{ color: "var(--gold)" }}>
              Start shopping →
            </Link>
          </div>
        ) : (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((li) => (
                  <tr key={li.product.id}>
                    <td>
                      <div className="cart-item-info">
                        <img src={productImage(li.product)} alt={li.product.name} />
                        <div>
                          <div style={{ color: "var(--gold)", fontSize: 11, letterSpacing: 1 }}>{li.product.brand}</div>
                          <Link href={`/product/${li.product.id}`}>{li.product.name}</Link>
                        </div>
                      </div>
                    </td>
                    <td>{formatINR(li.product.price)}</td>
                    <td>
                      <div className="qty-selector">
                        <button onClick={() => updateCartQty(li.product.id, li.qty - 1)}>−</button>
                        <span>{li.qty}</span>
                        <button onClick={() => updateCartQty(li.product.id, li.qty + 1)}>+</button>
                      </div>
                    </td>
                    <td>{formatINR(li.lineTotal)}</td>
                    <td>
                      <a
                        className="remove-link"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          removeFromCart(li.product.id);
                        }}
                      >
                        Remove
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cart-summary">
              <div className="row">
                <span>Subtotal</span>
                <span>{formatINR(total)}</span>
              </div>
              <div className="row">
                <span>Delivery</span>
                <span>Free</span>
              </div>
              <div className="row total">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>
              <a
                className="btn btn-whatsapp btn-block mt-lg"
                href={buildWhatsAppCheckoutUrl(lineItems, total)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Checkout via WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
