
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import monaco from "rollup-plugin-monaco-editor";

const production = !process.env.ROLLUP_WATCH;
const JOINT_DASHBOARD_ROOT = 'src/visualizers/widgets/MonacoEditor/MonacoEditorDashboard';
const MONACO_PREFIX = 'node_modules/monaco-editor/esm/vs';

function serve() {
    let started = false;

    return {
        writeBundle() {
            if (!started) {
                started = true;

                require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
                    stdio: ['ignore', 'inherit', 'inherit'],
                    shell: true
                });
            }
        }
    };
}


export default {
    input: `${JOINT_DASHBOARD_ROOT}/MonacoEditorDashboard.svelte`,
    external: ['showdown'],
    output: {
        sourcemap: true,
        format: 'amd',
        name: 'app',
        dir: `${JOINT_DASHBOARD_ROOT}/build`,
    },
    plugins: [
        svelte({
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production
            }
        }),
        // we'll extract any component CSS out into
        // a separate file - better for performance
        css({output: 'MonacoEditorDashboard.css'}),
        monaco(),
        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser()
    ],
    watch: {
        clearScreen: false
    }
};