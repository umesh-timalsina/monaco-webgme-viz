import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import yamlWorker from 'monaco-yaml/yaml.worker?worker';

import {setDiagnosticsOptions} from 'monaco-yaml';

export function setMonacoEnvironment() {
    self.MonacoEnvironment = window.MonacoEnvironment = {
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
