<script>

    import {onMount} from 'svelte';
    let eventElement, editor;
    export let monaco;

    onMount(() => {
        setTimeout(() => {
            editor = monaco.editor.create(
            document.getElementById('monaco-editor'),
            {
                model: monaco.editor.createModel('console.log("hi");', 'javascript'),
                minimap: {
                    enabled: true
                },
                dimension: {
                    width: 800,
                    height: 800
                },
                autosize: true
            }
        );
        }, 0);

    });

    export function resize(width, height) {
        if (monaco && editor) {
            console.log('here');
            editor.updateOptions({
                dimension: {
                    width: width,
                    height: height
                }
            });
        }
    }

</script>
<main bind:this={eventElement}>
    <div id="monaco-editor">
    </div>
</main>