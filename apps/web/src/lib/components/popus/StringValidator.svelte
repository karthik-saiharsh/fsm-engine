<!--
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script lang="ts">
    import Window from "../generic/Window.svelte";
    import secondary_stores from "../../brain/extras.svelte";

    /**
     * Function to handle Closing of the Transition table window
     */
    function closeWindow() {
        secondary_stores.show_transition_table = false;
    }
</script>

<Window
    win_dim={{ width: 500, height: 200 }}
    title="Transition Table"
    is_shown={secondary_stores.show_transition_table}
    {closeWindow}>
    <div></div>
</Window>
