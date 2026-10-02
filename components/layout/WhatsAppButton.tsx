import { FaWhatsapp } from "react-icons/fa";

import { CONTACT } from "@/lib/content";

export default function WhatsAppButton() {
  return (
    <a
      href={CONTACT.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="cz-pulse-glow-green fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] transition-transform duration-150 hover:scale-110 md:right-7 md:bottom-7"
    >
      <FaWhatsapp className="h-7 w-7" aria-hidden />
    </a>
  );
}
