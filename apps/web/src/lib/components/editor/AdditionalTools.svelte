<!--
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script lang="ts">
    import * as DropdownMenu from "../ui/dropdown-menu/index";
    import Button from "../ui/button/button.svelte";
    import secondary_stores from "../../brain/extras.svelte";
    import ProjectClass from "../../brain/store.svelte";

    function openStringValidator() {
        secondary_stores.show_string_validator = true;
    }

    function getRegex() {
        if ("toRegex" in ProjectClass.engine) {
            try {
                const regex = ProjectClass.engine.toRegex();
                secondary_stores.openAlert("info", "Regular Expression of your DFA: " + regex);
            } catch (e) {
                console.log(e);
            }
        }
    }
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        <Button variant="outline">Additional Functions</Button>
    </DropdownMenu.Trigger>

    <DropdownMenu.Content class="w-fit" align="start">
        <DropdownMenu.Group>
            <DropdownMenu.Item
                class="px-4 py-2 my-0.5"
                onclick={openStringValidator}
                >Validate a String</DropdownMenu.Item>

            {#if "minimize" in ProjectClass.engine}
                <DropdownMenu.Item
                    class="px-4 py-2 my-0.5"
                    onclick={() => ProjectClass.minimizeMachine()}
                    >Minimize a DFA</DropdownMenu.Item>
            {/if}

            {#if "toRegex" in ProjectClass.engine}
                <DropdownMenu.Item class="px-4 py-2 my-0.5" onclick={getRegex}
                    >Regular Expression from DFA</DropdownMenu.Item>
            {/if}
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>
