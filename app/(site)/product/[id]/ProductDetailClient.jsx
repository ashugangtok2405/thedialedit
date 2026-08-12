"use client";

import { useState } from "react";
import { productImage, sortedMedia } from "@/lib/placeholder";
import { formatINR, discountPct, buildWhatsAppBuyNowUrl } from "@/lib/format";
import { addToCart } from "@/lib/cart";

export default function ProductDetailClient({ product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const off = discountPct(product);

  const media = sortedMedia(product);
  const gallery = media.length ? media : [{ type: "image", url: productImage(product) }];
  const active = gallery[Math.min(activeIndex, gallery.length - 1)];

  function handleAdd() {
    addToCart(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="product-detail">
      <div>
        <div className="pd-image">
          {active.type === "video" ? (
            <video src={active.url} controls playsInline />
          ) : (
            <img src={active.url} alt={`${product.brand} ${product.name}`} />
          )}
        </div>
        {gallery.length > 1 && (
          <div className="pd-thumbs">
            {gallery.map((m, i) => (
              <button key={i} className={`pd-thumb${i === activeIndex ? " active" : ""}`} onClick={() => setActiveIndex(i)}>
                {m.type === "video" ? <video src={m.url} muted /> : <img src={m.url} alt="" />}
                {m.type === "video" && <span className="pd-thumb-play">▶</span>}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="pd-info">
        <span className="brand">{product.brand}</span>
        <h1>{product.name}</h1>
        <div className="price-row">
          <span className="price">{formatINR(product.price)}</span>
          {product.mrp ? <span className="mrp">{formatINR(product.mrp)}</span> : null}
          {off ? <span className="discount">{off}% off</span> : null}
        </div>
        <p className="desc">{product.description}</p>
        <table className="specs-table">
          <tbody>
            <tr>
              <td>Brand</td>
              <td>{product.brand}</td>
            </tr>
            <tr>
              <td>Category</td>
              <td>{product.category}</td>
            </tr>
            <tr>
              <td>Availability</td>
              <td>{product.in_stock ? "In Stock" : "Out of Stock"}</td>
            </tr>
            <tr>
              <td>Delivery</td>
              <td>Pan India, 3–7 business days</td>
            </tr>
          </tbody>
        </table>
        <div className="qty-selector">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <span>{qty}</span>
          <button onClick={() => setQty((q) => q + 1)}>+</button>
        </div>
        <div className="pd-actions">
          <button className="btn btn-outline" disabled={!product.in_stock} onClick={handleAdd}>
            {added ? "Added to Cart ✓" : "Add to Cart"}
          </button>
          <a
            className="btn btn-whatsapp"
            style={!product.in_stock ? { pointerEvents: "none", opacity: 0.4 } : undefined}
            href={buildWhatsAppBuyNowUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy Now via WhatsApp
          </a>
        </div>
        <div className="trust-badges">
          <span>✓ Pan India Delivery</span>
          <span>✓ Cash on Delivery</span>
          <span>✓ 7-Day Easy Returns</span>
        </div>
      </div>
    </div>
  );
}
