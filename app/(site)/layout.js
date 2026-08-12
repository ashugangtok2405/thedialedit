import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import RevealObserver from "@/components/RevealObserver";

export default function SiteLayout({ children }) {
  return (
    <>
      <RevealObserver />
      <Header />
      {children}
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
