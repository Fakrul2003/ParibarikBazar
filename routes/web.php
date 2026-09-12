<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\BannerController;
use Inertia\Inertia;

Route::post('/admin/banner/store', [BannerController::class, 'store']);
Route::get('/category/{category}', [OrderController::class, 'showByCategory'])->name('category.show');

// navOption  এখানে
Route::get('/about', function () {
    return Inertia::render('navOption/About');
})->name('about');

Route::get('/wishlists', function () {
    return Inertia::render('navOption/Wishlists');
})->name('wishlists');

Route::get('/faqs', function () {
    return Inertia::render('navOption/Faqs');
})->name('faqs');



// হোমপেজে প্রোডাক্ট লিস্ট সহ ওয়েলকাম পেজ দেখানোর জন্য
Route::get('/', [OrderController::class, 'index'])->name('home');
Route::get('/products/{product}', [OrderController::class, 'show'])->name('product.show');

// ইউজার প্রোডাক্ট অর্ডার করলে তা প্রসেস করার রুট
Route::post('/order/store', [OrderController::class, 'store'])->name('order.store');

// লগইন করা ইউজার ও অ্যাডমিনের ড্যাশবোর্ড এবং স্ট্যাটাস আপডেটের রুটসমূহ
Route::middleware(['auth', 'verified'])->group(function () {
    // ড্যাশবোর্ড পেজ (ইউজার ও অ্যাডমিন নেভিগেশন)
    Route::get('/dashboard', [OrderController::class, 'dashboard'])->name('dashboard');

    // অ্যাডমিন আলাদা পেজসমূহ
    Route::get('/admin/dashboard', [OrderController::class, 'adminDashboard'])->name('admin.dashboard');
    Route::get('/admin/orders', [OrderController::class, 'adminOrders'])->name('admin.orders');
    Route::get('/admin/products', [OrderController::class, 'adminProducts'])->name('admin.products');
    Route::get('/admin/invoices', [OrderController::class, 'adminInvoices'])->name('admin.invoices');
    Route::get('/admin/messages', [OrderController::class, 'adminMessages'])->name('admin.messages');

    // অ্যাডমিন প্রোডাক্ট এবং অর্ডার স্ট্যাটাস অ্যাকশন
    Route::post('/admin/product/store', [OrderController::class, 'storeProduct'])->name('admin.product.store');
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
    Route::patch('/orders/{order}/accept', [OrderController::class, 'acceptOrder'])->name('orders.accept');
    Route::patch('/orders/{order}/reject', [OrderController::class, 'rejectOrder'])->name('orders.reject');

    Route::get('/product/{product}', [OrderController::class, 'show'])->name('product.show');
});

require __DIR__ . '/settings.php';
