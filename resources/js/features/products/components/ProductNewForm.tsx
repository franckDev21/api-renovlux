"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react"

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
import { Product } from "@/features/products/types/product"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploadField } from "@/components/ImageUploadField"
import { MultiImageUploadField } from "@/components/MultiImageUploadField"

import { useCreateProduct, useUpdateProduct } from '@/features/products/hooks/useProducts';
import { Loader2 } from "lucide-react"
import { ProductFormData } from '@/features/products/types/product';

import { router } from '@inertiajs/react'

interface ProductFormProps {
  product?: Product
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  price: z.number().min(0, {
    message: "Le prix doit être supérieur ou égal à 0.",
  }),
  description: z.string().optional(),
  image_principale: z.any().optional(),
  images_secondaires: z.array(z.any()).optional(),
  existing_images_secondaires: z.array(z.string()).optional(),
  en_stock: z.boolean(),
  active: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

export function ProductNewForm({ product }: ProductFormProps) {
  const isEdit = !!product;
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const mutation = isEdit ? updateMutation : createMutation;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name ?? '',
      price: product?.price ?? 0,
      description: product?.description ?? '',
      en_stock: isEdit ? product?.en_stock ?? true : true,
      active: isEdit ? product?.active ?? true : true,
      image_principale: undefined,
      images_secondaires: [],
      existing_images_secondaires: product ? product.images_secondaires ?? [] : undefined,
    },
  })

  // Mettre à jour les valeurs du formulaire quand le produit change
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        price: product.price,
        description: product.description || '',
        en_stock: product.en_stock,
        active: product.active,
        image_principale: undefined, // On garde undefined pour ne pas forcer une nouvelle image
        images_secondaires: [], // On initialise vide, les images existantes sont gérées par defaultImageUrls
        existing_images_secondaires: product.images_secondaires ?? [],
      })
    }
  }, [product, form])

  const existingSecondaryImages = form.watch("existing_images_secondaires")
  const normalizedExistingSecondaryImages = existingSecondaryImages ?? []

  const handleExistingImagesChange = (urls: string[]) => {
    form.setValue("existing_images_secondaires", urls, {
      shouldDirty: true,
    })
  }

  function onSubmit(values: FormValues) {
    // Convertir les images secondaires en File[]
    const imagesSecondaires = (values.images_secondaires || []).filter((img): img is File => img instanceof File);
    const existingSecondaryImages = values.existing_images_secondaires ?? (product?.images_secondaires ?? []);
    
    const formData: ProductFormData = {
      name: values.name,
      price: values.price,
      description: values.description || '',
      en_stock: values.en_stock,
      active: values.active,
      image_principale: values.image_principale instanceof File ? values.image_principale : undefined,
      images_secondaires: imagesSecondaires,
      existing_images_secondaires: existingSecondaryImages,
    };

    console.log('Form data to send:', formData);

    if (isEdit && product) {
      updateMutation.mutate(
        { id: product.id.toString(), data: formData },
        {
          onSuccess: (data) => {
            console.log("Produit mis à jour :", data)
            router.visit('/products/home', { replace: true })
          },
          onError: (error) => {
            console.error("Erreur lors de la mise à jour:", error)
          }
        }
      )
    } else {
      console.log("Création du produit :", formData)
      createMutation.mutate(formData, {
        onSuccess: () => {
          router.visit('/products/home', { replace: true })
        },
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
        <div className="flex items-start md:flex-row flex-col space-x-4">
          <FormField
            control={form.control}
            name="image_principale"
            render={({ field }) => (
              <ImageUploadField
                label="Image principale"
                field={field}
                defaultImageUrl={product?.image_principale || undefined}
              />
            )}
          />
          <div className="w-full md:w-3/4 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du produit</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du produit..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Nom public du produit.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        field.onChange(isNaN(value) ? 0 : value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Prix du produit en euros.
                  </FormDescription>
                  <FormMessage />
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
                      placeholder="Décrivez le produit en détail..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="en_stock"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">En stock</FormLabel>
                      <FormDescription>
                        Le produit est disponible en stock.
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
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Produit actif</FormLabel>
                      <FormDescription>
                        Le produit sera visible s'il est actif.
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
        </div>

        <FormField
          control={form.control}
          name="images_secondaires"
          render={({ field }) => (
            <MultiImageUploadField
              label="Images secondaires"
              field={{
                onChange: (files: File[]) => field.onChange(files),
                value: (field.value || []) as File[],
              }}
              defaultImageUrls={product?.images_secondaires || []}
              existingImageUrls={normalizedExistingSecondaryImages}
              onExistingImagesChange={handleExistingImagesChange}
              maxImages={10}
            />
          )}
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isEdit ? "Mettre à jour" : "Créer le produit"}
        </Button>
      </form>
    </Form>
  )
}

