<script lang="ts">
    /******** COMPONENT IMPORTS ********/
    import { Input } from "./ui/input";
    import { Button } from "./ui/button";
    /******** COMPONENT IMPORTS ********/

    /******** LUCIDE ICON IMPORTS ********/
    import { SunMedium, Moon } from "@lucide/svelte";
    /******** LUCIDE ICON IMPORTS ********/

    /******** REACTIVE VARIABLES ********/
    let width = $state();
    let height = $state();

    let currentTheme = $state(0); // 1=light, 0=dark (kinda like turning a light on and off)
    /******** REACTIVE VARIABLES ********/

    /** Toggle between light and dark themes */
    function toggleColorTheme() {
        const body = document.querySelector("body");
        body?.classList.toggle("dark");
        currentTheme = Math.abs(currentTheme - 1);
    }
</script>

<!-- Main Editor Window -->
<main id="body" class="w-screen h-screen overflow-hidden flex max-md:hidden">
    <!-- Side Bar Editor -->
    <div class="w-1/4 h-screen border-r bg-secondary flex flex-col py-5 px-2">
        <!-- Project Details Container -->
        <div class="flex items-center justify-center gap-3">
            <Input
                type="text"
                placeholder="Project Name"
                class="not-hover:border-none not-active:border-none placeholder:text-primary font-geist font-semibold" />
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
    </div>

    <!-- Actual Editor -->
    <div class="w-3/4 flex-1 h-screen bg-card"></div>
</main>

<!-- FallBack in case screen size is too small -->
<main
    id="body"
    class="w-screen h-screen overflow-hidden flex justify-center items-center md:hidden">
    <p class="text-3xl font-bold text-center font-geist">
        Screen Size too Small
    </p>
</main>
