<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class ServiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name, // Mappage de title vers name pour le frontend
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'duration' => (int) $this->duration,
            'is_active' => (bool) $this->is_active,
            'image' => $this->image ? asset('storage/'.$this->image) : null,
            'features' => $this->whenLoaded('serviceItems', function () {
                return $this->serviceItems->pluck('title');
            }),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
