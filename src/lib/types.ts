export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image_key: string;
  created_at: string;
}

export interface AnalyticsSummary {
  totalVisits: number;
  totalWhatsappClicks: number;
  clicksByProduct: { product_id: string; product_name: string; clicks: number }[];
}
