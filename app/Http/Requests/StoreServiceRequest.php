<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class StoreServiceRequest extends FormRequest
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
    protected function prepareForValidation()
    {
        if ($this->hasFile('image')) {
            $this->merge([
                'image' => $this->handleImageUpload($this->file('image'))
            ]);
        }
    }

    /**
     * Handle image upload.
     */
    protected function handleImageUpload(UploadedFile $file): string
    {
        $filename = Str::random(20) . '.' . $file->getClientOriginalExtension();
        $file->storeAs('public/services', $filename);
        return 'storage/services/' . $filename;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            // 'price' => 'required|numeric|min:0',
            // 'duration' => 'required|integer|min:1',
            'is_active' => 'sometimes|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'service_items' => 'nullable|array',
            'service_items.*' => 'string|min:1',
        ];
    }
}
