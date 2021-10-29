<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Front\FrontController;
use App\Http\Controllers\Front\MarkovController;
use App\Http\Controllers\Front\SearchAllController;
use App\Http\Controllers\Front\SearchController;

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

Route::get('/tweet', function() {
    $consumer_key = "vTRxzTPHlUpuQh91ozH7hLUp8";
    $consumer_secret = "wJZFDjM85a0xSwxSnrQma0fIirJBwG5OkYQHy9LHFgDCUNNwKQ";
    $access_token = "1447450910494445572-60d2Wy5Gl4sblEqfXaV8GvpBBwRIb3";
    $access_token_secret = "G6bV1dHZtgQFYauhp61R2K4nMoUsrbWlikQz3Yl3q5Mfp";

    $connection = new Abraham\TwitterOAuth\TwitterOAuth($consumer_key, $consumer_secret, $access_token, $access_token_secret);
    $credentials = $connection->get("account/verify_credentials");

    $results = $connection->get("search/tweets", ["q" => "search", "tweet_mode" => "extended"]);

    return $results;
    foreach($results->statuses as $status)
    {
        echo $status->full_text . "<br><br><br>";
    }
});

/**** FRONT ****/
Route::name('front.')->group(function () {

    // Front HOME
    Route::get('/', [FrontController::class, 'index'])->name('home');

    // Front TEST page
    Route::get('/text/{project:slug}', [FrontController::class, 'text'])->name('text');
});

/**** API ****/
Route::get('/search', [SearchController::class, 'index']);
Route::get('/markov', [MarkovController::class, 'index']);
Route::get('/search-all', [SearchAllController::class, 'index']);

/**** ADMIN ****/
Route::middleware(['auth:sanctum', 'verified', 'remember'])->prefix('admin')->name('admin.')->group(function () {

    // Admin PROJECT
    Route::resource('project', ProjectController::class);

    // Admin SECTION
    Route::resource('section', SectionController::class);
});
