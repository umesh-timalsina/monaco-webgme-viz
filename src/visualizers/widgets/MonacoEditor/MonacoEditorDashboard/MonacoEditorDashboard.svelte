<script>

    import {tick} from 'svelte';

    // import { editor, Uri } from 'monaco-editor';
    import  EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker';
    import { setDiagnosticsOptions } from 'monaco-yaml';
    // import YamlWorker from 'monaco-yaml/yaml.worker';

    export let monaco;

    let eventElement, editor, workers;

    export async function initialize() {
        await tick();
        await setMonacoEnvironment();
        editor = monaco.editor.create(
            document.getElementById('monaco-editor'),
            {
                model: monaco.editor.createModel(
                    'console.log("Hi Please Select Appropriate code node to save edits");',
                    'javascript'
                ),
                minimap: {
                    enabled: true
                },
                dimension: {
                    width: 800,
                    height: 800
                },
                automaticLayout: true,
            });

        editor.onDidChangeModelContent = _.debounce(emitCodeChangeEvent, 1000);
    }

    function setMonacoEnvironment() {
        window.MonacoEnvironment = {
            getWorker: function (_moduleId, label) {
            //     if (label === 'json') {
            //         return new Worker(new URL(
            //                 'extlib/node_modules/monaco-editor/esm/vs/language/json/json.worker',
            //                 window.location.href
            //             )
            //         );
            //     }
            //     if (label === 'css' || label === 'scss' || label === 'less') {
            //         return new Worker(new URL(
            //                 'extlib/node_modules/monaco-editor/esm/vs/language/css/css.worker',
            //                 window.location.href
            //             )
            //         );
            //     }
            //     if (label === 'html' || label === 'handlebars' || label === 'razor') {
            //         return new Worker(new URL(
            //                 'extlib/node_modules/monaco-editor/esm/vs/language/html/html.worker',
            //                 window.location.href
            //             )
            //         );
            //     }
            //     if (label === 'typescript' || label === 'javascript') {
            //         return new Worker(new URL(
            //                 'extlib/node_modules/monaco-editor/esm/vs/language/typescript/ts.worker',
            //                 window.location.href
            //             )
            //         );
            //     }
            //     return new Worker(new URL(
            //             'extlib/node_modules/monaco-editor/esm/vs/editor/editor.worker',
            //             window.location.href
            //         )
            //     );
            //     console.log(editorWorker);
                return new EditorWorker();

            }
        }
    }

    function emitCodeChangeEvent() {
        const event = new CustomEvent('codeChanged', {
            detail: {
                code: editor.getModel().getValue() // ToDo: More Details than just code?
            }
        })
        eventElement.dispatchEvent(event);
    }


    export function events() {
        return eventElement;
    }

    export async function setEditorCode(code, language) {
        await tick();
        if (!editor) return;
        let model = editor.getModel(); // ToDo: Find a Better Way than disposing? May be getModels?
        model.dispose();
        model = monaco.editor.createModel(
            code,
            language
        );
        editor.setModel(model);
    }

    export function updateEditorCode(code, language) {
        let model = editor.getModel();
        if (language !== model.getLanguageId()) {
            model.dispose();
            editor.setModel(
                monaco.editor.createModel(
                    code,
                    language
                )
            )
        } else {
            if (model.getValue() !== code) {
                model.setValue(code);
            }
        }
    }

</script>
<main bind:this={eventElement}>
    <div id="monaco-editor">
    </div>
</main>