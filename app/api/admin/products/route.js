import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*, product_media(*)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

async function uploadMediaFile(file) {
  const isVideo = (file.type || "").startsWith("video/");
  const ext = (file.name.split(".").pop() || (isVideo ? "mp4" : "jpg")).toLowerCase();
  const safeExt = /^[a-z0-9]+$/.test(ext) ? ext : isVideo ? "mp4" : "jpg";
  const filename = `${crypto.randomUUID()}.${safeExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabaseAdmin.storage
    .from("product-images")
    .upload(filename, arrayBuffer, { contentType: file.type || (isVideo ? "video/mp4" : "image/jpeg") });

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrlData } = supabaseAdmin.storage.from("product-images").getPublicUrl(filename);
  return { url: publicUrlData.publicUrl, type: isVideo ? "video" : "image" };
}

export async function POST(request) {
  const formData = await request.formData();

  const brand = (formData.get("brand") || "").toString().trim();
  const name = (formData.get("name") || "").toString().trim() || `${brand || "Untitled"} Watch`;
  const category = (formData.get("category") || "Men").toString();
  const price = parseFloat(formData.get("price"));
  const mrpRaw = formData.get("mrp");
  const mrp = mrpRaw ? parseFloat(mrpRaw) : null;
  const inStock = formData.get("inStock") === "true";
  const description = (formData.get("description") || "").toString();
  const files = formData.getAll("media").filter((f) => typeof f === "object" && f.size > 0);

  if (!brand || !price || Number.isNaN(price)) {
    return NextResponse.json({ error: "Brand and a valid price are required." }, { status: 400 });
  }

  let uploaded = [];
  try {
    uploaded = await Promise.all(files.map(uploadMediaFile));
  } catch (err) {
    return NextResponse.json({ error: `Media upload failed: ${err.message}` }, { status: 500 });
  }

  const { data: product, error } = await supabaseAdmin
    .from("products")
    .insert({
      brand,
      name,
      category,
      price,
      mrp,
      in_stock: inStock,
      description,
      image_url: uploaded.find((m) => m.type === "image")?.url || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (uploaded.length) {
    const mediaRows = uploaded.map((m, i) => ({ product_id: product.id, url: m.url, type: m.type, sort_order: i }));
    const { error: mediaError } = await supabaseAdmin.from("product_media").insert(mediaRows);
    if (mediaError) return NextResponse.json({ error: `Product saved, but media failed: ${mediaError.message}` }, { status: 500 });
  }

  return NextResponse.json({ product });
}
