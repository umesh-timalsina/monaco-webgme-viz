
define([
    './EditorComponent/build/monaco-webgme-viz.amd',
    'vs/editor/editor.main',
    'css!./styles/MonacoEditorWidget.css',
], function (
    MonacoEditorDashboard,
    monaco
) {
    'use strict';
    const WIDGET_CLASS = 'monaco-editor-widget';

    function MonacoEditorWidget(logger, container, config={}) {
        this._logger = logger.fork('MonacoEditorWidget');
        this._el = container;
        this._initialize();
    }

    MonacoEditorWidget.prototype._initialize = function () {
        var width = this._el.width(),
            height = this._el.height(),
            self = this;

        // set widget class
        this._el.css({height: '100%', width: '100%'});
        this.$editor = $('<div/>');
        this._el.append(this.$editor[0]);
        this.dashboard = new MonacoEditorDashboard({
            target: this.$editor[0],
            props: {
                monaco: monaco
            }
        });
        this.dashboard.initialize();
        this.dashboard.events().addEventListener('codeChanged', (event) => {
            this.onCodeChange(event.detail.code);
        });
    };

    MonacoEditorWidget.prototype.onWidgetContainerResize = function (width, height) {
        this.$editor.width(width);
        this.$editor.height(height);
    };

    // Adding/Removing/Updating items
    MonacoEditorWidget.prototype.addNode = function (desc) {
        if(desc){
            this.dashboard.setEditorCode(
                desc.code,
                desc.language
            );
        }
    };

    MonacoEditorWidget.prototype.removeNode = function (gmeId) {
        // this.dashboard.setDefaults();
    };

    MonacoEditorWidget.prototype.updateNode = function (desc) {
        this.dashboard.updateEditorCode(desc.code, desc.language);
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