<?php

use App\Http\Controllers\UserController;
use App\Http\Middleware\HandleAdmin;
use App\Http\Middleware\HandleUsers;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('Login');
})->name('home');


Route::post('/login',[UserController::class, 'Login']);

Route::get('/dashboard/student', [UserController::class, 'studentDashboard'])->middleware(HandleUsers::class);
Route::get('/dashboard/admin', [UserController::class, 'adminDashboard'])->middleware(HandleAdmin::class);
Route::get('/dashboard/teacher',[UserController::class, 'teacherDashboard'])->middleware(HandleUsers::class);


Route::post('/adduser', [UserController::class,'addUser'])->middleware(HandleAdmin::class);
Route::post('/addcourse', [UserController::class, 'addcourse'])->middleware(HandleAdmin::class);
Route::post('/enrollstudent', [UserController::class, 'enrollStudent'])->middleware(HandleAdmin::class);
Route::post('/markattendance', [UserController::class, 'markAttendance']);
Route::post('/uploadmarks', [UserController::class, 'uploadMarks']);