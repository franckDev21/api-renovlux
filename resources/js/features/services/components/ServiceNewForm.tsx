"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from '@/components/ui/switch'   
import { Service } from "@/features/services/types/service"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploadField } from "@/components/ImageUploadField"

import { useCreateService, useUpdateService } from '@/features/services/hooks/useServices';
import { Loader2 } from "lucide-react"

import { router } from '@inertiajs/react'
import MultiSelectCreatable from "@/components/MultiSelectCreatable"

interface ServiceFormProps {
  service?: Service
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères.",
  }),
  is_active: z.boolean(),
  image: z.any().optional(),
})

export function ServiceNewForm({ service }: ServiceFormProps) {
  const isEdit = !!service;
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const mutation = isEdit ? updateMutation : createMutation;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: service?.name ?? '',
      description: service?.description ?? '',
      is_active: isEdit ? service.is_active : true,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isEdit && service) {
      updateMutation.mutate(
        { id: service.id.toString(), data: values },
        {
          onSuccess: (data) => {
            console.log("Service mis à jour :", data)
            router.visit('/company-services/home', { replace: true })
          },
        }
      )
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          router.visit('/company-services/home', { replace: true })
        },
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
        <div className="flex items-start space-x-4">
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
          <div className="w-3/4 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du service</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du service..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Nom public du service.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <MultiSelectCreatable />

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

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Service actif</FormLabel>
                    <FormDescription>
                      Le service sera visible s’il est actif.
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
          </div>
        </div>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isEdit ? "Mettre à jour" : "Créer le service"}
        </Button>
      </form>
    </Form>
  )
}
