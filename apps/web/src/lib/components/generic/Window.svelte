<!--
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script lang="ts">
    import { X } from "@lucide/svelte";

    let x = $state(50);
    let y = $state(100);

    let width = $state(300);
    let height = $state(300);

    let mousedown = $state(false);
    let resizing = $state(false);

    let { is_shown }: { is_shown: boolean } = $props();

    function onMouseMove(e: MouseEvent) {
        if (mousedown) {
            x += e.movementX;
            y += e.movementY;
        } else if (resizing) {
            width += e.movementX;
            height += e.movementY;
        }
    }

    function onMouseUp() {
        mousedown = false;
        resizing = false;
    }
</script>

<svelte:window onmousemove={onMouseMove} onmouseup={onMouseUp} />

{#if is_shown}
    <div
        id="window"
        style:--left-pos={`${x}px`}
        style:--top-pos={`${y}px`}
        style:--width-val={`${width}px`}
        style:--height-val={`${height}px`}
        class="absolute flex flex-col z-100 p-2 bg-card border border-border rounded-md overflow-hidden shadow-[0px_0px_50px_0px_#00000085]">
        <span class="flex justify-center items-center px-3">
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <p
                onmousedown={() => (mousedown = true)}
                class="w-full h-8 font-geist text-center select-none leading-8 cursor-move">
                Window Title
            </p>
            <X
                class="cursor-pointer"
                size={17}
                onclick={() => (is_shown = false)} />
        </span>

        <!-- Resize div, hovering on this this let user resize -->
        <div
            class="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-transparent"
            style="z-index: 10;"
            onmousedown={(e) => {
                resizing = true;
                e.stopPropagation();
            }}
            aria-hidden="true">
        </div>
    </div>
{/if}

<style>
    #window {
        min-width: 300px;
        min-height: 300px;
        width: var(--width-val);
        height: var(--height-val);
        left: var(--left-pos);
        top: var(--top-pos);
    }
</style>
