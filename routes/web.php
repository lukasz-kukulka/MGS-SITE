<?php

use Illuminate\Support\Facades\Route;
// use Inertia\Inertia;

// Route::get('/', function () {
//     return renderInertiaView('welcome');
// })->name('welcome');

// Route::get('/about', function () {
//     return renderInertiaView('about');
// })->name('about');

// Route::get('/contact', function () {
//     return renderInertiaView('contact');
// })->name('contact');

// Route::get('/offer', function () {
//     return renderInertiaView('offer');
// })->name('offer');

// Route::get('/partners', function () {
//     return renderInertiaView('partners');
// })->name('partners');

// Route::get('/', function () { return view('welcome'); })->name('welcome');
Route::get('/', function () { return view('welcome'); })->name('welcome');
Route::get('/about', function () { return view('about'); } )->name('about');
Route::get('/contact', function () { return view('contact'); })->name('contact');
Route::get('/offer', function () { return view('offer'); })->name('offer');
Route::get('/partners', function () { return view('partners'); })->name('partners');
// Route::get('/', function () { return Inertia::render('Welcome'); })->name('welcome');
// Route::get('/about', function () { return Inertia::render('About'); } )->name('about');
// Route::get('/contact', function () { return Inertia::render('Contact'); })->name('contact');
// Route::get('/offer', function () { return Inertia::render('Offer'); })->name('offer');
// Route::get('/partners', function () { return Inertia::render('Partners'); })->name('partners');

Route::view('dashboard', 'dashboard')->middleware(['auth', 'verified'])->name('dashboard');
Route::view('profile', 'profile')->middleware(['auth'])->name('profile');


require __DIR__.'/auth.php';