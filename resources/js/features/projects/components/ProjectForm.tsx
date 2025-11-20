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
import { Textarea } from "@/components/ui/textarea"
import { ImageUploadField } from "@/components/ImageUploadField"
import { MultiImageUploadField } from "@/components/MultiImageUploadField"

import { Loader2 } from "lucide-react"
import { Project } from "../../projects/types/project"
import { ProjectFormData } from "../../projects/types/project"
import { useCreateProject, useUpdateProject } from "../hooks/useProjects"
import { router } from "@inertiajs/react"

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
})

type FormValues = z.infer<typeof formSchema>

export function ProjectForm({ project }: ProjectFormProps) {
  const isEdit = !!project;
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const mutation = isEdit ? updateMutation : createMutation;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title ?? '',
      description: project?.description ?? '',
      image: undefined,
      secondary_images: [],
    },
  })

  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        description: project.description || '',
        image: undefined,
        secondary_images: [],
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
          </div>
        </div>

        <FormField
          control={form.control}
          name="secondary_images"
          render={({ field }) => (
            <MultiImageUploadField
              label="Images secondaires"
              field={{
                onChange: (files: File[]) => field.onChange(files),
                value: (field.value || []) as File[],
              }}
              defaultImageUrls={project?.secondary_images || []}
              maxImages={10}
            />
          )}
        />

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
