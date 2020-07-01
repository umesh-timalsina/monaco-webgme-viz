import {listen} from "vscode-ws-jsonrpc";
import {
    MonacoLanguageClient,
    CloseAction,
    ErrorAction,
    MonacoServices,
    createConnection
} from "monaco-languageclient";

import normalizeUrl from "normalize-url";
import ReconnectingWebSocket from "reconnecting-websocket";

export class WebgmeMonacoLanguageClient {
    constructor(editor, serverURL, opts) {
        MonacoServices.install(editor, {
            rootUri: opts.rootUri
        });
        this.url = createUrl(serverURL);
        this.socket = createWebSocket(this.url, opts);
        this._initializeClient(opts)
    }


    _initializeClient(opts) {
        listen({
            webSocket: this.socket,
            onConnection: connection => {
                const languageClient = createLanguageClient(connection, opts)
                const disposable = languageClient.start();
                connection.onClose(() => disposable.dispose());
            }
        });
    }
}

const createLanguageClient = function (connection, opts) {
    return new MonacoLanguageClient({
        name: opts.name || 'Webgme Monaco Client',
        clientOptions: {
            documentSelector: [opts.language || 'python'],
            errorHandler: {
                error: () => ErrorAction.Continue,
                closed: () => CloseAction.DoNotRestart
            }
        },
        connectionProvider: {
            get(errorHandler, closeHandler, outputChannel) {
                return Promise.resolve(
                    createConnection(connection, errorHandler, closeHandler)
                )
            }
        }
    })
}


const createUrl = function (path) {
    return normalizeUrl(path);
};

const createWebSocket = function (url, opts = {}) {
    const socketOpts = {
        maxReconnectionDelay: opts.socket.maxReconnectionDelay || 10000,
        minReconnectionDelay: opts.socket.minReconnectionDelay || 1000,
        reconnectionDelayGrowFactor: opts.socket.reconnectionDelayGrowFactor || 1.3,
        connectionTimeout: 10000,
        maxRetries: Infinity,
        debug: opts.socket.debug || false,
    }
    return new ReconnectingWebSocket(url, [], socketOpts);
}
