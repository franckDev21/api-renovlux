"use client"

import React, { useEffect, useState } from "react"
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ImageIcon, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface MultiImageUploadFieldProps {
  label?: string
  field: {
    onChange: (value: File[]) => void
    value: File[] | string[]
  }
  defaultImageUrls?: string[]
  className?: string
  maxImages?: number
}

/**
 * Champ d'upload d'images multiples avec prévisualisation intégrée.
 * Compatible avec react-hook-form et shadcn/ui.
 */
export function MultiImageUploadField({
  label = "Images",
  field,
  defaultImageUrls = [],
  className,
  maxImages = 10,
}: MultiImageUploadFieldProps) {
  const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([])

  // Convertir les valeurs en URLs de prévisualisation
  useEffect(() => {
    const urls: (string | null)[] = []
    
    // Gérer les fichiers
    if (field.value && Array.isArray(field.value)) {
      field.value.forEach((item) => {
        if (item instanceof File) {
          const url = URL.createObjectURL(item)
          urls.push(url)
        } else if (typeof item === "string") {
          urls.push(item)
        }
      })
    }
    
    // Ajouter les images par défaut si nécessaire
    if (urls.length === 0 && defaultImageUrls.length > 0) {
      urls.push(...defaultImageUrls)
    }
    
    setPreviewUrls(urls)
    
    // Nettoyer les URLs des fichiers
    return () => {
      urls.forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [field.value, defaultImageUrls])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const currentFiles = Array.isArray(field.value) 
        ? field.value.filter((item) => item instanceof File) as File[]
        : []
      
      const newFiles = [...currentFiles, ...files].slice(0, maxImages)
      field.onChange(newFiles)
    }
    // Réinitialiser l'input pour permettre de sélectionner le même fichier
    e.target.value = ""
  }

  const handleRemoveImage = (index: number) => {
    const currentFiles = Array.isArray(field.value) 
      ? field.value.filter((item) => item instanceof File) as File[]
      : []
    
    const newFiles = currentFiles.filter((_, i) => i !== index)
    field.onChange(newFiles)
  }

  const canAddMore = previewUrls.length < maxImages

  return (
    <FormItem className={cn("flex flex-col space-y-2", className)}>
      {label && <FormLabel>{label}</FormLabel>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {previewUrls.map((url, index) => (
          <div
            key={index}
            className="relative group rounded-md border overflow-hidden"
          >
            {url ? (
              <>
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="w-full h-32 flex items-center justify-center bg-muted">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {canAddMore && (
          <label
            htmlFor="multi-image-upload"
            className={cn(
              "relative flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-4 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800/50 h-32"
            )}
          >
            <input
              id="multi-image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <Plus className="mb-2 h-6 w-6 text-gray-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Ajouter
            </p>
          </label>
        )}
      </div>

      {previewUrls.length === 0 && (
        <label
          htmlFor="multi-image-upload-initial"
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-8 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800/50"
          )}
        >
          <input
            id="multi-image-upload-initial"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cliquez pour télécharger ou glisser-déposer
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG, GIF (max. 2MB par image)
          </p>
        </label>
      )}

      <FormMessage />
      {previewUrls.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {previewUrls.length} image{previewUrls.length > 1 ? "s" : ""} sélectionnée{previewUrls.length > 1 ? "s" : ""}
          {maxImages && ` (maximum ${maxImages})`}
        </p>
      )}
    </FormItem>
  )
}

