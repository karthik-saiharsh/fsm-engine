<!--
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script lang="ts">
    import Button from "../ui/button/button.svelte";
    import Separator from "../ui/separator/separator.svelte";
    import {
        NotepadText,
        Save,
        Settings2,
        Sparkle,
        Table,
        CirclePlus,
        Grid3X3,
        Github,
    } from "@lucide/svelte";
    import ProjectClass from "../../brain/store.svelte";
    import MachinePicker from "./MachinePicker.svelte";
    import { EngineTypes } from "@fsm/engine";
    import secondary_stores from "../../brain/extras.svelte";

    /**
     * Show additional Project Settings Data
     */
    function openProjSettings() {
        ProjectClass.togglers.show_proj_details = true;
    }

    /**
     * Toggle Grid Display
     */
    function toggleGrid() {
        secondary_stores.grid_shown = secondary_stores.grid_shown
            ? false
            : true;
    }
</script>

<div class="w-full h-15 flex items-center px-3 gap-2 bg-secondary border-b">
    <!-- Project Meta Data Settings and Details -->

    <!-- New Project  -->
    <Button variant="outline" onclick={() => ProjectClass.newProject()}>
        <CirclePlus />
        <p class="font-geist">New</p>
    </Button>

    <!-- Project Save  -->
    <Button
        variant="outline"
        onclick={() => (ProjectClass.togglers.show_save_details = true)}>
        <Save />
        <p class="font-geist">Save</p>
    </Button>

    <!-- Open Saved Project -->
    <Button variant="outline" onclick={() => ProjectClass.importProject()}>
        <NotepadText />
        <p class="font-geist">Open</p>
    </Button>

    <!-- Bind this input directly to the project name -->
    <!-- <Input
        class="w-1/6 text-center font-geist"
        placeholder="Project Name..."
        bind:value={projectData.name} /> -->
    <p
        class="w-[24ch] font-geist font-semi-bold border py-1 px-2 rounded-md truncate">
        {ProjectClass.project_details.name}
    </p>

    <!-- Open Additional Project Configuration Options -->
    <Button onclick={openProjSettings} variant="outline" size="icon">
        <Settings2 />
    </Button>

    <!-- Project Meta Data Settings and Details -->

    <Separator orientation="vertical" />

    <!-- Project State Machine Type Selection and Additional Settings -->
    <MachinePicker />

    <Button
        disabled={ProjectClass.project_details.type === EngineTypes.FREE}
        variant="outline"
        size="icon">
        <Settings2 />
    </Button>

    <Button
        onclick={toggleGrid}
        variant={secondary_stores.grid_shown ? "default" : "outline"}>
        <Grid3X3 />
        <p>Grid {secondary_stores.grid_shown ? "On" : "Off"}</p>
    </Button>
    <!-- Project State Machine Type Selection and Additional Settings -->

    <Separator orientation="vertical" />

    <!-- Special Functions and Features -->
    <Button
        variant="outline"
        class="font-geist"
        onclick={() => ProjectClass.autoLayout()}>
        <Sparkle />
        Auto Layout
    </Button>

    <Button variant="outline" class="font-geist" onclick={() => {
        alert("This feature hasn't been implemented yet. We are working on it.\n\nDevelopment of FSM Engine takes time and effort, and the team is very small (only 1 developer for now; so bear with me if new features, and fixes take time)")
    }}>
        <Table />
        Transition Table
    </Button>

    <a href="https://github.com/karthik-saiharsh/fsm-engine" target="_blank">
        <Button variant="outline" class="font-geist">
            <Github />
            Github
        </Button>
    </a>
    <!-- Special Functions and Features -->
</div>
