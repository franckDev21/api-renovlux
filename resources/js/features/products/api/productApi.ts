import { Product, ProductFormData, ProductFilters, ProductApiResponse } from '../types/product';
import axios from 'axios';

const API_BASE_URL = '/api/products';

export const fetchProducts = async (filters: ProductFilters = {}): Promise<ProductApiResponse> => {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.active !== undefined) params.append('active', String(filters.active));
  if (filters.en_stock !== undefined) params.append('en_stock', String(filters.en_stock));
  if (filters.sortBy || filters.sort_by) params.append('sort_by', filters.sortBy || filters.sort_by || 'created_at');
  if (filters.sortOrder || filters.sort_order) params.append('sort_order', filters.sortOrder || filters.sort_order || 'desc');
  if (filters.page) params.append('page', String(filters.page));
  if (filters.perPage || filters.per_page) params.append('per_page', String(filters.perPage || filters.per_page || 15));

  const response = await axios.get<ProductApiResponse>(`${API_BASE_URL}?${params.toString()}`);
  return response.data;
};

export const fetchProduct = async (id: string): Promise<Product> => {
  const response = await axios.get<{ data: Product }>(`${API_BASE_URL}/${id}`);
  return response.data.data;
};

export const createProduct = async (data: FormData): Promise<Product> => {
  const response = await axios.post<{ data: Product }>(API_BASE_URL, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const updateProduct = async (id: string, data: FormData): Promise<Product> => {
  const response = await axios.put<{ data: Product }>(`${API_BASE_URL}/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};

// Helper function to convert ProductFormData to FormData
export const toFormData = (data: ProductFormData): FormData => {
  const formData = new FormData();
  
  formData.append('name', data.name);
  formData.append('price', data.price.toString());
  formData.append('description', data.description || '');
  formData.append('en_stock', data.en_stock ? '1' : '0');
  formData.append('active', data.active ? '1' : '0');
  
  if (data.image_principale instanceof File) {
    formData.append('image_principale', data.image_principale);
  }
  
  if (data.images_secondaires && data.images_secondaires.length > 0) {
    data.images_secondaires.forEach((image) => {
      formData.append('images_secondaires[]', image);
    });
  }
  
  return formData;
};

