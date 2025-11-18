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
  // Ajouter _method=PUT pour que Laravel reconnaisse la méthode
  data.append('_method', 'PUT');
  
  const response = await axios.post<{ data: Product }>(`${API_BASE_URL}/${id}`, data, {
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
  
  // Toujours envoyer les champs de base pour qu'ils soient mis à jour
  formData.append('name', data.name);
  formData.append('price', data.price.toString());
  
  // Description - toujours envoyer, même si vide
  formData.append('description', data.description || '');
  
  // Booléens - toujours envoyer
  formData.append('en_stock', data.en_stock ? '1' : '0');
  formData.append('active', data.active ? '1' : '0');
  
  // Pour l'image principale : seulement si c'est un nouveau fichier
  // Si ce n'est pas un File, on ne l'envoie pas (le backend gardera l'image existante)
  if (data.image_principale instanceof File) {
    formData.append('image_principale', data.image_principale);
  }
  
  // Pour les images secondaires : seulement les nouveaux fichiers
  // Les images existantes sont conservées par le backend
  if (data.images_secondaires && data.images_secondaires.length > 0) {
    data.images_secondaires.forEach((image) => {
      if (image instanceof File) {
        formData.append('images_secondaires[]', image);
      }
    });
  }
  
  return formData;
};

