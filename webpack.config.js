const path = require('path');
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const webpack = require("webpack")

module.exports = {
    resolve: {
        alias: {
            '@': path.resolve('resources/js'),
            'jquery-ui': 'jquery-ui-dist/jquery-ui.js'
        },
    },
    stats: {
        children: false,
    },
    plugins: [
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ],
};
