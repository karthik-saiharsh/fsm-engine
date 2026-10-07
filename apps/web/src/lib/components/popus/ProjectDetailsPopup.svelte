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

    let proj_name = $derived(ProjectClass.project_details.name);
    let proj_author = $derived(ProjectClass.project_details.author);
    const proj_date = $derived(ProjectClass.project_details.created);

    function handleSave() {
        ProjectClass.saveProjectDetails({
            ...ProjectClass.project_details,
            name: proj_name,
            author: proj_author,
        });
        ProjectClass.togglers.show_proj_details = false;
    }

    function handleCancel() {
        ProjectClass.togglers.show_proj_details = false;
    }
</script>

{#if ProjectClass.togglers.show_proj_details}
    <Popup
        title="Project Settings"
        description="Configure the Project Settings"
        onClose={handleCancel}>
        <span class="w-full flex flex-col gap-2">
            <Label for="name">Project Name</Label>
            <Input id="name" type="text" bind:value={proj_name} />
        </span>

        <span class="w-full flex flex-col gap-2">
            <Label for="author">Author's Name</Label>
            <Input id="author" type="text" bind:value={proj_author} />
        </span>

        <span class="w-full flex flex-col gap-2">
            <Label for="created">Created on</Label>
            <Input
                id="created"
                type="text"
                readonly
                disabled
                value={proj_date} />
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
