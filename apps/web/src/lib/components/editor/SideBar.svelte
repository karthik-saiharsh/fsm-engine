<script lang="ts">
    /******** Component Imports ********/
    import { Button } from "../ui/button";
    import { Input } from "../ui/input";
    import { SunMedium, Moon } from "@lucide/svelte";
    /******** Component Imports ********/

    /******** Reactive Variables ********/

    /** Control whether the sidebar is visible or not */
    let visible: number = $state(1);

    /** 1=light, 0=dark (kinda like turning a light on and off) */
    let currentTheme = $state(0);

    /******** Reactive Variables ********/

    /** Toggle between light and dark themes */
    function toggleColorTheme() {
        const body = document.querySelector("body");
        body?.classList.toggle("dark");
        currentTheme = Math.abs(currentTheme - 1);
    }
</script>

<div
    class={`${visible ? "min-w-80 w-1/4" : "hidden w-0"} h-screen border-r bg-secondary flex flex-col pt-5 px-2`}>
    <!-- Project Details Container and Theme Switcher -->
    {@render SideBarHeader()}

    <div
        class="w-full h-full flex flex-1 flex-col justify-center items-center py-5">
        <div
            class="w-full h-full flex flex-col justify-start items-center border-t py-1">
            <p
                class="text-left w-full font-geist font-semibold text-secondary-foreground">
                States
            </p>
        </div>
        <div
            class="w-full h-full flex flex-col justify-start items-center border-t py-1">
            <p
                class="text-left w-full font-geist font-semibold text-secondary-foreground">
                Properties
            </p>
        </div>
    </div>
</div>

<!------------------------------------- Snippets and Resuable blocks ------------------------------------->
{#snippet SideBarHeader()}
    <div class="flex items-center justify-center gap-3">
        <Input
            type="text"
            placeholder="Project Name"
            class="text-center not-hover:border-none not-active:border-none placeholder:text-primary font-geist font-semibold active:scale-95 transition-all ease-in-out duration-300" />
        <Button
            class="cursor-pointer active:scale-90"
            variant="outline"
            size="icon"
            onclick={toggleColorTheme}>
            {#if currentTheme}
                <Moon size={18} />
            {:else}
                <SunMedium size={18} />
            {/if}
        </Button>
    </div>
{/snippet}

<!------------------------------------- Snippets and Resuable blocks ------------------------------------->
