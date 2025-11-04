<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Autoriser toutes les requêtes pour l'instant
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'secondary_images' => 'nullable|array',
            'secondary_images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'category_id' => 'required|exists:categories,id'
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'image.required' => 'The main image is required.',
            'image.image' => 'The main image must be a valid image file.',
            'image.mimes' => 'The main image must be a file of type: jpeg, png, jpg, gif, svg.',
            'image.max' => 'The main image may not be greater than 2MB.',
            'secondary_images.array' => 'Secondary images must be an array of files.',
            'secondary_images.*.image' => 'Each secondary image must be a valid image file.',
            'secondary_images.*.mimes' => 'Each secondary image must be a file of type: jpeg, png, jpg, gif, svg.',
            'secondary_images.*.max' => 'Each secondary image may not be greater than 2MB.',
        ];
    }
}
