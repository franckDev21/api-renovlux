import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as productApi from '../api/productApi';
import { ProductFormData, ProductFilters } from '../types/product';

export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const data = await productApi.fetchProducts(filters);
      return data;
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.fetchProduct(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductFormData) => {
      const formData = productApi.toFormData(data);
      return productApi.createProduct(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit créé avec succès');
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      toast.error("Erreur lors de la création du produit");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductFormData }) => {
      const formData = productApi.toFormData(data);
      return productApi.updateProduct(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      toast.success('Produit mis à jour avec succès');
    },
    onError: (error: unknown) => {
      console.error('Error updating product:', error);
      
      // Gérer les erreurs de validation (422)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { errors?: Record<string, string[]>; message?: string; error?: string } } };
        
        if (axiosError.response?.status === 422) {
          const validationErrors = axiosError.response.data?.errors;
          if (validationErrors) {
            const firstError = Object.values(validationErrors)[0];
            const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
            toast.error(errorMessage || "Erreur de validation");
            return;
          }
        }
        
        // Autres erreurs
        const errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error || "Erreur lors de la mise à jour du produit";
        toast.error(errorMessage);
        return;
      }
      
      // Erreur générique
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la mise à jour du produit";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit supprimé avec succès');
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      toast.error("Erreur lors de la suppression du produit");
    },
  });
};

