const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.disableSuccessNotifications();

mix.js('resources/js/app.js', 'public/js').vue()
    .postCss('resources/css/app.css', 'public/css', [
        require('postcss-import'),
        require('tailwindcss'),
    ])
    .combine(['resources/js/Machine/utils.js', 'resources/js/Machine/functions.js', 'resources/js/Machine/app.js'], 'public/js/machine/app.js')
    .js(['resources/js/vendor/vendor.js'], 'public/js/vendor/vendor.js')
    .combine([
        'resources/js/vendor/grid.js',
        'resources/js/vendor/txtwiki.js',
        'resources/js/vendor/dragscrollable.js',
        'resources/js/vendor/wikify.js',
        'resources/js/vendor/jquery.highlight-3.js',
        'resources/js/vendor/jquery.ba-dotimeout.min.js',
        'resources/js/vendor/jquery.jscrollpane.min.js',
        'resources/js/vendor/jquery.window.min.js',
        'resources/js/vendor/jquery.jsPlumb-1.3.16-all.js'
    ], 'public/js/vendor/main.js')
    .postCss('resources/css/machine.css', 'public/css', [
        require('postcss-import'),
    ])
    .webpackConfig(require('./webpack.config'));

if (mix.inProduction()) {
    mix.version();
}
