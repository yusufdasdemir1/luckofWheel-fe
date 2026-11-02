// Salon iletişim bağlantıları (telefon + WhatsApp)

export const whatsappUrl = (
  phone: string,
  text = 'Merhaba, randevu oluşturmak istiyorum.'
) => `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
