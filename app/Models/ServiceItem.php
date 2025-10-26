<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'service_id'
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
