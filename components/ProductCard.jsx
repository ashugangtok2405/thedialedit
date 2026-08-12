"use client";

import { useState } from "react";
import Link from "next/link";
import { productImage } from "@/lib/placeholder";
import { formatINR, discountPct } from "@/lib/format";
import { addToCart } from "@/lib/cart";

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const off = discountPct(product);

  function handleAdd() {
    addToCart(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="product-card">
      <Link className="thumb" href={`/product/${product.id}`}>
        <img src={productImage(product)} alt={`${product.brand} ${product.name}`} />
      </Link>
      <div className="info">
        <span className="brand">{product.brand}</span>
        <Link href={`/product/${product.id}`}>
          <div className="name">{product.name}</div>
        </Link>
        <div className="price-row">
          <span className="price">{formatINR(product.price)}</span>
          {product.mrp ? <span className="mrp">{formatINR(product.mrp)}</span> : null}
          {off ? <span className="discount">{off}% off</span> : null}
        </div>
        {!product.in_stock && <span className="stock-badge">Out of stock</span>}
        <div className="card-actions">
          <button className="btn btn-outline" disabled={!product.in_stock} onClick={handleAdd}>
            {added ? "Added ✓" : "Add to Cart"}
          </button>
          <Link className="btn btn-gold" href={`/product/${product.id}`}>
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
