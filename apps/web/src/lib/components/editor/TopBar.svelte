<!--
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script lang="ts">
    import Button from "../ui/button/button.svelte";
    import Input from "../ui/input/input.svelte";
    import Separator from "../ui/separator/separator.svelte";
    import { NotepadText, Save, Sun, Moon } from "@lucide/svelte";
    import ProjectClass from "../../brain/store.svelte";
</script>

<div class="w-full h-15 flex items-center px-3 gap-2 bg-secondary border-b">
    <Button variant="outline">
        <Save />
        <p class="font-geist">Save</p>
    </Button>

    <Button variant="outline">
        <NotepadText />
        <p class="font-geist">Open</p>
    </Button>

    <Input
        class="w-1/6 text-center font-geist"
        placeholder="Project Name..."
        bind:value={ProjectClass.project_name} />

    <Button variant="outline" size="icon" onclick={ProjectClass.toggleTheme}>
        {#if ProjectClass.theme === "dark"}
            <Sun />
        {:else}
            <Moon />
        {/if}
    </Button>

    <Separator orientation="vertical" />
</div>
