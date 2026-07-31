"use client";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

interface WhatsAppButtonProps {
  productId: string;
  productName: string;
  phoneNumber: string;
}

export default function WhatsAppButton({ productId, productName, phoneNumber }: WhatsAppButtonProps) {
  async function handleClick() {
    const message = encodeURIComponent(`Bonjour, je suis intéressé par le produit ${productName}`);
    const url = `https://wa.me/${phoneNumber}?text=${message}`;

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "whatsapp_click", productId }),
    }).catch(() => { });

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      onClick={handleClick}
      className="flex flex-row min-h-[44px] w-full items-center justify-center gap-2 rounded-3xl bg-green-600 px-6 py-4 text-base font-medium text-paper transition hover:opacity-90"
      aria-label={`Contacter via WhatsApp pour ${productName}`}
    >
      <WhatsAppIcon />
      Contacter via WhatsApp
    </button>
  );
}
