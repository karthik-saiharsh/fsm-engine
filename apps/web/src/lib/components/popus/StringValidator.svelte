<!--
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script lang="ts">
    import Window from "../generic/Window.svelte";
    import secondary_stores from "../../brain/extras.svelte";
    import { EngineTypes } from "@fsm/engine";
    import ProjectClass from "../../brain/store.svelte";
    import Input from "../ui/input/input.svelte";
    import Button from "../ui/button/button.svelte";
    import { EMPTY_STRING } from "../../brain/types";

    /****** REACTIVE VARIABLES ******/
    let inputString: string = $state("");
    let show_result: {
        show: boolean;
        result: null | {
            path: number[];
            str: null | string;
            accepted: boolean;
        };
    } = $state({ show: false, result: null });

    /****** HELPER METHODS ******/
    /**
     * Function to handle Closing of the Transition table window
     */
    function closeWindow() {
        secondary_stores.show_string_validator = false;
        inputString = ""; // reset input
        // reset result object
        show_result = { show: false, result: null };
    }

    /** Valid the string entered */
    function validateString() {
        // Clear out any result from previous run
        show_result = { show: false, result: null };

        if ("validateString" in ProjectClass.engine) {
            try {
                console.log(ProjectClass.engine.languageAlphabet);
                const res = ProjectClass.engine.validateString(inputString);
                show_result = { show: true, result: res };
            } catch (err) {
                if (err instanceof Error)
                    secondary_stores.openAlert("info", err.message);
                else console.log(err);
            }
        }
    }
</script>

<Window
    win_dim={{ width: 400, height: 200 }}
    title="String Validator"
    is_shown={secondary_stores.show_string_validator}
    {closeWindow}>
    <div class="flex flex-col justify-center items-center text-sm gap-5 mb-5">
        <p>
            Validate the acceptance of a string using a {EngineTypes[
                ProjectClass.project_details.type
            ]}
        </p>

        <span class="flex gap-5 justify-center items-center">
            <Input
                type="text"
                placeholder="Enter a string..."
                bind:value={inputString} />
            <Button onclick={validateString}>Validate</Button>
        </span>

        {#if show_result.show}
            {#if show_result.result?.accepted}
                <p class="text-balance font-bold">String Accepted</p>
            {:else}
                <p class="text-balance font-bold">String Rejected</p>
            {/if}

            {#each show_result.result?.path as state, index}
                {@const stateName = ProjectClass.engine.getState(state).value}
                {@const remainingString =
                    show_result.result?.str?.slice(index) ?? ""}
                <p>
                    = ({stateName}, {remainingString.length === 0
                        ? EMPTY_STRING
                        : remainingString})
                </p>
            {/each}
        {/if}
    </div>
</Window>
