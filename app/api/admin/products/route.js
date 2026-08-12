import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

export async function POST(request) {
  const formData = await request.formData();

  const brand = (formData.get("brand") || "").toString().trim();
  const name = (formData.get("name") || "").toString().trim();
  const category = (formData.get("category") || "Men").toString();
  const price = parseFloat(formData.get("price"));
  const mrpRaw = formData.get("mrp");
  const mrp = mrpRaw ? parseFloat(mrpRaw) : null;
  const rating = parseFloat(formData.get("rating") || "4.5");
  const inStock = formData.get("inStock") === "true";
  const description = (formData.get("description") || "").toString();
  const file = formData.get("image");

  if (!brand || !name || !price || Number.isNaN(price)) {
    return NextResponse.json({ error: "Brand, name, and a valid price are required." }, { status: 400 });
  }

  let imageUrl = null;

  if (file && typeof file === "object" && file.size > 0) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const safeExt = /^[a-z0-9]+$/.test(ext) ? ext : "jpg";
    const filename = `${crypto.randomUUID()}.${safeExt}`;
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from("product-images")
      .upload(filename, arrayBuffer, { contentType: file.type || "image/jpeg" });

    if (uploadError) {
      return NextResponse.json({ error: `Image upload failed: ${uploadError.message}` }, { status: 500 });
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from("product-images").getPublicUrl(filename);
    imageUrl = publicUrlData.publicUrl;
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({
      brand,
      name,
      category,
      price,
      mrp,
      rating: Number.isNaN(rating) ? 4.5 : rating,
      in_stock: inStock,
      description,
      image_url: imageUrl,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}
