export interface Project {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  secondary_images: string[];
  category_id: number | string;
  created_at: string;
  updated_at: string;
}

export interface ProjectFormData {
  title: string;
  description?: string | null;
  image?: File | string | null;
  secondary_images?: File[];
  existing_secondary_images?: string[];
  category_id: number | string;
}

export interface ProjectFilters {
  search?: string;
  sortBy?: 'title' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  sort_by?: string;
  sort_order?: string;
  page?: number;
  perPage?: number;
  per_page?: number;
}

export interface ProjectApiResponse {
  data: Project[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
