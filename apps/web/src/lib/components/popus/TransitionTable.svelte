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
    import ProjectClass from "../../brain/store.svelte";
    import Button from "../ui/button/button.svelte";
    import { Wind } from "@lucide/svelte";
    import { downloadFromUrl } from "../../brain/download";

    // The table is only built while its window is open
    const table = $derived(
        secondary_stores.show_transition_table
            ? ProjectClass.engine.makeTransitionTable()
            : null
    );

    /**
     * Given a node Id, get the name of the node
     * @param id id of the node
     */
    function getNodeName(id: number): string {
        const node = ProjectClass.nodes.get(id);
        if (node) {
            if (node.isStart) return node.value + "(S)";
            if (node.isEnd) return node.value + "(E)";
            return node.value;
        } else {
            return "-";
        }
    }

    /**
     * To build the Transition Table,
     * given the node id and alphabet, find out what states it goes to
     * @param id ref num of the node
     * @param alphabet the alphabet to get transition on
     */
    function getCell(id: number, alphabet: string): string {
        const targets = table?.table.get(id)?.get(alphabet);
        return targets?.map(getNodeName).join(",") ?? "-";
    }

    /**
     * Download State Machine Transition Table as CSV
     */
    function downloadCSV() {
        const csvData: string = ProjectClass.engine.getTransitionTableCSV();

        downloadFromUrl(
            "data:text/json;charset=utf-8," + encodeURIComponent(csvData),
            ProjectClass.project_details.name + ".csv"
        );
    }

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
    <div class="flex flex-col gap-5 justify-evenly items-center w-full h-full">
        {#if table && table.table.size > 0 && table.alphabets.size > 0}
            <table>
                <thead>
                    <tr>
                        <th>State\Alphabets</th>

                        {#each table.alphabets as alph}
                            <th>{alph}</th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each table.table.keys() as state}
                        <tr>
                            <td class="font-bold">{getNodeName(state)}</td>

                            {#each table.alphabets as alph}
                                <td>{getCell(state, alph)}</td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>

            <Button onclick={downloadCSV}>Export Data as CSV</Button>
        {:else}
            <div class="flex flex-col gap-1 justify-center items-center">
                <Wind size={50} class="opacity-70" />
                <p class="font-geist text-balance opacity-85">
                    Nothing here for now...
                </p>
            </div>
        {/if}
    </div>
</Window>

<style>
    table {
        border-radius: 2rem;
    }

    tr {
        padding: 1rem 0rem 1rem 0rem;
    }

    th {
        width: 1%;
        border: 1px solid #ffffff50;
        border-radius: 2rem;
        padding: 1rem 0rem 1rem 0rem;
    }

    td {
        padding: 1rem 0rem 1rem 0rem;
        text-align: center;
        border-radius: 2rem;
        border: 1px solid #ffffff50;
    }
</style>
