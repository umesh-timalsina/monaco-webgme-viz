const path = require('path');
const lib = path.resolve(__dirname, 'lib');

module.exports = {
    entry: {
        'vscode-ws-jsonrpc': path.resolve(__dirname, 'src/vscode-ws-jsonrpc.js'),
        'monaco-languageclient': path.resolve(__dirname, 'src/monaco-languageclient.js'),
        'reconnecting-websocket': path.resolve(__dirname, 'src/reconnecting-websocket.js')
    },
    output: {
        path: lib,
        filename: '[name].min.js',
        libraryTarget: 'umd',
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
            {
                test: /\.ttf$/,
                use: ['file-loader']
            },
            {
                test: /\.m?(js)$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            }]
    },
    target: "web",
    resolve: {
        extensions: ['.js', '.json', '.ttf'],
        alias: {
            'vscode': require.resolve('monaco-languageclient/lib/vscode-compatibility')
        }
    },
    mode: 'production',
    devtool: 'source-map',
    node: {
        fs: 'empty',
        child_process: 'empty',
        net: 'empty',
        crypto: 'empty'
    }
}
