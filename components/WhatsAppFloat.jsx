export default function WhatsAppFloat() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  return (
    <a className="whatsapp-float" href={`https://wa.me/${number}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
      💬
    </a>
  );
}
