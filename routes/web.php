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
    $consumer_key = env('TWITTER_CONSUMER_KEY');
    $consumer_secret = env('TWITTER_CONSUMER_SECRET');
    $access_token = env('TWITTER_ACCESS_TOKEN');
    $access_token_secret = env('TWITTER_ACCESS_TOKEN_SECRET');

    $connection = new Abraham\TwitterOAuth\TwitterOAuth($consumer_key, $consumer_secret, $access_token, $access_token_secret);
    $connection->setApiVersion('2');
    $credentials = $connection->get("account/verify_credentials");

    // -birthday leaves the word out of the tweet
    // in this sense, the app could have things to leave in and out by default
    // for example a random list of phrases or words to which the client search param would be added
    // like, the word birthday could explictly be added
    // also the results from the thesaures could be added to the OR list
    // search OR hint OR ...
    // could also have the searched word with a hashtag
    // array rand
    $results = $connection->get("tweets/search/recent", [
        "query" => '"come" (happy OR happiness) -birthday -is:retweet'
    ]);

    return $results;

    if($results->data ?? null)
        return $results;
    else {
        return "no results";
    }
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
