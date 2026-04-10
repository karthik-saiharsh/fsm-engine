<!--
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script lang="ts">
    import { Plus, MonitorUp } from "@lucide/svelte";
    import { Button } from "./ui/button";
    import { SunMedium, Moon } from "@lucide/svelte";
    import ProjectClass from "../brain/store.svelte";

    let currentTheme = $state(0); // 1=light, 0=dark (kinda like turning a light on and off)

    /** Toggle between light and dark themes */
    function toggleColorTheme() {
        const body = document.querySelector("body");
        body?.classList.toggle("dark");
        currentTheme = Math.abs(currentTheme - 1);

        if(ProjectClass.theme === "dark") ProjectClass.theme = "light";
        else ProjectClass.theme = "dark";
    }
</script>

<main
    class="absolute left-0 top-0 w-screen h-screen bg-background z-100 select-none flex flex-col justify-center items-center gap-20 text-center max-md:hidden">
    <!-- Theme Switcher -->
    <!-- <Button
        class="absolute right-5 top-5 cursor-pointer active:scale-90 rounded-full"
        variant="outline"
        size="icon"
        onclick={toggleColorTheme}>
        {#if currentTheme}
            <Moon size={18} />
        {:else}
            <SunMedium size={18} />
        {/if}
    </Button> -->

    <span>
        <h1 class="text-4xl font-bold font-geist">FSM Engine 3.0</h1>
        <p class="font-geist text-balance">One Tool To Tule Them All</p>
    </span>

    <span class="flex justify-center items-center gap-5">
        <button
            onclick={() => {
                ProjectClass.newProject();
                ProjectClass.togglers = {
                    ...ProjectClass.togglers,
                    show_launch: false,
                };
            }}
            class="border-2 border-dashed rounded-lg w-40 h-40 flex flex-col gap-3 justify-center items-center not-dark:shadow-lg cursor-pointer hover:-translate-y-3 transition-all ease-in-out duration-300 active:scale-90">
            <Plus size={30} />
            <p class="text-sm font-geist">New Project</p>
        </button>
        <button
            onclick={() => {
                ProjectClass.importProject();
                ProjectClass.togglers = {
                    ...ProjectClass.togglers,
                    show_launch: false,
                };
            }}
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

    <p class="text-center font-geist">
        Looking for FSM Engine 2.0 ? <a
            href="https://fsm-engine.vercel.app/"
            class="underline hover:text-blue-200">Click here</a>
    </p>
</main>
