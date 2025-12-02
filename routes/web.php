<?php

use App\Http\Controllers\UserController;
use App\Http\Middleware\HandleAdmin;
use App\Http\Middleware\HandleStudents;
use App\Http\Middleware\HandleTeachers;
use App\Http\Middleware\HandleUsers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('Login');
})->name('home');


Route::post('/login', [UserController::class, 'Login']);

Route::get('/logout', function () {
    Auth::logout();
    return redirect('/');
});

Route::middleware([HandleUsers::class])->group(function () {
    Route::middleware([HandleAdmin::class])->group(function () {
        Route::get('/dashboard/admin', [UserController::class, 'adminDashboard']);
        Route::post('/adduser', [UserController::class, 'addUser']);
        Route::post('/addcourse', [UserController::class, 'addcourse']);
        Route::post('/enrollstudent', [UserController::class, 'enrollStudent']);
    });
    Route::middleware([HandleTeachers::class])->group(function(){
        Route::get('/dashboard/teacher', [UserController::class, 'teacherDashboard']);
        Route::post('/markattendance', [UserController::class, 'markAttendance']);
        Route::post('/uploadmarks', [UserController::class, 'uploadMarks']);
    });
    Route::middleware([HandleStudents::class])->group(function(){
        Route::get('/dashboard/student', [UserController::class, 'studentDashboard']);
    });
});
