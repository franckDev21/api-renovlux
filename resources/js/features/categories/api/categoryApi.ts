import axios from 'axios';
import { Category, CategoryApiResponse } from '../types/category';

const API_BASE_URL = '/api/categories';

export const fetchCategories = async (search?: string, perPage: number = 100): Promise<CategoryApiResponse> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  params.append('per_page', String(perPage));

  const response = await axios.get<CategoryApiResponse>(`${API_BASE_URL}?${params.toString()}`);
  return response.data;
};

export const fetchCategory = async (id: string | number): Promise<Category> => {
  const response = await axios.get<{ data: Category }>(`${API_BASE_URL}/${id}`);
  return response.data.data;
};

export const createCategory = async (payload: { name: string; slug?: string }): Promise<Category> => {
  const response = await axios.post<{ data: Category }>(API_BASE_URL, payload);
  return response.data.data;
};

export const updateCategory = async (id: string | number, payload: { name: string; slug?: string }): Promise<Category> => {
  const response = await axios.put<{ data: Category }>(`${API_BASE_URL}/${id}`, payload);
  return response.data.data;
};

export const deleteCategory = async (id: string | number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
