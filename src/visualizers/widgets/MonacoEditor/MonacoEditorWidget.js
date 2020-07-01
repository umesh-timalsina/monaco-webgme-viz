define([
    './WebgmeMonacoLanguageClient',
    'css!./styles/MonacoEditorWidget.css',
    'vs/editor/editor.main'
], function (
    WebgmeMonacoLanguageClient
) {
    'use strict';

    var WIDGET_CLASS = 'monaco-editor';
    const LANGUAGE_ID = 'python',
        MODEL_URI = 'file:///tmp/py-models/model.py',
        MONACO_URI = monaco.Uri.parse(MODEL_URI);


    function MonacoEditorWidget(logger, container, config={}) {
        this._logger = logger.fork('Widget');

        this._logger = logger.fork('Widget');

        this.language = config.language || 'python';
        this._el = container;
        this._el.css({height: '100%'});
        this.$editor = $('<div/>');
        this.$editor.css({height: '100%'});
        this._el.append(this.$editor[0]);
        this._registerMonacoLanguages();
        this._createEditor();

        this._el = container;

        this.nodes = {};
        this._initialize();

        this._logger.debug('ctor finished');

    }

    MonacoEditorWidget.prototype._registerMonacoLanguages = function () {
        monaco.languages.register({
            id: LANGUAGE_ID,
            extensions: ['.py'],
            aliases: ['python', 'PY'],
            mimetypes: ['application/text']
        });
    }

    MonacoEditorWidget.prototype._createEditor = function () {
        const value = `class DummyClass():\n\tdef __init__(self):\n\tpass`;
        const editor = monaco.editor.create(
            this.$editor[0],{
                model: monaco.editor.createModel(value, LANGUAGE_ID, MONACO_URI),
                glyphMargin: true,
                lightbulb: {
                    enabled: true,
                },
                theme: 'vs-dark',
                automaticLayout: true
            }
        )
        this.client = new WebgmeMonacoLanguageClient(
            editor,
            'ws://localhost:3000/python',
            {
                language: 'python',
                rootUri: 'file:///tmp/py-models',
                socket: {}
            }
        );
        editor.getModel().updateOptions({
            trimAutoWhitespace: true,
            insertSpaces: true
        })

    };

    MonacoEditorWidget.prototype.getModel = function() {
        return monaco.editor.getModel(MONACO_URI);
    }

    MonacoEditorWidget.prototype._initialize = function () {
        var width = this._el.width(),
            height = this._el.height(),
            self = this;

        // set widget class
        this._el.addClass(WIDGET_CLASS);

        // Create a dummy header
        this._el.append('<h3>MonacoEditor Events:</h3>');

        // Registering to events can be done with jQuery (as normal)
        this._el.on('dblclick', function (event) {
            event.stopPropagation();
            event.preventDefault();
            self.onBackgroundDblClick();
        });
    };

    MonacoEditorWidget.prototype.onWidgetContainerResize = function (width, height) {
        this._logger.debug('Widget is resizing...');
    };

    // Adding/Removing/Updating items
    MonacoEditorWidget.prototype.addNode = function (desc) {
        if (desc) {
            // Add node to a table of nodes
            var node = document.createElement('div'),
                label = 'children';

            if (desc.childrenIds.length === 1) {
                label = 'child';
            }

            this.nodes[desc.id] = desc;
            node.innerHTML = 'Adding node "' + desc.name + '" (click to view). It has ' +
                desc.childrenIds.length + ' ' + label + '.';

            this._el.append(node);
            node.onclick = this.onNodeClick.bind(this, desc.id);
        }
    };

    MonacoEditorWidget.prototype.removeNode = function (gmeId) {
        var desc = this.nodes[gmeId];
        this._el.append('<div>Removing node "' + desc.name + '"</div>');
        delete this.nodes[gmeId];
    };

    MonacoEditorWidget.prototype.updateNode = function (desc) {
        if (desc) {
            this._logger.debug('Updating node:', desc);
            this._el.append('<div>Updating node "' + desc.name + '"</div>');
        }
    };

    /* * * * * * * * Visualizer event handlers * * * * * * * */

    MonacoEditorWidget.prototype.onNodeClick = function (/*id*/) {
        // This currently changes the active node to the given id and
        // this is overridden in the controller.
    };

    MonacoEditorWidget.prototype.onBackgroundDblClick = function () {
        this._el.append('<div>Background was double-clicked!!</div>');
    };

    /* * * * * * * * Visualizer life cycle callbacks * * * * * * * */
    MonacoEditorWidget.prototype.destroy = function () {
    };

    MonacoEditorWidget.prototype.onActivate = function () {
        this._logger.debug('MonacoEditorWidget has been activated');
    };

    MonacoEditorWidget.prototype.onDeactivate = function () {
        this._logger.debug('MonacoEditorWidget has been deactivated');
    };

    return MonacoEditorWidget;
});
