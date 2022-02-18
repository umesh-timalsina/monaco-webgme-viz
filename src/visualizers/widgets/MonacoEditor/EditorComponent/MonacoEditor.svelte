<script>

    import {tick} from 'svelte';

    // import 'monaco-editor';
    import {editor} from 'monaco-editor';
    import {setDiagnosticsOptions} from 'monaco-yaml';
    import {setMonacoEnvironment} from './YamlService';

    let eventElement, monacoEditor;
    // export let monaco;

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



    async function setYAMLDiagonosticOptions(model, schemaURI) {
        const schemaValue = await (await fetch(schemaURI)).json()
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
                    uri: 'https://raw.githubusercontent.com/aanand/compose-file/master/schema/data/config_schema_v3.0.json',
                    // Associate with our model
                    fileMatch: [String(modelUri)],
                },
            ]
        });

        const value = 'p1: \np2: \n';
        // const model = editor.createModel(value, 'yaml', modelUri);
        // monacoEditor.setModel(model);

        const monacoEditor = editor.create(document.getElementById('monaco-editor'), {
            automaticLayout: true,
            dimensions: {
                width: '800px',
                height: '800px'
            },
            model: editor.createModel(value, 'yaml', modelUri),
        });
        return monacoEditor;
    }


    export function updateEditorCode(code, language) {
        let model = monacoEditor.getModel();
        if (language !== model.getLanguageId()) {
            model.dispose();
            monacoEditor.setModel(
                editor.createModel(
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
    <div id="monaco-editor" style="height: 1000px;">
    </div>
</main>
