import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as serviceApi from '../api/serviceApi';
import { ServiceFormData, ServiceFilters } from '../types/service';

export const useServices = (filters: ServiceFilters = {}) => {
  return useQuery({
    queryKey: ['services', filters],
    queryFn: async () => {
      const data = await serviceApi.fetchServices(filters);
      console.log('Services data:', data);
      return data;
    },
  });
};

export const useService = (id: string) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => serviceApi.fetchService(id),
    enabled: !!id,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ServiceFormData) => {
      const formData = serviceApi.toFormData(data);
      return serviceApi.createService(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service créé avec succès');
    },
    onError: (error) => {
      console.error('Error creating service:', error);
      toast.error("Erreur lors de la création du service");
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceFormData }) => {
      const formData = serviceApi.toFormData(data);
      return serviceApi.updateService(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service mis à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating service:', error);
      toast.error("Erreur lors de la mise à jour du service");
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => serviceApi.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service supprimé avec succès');
    },
    onError: (error) => {
      console.error('Error deleting service:', error);
      toast.error("Erreur lors de la suppression du service");
    },
  });
};

export const useToggleServiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      serviceApi.toggleServiceStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Statut du service mis à jour');
    },
    onError: (error) => {
      console.error('Error toggling service status:', error);
      toast.error("Erreur lors de la mise à jour du statut");
    },
  });
};
