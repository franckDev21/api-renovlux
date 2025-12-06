"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"

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
import { Textarea } from "@/components/ui/textarea"
import { ImageUploadField } from "@/components/ImageUploadField"
import { MultiImageUploadField } from "@/components/MultiImageUploadField"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Loader2 } from "lucide-react"
import { Project } from "../../projects/types/project"
import { ProjectFormData } from "../../projects/types/project"
import { useCreateProject, useUpdateProject } from "../hooks/useProjects"
import { router } from "@inertiajs/react"
import { useCategories } from "@/features/categories/hooks/useCategories"

interface ProjectFormProps {
  project?: Project
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Le titre doit contenir au moins 2 caractères.",
  }),
  description: z.string().optional(),
  image: z.any().optional(),
  secondary_images: z.array(z.any()).optional(),
  existing_secondary_images: z.array(z.string()).optional(),
  category_id: z.union([
    z.string().min(1, "La catégorie est requise"),
    z.number().min(1, "La catégorie est requise")
  ]).refine(
    val => val !== undefined && val !== '' && val !== null,
    { message: "La catégorie est requise" }
  ),
})

type FormValues = z.infer<typeof formSchema>

export function ProjectForm({ project }: ProjectFormProps) {
  const isEdit = !!project;
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const mutation = isEdit ? updateMutation : createMutation;
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();

  const [existingSecondaryImages, setExistingSecondaryImages] = useState<string[]>(project?.secondary_images || []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title ?? '',
      description: project?.description ?? '',
      image: undefined,
      secondary_images: [],
      existing_secondary_images: project?.secondary_images || [],
      // S'assurer que category_id est une chaîne pour le composant Select
      category_id: project?.category_id ? String(project.category_id) : '',
    },
  })
  
  // Forcer la mise à jour de la valeur de la catégorie quand les données sont chargées
  useEffect(() => {
    if (project?.category_id && categoriesData?.data) {
      form.setValue('category_id', String(project.category_id), { shouldValidate: true });
    }
  }, [project?.category_id, categoriesData?.data, form])
  
  // Debug
  useEffect(() => {
    console.log('Form values:', form.getValues())
    console.log('Project category_id:', project?.category_id)
    console.log('Categories data:', categoriesData?.data)
  }, [form, project?.category_id, categoriesData?.data])

  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        description: project.description || '',
        image: undefined,
        secondary_images: [],
        // S'assurer que category_id est une chaîne pour le composant Select
        category_id: project.category_id ? String(project.category_id) : '',
      })
    }
  }, [project, form])

  function onSubmit(values: FormValues) {
    const imagesSecondaires = (values.secondary_images || []).filter((img): img is File => img instanceof File);

    const formData: ProjectFormData = {
      title: values.title,
      description: values.description || '',
      image: values.image instanceof File ? values.image : undefined,
      secondary_images: imagesSecondaires,
      existing_secondary_images: existingSecondaryImages,
      category_id: typeof values.category_id === 'string' && values.category_id !== '' ? values.category_id : Number(values.category_id),
    };

    if (isEdit && project) {
      updateMutation.mutate(
        { id: project.id.toString(), data: formData },
        {
          onSuccess: () => {
            router.visit('/projects/home', { replace: true })
          },
        }
      )
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          router.visit('/projects/home', { replace: true })
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
            name="image"
            render={({ field }) => (
              <ImageUploadField
                label="Image principale"
                field={field}
                defaultImageUrl={project?.image || undefined}
              />
            )}
          />
          <div className="w-full md:w-3/4 space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre du projet</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre du projet..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Nom public du projet.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value || '')}
                      defaultValue={String(field.value || '')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingCategories ? "Chargement..." : "Sélectionnez une catégorie"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesData?.data?.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
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
                      placeholder="Décrivez le projet en détail..."
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
              name="secondary_images"
              render={({ field: { value, onChange, ...field } }) => (
                <MultiImageUploadField
                  label="Images secondaires"
                  field={{
                    ...field,
                    value: value || [],
                    onChange: (files: File[]) => {
                      onChange(files);
                    },
                  }}
                  existingImageUrls={existingSecondaryImages}
                  onExistingImagesChange={setExistingSecondaryImages}
                  maxImages={5}
                />
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isEdit ? "Mettre à jour" : "Créer le projet"}
        </Button>
      </form>
    </Form>
  )
}
