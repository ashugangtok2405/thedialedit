/* Generates an inline SVG "watch" placeholder for products without a photo yet. */

const PALETTE = ["#c9a227", "#8a6d3b", "#3a3a3a", "#1f4e5f", "#5c4a72", "#a13d3d", "#2f5d50", "#4a4a4a", "#b08d57", "#6b4226"];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function placeholderImage(product) {
  const brand = product.brand || "The Dial Edit";
  const color = PALETTE[hashString(brand) % PALETTE.length];
  const initials = brand.slice(0, 2).toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#111111"/>
      <circle cx="200" cy="170" r="110" fill="none" stroke="${color}" stroke-width="6"/>
      <circle cx="200" cy="170" r="96" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="2"/>
      <line x1="200" y1="170" x2="200" y2="105" stroke="${color}" stroke-width="5" stroke-linecap="round"/>
      <line x1="200" y1="170" x2="245" y2="185" stroke="#e8e2d5" stroke-width="4" stroke-linecap="round"/>
      <circle cx="200" cy="170" r="6" fill="${color}"/>
      <rect x="176" y="55" width="48" height="20" rx="4" fill="${color}"/>
      <rect x="176" y="285" width="48" height="20" rx="4" fill="${color}"/>
      <text x="200" y="176" font-family="Georgia, serif" font-size="26" fill="${color}" text-anchor="middle" opacity="0.35">${initials}</text>
      <text x="200" y="345" font-family="Poppins, Arial, sans-serif" font-size="18" letter-spacing="2" fill="#e8e2d5" text-anchor="middle">${brand.toUpperCase()}</text>
    </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg.replace(/\s+/g, " "));
}

export function productImage(product) {
  return product.image_url || placeholderImage(product);
}
