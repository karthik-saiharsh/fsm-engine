<!--
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script lang="ts">
    import { Plus, Minus, Cable, ZoomIn, ZoomOut } from "@lucide/svelte";
    import Button from "./ui/button/button.svelte";
    import { DockModes } from "../brain/types";
    import ProjectClass from "../brain/store.svelte";
    import type { Component } from "svelte";
    import type { IconProps } from "@lucide/svelte";
    import type { Stage } from "svelte-konva";
    import AdditionalTools from "./editor/AdditionalTools.svelte";
    import { EngineTypes } from "@fsm/engine";
    import { zoomStage } from "../brain/zoom";

    // Get props from Editor
    let { stage }: { stage: ReturnType<typeof Stage> | undefined } = $props();

    // Items in the Dock. Items with a `mode` are highlighted while that mode is active
    const DockItems: {
        name: string;
        icon: Component<IconProps, {}, "">;
        mode?: DockModes;
        onClick: () => void;
    }[] = [
        {
            name: "Add",
            icon: Plus,
            mode: DockModes.ADD,
            onClick: () => handleModeChange(DockModes.ADD),
        },
        {
            name: "Remove",
            icon: Minus,
            mode: DockModes.REMOVE,
            onClick: () => handleModeChange(DockModes.REMOVE),
        },
        {
            name: "Connect",
            icon: Cable,
            mode: DockModes.CONNECT,
            onClick: () => handleModeChange(DockModes.CONNECT),
        },
        {
            name: "Zoom In",
            icon: ZoomIn,
            onClick: () => zoomCenter(true),
        },
        {
            name: "Zoom Out",
            icon: ZoomOut,
            onClick: () => zoomCenter(false),
        },
    ];

    /** Picks a mode, or leaves it if it was already the current one */
    function handleModeChange(mode: DockModes) {
        ProjectClass.current_mode =
            ProjectClass.current_mode === mode ? DockModes.NIL : mode;
    }

    /** Zoom at the center of the stage */
    function zoomCenter(zoomIn: boolean) {
        if (!stage?.node) return;

        const center = {
            x: stage.node.width() / 2,
            y: stage.node.height() / 2,
        };
        zoomStage(stage.node, center, zoomIn, 1.2);
    }
</script>

<main
    class="absolute w-screen h-15 bottom-5 z-20 flex justify-center items-center max-md:hidden">
    <div
        class="w-fit bg-secondary border rounded-lg px-2 py-2 flex justify-center items-center gap-2">
        {#each DockItems as DockItem}
            <Button
                variant={ProjectClass.current_mode === DockItem.mode
                    ? "default"
                    : "outline"}
                onclick={DockItem.onClick}>
                <p>{DockItem.name}</p>
                <DockItem.icon />
            </Button>
        {/each}

        {#if ProjectClass.project_details.type !== EngineTypes.FREE}
            <span class="h-10 w-px bg-primary/20"> </span>
            <AdditionalTools />
        {/if}
    </div>
</main>
