<?php

use App\Http\Controllers\UserController;
use App\Http\Middleware\HandleUsers;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('Login');
})->name('home');


Route::post('/login',[UserController::class, 'Login']);

Route::get('/dashboard', function(){
    return Inertia::render('Dashboard');
})->middleware(HandleUsers::class);