import { sortedMedia } from "@/lib/placeholder";

export function formatINR(n) {
  return "Rs." + Number(n || 0).toLocaleString("en-IN");
}

// Only a real uploaded photo makes sense as a link in a WhatsApp message —
// never the generated placeholder (that's a giant inline data: URI, not a link).
function realPhotoUrl(product) {
  return sortedMedia(product).find((m) => m.type === "image")?.url || product.image_url || null;
}

export function discountPct(product) {
  if (!product.mrp || product.mrp <= product.price) return 0;
  return Math.round(((product.mrp - product.price) / product.mrp) * 100);
}

export function buildWhatsAppBuyNowUrl(product) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const photo = realPhotoUrl(product);
  let message = `Hi The Dial Edit! I'd like to buy the ${product.brand} ${product.name} (${formatINR(product.price)}).`;
  if (photo) message += `\nPhoto: ${photo}`;
  message += `\n\nPlease confirm availability and delivery details.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppCheckoutUrl(lineItems, total) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  let message = "Hi The Dial Edit! I'd like to order:\n\n";
  lineItems.forEach((li, idx) => {
    message += `${idx + 1}. ${li.product.brand} - ${li.product.name} x${li.qty} - ${formatINR(li.lineTotal)}\n`;
    const photo = realPhotoUrl(li.product);
    if (photo) message += `   Photo: ${photo}\n`;
  });
  message += `\nTotal: ${formatINR(total)}\n\nPlease confirm availability and delivery details.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
