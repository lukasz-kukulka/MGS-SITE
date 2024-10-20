<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\BackgroundSentenceController;

Route::get('/', function () { return view('welcome'); })->name('welcome');
Route::get('/about', function () { return view('about'); } )->name('about');
Route::get('/contact', function () { return view('contact'); })->name('contact');
Route::get('/offer', function () { return view('offer'); })->name('offer');
Route::get('/partners', function () { return view('partners'); })->name('partners');

Route::view('dashboard', 'dashboard')->middleware(['auth', 'verified'])->name('dashboard');
Route::view('profile', 'profile')->middleware(['auth'])->name('profile');

Route::post('/sendMail', [App\Http\Controllers\ContactController::class, 'sendMail'] )->name('sendMail');
Route::post('/switch-lang', [ LanguageController::class, 'switchLang' ])->name('switch.lang');
Route::get( '/background/sentence', [ BackgroundSentenceController::class, 'getSentence' ] );

require __DIR__.'/auth.php';