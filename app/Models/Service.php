<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'duration',
        'is_active',
        'image'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($service) {
            $service->slug = \Illuminate\Support\Str::slug($service->name);
        });

        static::updating(function ($service) {
            if ($service->isDirty('name')) {
                $service->slug = \Illuminate\Support\Str::slug($service->name);
            }
        });
    }

    public function serviceItems(): HasMany
    {
        return $this->hasMany(ServiceItem::class);
    }
}
