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
    import { X, Download, ImageDown } from "@lucide/svelte";
    import secondary_stores from "../../brain/extras.svelte";

    let { stage } = $props();

    let export_scale = $state("1x");
    const togglers = ProjectClass.togglers;

    function handleCancel() {
        secondary_stores.show_save_dialog = false;
    }

    function saveProject() {
        ProjectClass.exportProject();
        handleCancel();
    }

    function downloadImage() {
        if (!stage?.node) return;

        const pixelRatio = Number.parseInt(export_scale, 10);

        const dataUrl = stage.node.toDataURL({
            mimeType: "image/png",
            pixelRatio,
        });

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${ProjectClass.project_details.name}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        handleCancel();
    }
</script>

{#if secondary_stores.show_save_dialog}
    <main
        class="absolute top-0 left-0 z-20 flex justify-center items-center w-screen h-screen bg-background/10 backdrop-blur">
        <Card.Root
            class={`-my-4 w-full max-w-sm shadow-[0px_0px_50px_0px_#000000${ProjectClass.theme === "dark" ? "85" : "25"}]`}>
            <Card.Header>
                <Card.Title class="font-geist">Save Project</Card.Title>
                <Card.Description class="font-geist"
                    >Save or export your project</Card.Description>
                <Card.Action onclick={handleCancel}>
                    <Button variant="link" size="icon"><X /></Button>
                </Card.Action>
            </Card.Header>

            <Card.Content
                class="flex flex-col justify-center items-center gap-6">
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
            </Card.Content>

            <Card.Footer class="flex justify-center items-center">
                <Button onclick={handleCancel} variant="secondary"
                    >Close</Button>
            </Card.Footer>
        </Card.Root>
    </main>
{/if}
