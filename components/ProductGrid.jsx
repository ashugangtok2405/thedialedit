import ProductCard from "./ProductCard";

export default function ProductGrid({ products, emptyMessage }) {
  if (!products || !products.length) {
    return <div className="empty-state">{emptyMessage || "No watches to show yet."}</div>;
  }
  return (
    <div className="product-grid reveal-group">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
