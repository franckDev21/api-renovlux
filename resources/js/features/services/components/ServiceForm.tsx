import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import React from 'react';

import { router } from '@inertiajs/react'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Service } from '../types/service';
import { useCreateService, useUpdateService } from '../hooks/useServices';
import { ImageUploadField } from '@/components/ImageUploadField';
import MultiSelectCreatable from '@/components/MultiSelectCreatable';

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Le nom du service est requis.",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères.",
  }),
  is_active: z.boolean(),
  image: z.any().optional(),
  service_items: z.array(z.string().min(1, "L'élément ne peut pas être vide")).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ServiceFormProps {
  service?: Service;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ServiceForm({ service, onSuccess, onCancel }: ServiceFormProps) {
  const isEdit = !!service;
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const mutation = isEdit ? updateMutation : createMutation;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: service?.name ?? '',
      description: service?.description ?? '',
      is_active: service?.is_active ?? true,
      service_items: service?.features || [],
      image: service?.image || undefined,
    },
  });

  // Convertir les features en options pour le MultiSelectCreatable
  const featureOptions = React.useMemo(() => {
    return service?.features?.map(feature => ({
      value: feature,
      label: feature
    })) || [];
  }, [service?.features]);


  const handleSubmit = (values: FormValues) => {
    const formData = new FormData();
    
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('is_active', String(values.is_active));
    
    if (values.image && values.image instanceof File) {
      formData.append('image', values.image);
    }
    
    if (values.service_items && values.service_items.length > 0) {
      values.service_items.forEach((item, index) => {
        formData.append(`service_items[${index}]`, item);
      });
    }

    if (isEdit && service) {
      updateMutation.mutate(
        { id: service.id.toString(), data: values },
        {
          onSuccess: () => {
            router.visit('/company-services/home', { replace: true })
          },
        }
      )
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          onSuccess();
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 _md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du service</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du service" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="service_items"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MultiSelectCreatable
                    name="service_items"
                    label="Fonctionnalités du service"
                    description="Ajoutez les fonctionnalités de votre service"
                    options={featureOptions}
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Statut</FormLabel>
                  <FormDescription>
                    Activez ou désactivez la visibilité de ce service
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
                  
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description détaillée du service"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <ImageUploadField
                label="Image du service"
                field={field}
                defaultImageUrl={service?.image}
              />
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={mutation.isPending}>
            Annuler
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Mettre à jour' : 'Créer le service'}
          </Button>
        </div>
      </form>
    </Form>
  );
}