import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabasePublic";

// Redirects a short, branded link (yourdomain.com/api/img/42) to the actual
// Supabase storage URL — so links shared in WhatsApp show your own domain
// in the preview card instead of the raw Supabase subdomain.
export async function GET(request, { params }) {
  const { id } = await params;

  const { data } = await supabasePublic.from("product_media").select("url").eq("id", id).single();

  if (!data?.url) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.redirect(data.url, { status: 302 });
}
