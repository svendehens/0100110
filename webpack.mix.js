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
    .js(['resources/js/Machine_original/vendor.js', 'resources/js/Machine_original/jquery.jsPlumb-1.3.16-all.js'], 'public/js/machine_original/vendor.js')
    .js('resources/js/Machine/app.js', 'public/js/machine')
    .combine([
        'resources/js/Machine_original/utils.js',
        'resources/js/Machine_original/app.js',
        'resources/js/Machine_original/functions.js',
        'resources/js/Machine_original/grid.js',
        'resources/js/Machine_original/txtwiki.js',
        'resources/js/Machine_original/dragscrollable.js',
        'resources/js/Machine_original/wikify.js',
        'resources/js/Machine_original/jquery.highlight-3.js',
        'resources/js/Machine_original/jquery.ba-dotimeout.min.js',
        'resources/js/Machine_original/jquery.jscrollpane.min.js',
    ], 'public/js/machine_original/app.js')
    .copy('resources/js/Machine_original/jquery.window.min.js', 'public/js/machine_original')
    .postCss('resources/css/machine.css', 'public/css', [
        require('postcss-import'),
    ])
    .webpackConfig(require('./webpack.config'));

if (mix.inProduction()) {
    mix.version();
}
