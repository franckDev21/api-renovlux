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
        $imagesSecondaires = collect($this->images_secondaires ?? [])->map(function ($image) {
            return $image ? asset('storage/' . $image) : null;
        })->filter()->values()->toArray();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => (float) $this->price,
            'image_principale' => $this->image_principale ? asset('storage/' . $this->image_principale) : null,
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

