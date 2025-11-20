<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Convertir les chemins des images secondaires en URLs complètes
        // Ne transformer que si ce n'est pas déjà une URL complète
        $imagesSecondaires = collect($this->images_secondaires ?? [])->map(function ($image) {
            if (!$image) {
                return null;
            }
            
            // Si c'est déjà une URL complète (commence par http:// ou https://), la retourner telle quelle
            if (str_starts_with($image, 'http://') || str_starts_with($image, 'https://')) {
                return $image;
            }
            
            // Sinon, c'est un chemin relatif, on le transforme en URL complète
            return asset('storage/' . ltrim($image, '/'));
        })->filter()->values()->toArray();

        // Fonction helper pour normaliser l'image principale
        $normalizeImagePath = function ($image) {
            if (!$image) {
                return null;
            }
            
            // Si c'est déjà une URL complète, la retourner telle quelle
            if (str_starts_with($image, 'http://') || str_starts_with($image, 'https://')) {
                return $image;
            }
            
            // Sinon, c'est un chemin relatif, on le transforme en URL complète
            return asset('storage/' . ltrim($image, '/'));
        };

        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => (float) $this->price,
            'image_principale' => $normalizeImagePath($this->image_principale),
            'images_secondaires' => $imagesSecondaires,
            'description' => $this->description,
            'en_stock' => (bool) $this->en_stock,
            'active' => (bool) $this->active,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'created_by' => $this->whenLoaded('createdBy', function () {
                return [
                    'id' => $this->createdBy->id,
                    'name' => $this->createdBy->name,
                    'email' => $this->createdBy->email,
                ];
            }),
        ];
    }
}

