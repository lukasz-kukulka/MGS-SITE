<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () { return view('welcome'); })->name('welcome');
Route::get('/about', function () { return view('about'); } )->name('about');
Route::get('/contact', function () { return view('contact'); })->name('contact');
Route::get('/offer', function () { return view('offer'); })->name('offer');
Route::get('/partners', function () { return view('partners'); })->name('partners');

Route::view('dashboard', 'dashboard')->middleware(['auth', 'verified'])->name('dashboard');
Route::view('profile', 'profile')->middleware(['auth'])->name('profile');

Route::post('/sendMail', [App\Http\Controllers\ContactController::class, 'sendMail'] )->name('sendMail');

require __DIR__.'/auth.php';