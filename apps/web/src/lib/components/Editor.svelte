<!--
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script lang="ts">
    /******** COMPONENT IMPORTS ********/
    import { Stage, Rect, Layer } from "svelte-konva";
    import TopBar from "./editor/TopBar.svelte";
    import ProjectDetailsPopup from "./popus/ProjectDetailsPopup.svelte";
    import Dock from "./Dock.svelte";
    import secondary_stores from "../brain/extras.svelte";
    /******** COMPONENT IMPORTS ********/

    /******** LUCIDE ICON IMPORTS ********/
    /******** LUCIDE ICON IMPORTS ********/

    /******** REACTIVE VARIABLES ********/
    let width: number = $state(0); // Width of Konav Stage
    let height: number = $state(0); // Width of Konav Stage

    /******** REACTIVE VARIABLES ********/
</script>

<!-- Main Editor Window -->
<main
    class="w-screen h-screen overflow-hidden flex flex-col max-md:hidden transition-all ease-in-out duration-300">
    <TopBar />
    <div
        id="body"
        bind:clientWidth={width}
        bind:clientHeight={height}
        class="w-full flex-1 h-screen bg-card">
        <Stage {width} {height}>
            <Layer>
                <!-- <Rect
                    draggable
                    x={100}
                    y={100}
                    width={100}
                    height={100}
                    fill="blue" /> -->
            </Layer>
        </Stage>
    </div>
</main>

<!-- Additional Overlays and Popup Windows -->
<ProjectDetailsPopup />
<!-- Additional Overlays and Popup Windows -->

<!-- Options Dock -->
<Dock />
<!-- Options Dock -->

{#if secondary_stores.grid_shown}
    <style>
        #body {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-0 -0 10 10'%3E%3Cpath d='M 0 1 L 10 1 M 1 0 L 1 10' stroke='%23ffffff25' stroke-dasharray='1' stroke-width='0.3' /%3E%3C/svg%3E");
            background-size: 30px 30px;
        }
    </style>
{/if}
