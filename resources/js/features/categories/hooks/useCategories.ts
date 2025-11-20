import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as categoryApi from '../api/categoryApi';
import { Category } from '../types/category';

export const useCategories = (search?: string) => {
  return useQuery({
    queryKey: ['categories', { search }],
    queryFn: async () => {
      const data = await categoryApi.fetchCategories(search);
      return data;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; slug?: string }) => categoryApi.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Catégorie créée avec succès');
    },
    onError: () => toast.error("Erreur lors de la création de la catégorie"),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: { name: string; slug?: string } }) => categoryApi.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Catégorie mise à jour avec succès');
    },
    onError: () => toast.error("Erreur lors de la mise à jour de la catégorie"),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Catégorie supprimée avec succès');
    },
    onError: () => toast.error("Erreur lors de la suppression de la catégorie"),
  });
};
