import { Suspense } from "react";
import ShopContent from "./ShopContent";

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <section className="section">
          <div className="container">
            <p style={{ color: "var(--muted)" }}>Loading…</p>
          </div>
        </section>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
