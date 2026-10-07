<!--
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script lang="ts">
    import Popup from "../generic/Popup.svelte";
    import Button from "../ui/button/button.svelte";
    import secondary_stores from "../../brain/extras.svelte";
</script>

{#if secondary_stores.alert_popup.visible}
    <Popup
        title="Heads up!"
        description="Something demands your attention"
        onClose={() => secondary_stores.alert_popup.onReject?.()}
        contentGap="gap-6">
        <p class="text-sm">
            {secondary_stores.alert_popup.message}
        </p>

        {#snippet footer()}
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
        {/snippet}
    </Popup>
{/if}
