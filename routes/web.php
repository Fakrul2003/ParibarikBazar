<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController; // অর্ডার কন্ট্রোলার ইমপোর্ট করা হলো

// হোমপেজে প্রোডাক্ট লিস্ট সহ ওয়েলকাম পেজ দেখানোর জন্য
Route::get('/', [OrderController::class, 'index'])->name('home');

// ইউজার প্রোডাক্ট অর্ডার করলে তা প্রসেস করার রুট
Route::post('/order/store', [OrderController::class, 'store'])->name('order.store');

// লগইন করা ইউজার ও অ্যাডমিনের ড্যাশবোর্ড এবং স্ট্যাটাস আপডেটের রুটসমূহ
Route::middleware(['auth', 'verified'])->group(function () {
    // ড্যাশবোর্ড পেজ (অর্ডার লিস্টসহ)
    Route::get('/dashboard', [OrderController::class, 'dashboard'])->name('dashboard');
     Route::post('/admin/product/store', [OrderController::class, 'storeProduct'])->name('admin.product.store');
    // ডেলিভারি ম্যান বা অ্যাডমিন স্ট্যাটাস আপডেট করার রুট
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
});

require __DIR__.'/settings.php';
