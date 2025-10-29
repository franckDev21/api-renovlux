export interface ServiceItem {
  id: string;
  title: string;
  service_id: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  duration: string; // format: "30 jours"
  is_active: boolean;
  created_at: string;
  updated_at: string;
  features?: string[]; // Anciennement service_items
  service_items?: ServiceItem[]; // Gardé pour la rétrocompatibilité
}

export interface ServiceFormData {
  name: string;
  description: string;
  image?: File | string;
  // price: number;
  // duration: string; // format: "30 jours"
  is_active: boolean;
  service_items?: string[];
}

export interface ServiceFilters {
  search?: string;
  is_active?: boolean | null;
  sortBy?: 'name' | 'price' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  sort_by?: string; // Alias pour la compatibilité avec l'API
  sort_order?: string; // Alias pour la compatibilité avec l'API
  page?: number;
  perPage?: number;
  per_page?: number; // Alias pour la compatibilité avec l'API
}

export interface ServiceApiResponse {
  data: Service[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
