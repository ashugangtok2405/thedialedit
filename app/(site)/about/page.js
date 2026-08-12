export const metadata = { title: "About Us — The Dial Edit" };

export default function AboutPage() {
  return (
    <section className="about-hero">
      <span style={{ color: "var(--gold)", letterSpacing: 3, fontSize: 12 }}>OUR STORY</span>
      <h1 style={{ fontSize: 34, marginTop: 10 }}>Timepieces that define you.</h1>
      <p>
        The Dial Edit is a multi-brand watch destination bringing together the brands you love — curated for
        every style, wrist, and budget, delivered anywhere in India.
      </p>

      <div className="about-grid container reveal-group">
        <div className="about-card">
          <div className="icon">🚚</div>
          <h3 style={{ fontSize: 16 }}>Pan India Delivery</h3>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>We ship to every pin code across the country, with cash-on-delivery available.</p>
        </div>
        <div className="about-card">
          <div className="icon">🏷️</div>
          <h3 style={{ fontSize: 16 }}>Multi-Brand Selection</h3>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>One place to browse and compare watches across the brands you already trust.</p>
        </div>
        <div className="about-card">
          <div className="icon">↩️</div>
          <h3 style={{ fontSize: 16 }}>Easy Returns</h3>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Not happy with your order? Return within 7 days, no questions asked.</p>
        </div>
        <div className="about-card">
          <div className="icon">💬</div>
          <h3 style={{ fontSize: 16 }}>Personal Support</h3>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Chat with us directly on WhatsApp for sizing, availability, or order help.</p>
        </div>
      </div>
    </section>
  );
}
