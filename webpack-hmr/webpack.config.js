'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        index: './index.js'
    },
    output: {
        path: path.join(__dirname, 'bundle'),
        filename: '[name].js'
    },
    devServer: {
        hot: true,
        inline: true,
        compress: true,
        stats: {
            colors: true,
            children: false,
            chunks: false,
            assetsSort: 'size'
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};
