<!-- 
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script lang="ts">
    import { Plus, MonitorUp } from "@lucide/svelte";
    import { ProjectData } from "../utils/stores.svelte";
    import { ProjectType } from "../utils/types";

    /**
     * Sets Project Type
     * @param type @see ProjectType
     */
    function setProjectType(type: ProjectType) {
        ProjectData.show_proj_selector = false;
        ProjectData.proj_type = type;
    }
</script>

<main
    class="w-screen h-screen select-none flex flex-col justify-center items-center gap-20 text-center">
    <span>
        <h1 class="text-4xl font-bold font-geist">FSM Engine</h1>
        <p class="font-geist text-balance">One tool to rule them All</p>
    </span>

    <span class="flex justify-center items-center gap-5">
        <button
            onclick={() => setProjectType(ProjectType.NEW)}
            class="border-2 border-dashed rounded-lg w-40 h-40 flex flex-col gap-3 justify-center items-center not-dark:shadow-lg cursor-pointer hover:-translate-y-3 transition-all ease-in-out duration-300 active:scale-90">
            <Plus size={30} />
            <p class="text-sm font-geist">New Project</p>
        </button>
        <button
            onclick={() => setProjectType(ProjectType.EXISTING)}
            class="border-2 border-dashed rounded-lg w-40 h-40 flex flex-col gap-3 justify-center items-center not-dark:shadow-lg cursor-pointer hover:-translate-y-3 transition-all ease-in-out duration-300 active:scale-90">
            <MonitorUp size={30} />
            <p class="text-sm font-geist">Open Project</p>
        </button>
    </span>

    <p class="text-center font-geist">
        Looking for Documentation and Example Tutorials ? <a
            href="/"
            class="underline hover:text-blue-200">Click here</a>
    </p>
</main>
