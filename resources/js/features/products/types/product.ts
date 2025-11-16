export interface Product {
  id: string;
  name: string;
  price: number;
  image_principale: string | null;
  images_secondaires: string[];
  description: string | null;
  en_stock: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ProductFormData {
  name: string;
  price: number;
  image_principale?: File | string | null;
  images_secondaires?: File[];
  description?: string;
  en_stock: boolean;
  active: boolean;
}

export interface ProductFilters {
  search?: string;
  active?: boolean | null;
  en_stock?: boolean | null;
  sortBy?: 'name' | 'price' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  sort_by?: string;
  sort_order?: string;
  page?: number;
  perPage?: number;
  per_page?: number;
}

export interface ProductApiResponse {
  data: Product[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

