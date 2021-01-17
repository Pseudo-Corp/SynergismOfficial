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
        extensions: [ '.ts' ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '.dist'),
    },
};