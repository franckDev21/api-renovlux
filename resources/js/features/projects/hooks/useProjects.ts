import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as projectApi from '../api/projectApi';
import { ProjectFormData, ProjectFilters } from '../types/project';

export const useProjects = (filters: ProjectFilters = {}) => {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const data = await projectApi.fetchProjects(filters);
      return data;
    },
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectApi.fetchProject(id),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectFormData) => {
      const formData = projectApi.toFormData(data);
      return projectApi.createProject(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projet créé avec succès');
    },
    onError: (error) => {
      console.error('Error creating project:', error);
      toast.error("Erreur lors de la création du projet");
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProjectFormData }) => {
      const formData = projectApi.toFormData(data);
      return projectApi.updateProject(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project'] });
      toast.success('Projet mis à jour avec succès');
    },
    onError: (error: unknown) => {
      console.error('Error updating project:', error);
      toast.error("Erreur lors de la mise à jour du projet");
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projet supprimé avec succès');
    },
    onError: (error) => {
      console.error('Error deleting project:', error);
      toast.error("Erreur lors de la suppression du projet");
    },
  });
};
