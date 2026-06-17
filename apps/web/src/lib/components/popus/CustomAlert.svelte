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
</script>

{#if secondary_stores.alert_popup.visible}
    <main
        class="absolute top-0 left-0 z-20 flex justify-center items-center w-screen h-screen bg-background/10 backdrop-blur">
        <Card.Root
            class={`-my-4 w-full max-w-sm shadow-[0px_0px_50px_0px_#000000${ProjectClass.theme === "dark" ? "85" : "25"}]`}>
            <Card.Header>
                <Card.Title class="font-geist">Heads up!</Card.Title>
                <Card.Description class="font-geist"
                    >Something demands your attention</Card.Description>
                <Card.Action onclick={secondary_stores.alert_popup.onReject}>
                    <Button variant="link" size="icon"><X /></Button>
                </Card.Action>
            </Card.Header>

            <Card.Content
                class="flex flex-col justify-center items-center gap-6">
                <p class="text-sm">
                    {secondary_stores.alert_popup.message}
                </p>
            </Card.Content>

            <Card.Footer class="flex justify-center items-center gap-5">
                <Button
                    onclick={secondary_stores.alert_popup.onReject}
                    variant="secondary"
                    >{secondary_stores.alert_popup.type === "info"
                        ? "Close"
                        : "Cancel"}</Button>

                {#if secondary_stores.alert_popup.type === "confirm"}
                    <Button
                        onclick={secondary_stores.alert_popup.onAccept}
                        variant="default">Okay</Button>
                {/if}
            </Card.Footer>
        </Card.Root>
    </main>
{/if}
