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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('size')->nullable()->after('quantity'); // অর্ডারের সাইজ সেভ করার জন্য
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('size'); // মাইগ্রেশন রোলব্যাক করলে সাইজ কলাম মুছে যাবে
        });
    }
};
