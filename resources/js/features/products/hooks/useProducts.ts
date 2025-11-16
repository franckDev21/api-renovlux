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
      toast.success('Produit mis à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      toast.error("Erreur lors de la mise à jour du produit");
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

