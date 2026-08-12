import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function SiteLayout({ children }) {
  return (
    <>
      <div className="announce">FREE PAN INDIA DELIVERY &nbsp;|&nbsp; CASH ON DELIVERY AVAILABLE &nbsp;|&nbsp; EASY 7-DAY RETURNS</div>
      <Header />
      {children}
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
