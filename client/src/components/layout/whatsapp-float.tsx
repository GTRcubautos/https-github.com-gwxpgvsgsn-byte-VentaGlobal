export default function WhatsAppFloat() {
  const handleWhatsAppClick = () => {
    const phoneNumber = "1234567890";
    const message = "Hola, necesito información sobre sus productos";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="bg-whatsapp text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-whatsapp/90 transition-colors animate-pulse"
        data-testid="whatsapp-float"
        aria-label="Contactar por WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
      </button>
    </div>
  );
}
