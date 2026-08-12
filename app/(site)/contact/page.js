"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    e.target.reset();
  }

  return (
    <section className="section">
      <div className="container">
        <h2 style={{ marginTop: 0 }}>Get in Touch</h2>
        <p style={{ color: "var(--muted)", maxWidth: 520 }}>
          Questions about sizing, availability, or your order? Reach us on WhatsApp for the fastest response, or send a message below.
        </p>

        <div style={{ display: "flex", gap: 48, flexWrap: "wrap", marginTop: 30 }}>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Your Name" required />
            <input type="tel" placeholder="Phone Number" required />
            <input type="email" placeholder="Email Address" />
            <textarea rows={5} placeholder="Your Message" required />
            <button className="btn btn-gold" type="submit">
              Send Message
            </button>
            {sent && (
              <p style={{ fontSize: 12, color: "var(--muted)" }}>
                Thanks! This demo form doesn&apos;t send yet — please message us on WhatsApp for now.
              </p>
            )}
          </form>

          <div>
            <h3 style={{ fontSize: 16, color: "var(--gold)" }}>Reach us directly</h3>
            <a className="btn btn-whatsapp" style={{ marginTop: 10 }} href={`https://wa.me/${number}`} target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp
            </a>
            <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 20 }}>Pan India Delivery · Cash on Delivery Available · 7-Day Easy Returns</p>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)", fontSize: 13 }}>
              Follow us on Instagram →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
