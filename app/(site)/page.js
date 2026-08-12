import Link from "next/link";
import Image from "next/image";
import { supabasePublic } from "@/lib/supabasePublic";
import ProductGrid from "@/components/ProductGrid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data } = await supabasePublic
    .from("products")
    .select("*, product_media(*)")
    .order("created_at", { ascending: false });

  const products = data || [];
  const newArrivals = products.slice(0, 4);
  const bestsellers = products.slice(4, 8);
  const brands = [...new Set(products.map((p) => p.brand))];

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <span className="eyebrow">PAN INDIA DELIVERY</span>
            <h1>
              Timepieces that <span>define you.</span>
            </h1>
            <p>
              Discover a curated collection of watches across every brand you love — all in one place,
              delivered to your doorstep anywhere in India.
            </p>
            <Link href="/shop" className="btn btn-gold">
              Shop the Collection
            </Link>
          </div>
          <div className="hero-visual">
            <Image src="/logo-mark.png" alt="The Dial Edit" width={320} height={320} priority style={{ width: "100%", maxWidth: 320, height: "auto" }} />
          </div>
        </div>
      </section>

      <section className="brand-strip">
        <div className="container reveal-group">
          {brands.length ? (
            brands.map((b) => (
              <Link key={b} className="brand-chip" href={`/shop?brand=${encodeURIComponent(b)}`}>
                {b}
              </Link>
            ))
          ) : (
            <p style={{ color: "var(--muted)" }}>No products yet.</p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <h2>Bestsellers</h2>
            <Link href="/shop">View all →</Link>
          </div>
          <ProductGrid products={bestsellers} emptyMessage="No products yet." />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head reveal">
            <h2>New Arrivals</h2>
            <Link href="/shop">View all →</Link>
          </div>
          <ProductGrid products={newArrivals} />
        </div>
      </section>
    </>
  );
}
