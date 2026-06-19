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
    // import DropdownMenu from "../ui/dropdown-menu/dropdown-menu.svelte";

    function openStringValidator() {
        secondary_stores.show_string_validator = true;
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

            <DropdownMenu.Item
                class="px-4 py-2 my-0.5"
                onclick={() =>
                    secondary_stores.openAlert("info", "Feature Coming Soon!")}
                >DFA from Regular Expression</DropdownMenu.Item>
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>
