"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabasePublic } from "@/lib/supabasePublic";
import { formatINR } from "@/lib/format";
import ProductGrid from "@/components/ProductGrid";

export default function ShopContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBrands, setSelectedBrands] = useState(() => (searchParams.get("brand") ? [searchParams.get("brand")] : []));
  const [selectedCategories, setSelectedCategories] = useState(() => (searchParams.get("category") ? [searchParams.get("category")] : []));
  const [maxPrice, setMaxPrice] = useState(50000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [sort, setSort] = useState("popular");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    supabasePublic
      .from("products")
      .select("*, product_media(*)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (active) {
          setProducts(data || []);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const allBrands = useMemo(() => [...new Set(products.map((p) => p.brand))].sort(), [products]);
  const allCategories = useMemo(() => [...new Set(products.map((p) => p.category))].sort(), [products]);
  const priceCeiling = useMemo(() => Math.max(1000, ...products.map((p) => p.price), 1000), [products]);

  const results = useMemo(() => {
    let list = products.filter((p) => {
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (p.price > maxPrice) return false;
      if (inStockOnly && !p.in_stock) return false;
      if (query && !`${p.brand} ${p.name}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, selectedBrands, selectedCategories, maxPrice, inStockOnly, query, sort]);

  function toggleValue(list, setList, value) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function clearFilters() {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setMaxPrice(priceCeiling);
    setInStockOnly(false);
    setQuery("");
  }

  return (
    <section className="section">
      <div className="container">
        <h2 style={{ marginTop: 0 }}>Shop All Watches</h2>
        <div className="shop-layout">
          <aside className="filters">
            <h3>Brand</h3>
            <div className="filter-group">
              {allBrands.map((b) => (
                <label key={b}>
                  <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleValue(selectedBrands, setSelectedBrands, b)} />
                  {b}
                </label>
              ))}
              {!allBrands.length && <p style={{ color: "var(--muted)", fontSize: 12 }}>No brands yet.</p>}
            </div>

            <h3>Category</h3>
            <div className="filter-group">
              {allCategories.map((c) => (
                <label key={c}>
                  <input type="checkbox" checked={selectedCategories.includes(c)} onChange={() => toggleValue(selectedCategories, setSelectedCategories, c)} />
                  {c}
                </label>
              ))}
            </div>

            <h3>Price</h3>
            <div className="filter-group">
              <input
                type="range"
                min={1000}
                max={priceCeiling}
                step={500}
                value={maxPrice > priceCeiling ? priceCeiling : maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              />
              <div className="price-range-val">Up to {formatINR(maxPrice > priceCeiling ? priceCeiling : maxPrice)}</div>
            </div>

            <label>
              <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} /> In stock only
            </label>

            <div style={{ marginTop: 16 }}>
              <button className="clear-filters" onClick={clearFilters}>
                Clear all filters
              </button>
            </div>
          </aside>

          <div>
            <div className="shop-toolbar">
              <span className="result-count">{loading ? "Loading…" : `${results.length} watch${results.length !== 1 ? "es" : ""} found`}</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="popular">Sort: Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
            {!loading && <ProductGrid products={results} emptyMessage="No watches match these filters. Try clearing some." />}
          </div>
        </div>
      </div>
    </section>
  );
}
