"use client"

import React, { useEffect, useState } from "react"
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ImageIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadFieldProps {
  label?: string
  field: {
    onChange: (value: File | string | null) => void
    value: File | string | null
  }
  defaultImageUrl?: string
  className?: string
}

/**
 * Champ d'upload d'image avec prévisualisation intégrée.
 * Compatible avec react-hook-form et shadcn/ui.
 */
export function ImageUploadField({
  label = "Image",
  field,
  defaultImageUrl,
  className,
}: ImageUploadFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Déterminer l’image à afficher initialement
  useEffect(() => {
    if (field.value instanceof File) {
      const url = URL.createObjectURL(field.value)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else if (typeof field.value === "string") {
      setPreviewUrl(field.value)
    } else if (defaultImageUrl) {
      setPreviewUrl(defaultImageUrl)
    } else {
      setPreviewUrl(null)
    }
  }, [field.value, defaultImageUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      field.onChange(file)
    }
  }

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    field.onChange(null)
    setPreviewUrl(defaultImageUrl ?? null)
  }

  return (
    <FormItem className={cn("flex flex-col space-y-2", className)}>
      {label && <FormLabel>{label}</FormLabel>}

      <label
        htmlFor="image-upload"
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-4 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800/50 overflow-hidden",
          previewUrl && "border-muted-foreground/20 hover:bg-muted/50"
        )}
      >
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {!previewUrl ? (
          <>
            <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cliquez pour télécharger ou glisser-déposer
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF (max. 2MB)
            </p>
          </>
        ) : (
          <>
            <img
              src={previewUrl}
              alt="Preview"
              className="h-48 w-full object-cover rounded-md"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        )}
      </label>

      <FormMessage />
    </FormItem>
  )
}
