<!--
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script lang="ts">
    import * as Card from "../ui/card/index";
    import Button from "../ui/button/button.svelte";
    import Label from "../ui/label/label.svelte";
    import Input from "../ui/input/input.svelte";
    import { X, CircleCheck, CircleX } from "@lucide/svelte";
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
        let alphabets = alphabetInput.split(",");
        alphabets = alphabets.map((alph) => alph.trim());

        if (alphabets.length) {
            if (ProjectClass.engine instanceof DFA) {
                ProjectClass.engine.addAlphabets(...alphabets);
            }
        } else {
            alert("You have to enter atleast one alphabet!");
        }

        handleCancel();
    }
</script>

{#if secondary_stores.show_lang_settings}
    <main
        class="absolute top-0 left-0 z-20 flex justify-center items-center w-screen h-screen bg-background/10 backdrop-blur">
        <Card.Root
            class={`-my-4 w-full max-w-sm shadow-[0px_0px_50px_0px_#000000${ProjectClass.theme === "dark" ? "85" : "25"}]`}>
            <Card.Header>
                <Card.Title class="font-geist">Machine Settings</Card.Title>
                <Card.Description class="font-geist"
                    >Configure Settings Specific to Machine Type</Card.Description>
                <Card.Action onclick={handleCancel}>
                    <Button variant="link" size="icon"><X /></Button>
                </Card.Action>
            </Card.Header>

            <Card.Content
                class="flex flex-col justify-center items-center gap-5">
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
            </Card.Content>

            <Card.Footer class="flex justify-center items-center gap-5">
                <Button onclick={handleCancel} variant="secondary">
                    <CircleX />
                    Cancel</Button>
                <Button onclick={collectLanguageAlphabets}>
                    <CircleCheck />
                    Save</Button>
            </Card.Footer>
        </Card.Root>
    </main>
{/if}
