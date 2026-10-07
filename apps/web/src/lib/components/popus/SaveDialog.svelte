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
    import { Download, ImageDown } from "@lucide/svelte";
    import secondary_stores from "../../brain/extras.svelte";
    import { downloadFromUrl } from "../../brain/download";
    import type { Stage } from "svelte-konva";

    let { stage }: { stage: ReturnType<typeof Stage> | undefined } = $props();

    let export_scale = $state("1x");

    function handleCancel() {
        secondary_stores.show_save_dialog = false;
    }

    function saveProject() {
        ProjectClass.exportProject();
        handleCancel();
    }

    function downloadImage() {
        if (!stage?.node) return;

        const dataUrl = stage.node.toDataURL({
            mimeType: "image/png",
            pixelRatio: Number.parseInt(export_scale, 10),
        });

        downloadFromUrl(dataUrl, `${ProjectClass.project_details.name}.png`);
        handleCancel();
    }
</script>

{#if secondary_stores.show_save_dialog}
    <Popup
        title="Save Project"
        description="Save or export your project"
        onClose={handleCancel}
        contentGap="gap-6">
        <section class="w-full flex flex-col gap-3">
            <h3 class="font-geist text-base font-semibold">
                Save Project as File
            </h3>
            <Button class="w-full" onclick={saveProject}>
                <Download />
                Download
            </Button>
        </section>

        <section class="w-full flex flex-col gap-3">
            <h3 class="font-geist text-base font-semibold">
                Export Project as Image
            </h3>

            <div class="flex w-full items-center gap-3">
                <select
                    class="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    bind:value={export_scale}>
                    <option value="1x">1x</option>
                    <option value="2x">2x</option>
                    <option value="3x">3x</option>
                </select>

                <Button class="shrink-0" onclick={downloadImage}>
                    <ImageDown />
                    Download Image
                </Button>
            </div>
        </section>

        {#snippet footer()}
            <Button onclick={handleCancel} variant="secondary">Close</Button>
        {/snippet}
    </Popup>
{/if}
