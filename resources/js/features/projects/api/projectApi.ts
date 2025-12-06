import axios from 'axios';
import { Project, ProjectApiResponse, ProjectFilters, ProjectFormData } from '../types/project';

const API_BASE_URL = '/api/projects';

export const fetchProjects = async (filters: ProjectFilters = {}): Promise<ProjectApiResponse> => {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.sortBy || filters.sort_by) params.append('sort_by', filters.sortBy || filters.sort_by || 'created_at');
  if (filters.sortOrder || filters.sort_order) params.append('sort_order', filters.sortOrder || filters.sort_order || 'desc');
  if (filters.page) params.append('page', String(filters.page));
  if (filters.perPage || filters.per_page) params.append('per_page', String(filters.perPage || filters.per_page || 15));

  const response = await axios.get<ProjectApiResponse>(`${API_BASE_URL}?${params.toString()}`);
  return response.data;
};

export const fetchProject = async (id: string): Promise<Project> => {
  const response = await axios.get<{ data: Project }>(`${API_BASE_URL}/${id}`);
  return response.data.data;
};

export const createProject = async (data: FormData): Promise<Project> => {
  const response = await axios.post<{ data: Project }>(API_BASE_URL, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const updateProject = async (id: string, data: FormData): Promise<Project> => {
  // L'API accepte POST /api/projects/{project} pour update
  const response = await axios.post<{ data: Project }>(`${API_BASE_URL}/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};

export const deleteSecondaryImage = async (id: string, imagePath: string): Promise<void> => {
  // La route backend accepte DELETE /api/projects/{project}/secondary-images/{imagePath}
  // imagePath peut contenir des slashes, il faut l'encoder correctement
  const encoded = encodeURIComponent(imagePath);
  await axios.delete(`${API_BASE_URL}/${id}/secondary-images/${encoded}`);
};

export const toFormData = (data: ProjectFormData): FormData => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description || '');
  formData.append('category_id', String(data.category_id));

  // Gestion de l'image principale
  if (data.image instanceof File) {
    formData.append('image', data.image);
  }

  // Gestion des images secondaires existantes
  if (data.existing_secondary_images && data.existing_secondary_images.length > 0) {
    data.existing_secondary_images.forEach((imageUrl) => {
      if (typeof imageUrl === 'string') {
        formData.append('existing_secondary_images[]', imageUrl);
      }
    });
  }

  // Gestion des nouvelles images secondaires
  if (data.secondary_images && data.secondary_images.length > 0) {
    data.secondary_images.forEach((file) => {
      if (file instanceof File) {
        formData.append('secondary_images[]', file);
      }
    });
  }

  // Ajouter un indicateur pour indiquer que les images existantes ont été soumises
  formData.append('existing_secondary_images_submitted', 'true');

  return formData;
};
