<!--
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script lang="ts">
    import ProjectClass from "../../brain/store.svelte";
    import Popup from "../generic/Popup.svelte";
    import Button from "../ui/button/button.svelte";
    import Label from "../ui/label/label.svelte";
    import Input from "../ui/input/input.svelte";
    import { CircleCheck, CircleX } from "@lucide/svelte";
    import type { PartialNodeProps } from "../../brain/types";
    import secondary_stores from "../../brain/extras.svelte";

    let name = $state<undefined | string>(undefined);
    let color = $state<undefined | string>(undefined);
    let isStart = $state<undefined | boolean>(undefined);
    let isEnd = $state<undefined | boolean>(undefined);

    // Fill the form with the details of the selected node each time the popup opens
    $effect(() => {
        if (ProjectClass.togglers.show_node_customizer) {
            const currentId = secondary_stores.current_select;

            if (currentId !== null) {
                const currentSelected = ProjectClass.nodes.get(currentId);
                const currentSelectedProp =
                    ProjectClass.node_properties.get(currentId);

                name = currentSelected?.value;
                color =
                    currentSelectedProp?.color ??
                    ProjectClass.defaultNodeLook.color;
                isStart = currentSelected?.isStart ?? false;
                isEnd = currentSelected?.isEnd ?? false;
            }
        }
    });

    function handleSave() {
        const currentId = secondary_stores.current_select;
        if (currentId !== null) {
            const currentSelected = ProjectClass.nodes.get(currentId);
            const currentSelectedProp =
                ProjectClass.node_properties.get(currentId);

            // Update Node's name
            if (currentSelected) {
                const newIsStart = isStart ?? currentSelected.isStart;
                const newIsEnd = isEnd ?? currentSelected.isEnd;

                // Reset the node's type, the engine sets the new one below
                ProjectClass.nodes.set(currentId, {
                    ...currentSelected,
                    value: name ?? currentSelected.value,
                    isStart: false,
                    isEnd: false,
                });

                // Set New State Types
                if (newIsStart) ProjectClass.engine.setStart(currentId);
                if (newIsEnd) ProjectClass.engine.setEnd(currentId);
                if (!newIsStart && !newIsEnd) {
                    ProjectClass.engine.setIntermediate(currentId);
                }
            }

            // The color picker gives #rrggbb, add the transparency the nodes are drawn with
            const newColor = color?.length === 7 ? color + "80" : color;

            // Update color
            ProjectClass.node_properties.set(currentId, {
                ...currentSelectedProp,
                color:
                    newColor ??
                    currentSelectedProp?.color ??
                    ProjectClass.defaultNodeLook.color,
                radius:
                    name && name.length >= 6
                        ? 50
                        : (currentSelectedProp?.radius ??
                          ProjectClass.defaultNodeLook.radius),
            } as PartialNodeProps);
        }

        handleCancel();
    }

    function handleCancel() {
        ProjectClass.togglers.show_node_customizer = false;
    }
</script>

{#if ProjectClass.togglers.show_node_customizer}
    <Popup
        title="Node Properties"
        description="Change Appearance of the State"
        onClose={handleCancel}>
        <span class="w-full flex flex-col gap-2">
            <Label for="name">State Name</Label>
            <Input id="name" type="text" bind:value={name} />
        </span>

        <span class="w-full flex flex-col gap-2">
            <Label for="author">State Color</Label>
            <input
                type="color"
                class="rounded-sm outline-none border-none"
                bind:value={color} />
        </span>

        <span class="w-full flex flex-col gap-2">
            <Label for="created">State Type</Label>
            <span class="flex justify-center gap-1">
                <Button
                    size="sm"
                    onclick={() => (isStart = !isStart)}
                    variant={isStart ? "default" : "outline"}
                    >Start State</Button>

                <Button
                    size="sm"
                    onclick={() => {
                        isStart = false;
                        isEnd = false;
                    }}
                    variant={!isStart && !isEnd ? "default" : "outline"}
                    >Intermediate State</Button>

                <Button
                    size="sm"
                    variant={isEnd ? "default" : "outline"}
                    onclick={() => (isEnd = !isEnd)}>End State</Button>
            </span>
        </span>

        {#snippet footer()}
            <Button onclick={handleCancel} variant="secondary">
                <CircleX />
                Cancel</Button>
            <Button onclick={handleSave}>
                <CircleCheck />
                Save</Button>
        {/snippet}
    </Popup>
{/if}
