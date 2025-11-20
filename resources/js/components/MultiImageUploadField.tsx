"use client"

import React, { useEffect, useId, useMemo, useState } from "react"
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ImageIcon, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface MultiImageUploadFieldProps {
  label?: string
  field: {
    onChange: (value: File[]) => void
    value: File[] | string[]
  }
  defaultImageUrls?: string[]
  existingImageUrls?: string[]
  onExistingImagesChange?: (urls: string[]) => void
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
  existingImageUrls = [],
  onExistingImagesChange,
  className,
  maxImages = 10,
}: MultiImageUploadFieldProps) {
  const [visibleExistingUrls, setVisibleExistingUrls] = useState<string[]>(
    existingImageUrls.length > 0 ? existingImageUrls : defaultImageUrls
  )
  const [filePreviews, setFilePreviews] = useState<{ url: string; fileIndex: number }[]>([])
  const addInputId = useId()
  const initialInputId = useId()

  // Réinitialiser l'affichage des images existantes quand elles changent
  useEffect(() => {
    if (existingImageUrls.length > 0) {
      setVisibleExistingUrls(existingImageUrls)
    } else {
      setVisibleExistingUrls(defaultImageUrls)
    }
  }, [existingImageUrls, defaultImageUrls])

  // Convertir les nouveaux fichiers en URLs de prévisualisation
  useEffect(() => {
    const files = Array.isArray(field.value)
      ? field.value.filter((item): item is File => item instanceof File)
      : []

    const previews = files.map((file, index) => ({
      url: URL.createObjectURL(file),
      fileIndex: index,
    }))

    setFilePreviews(previews)

    return () => {
      previews.forEach((preview) => {
        if (preview.url.startsWith("blob:")) {
          URL.revokeObjectURL(preview.url)
        }
      })
    }
  }, [field.value])

  const previewItems = useMemo(() => {
    const existingItems = visibleExistingUrls.map((url, index) => ({
      type: "existing" as const,
      url,
      existingIndex: index,
    }))

    const newItems = filePreviews.map((preview) => ({
      type: "new" as const,
      url: preview.url,
      fileIndex: preview.fileIndex,
    }))

    return [...existingItems, ...newItems]
  }, [filePreviews, visibleExistingUrls])

  const existingCount = visibleExistingUrls.length
  const newFilesCount = filePreviews.length
  const totalCount = existingCount + newFilesCount

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const currentFiles = Array.isArray(field.value) 
        ? field.value.filter((item): item is File => item instanceof File)
        : []
      
      const availableSlots = Math.max(maxImages - existingCount - currentFiles.length, 0)
      const filesToAdd = files.slice(0, availableSlots)

      const newFiles = [...currentFiles, ...filesToAdd]
      field.onChange(newFiles)
    }
    // Réinitialiser l'input pour permettre de sélectionner le même fichier
    e.target.value = ""
  }

  const handleRemoveImage = (item: (typeof previewItems)[number]) => {
    if (item.type === "existing") {
      setVisibleExistingUrls((prev) => {
        const next = prev.filter((url, index) => !(index === item.existingIndex && url === item.url))
        onExistingImagesChange?.(next)
        return next
      })
      return
    }

    const currentFiles = Array.isArray(field.value) 
      ? field.value.filter((value): value is File => value instanceof File)
      : []
    
    const newFiles = currentFiles.filter((_, index) => index !== item.fileIndex)
    field.onChange(newFiles)
  }

  const canAddMore = totalCount < maxImages

  return (
    <FormItem className={cn("flex flex-col space-y-2", className)}>
      {label && <FormLabel>{label}</FormLabel>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {previewItems.map((item, index) => (
          <div
            key={index}
            className="relative group rounded-md border overflow-hidden"
          >
            {item.url ? (
              <>
                <img
                  src={item.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(item)}
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
            htmlFor={addInputId}
            className={cn(
              "relative flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-4 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800/50 h-32"
            )}
          >
            <input
              id={addInputId}
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

      {previewItems.length === 0 && (
        <label
          htmlFor={initialInputId}
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-8 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800/50"
          )}
        >
          <input
            id={initialInputId}
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
      {previewItems.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {totalCount} image{totalCount > 1 ? "s" : ""} sélectionnée{totalCount > 1 ? "s" : ""}
          {maxImages && ` (maximum ${maxImages})`}
        </p>
      )}
    </FormItem>
  )
}

