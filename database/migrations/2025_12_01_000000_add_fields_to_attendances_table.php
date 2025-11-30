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
        Schema::table('attendances', function (Blueprint $table) {
            if (!Schema::hasColumn('attendances', 'date')) {
                $table->date('date')->nullable()->after('markby');
            }
            if (!Schema::hasColumn('attendances', 'student_id')) {
                $table->unsignedBigInteger('student_id')->nullable()->after('date');
                $table->foreign('student_id')->references('id')->on('users');
            }
            if (!Schema::hasColumn('attendances', 'course_id')) {
                $table->unsignedBigInteger('course_id')->nullable()->after('student_id');
                $table->foreign('course_id')->references('id')->on('courses');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            if (Schema::hasColumn('attendances', 'course_id')) {
                $table->dropForeign(['course_id']);
                $table->dropColumn('course_id');
            }
            if (Schema::hasColumn('attendances', 'student_id')) {
                $table->dropForeign(['student_id']);
                $table->dropColumn('student_id');
            }
            if (Schema::hasColumn('attendances', 'date')) {
                $table->dropColumn('date');
            }
        });
    }
};
