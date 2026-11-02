// Salon sayfasında görünen onaylı yorum (GET /public/reviews/<slug>)
export interface IPublicReview {
  id: number;
  rating: number;
  comment: string;
  customer: string;
  service_title: string;
  reply: string;
  replied_at: string | null;
  created_at: string;
}

export interface IReviewSummary {
  rating_avg: number;
  rating_count: number;
  // { '5': 3, '4': 1, ... }
  distribution: Record<string, number>;
}

// Panelde görünen yorum (GET /company/reviews)
export type ReviewStatus = 'pending' | 'approved' | 'hidden';

export interface IPanelReview {
  id: number;
  rating: number;
  comment: string;
  status: ReviewStatus;
  reply: string;
  replied_at: string | null;
  created_at: string;
  customer: string;
  service_title: string;
  meeting_date: string;
  staff: string | null;
}

// Maildeki linkin açtığı sayfa (GET /public/review/<token>)
export type ReviewPageState = 'open' | 'too_early' | 'canceled' | 'done';

export interface IReviewPageData {
  state: ReviewPageState;
  message: string;
  company: { title: string; slug: string; logo: string | null };
  meeting: {
    service_title: string;
    date: string;
    time: string;
    staff: string | null;
  };
}
