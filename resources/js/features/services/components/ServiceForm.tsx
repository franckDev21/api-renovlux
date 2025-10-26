import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

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

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Le nom du service est requis.",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères.",
  }),
  is_active: z.boolean(),
  image: z.any().optional(),
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
    },
  });

  const handleSubmit = (values: FormValues) => {
    const formData = new FormData();
    
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('is_active', String(values.is_active));
    
    if (values.image && values.image instanceof File) {
      formData.append('image', values.image);
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Service actif</FormLabel>
                  <FormDescription>
                    Ce service sera visible pour les clients s'il est actif
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
          
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez le service en détail..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="md:col-span-2">
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