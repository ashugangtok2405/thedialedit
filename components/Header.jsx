"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cartCount, subscribeToCart } from "@/lib/cart";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=Men", label: "Men" },
  { href: "/shop?category=Women", label: "Women" },
  { href: "/shop?category=Smart", label: "Smart" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [count, setCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setCount(cartCount());
    return subscribeToCart(() => setCount(cartCount()));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const q = e.target.q.value;
    setMenuOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo">
          <Image src="/logo-mark.png" alt="The Dial Edit" width={44} height={44} className="logo-mark" priority />
          <div>
            <div className="logo-text">
              <span className="the">THE</span> <span className="dial">DIAL</span> <span className="the">EDIT</span>
            </div>
            <span className="logo-tagline">TIMEPIECES THAT DEFINE YOU</span>
          </div>
        </Link>

        <nav className="main-nav">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={pathname === link.href.split("?")[0] && !link.href.includes("?") ? "active" : ""}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <form className="search-box" onSubmit={handleSearch}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input name="q" type="text" placeholder="Search watches, brands..." />
          </form>

          <Link className="icon-btn" href="/cart" aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="cart-badge">{count}</span>
          </Link>

          <button className="hamburger" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div className={`mobile-nav${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
