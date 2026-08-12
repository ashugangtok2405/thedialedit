const CART_KEY = "tde_cart";
const CART_EVENT = "tde-cart-updated";

export function getCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) existing.qty += qty;
  else cart.push({ id: productId, qty });
  saveCart(cart);
}

export function updateCartQty(productId, qty) {
  let cart = getCart();
  if (qty <= 0) cart = cart.filter((item) => item.id !== productId);
  else {
    const item = cart.find((i) => i.id === productId);
    if (item) item.qty = qty;
  }
  saveCart(cart);
}

export function removeFromCart(productId) {
  saveCart(getCart().filter((item) => item.id !== productId));
}

export function cartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

export function subscribeToCart(callback) {
  window.addEventListener(CART_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CART_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
