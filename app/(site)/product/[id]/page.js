import Link from "next/link";
import { notFound } from "next/navigation";
import { supabasePublic } from "@/lib/supabasePublic";
import ProductGrid from "@/components/ProductGrid";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data: product } = await supabasePublic.from("products").select("brand,name").eq("id", id).single();
  return { title: product ? `${product.brand} ${product.name} — The Dial Edit` : "Product — The Dial Edit" };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const { data: product } = await supabasePublic.from("products").select("*, product_media(*)").eq("id", id).single();

  if (!product) notFound();

  const { data: related } = await supabasePublic
    .from("products")
    .select("*, product_media(*)")
    .eq("brand", product.brand)
    .neq("id", product.id)
    .limit(4);

  return (
    <>
      <section className="section">
        <div className="container">
          <p>
            <Link href="/shop" style={{ color: "var(--gold)", fontSize: 13 }}>
              ← Back to Shop
            </Link>
          </p>
          <ProductDetailClient product={product} />
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <h2>You may also like</h2>
          </div>
          <ProductGrid products={related || []} emptyMessage="No related products yet." />
        </div>
      </section>
    </>
  );
}
