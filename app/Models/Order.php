<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'product_id',
        'name',
        'address',
        'phone',
        'quantity',
        'size',
        'size_data',
        'total_price',
        'status'
    ];

    protected $appends = [
        'sizes_data'
    ];

    public function getSizesDataAttribute()
    {
        return $this->attributes['size_data'] ?? null;
    }

    // এই রিলেসনশিপ যোগ করা হইচে
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
