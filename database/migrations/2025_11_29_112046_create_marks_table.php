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
        Schema::create('marks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('enrollid');
            $table->foreign('enrollid')->references('id')->on('enrollments');
            $table->enum('type',['Exam','Quiz','Assignment','Project']);
            $table->bigInteger('total_marks');
            $table->bigInteger('obtained_marks');
            $table->unsignedBigInteger('markby');
            $table->foreign('markby')->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marks');
    }
};
