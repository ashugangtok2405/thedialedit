import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid reveal-group">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Image src="/logo-mark.png" alt="The Dial Edit" width={36} height={36} className="logo-mark" />
            <div className="logo-text">
              <span className="the">THE</span> <span className="dial">DIAL</span> <span className="the">EDIT</span>
            </div>
          </div>
          <p style={{ marginTop: 12 }}>Best high quality watches across every brand you love, we ship pan India.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <Link href="/shop">All Watches</Link>
          <Link href="/shop?category=Men">Men&apos;s Watches</Link>
          <Link href="/shop?category=Women">Women&apos;s Watches</Link>
          <Link href="/shop?category=Smart">Smart Watches</Link>
        </div>
        <div>
          <h4>Company</h4>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/cart">Your Cart</Link>
        </div>
        <div>
          <h4>Get in Touch</h4>
          <p>Pan India Delivery</p>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
      <div className="footer-bottom">© 2026 The Dial Edit. All rights reserved.</div>
    </footer>
  );
}
