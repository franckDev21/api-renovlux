<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Convertir les chemins des images secondaires en URLs complètes
        $secondaryImages = collect($this->secondary_images ?? [])->map(function ($image) {
            return $image ? asset('storage/' . $image) : null;
        })->filter()->values()->toArray();

        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'title' => $this->title,
            'description' => $this->description,
            'image' => $this->image ? asset('storage/' . $this->image) : null,
            'secondary_images' => $secondaryImages,
            'created_at' => $this->created_at->translatedFormat('d M Y'),
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => $this->category->id,
                    'name' => $this->category->name
                ];
            })
        ];
    }
}
