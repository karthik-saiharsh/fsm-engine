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
    import secondary_stores from "../../brain/extras.svelte";
    import { DFA } from "@fsm/engine";

    let label = $state<undefined | string>(undefined);

    const transitions = ProjectClass.transitions;

    // Start from the label of the transition being edited each time the popup opens
    $effect(() => {
        if (ProjectClass.togglers.show_tr_customizer) {
            label = transitions.get(secondary_stores.current_tr!)?.on;
        }
    });

    function handleSave() {
        const id = secondary_stores.current_tr;

        if (id !== null && label !== undefined) {
            if ("editLabel" in ProjectClass.engine) {
                // Use the Engine provided editLabel Method for non Free Style State Machines
                ProjectClass.engine.editLabel(id, label, true);
            } else {
                // And for FreeStyle, simple edit the label in place
                transitions.set(id, { ...transitions.get(id)!, on: label });
            }
        }

        handleCancel();
    }

    function handleCancel() {
        secondary_stores.current_tr = null;
        ProjectClass.togglers.show_tr_customizer = false;
    }
</script>

{#if ProjectClass.togglers.show_tr_customizer}
    <Popup
        title="Transition Properties"
        description="Change Transition Label"
        onClose={handleCancel}>
        {#if ProjectClass.engine instanceof DFA}
            <!-- If not in free style, then there is a restriction on the language alphabets -->
            <!-- Only show the available alphabets to pick from -->

            <p class="font-bold text-base">
                Choose Alphabet for this transition
            </p>

            <div class="w-85 h-max-50 overflow-scroll flex flex-wrap gap-5">
                {#each ProjectClass.engine.languageAlphabet as alph}
                    <Button
                        onclick={() => (label = alph)}
                        variant={label === alph ? "default" : "outline"}
                        >{alph}</Button>
                {/each}
            </div>
        {:else}
            <span class="w-full flex flex-col gap-2">
                <Label for="name">Transition Label</Label>
                <Input id="name" type="text" bind:value={label} />
            </span>
        {/if}

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
