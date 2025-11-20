<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convertir les strings '1'/'0' en booléens pour la validation
        if ($this->has('en_stock')) {
            $value = $this->input('en_stock');
            // Convertir '1', 'true', 1, true en true, sinon false
            $boolValue = ($value === '1' || $value === 1 || $value === 'true' || $value === true);
            $this->merge([
                'en_stock' => $boolValue,
            ]);
        }
        
        if ($this->has('active')) {
            $value = $this->input('active');
            // Convertir '1', 'true', 1, true en true, sinon false
            $boolValue = ($value === '1' || $value === 1 || $value === 'true' || $value === true);
            $this->merge([
                'active' => $boolValue,
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'image_principale' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'images_secondaires' => 'sometimes|nullable|array',
            'images_secondaires.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'existing_images_secondaires' => 'sometimes|array',
            'existing_images_secondaires.*' => 'string',
            'existing_images_secondaires_submitted' => 'sometimes|boolean',
            'description' => 'nullable|string',
            'en_stock' => 'required|boolean',
            'active' => 'required|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom du produit est obligatoire.',
            'price.required' => 'Le prix est obligatoire.',
            'price.numeric' => 'Le prix doit être un nombre.',
            'price.min' => 'Le prix doit être supérieur ou égal à 0.',
            'image_principale.image' => 'L\'image principale doit être un fichier image valide.',
            'image_principale.mimes' => 'L\'image principale doit être de type : jpeg, png, jpg, gif, svg.',
            'image_principale.max' => 'L\'image principale ne peut pas dépasser 2MB.',
            'images_secondaires.array' => 'Les images secondaires doivent être un tableau.',
            'images_secondaires.*.image' => 'Chaque image secondaire doit être un fichier image valide.',
            'images_secondaires.*.mimes' => 'Chaque image secondaire doit être de type : jpeg, png, jpg, gif, svg.',
            'images_secondaires.*.max' => 'Chaque image secondaire ne peut pas dépasser 2MB.',
            'existing_images_secondaires.array' => 'Les images secondaires existantes doivent être un tableau.',
            'existing_images_secondaires.*.string' => 'Chaque image secondaire existante doit être une URL valide.',
            'existing_images_secondaires_submitted.boolean' => 'Le champ de suivi des images secondaires est invalide.',
        ];
    }
}

