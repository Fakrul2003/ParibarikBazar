<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'price',
        'stock',
        'sizes',
        'image',
        'image_2', // নতুন যোগ করুন
        'image_3',
        'images',
        'offers',
    ];

    protected $casts = [
        'images' => 'array',
        'offers' => 'array',
    ];
}
