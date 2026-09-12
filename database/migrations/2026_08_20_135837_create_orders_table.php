<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('address');
            $table->string('phone');
            $table->integer('quantity')->default(1);
            $table->text('size_data')->nullable(); // এখানে সাইজ কলামটি যুক্ত করা হলো
            $table->decimal('total_price', 10, 2);
            $table->string('status')->default('Pending'); // Pending, Out for Delivery, Delivered
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
