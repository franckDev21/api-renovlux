<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'price',
        'image_principale',
        'images_secondaires',
        'description',
        'en_stock',
        'active',
        'creé_par',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'images_secondaires' => 'array',
        'en_stock' => 'boolean',
        'active' => 'boolean',
    ];

    /**
     * Get the user that created the product.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creé_par');
    }
}

