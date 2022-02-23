<script>

    import {tick} from 'svelte';
    import {editor} from 'monaco-editor';
    import {setMonacoEnvironment, setYAMLDiagonosticOptions} from './YamlService';

    let eventElement, monacoEditor;

    export async function initialize() {
        await tick();
        setMonacoEnvironment();
        monacoEditor = editor.create(
            document.getElementById('monaco-editor'),
            {
                model: editor.createModel(
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
                tabSize: 4,
                automaticLayout: true,
            });
        monacoEditor.onDidChangeModelContent = _.debounce(emitCodeChangeEvent, 3000);

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

    export async function setEditorCode(code, language, schemaURI) {
        await tick();
        if (!monacoEditor) return;
        let model = monacoEditor.getModel(); // ToDo: Find a Better Way than disposing? May be getModels?
        model.dispose();
        model = editor.createModel(
            code,
            language
        );
        monacoEditor.setModel(model);
        language === 'yaml'? setYAMLDiagonosticOptions(monacoEditor.getModel(), schemaURI): null;
        monacoEditor.focus();
    }


    export function updateEditorCode(code, language, schemaURI) {
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
                setYAMLDiagonosticOptions(monacoEditor.getModel, schemaURI) : null;
        } else {
            if (monacoEditor.getValue() !== code) {
                model.setValue(code);
            }
        }
        monacoEditor.focus();

    }

</script>
<main bind:this={eventElement}>
    <div id="monaco-editor" style="height: 1000px;">
    </div>
</main>
