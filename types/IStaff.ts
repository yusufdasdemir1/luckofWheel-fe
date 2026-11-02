// Panelde çalışan listesi (sadece firma sahibi görür)
export default interface IStaff {
  id: number;
  name: string;
  surname: string;
  email: string;
  is_active: boolean;
  meeting_count: number;
  photo: string; // public/images altındaki yol, yoksa boş
}

// Müşterinin randevuda göreceği çalışan: ad, soyad ve fotoğraf
export interface IStaffPublic {
  id: number;
  name: string;
  surname: string;
  photo: string;
}
