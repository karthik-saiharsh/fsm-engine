<!--
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script lang="ts">
    import ProjectClass from "../../brain/store.svelte";
    import * as Card from "../ui/card/index";
    import Button from "../ui/button/button.svelte";
    import Label from "../ui/label/label.svelte";
    import Input from "../ui/input/input.svelte";
    import { X, CircleCheck, CircleX } from "@lucide/svelte";
    import type { NodeProps, PartialNodeProps } from "../../brain/types";
    import secondary_stores from "../../brain/extras.svelte";
    import type { State } from "@fsm/engine";

    /********** REACTIVE VARIABLES **********/
    let name = $state<undefined | string>(undefined);
    let color = $state<undefined | string>(undefined);
    /********** REACTIVE VARIABLES **********/

    $effect(() => {
        if (ProjectClass.togglers.show_node_customizer) {
            const currentId = secondary_stores.current_select;
            const defaultLook = ProjectClass.defaultNodeLook;

            if (currentId != null) {
                const currentSelected = ProjectClass.nodes.get(currentId);
                const currentSelectedProp =
                    ProjectClass.node_properties.get(currentId);

                name = currentSelected?.value;
                color = currentSelectedProp?.color ?? defaultLook.color;
            }
        }
    });

    function handleSave() {
        const currentId = secondary_stores.current_select;
        console.log(`Current selected: ${currentId}`);
        if (currentId != null) {
            const currentSelected = ProjectClass.nodes.get(currentId);
            const currentSelectedProp =
                ProjectClass.node_properties.get(currentId);

            // Update Node's name
            if (currentSelected) {
                ProjectClass.nodes.set(currentId, {
                    ...currentSelected,
                    value: name ?? currentSelected.value,
                } as State);
            }

            console.log(color);
            if (color?.length === 7) {
                color += "80";
            }
            console.log(color);
            // Update color
            ProjectClass.node_properties.set(currentId, {
                ...currentSelectedProp,
                color:
                    color ??
                    currentSelectedProp?.color ??
                    ProjectClass.defaultNodeLook.color,
                radius:
                    name && name.length >= 6
                        ? 50
                        : (currentSelectedProp?.radius ??
                          ProjectClass.defaultNodeLook.radius),
            } as PartialNodeProps);
        }

        ProjectClass.togglers.show_node_customizer = false;
    }

    function handleCancel() {
        ProjectClass.togglers.show_node_customizer = false;
    }
</script>

{#if ProjectClass.togglers.show_node_customizer}
    <main
        class="absolute top-0 left-0 z-20 flex justify-center items-center w-screen h-screen bg-background/10 backdrop-blur">
        <Card.Root
            class="-my-4 w-full max-w-sm shadow-[0px_0px_50px_0px_#00000085]">
            <Card.Header>
                <Card.Title class="font-geist">Node Properties</Card.Title>
                <Card.Description class="font-geist"
                    >Change Appearance of the State</Card.Description>
                <Card.Action onclick={handleCancel}>
                    <Button variant="link" size="icon" onclick={handleCancel}
                        ><X /></Button>
                </Card.Action>
            </Card.Header>

            <Card.Content
                class="flex flex-col justify-center items-center gap-5">
                <span class="w-full flex flex-col gap-2">
                    <Label for="name">State Name</Label>
                    <Input id="name" type="text" bind:value={name} />
                </span>

                <span class="w-full flex flex-col gap-2">
                    <Label for="author">State Color</Label>
                    <input
                        type="color"
                        class="rounded-sm outline-none border-none"
                        bind:value={color}
                        name=""
                        id="" />
                </span>

                <!-- <span class="w-full flex flex-col gap-2">
                    <Label for="created">State Type</Label>
                    <span class="flex justify-center gap-1">
                        <Button size="sm" variant="outline">Start State</Button>
                        <Button size="sm" variant="outline"
                            >Intermediate State</Button>
                        <Button size="sm" variant="outline">End State</Button>
                    </span>
                </span> -->
            </Card.Content>

            <Card.Footer class="flex justify-center items-center gap-5">
                <Button onclick={handleCancel} variant="secondary">
                    <CircleX />
                    Cancel</Button>
                <Button onclick={handleSave}>
                    <CircleCheck />
                    Save</Button>
            </Card.Footer>
        </Card.Root>
    </main>
{/if}
