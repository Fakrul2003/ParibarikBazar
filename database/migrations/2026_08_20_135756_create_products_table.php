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
       Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('category')->default('General');
    $table->decimal('price', 10, 2);
    $table->integer('stock')->default(0);
    $table->string('sizes')->nullable();
    $table->string('image')->nullable();
    $table->string('image_2')->nullable(); // নতুন যোগ করুন
    $table->string('image_3')->nullable();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
