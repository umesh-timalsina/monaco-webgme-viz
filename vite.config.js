import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const path = require('path');

const MONACO_BASE = 'src/visualizers/widgets/MonacoEditor/EditorComponent';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      svelte(),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(MONACO_BASE, 'MonacoEditor.svelte'),
      name: 'MonacoEditorComponent',
      formats: ['amd'],
    },
    outDir: path.resolve(MONACO_BASE, 'build'),
  },
  base: '/extlib/src/visualizers/widgets/MonacoEditor/EditorComponent/build/'
});
