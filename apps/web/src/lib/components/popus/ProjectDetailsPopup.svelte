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

    let proj_name = $derived(ProjectClass.project_details.name);
    let proj_author = $derived(ProjectClass.project_details.author);
    const proj_date = $derived(ProjectClass.project_details.created);

    function handleSave() {
        const new_proj_details: typeof ProjectClass.project_details = {
            ...ProjectClass.project_details,
            name: proj_name,
            author: proj_author,
        };

        ProjectClass.saveProjectDetails(new_proj_details);
        ProjectClass.togglers.show_proj_details = false;
    }

    function handleCancel() {
        ProjectClass.togglers.show_proj_details = false;
    }
</script>

{#if ProjectClass.togglers.show_proj_details}
    <main
        class="absolute top-0 left-0 z-20 flex justify-center items-center w-screen h-screen bg-background/10 backdrop-blur">
        <Card.Root
            class={`-my-4 w-full max-w-sm shadow-[0px_0px_50px_0px_#000000${ProjectClass.theme === "dark" ? "85" : "25"}]`}>
            <Card.Header>
                <Card.Title class="font-geist">Project Settings</Card.Title>
                <Card.Description class="font-geist"
                    >Configure the Project Settings</Card.Description>
                <Card.Action onclick={handleCancel}>
                    <Button variant="link" size="icon"><X /></Button>
                </Card.Action>
            </Card.Header>

            <Card.Content
                class="flex flex-col justify-center items-center gap-5">
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
