const path = require('path');
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = {
    resolve: {
        alias: {
            '@': path.resolve('resources/js'),
        },
    },
    plugins: [
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
};
