const path = require('path');

module.exports = (env, argv) => ({
    entry: './src/Synergism.ts',
    mode: argv.mode,
    devtool: argv.mode === 'development' ? 'eval-source-map' : 'source-map',
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
        filename: 'bundle.[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/'
    },
    devServer: {
        stats: {
            children: false, // Hide children information
            maxModules: 0 // Set the maximum number of modules to be shown
        },
        port: 3001 // Specify a port number to listen for requests
    },
});