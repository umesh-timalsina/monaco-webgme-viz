<script>

    import {tick} from 'svelte';

    // import {editor} from 'monaco-editor';
    import {setDiagnosticsOptions} from 'monaco-yaml';
    import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
    import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
    import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
    import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
    import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
    import yamlWorker from 'monaco-yaml/yaml.worker?worker';

    let eventElement, monacoEditor;
    export let monaco;

    export async function initialize() {
        await tick();
        setMonacoEnvironment();
        // monacoEditor = monaco.editor.create(
        //     document.getElementById('monaco-editor'),
        //     {
        //         model: monaco.editor.createModel(
        //             'console.log("Hi Please Select Appropriate code node to save edits");',
        //             'javascript'
        //         ),
        //         minimap: {
        //             enabled: true
        //         },
        //         dimension: {
        //             width: 800,
        //             height: 800
        //         },
        //         automaticLayout: true,
        //     });
        monacoEditor = setEditorCode();
        monacoEditor.onDidChangeModelContent = _.debounce(emitCodeChangeEvent, 1000);

    }

    function setMonacoEnvironment() {
        window.MonacoEnvironment = {
            getWorker(_, label) {
                console.log(label);
                if (label === 'json') {
                    return new jsonWorker();
                }
                if (label === 'css' || label === 'scss' || label === 'less') {
                    return new cssWorker();
                }
                if (label === 'html' || label === 'handlebars' || label === 'razor') {
                    return new htmlWorker();
                }
                if (label === 'typescript' || label === 'javascript') {
                    return new tsWorker();
                }
                if (label === 'yaml') {
                    return new yamlWorker();
                }
                return new editorWorker();
            }
        }
    }

    async function setYAMLDiagonosticOptions(model, schemaURI) {
        const schemaValue = await (await fetch(schemaURI)).json()
        console.log(schemaValue);
        const schema = {
            uri: schemaValue,
            fileMatch: [model.uri.toString()]
        }

        setDiagnosticsOptions({
            validate: true,
            enableSchemaRequest: true,
            format: true,
            hover: true,
            completion: true,
            schemas: [schema]
        })
    }

    function emitCodeChangeEvent() {
        const event = new CustomEvent('codeChanged', {
            detail: {
                code: monacoEditor.getModel().getValue() // ToDo: More Details than just code?
            }
        })
        eventElement.dispatchEvent(event);
    }


    export function events() {
        return eventElement;
    }

    export async function setEditorCode(code, language) {
        await tick();
        // if (!monacoEditor) return;
        // let model = monacoEditor.getModel(); // ToDo: Find a Better Way than disposing? May be getModels?
        // model.dispose();
        // model = monaco.editor.createModel(
        //     code,
        //     language
        // );
        // monacoEditor.setModel(model);
        // language === 'yaml'?
        //     setYAMLDiagonosticOptions(monacoEditor.getModel(),
        //         'https://raw.githubusercontent.com/aanand/compose-file/master/schema/data/config_schema_v3.0.json'): null;
        // The uri is used for the schema file match.
        const modelUri = monaco.Uri.parse('a://c/foo.yaml');

        setDiagnosticsOptions({
            enableSchemaRequest: true,
            hover: true,
            completion: true,
            validate: true,
            format: true,
            schemas: [
                {
                    // Id of the first schema
                    uri: 'http://myserver/foo-schema.json',
                    // Associate with our model
                    fileMatch: [String(modelUri)],
                    schema: {
                        type: 'object',
                        properties: {
                            p1: {
                                enum: ['v1', 'v2'],
                            },
                            p2: {
                                // Reference the second schema
                                $ref: 'http://myserver/bar-schema.json',
                            },
                        },
                    },
                },
                {
                    // Id of the first schema
                    uri: 'http://myserver/bar-schema.json',
                    schema: {
                        type: 'object',
                        properties: {
                            q1: {
                                enum: ['x1', 'x2'],
                            },
                        },
                    },
                },
            ],
        });

        const value = 'p1: \np2: \n';
        // const model = monaco.editor.createModel(value, 'yaml', modelUri);
        // monacoEditor.setModel(model);

        const editor = monaco.editor.create(document.getElementById('monaco-editor'), {
            automaticLayout: true,
            dimensions: {
                width: 800,
                height: 800
            },
            model: monaco.editor.createModel(value, 'yaml', modelUri),
        });
        return editor;
    }


    export function updateEditorCode(code, language) {
        let model = monacoEditor.getModel();
        if (language !== model.getLanguageId()) {
            model.dispose();
            monacoEditor.setModel(
                monaco.editor.createModel(
                    code,
                    language
                )
            )
            language === 'yaml' ?
                setYAMLDiagonosticOptions(monacoEditor.getModel,
                    'https://raw.githubusercontent.com/aanand/compose-file/master/schema/data/config_schema_v3.0.json') : null;
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