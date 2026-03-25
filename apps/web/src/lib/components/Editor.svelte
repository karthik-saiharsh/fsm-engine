<!--
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script lang="ts">
    /******** COMPONENT IMPORTS ********/
    import { Stage, Text, Layer, Circle, Group } from "svelte-konva";
    import TopBar from "./editor/TopBar.svelte";
    import ProjectDetailsPopup from "./popus/ProjectDetailsPopup.svelte";
    import Dock from "./Dock.svelte";
    import NodeCustomizer from "./popus/NodeCustomizer.svelte";
    import type { KonvaMouseEvent } from "svelte-konva";
    /******** COMPONENT IMPORTS ********/

    /****** BACKEND IMPORTS ******/
    import secondary_stores from "../brain/extras.svelte";
    import ProjectClass from "../brain/store.svelte";
    const defaultLook = ProjectClass.defaultNodeLook;
    const Nodes = ProjectClass.nodes;
    const NodeProps = ProjectClass.node_properties;
    /****** BACKEND IMPORTS ******/

    /******** LUCIDE ICON IMPORTS ********/
    /******** LUCIDE ICON IMPORTS ********/

    /******** REACTIVE VARIABLES ********/
    let width: number = $state(0); // Width of Konav Stage
    let height: number = $state(0); // Width of Konav Stage
    /******** REACTIVE VARIABLES ********/

    /********* FUNCTIONS *********/
    /**
     * Open node customization option on right click on a node
     */
    function toggleRightClick(e: KonvaMouseEvent, id: number) {
        // Keep track of current selected State
        if (secondary_stores.current_select === id) {
            secondary_stores.current_select = null;
        } else {
            secondary_stores.current_select = id;
        }

        if (e.evt.button === 2) {
            ProjectClass.togglers.show_node_customizer =
                !ProjectClass.togglers.show_node_customizer;
        }
    }
    /********* FUNCTIONS *********/
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
        <Stage
            draggable
            {width}
            {height}
            onclick={(e) => {
                // Call only if left click
                if (e.evt.button === 0) {
                    ProjectClass.onStageClick(e);
                }
            }}>
            <Layer>
                {#each ProjectClass.node_properties.keys() as id}
                    <Group
                        onclick={(e) => {
                            toggleRightClick(e, id);
                        }}
                        x={NodeProps.get(id)?.x}
                        y={NodeProps.get(id)?.y}
                        draggable>
                        <Text
                            text={Nodes.get(id)?.value}
                            fill="#ffffff"
                            fontSize={18}
                            x={-(Math.exp(Nodes.get(id)?.value.length!) ** 1.5)}
                            y={-(
                                Math.exp(Nodes.get(id)?.value.length!) ** 2
                            )} />

                        <Circle
                            radius={NodeProps.get(id)?.radius ??
                                defaultLook.radius}
                            fill={NodeProps.get(id)?.color ?? defaultLook.color}
                            stroke={NodeProps.get(id)?.stroke ??
                                defaultLook.stroke} />
                    </Group>
                {/each}
            </Layer>
        </Stage>
    </div>
</main>

<!-- Disable Right click -->
<svelte:window oncontextmenu={(e) => e.preventDefault()} />

<!-- Additional Overlays and Popup Windows -->
<ProjectDetailsPopup />
<NodeCustomizer />
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
