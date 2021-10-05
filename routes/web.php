<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Front\FrontController;

use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\SectionController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/**** FRONT ****/
Route::name('front.')->group(function () {

    // Front HOME
    Route::get('/', [FrontController::class, 'index'])->name('home');

    // Front TEST page
    Route::get('/text/{project:slug}', [FrontController::class, 'text'])->name('text');
});

/**** ADMIN ****/
Route::middleware(['auth:sanctum', 'verified', 'remember'])->prefix('admin')->name('admin.')->group(function () {

    // Admin PROJECT
    Route::resource('project', ProjectController::class);

    // Admin SECTION
    Route::resource('section', SectionController::class);
});
