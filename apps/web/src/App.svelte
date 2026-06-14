<!-- 
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script>
    import Launch from "./lib/components/Launch.svelte";
    import Editor from "./lib/components/Editor.svelte";
    import ScreenSizeFallback from "./lib/components/generic/ScreenSizeFallback.svelte";
    import ProjectClass from "./lib/brain/store.svelte";
    import Window from "./lib/components/generic/Window.svelte";
</script>

<!-- Show Project details if not already chosen -->
{#if ProjectClass.togglers.show_launch}
    <Launch />
{/if}

<Editor />

<!-- Displayed if screen size is too small -->
<ScreenSizeFallback />

<!-- Add Copyrights -->
<p class="z-50 absolute bottom-1.5 text-[0.5rem] text-center w-full opacity-85 select-none">
    Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
</p>
