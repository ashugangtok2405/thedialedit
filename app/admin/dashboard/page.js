"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { productImage } from "@/lib/placeholder";
import { formatINR } from "@/lib/format";

const CATEGORIES = ["Men", "Women", "Unisex", "Smart"];

const EMPTY_FORM = {
  brand: "",
  name: "",
  category: "Men",
  price: "",
  mrp: "",
  inStock: true,
  description: "",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadProducts() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function addFiles(files) {
    setMediaFiles((prev) => [...prev, ...files]);
  }

  function removeFile(index) {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    const fd = new FormData();
    fd.set("brand", form.brand);
    fd.set("name", form.name);
    fd.set("category", form.category);
    fd.set("price", form.price);
    fd.set("mrp", form.mrp);
    fd.set("inStock", String(form.inStock));
    fd.set("description", form.description);
    mediaFiles.forEach((file) => fd.append("media", file));

    const res = await fetch("/api/admin/products", { method: "POST", body: fd });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }

    setSuccess(`"${data.product.name}" added.`);
    setForm(EMPTY_FORM);
    setMediaFiles([]);
    document.getElementById("media-input").value = "";
    loadProducts();
  }

  async function toggleStock(product) {
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ in_stock: !product.in_stock }),
    });
    loadProducts();
  }

  async function deleteProduct(product) {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    loadProducts();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="logo-text">
          <span className="the">THE</span> <span className="dial">DIAL</span> <span className="the">EDIT</span> <span style={{ fontSize: 12, color: "var(--muted)" }}>Admin</span>
        </div>
        <button className="btn btn-outline" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <div className="container" style={{ padding: "32px 24px" }}>
        <div className="admin-card" style={{ marginBottom: 32 }}>
          <h3 style={{ marginTop: 0, marginBottom: 18 }}>Add a Watch</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div>
              <label>Brand *</label>
              <input type="text" value={form.brand} onChange={(e) => updateField("brand", e.target.value)} placeholder="e.g. Titan, Rolex, Fossil…" required />
            </div>
            <div>
              <label>Product Name</label>
              <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g. Neo Classic Analog (optional)" />
            </div>
            <div>
              <label>Category</label>
              <select value={form.category} onChange={(e) => updateField("category", e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Price (₹) *</label>
              <input type="number" min="0" value={form.price} onChange={(e) => updateField("price", e.target.value)} required />
            </div>
            <div>
              <label>MRP / Strike-through price (₹)</label>
              <input type="number" min="0" value={form.mrp} onChange={(e) => updateField("mrp", e.target.value)} placeholder="Optional" />
            </div>
            <div className="full">
              <label>Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => updateField("description", e.target.value)} />
            </div>
            <div className="full">
              <label>Photos &amp; Videos</label>
              <input
                id="media-input"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  e.target.value = "";
                  addFiles(files);
                }}
              />
              {mediaFiles.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                  {mediaFiles.map((file, i) => (
                    <div key={i} style={{ position: "relative", width: 72, height: 72, borderRadius: 6, overflow: "hidden", border: "1px solid var(--border)", background: "var(--black-soft)" }}>
                      {file.type.startsWith("video/") ? (
                        <video src={URL.createObjectURL(file)} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                      ) : (
                        <img src={URL.createObjectURL(file)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.7)", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, fontSize: 12, lineHeight: 1 }}
                        aria-label="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20 }}>
              <input type="checkbox" checked={form.inStock} onChange={(e) => updateField("inStock", e.target.checked)} id="instock" />
              <label htmlFor="instock" style={{ margin: 0 }}>
                In stock
              </label>
            </div>
            <div className="full">
              {error && <p className="error-text">{error}</p>}
              {success && <p className="success-text">{success}</p>}
              <button className="btn btn-gold" type="submit" disabled={submitting}>
                {submitting ? "Uploading…" : "Add Watch"}
              </button>
            </div>
          </form>
        </div>

        <h3>Your Catalog ({products.length})</h3>
        {loading ? (
          <p style={{ color: "var(--muted)" }}>Loading…</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Brand / Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img src={productImage(p)} alt={p.name} />
                  </td>
                  <td>
                    <div style={{ color: "var(--gold)", fontSize: 11 }}>{p.brand}</div>
                    {p.name}
                    {p.product_media?.length > 1 && (
                      <span style={{ color: "var(--muted)", fontSize: 11 }}> · {p.product_media.length} files</span>
                    )}
                  </td>
                  <td>{p.category}</td>
                  <td>{formatINR(p.price)}</td>
                  <td>
                    <span className={p.in_stock ? "admin-badge-in" : "admin-badge-out"}>{p.in_stock ? "In Stock" : "Out of Stock"}</span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="btn btn-outline" onClick={() => toggleStock(p)}>
                        {p.in_stock ? "Mark Out" : "Mark In"}
                      </button>
                      <button className="btn btn-outline" style={{ borderColor: "var(--danger)", color: "var(--danger)" }} onClick={() => deleteProduct(p)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!products.length && (
                <tr>
                  <td colSpan={6} style={{ color: "var(--muted)", textAlign: "center", padding: 24 }}>
                    No products yet. Add your first watch above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
