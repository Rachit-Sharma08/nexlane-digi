import { site } from "@/config/site";
import { WhatsAppIcon } from "./Navbar";

/** Floating WhatsApp chat button on every page. */
export default function WhatsAppFloat() {
  if (!site.whatsappNumber) return null;
  const text = encodeURIComponent(
    `Hello ${site.name}! I want to know how you can help my business grow.`
  );
  return (
    <a
      href={`https://wa.me/${site.whatsappNumber}?text=${text}`}
      aria-label="Chat with us on WhatsApp"
      className="whatsapp-float fixed bottom-[5.75rem] right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg shadow-black/40 transition-transform hover:scale-105"
      rel="noopener noreferrer"
      target="_blank"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
