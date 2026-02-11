<script lang="ts">
    /******** COMPONENT IMPORTS ********/
    import SideBar from "./editor/SideBar.svelte";
    import ScreenSizeFallback from "./generic/ScreenSizeFallback.svelte";
    import { Stage, Rect, Layer } from "svelte-konva";
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
    class="w-screen h-screen overflow-hidden flex max-md:hidden transition-all ease-in-out duration-300">
    <!-- Side Bar Editor -->
    <SideBar />
    <!-- Actual Editor -->
    <div
        id="body"
        bind:clientWidth={width}
        bind:clientHeight={height}
        class="w-3/4 flex-1 h-screen bg-card">
        <Stage {width} {height}>
            <Layer>
                <Rect
                    draggable
                    x={100}
                    y={100}
                    width={100}
                    height={100}
                    fill="blue" />
            </Layer>
        </Stage>
    </div>
</main>

<!-- Displayed if screen size is too small -->
<ScreenSizeFallback />

<style>
    #body {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-0 -0 10 10'%3E%3Cpath d='M 0 1 L 10 1 M 1 0 L 1 10' stroke='%23404040' stroke-dasharray='1' stroke-width='0.3' /%3E%3C/svg%3E");
        background-size: 30px 30px;
    }
</style>
