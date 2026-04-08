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

    // Get props from Editor
    let { stage } = $props();

    // Items in the Dock
    const DockItems: {
        name: string;
        icon: Component<IconProps, {}, "">;
        active?: DockModes;
        onClick?: () => void;
    }[] = [
        {
            name: "Add",
            icon: Plus,
            active: DockModes.ADD,
        },
        {
            name: "Remove",
            icon: Minus,
            active: DockModes.REMOVE,
        },
        {
            name: "Connect",
            icon: Cable,
            active: DockModes.CONNECT,
        },
        {
            name: "Zoom In",
            icon: ZoomIn,
            onClick: () => zoomCenter(1),
        },
        {
            name: "Zoom Out",
            icon: ZoomOut,
            onClick: () => zoomCenter(-1),
        },
    ];

    function handleModeChange(mode: DockModes) {
        if (ProjectClass.current_mode === mode) {
            // If already set, unset the mode
            ProjectClass.current_mode = DockModes.NIL;
        } else {
            // set the mode otherwise
            ProjectClass.current_mode = mode;
        }
    }

    // Add this new function to zoom at the center of the stage
    function zoomCenter(direction: 1 | -1) {
        if (!stage?.node) return;

        const oldScale = stage.node.scaleX();
        const scaleBy = 1.2; // Step Size
        const newScale =
            direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        // Find the center of the stage
        const center = {
            x: stage.node.width() / 2,
            y: stage.node.height() / 2,
        };

        const pointTo = {
            x: (center.x - stage.node.x()) / oldScale,
            y: (center.y - stage.node.y()) / oldScale,
        };

        stage.node.scale({ x: newScale, y: newScale });
        stage.node.position({
            x: center.x - pointTo.x * newScale,
            y: center.y - pointTo.y * newScale,
        });
    }
</script>

<main
    class="absolute w-screen h-15 bottom-5 z-20 flex justify-center items-center max-md:hidden">
    <div
        class="w-fit bg-secondary border rounded-lg px-2 py-2 flex justify-center items-center gap-2">
        {#each DockItems as DockItem}
            <Button
                variant={ProjectClass.current_mode === DockItem.active
                    ? "default"
                    : "outline"}
                onclick={DockItem.onClick
                    ? DockItem.onClick
                    : DockItem.active
                      ? () => handleModeChange(DockItem.active!)
                      : () => {}}>
                <p>{DockItem.name}</p>
                <DockItem.icon />
            </Button>
        {/each}
    </div>
</main>
