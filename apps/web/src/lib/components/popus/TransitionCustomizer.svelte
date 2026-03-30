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
    import secondary_stores from "../../brain/extras.svelte";

    /********** REACTIVE VARIABLES **********/
    let label = $state<undefined | string>(undefined);
    /********** REACTIVE VARIABLES **********/

    /********** VARIABLES **********/
    const transitions = ProjectClass.transitions;
    /********** VARIABLES **********/

    $effect(() => {
        if (ProjectClass.togglers.show_tr_customizer) {
            const currentLabel = transitions.get(
                secondary_stores.current_tr!
            )?.on;

            label = currentLabel;
        }
    });

    function handleSave() {
        if (secondary_stores.current_tr !== null && label !== undefined) {
            const id = secondary_stores.current_tr;
            const oldTransition = transitions.get(id)!;

            ProjectClass.transitions.set(id, {
                ...oldTransition,
                on: label,
            });
        }

        secondary_stores.current_tr = null;
        ProjectClass.togglers.show_tr_customizer = false;
    }

    function handleCancel() {
        secondary_stores.current_tr = null;
        ProjectClass.togglers.show_tr_customizer = false;
    }
</script>

{#if ProjectClass.togglers.show_tr_customizer}
    <main
        class="absolute top-0 left-0 z-20 flex justify-center items-center w-screen h-screen bg-background/10 backdrop-blur">
        <Card.Root
            class="-my-4 w-full max-w-sm shadow-[0px_0px_50px_0px_#00000085]">
            <Card.Header>
                <Card.Title class="font-geist"
                    >Transition Properties</Card.Title>
                <Card.Description class="font-geist"
                    >Change Transition Label</Card.Description>
                <Card.Action onclick={handleCancel}>
                    <Button variant="link" size="icon" onclick={handleCancel}
                        ><X /></Button>
                </Card.Action>
            </Card.Header>

            <Card.Content
                class="flex flex-col justify-center items-center gap-5">
                <span class="w-full flex flex-col gap-2">
                    <Label for="name">Transition Label</Label>
                    <Input id="name" type="text" bind:value={label} />
                </span>
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
