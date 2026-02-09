<!-- 
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script>
    import Launch from "./lib/components/Launch.svelte";
    import { ProjectData } from "./lib/utils/stores.svelte";
    import Editor from "./lib/components/Editor.svelte";
</script>

<!-- Show Project details if not already chosen -->
{#if ProjectData.show_proj_selector}
    <Launch />
{/if}

<!-- <Editor /> -->
