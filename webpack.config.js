const path = require('path');

module.exports = {
    entry: './src/Synergism.ts',
    mode: 'none',
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }],
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
        modules: [path.resolve(__dirname, 'test'), 'node_modules']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        port: 3001 // Specify a port number to listen for requests
    },
};