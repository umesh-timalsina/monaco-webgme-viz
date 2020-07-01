const path = require('path');
const lib = path.resolve(__dirname, 'lib');

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: lib,
        filename: 'index.js',
        library: 'WebgmeMonacoLanguageClient',
        libraryTarget: 'umd',
    },
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
        }],
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            'vscode': require.resolve('monaco-languageclient/lib/vscode-compatibility')
        }
    },
    mode: 'development',
    devtool: 'sourceMap',
    node: {
        dns: 'mock',
        net: 'mock',
    }
}
