<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

use App\Http\Controllers\AdminController;
use App\Http\Controllers\TeacherController;

Route::get('/admin/dashboard', [AdminController::class, 'index'])
    ->name('admin.dashboard');

Route::get('/teacher/dashboard', [TeacherController::class, 'index'])
    ->name('teacher.dashboard');

Route::post('/teacher/attendance', [TeacherController::class, 'markAttendance'])->name('teacher.attendance');
Route::post('/teacher/results/upload', [TeacherController::class, 'uploadResults'])->name('teacher.results.upload');
Route::post('/teacher/announcements', [TeacherController::class, 'postAnnouncement'])->name('teacher.announcements');



