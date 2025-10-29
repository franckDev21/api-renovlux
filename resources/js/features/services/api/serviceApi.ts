import { Service, ServiceFormData, ServiceFilters, ServiceApiResponse } from '../types/service';
import axios from 'axios';

const API_BASE_URL = '/api/services';

export const fetchServices = async (filters: ServiceFilters = {}): Promise<ServiceApiResponse> => {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.is_active !== undefined) params.append('is_active', String(filters.is_active));
  if (filters.sortBy) params.append('sort_by', filters.sortBy);
  if (filters.sortOrder) params.append('sort_order', filters.sortOrder);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.perPage) params.append('per_page', String(filters.perPage));

  const response = await axios.get<ServiceApiResponse>(`${API_BASE_URL}?${params.toString()}`);
  return response.data;
};

export const fetchService = async (id: string): Promise<Service> => {
  const response = await axios.get<{ data: Service }>(`${API_BASE_URL}/${id}`);
  return response.data.data;
};

export const createService = async (data: FormData): Promise<Service> => {
  const response = await axios.post<{ data: Service }>(API_BASE_URL, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const updateService = async (id: string, data: FormData): Promise<Service> => {
  const response = await axios.post<{ data: Service }>(`${API_BASE_URL}/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-HTTP-Method-Override': 'PUT',
    },
  });
  return response.data.data;
};

export const deleteService = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};

export const toggleServiceStatus = async (id: string, isActive: boolean): Promise<void> => {
  await axios.patch(`${API_BASE_URL}/${id}/status`, { is_active: isActive });
};

// Helper function to convert ServiceFormData to FormData
export const toFormData = (data: ServiceFormData): FormData => {
  const formData = new FormData();
  
  formData.append('name', data.name);
  formData.append('description', data.description);
  // formData.append('price', data.price.toString());
  // formData.append('duration', data.duration.toString());
  formData.append('is_active', data.is_active ? '1' : '0');
  
  // Ajouter les éléments de service s'ils existent
  if (data.service_items && data.service_items.length > 0) {
    data.service_items.forEach((item, index) => {
      formData.append(`service_items[${index}]`, item);
    });
  }
  
  if (data.image instanceof File) {
    formData.append('image', data.image);
  } else if (typeof data.image === 'string') {
    // Si c'est une URL existante, on l'envoie comme une chaîne
    formData.append('image_url', data.image);
  }
  
  return formData;
};
