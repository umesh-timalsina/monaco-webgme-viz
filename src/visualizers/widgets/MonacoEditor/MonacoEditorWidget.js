define([
    './MonacoEditorDashboard/build/MonacoEditorDashboard',
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
    };

    MonacoEditorWidget.prototype.onWidgetContainerResize = function (width, height) {
        this.$editor.width(width);
        this.$editor.height(height);
        this.dashboard.resize(width, height);
    };

    // Adding/Removing/Updating items
    MonacoEditorWidget.prototype.addNode = function (desc) {

    };

    MonacoEditorWidget.prototype.removeNode = function (gmeId) {
    };

    MonacoEditorWidget.prototype.updateNode = function (desc) {
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
