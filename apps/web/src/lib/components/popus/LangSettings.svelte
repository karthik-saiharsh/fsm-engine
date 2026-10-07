<!--
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script lang="ts">
    import Popup from "../generic/Popup.svelte";
    import Button from "../ui/button/button.svelte";
    import Label from "../ui/label/label.svelte";
    import Input from "../ui/input/input.svelte";
    import { CircleCheck, CircleX } from "@lucide/svelte";
    import secondary_stores from "../../brain/extras.svelte";
    import ProjectClass from "../../brain/store.svelte";
    import { DFA, EngineTypes } from "@fsm/engine";

    let alphabetInput: string = $state("");

    /**
     * Close the popup window
     */
    function handleCancel() {
        secondary_stores.show_lang_settings = false;
    }

    /**
     * Collects language alphabets as comma seperated values
     */
    function collectLanguageAlphabets() {
        const alphabets = alphabetInput.split(",").map((alph) => alph.trim());

        if (alphabets.join("").length === 0) {
            secondary_stores.openAlert(
                "info",
                "You have to enter atleast one alphabet!"
            );
        } else if (ProjectClass.engine instanceof DFA) {
            // First clear all alphabets
            ProjectClass.engine.removeAlphabets(
                ...ProjectClass.engine.getAlphabets()
            );
            ProjectClass.engine.addAlphabets(...alphabets);
        }

        handleCancel();
    }
</script>

{#if secondary_stores.show_lang_settings}
    <Popup
        title="Machine Settings"
        description="Configure Settings Specific to Machine Type"
        onClose={handleCancel}>
        <span class="w-full flex flex-col gap-2">
            <Label for="name"
                >Enter Language Alphabets for {EngineTypes[
                    ProjectClass.project_details.type
                ]}</Label>
            <Input
                id="name"
                type="text"
                placeholder="Enter Comma Seperated Alphabets..."
                bind:value={alphabetInput} />
        </span>

        {#snippet footer()}
            <Button onclick={handleCancel} variant="secondary">
                <CircleX />
                Cancel</Button>
            <Button onclick={collectLanguageAlphabets}>
                <CircleCheck />
                Save</Button>
        {/snippet}
    </Popup>
{/if}
