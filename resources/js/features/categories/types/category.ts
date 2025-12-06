export interface Category {
  id: number | string;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryApiResponse {
  data: Category[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
