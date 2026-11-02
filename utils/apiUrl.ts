// Backend görselleri (salon logoları, site logosu) env'deki API adresinden gelir
export const imageUrl = (file: string) =>
  `${process.env.NEXT_PUBLIC_BASE_URL}/public/images/${file}`;
