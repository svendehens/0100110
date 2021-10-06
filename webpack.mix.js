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
    .js(['resources/js/Machine/vendor.js', 'resources/js/Machine/jquery.jsPlumb-1.3.16-all.js'], 'public/js/machine/vendor.js')
    .combine([
        'resources/js/Machine/utils.js',
        'resources/js/Machine/app.js',
        'resources/js/Machine/functions.js',
        'resources/js/Machine/grid.js',
        'resources/js/Machine/txtwiki.js',
        'resources/js/Machine/dragscrollable.js',
        'resources/js/Machine/wikify.js',
        'resources/js/Machine/jquery.highlight-3.js',
        'resources/js/Machine/jquery.ba-dotimeout.min.js',
        'resources/js/Machine/jquery.jscrollpane.min.js',
    ], 'public/js/machine/app.js')
    .copy('resources/js/Machine/jquery.window.min.js', 'public/js/machine')
    .postCss('resources/css/machine.css', 'public/css', [
        require('postcss-import'),
    ])
    .webpackConfig(require('./webpack.config'));

if (mix.inProduction()) {
    mix.version();
}
