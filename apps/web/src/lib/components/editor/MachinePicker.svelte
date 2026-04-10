<script lang="ts">
    import CheckIcon from "@lucide/svelte/icons/check";
    import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
    import { tick } from "svelte";
    import * as Command from "../ui/command/index";
    import * as Popover from "../ui/popover/index";
    import { Button } from "../ui/button/index";
    import { cn } from "../../utils";

    const frameworks = [
        {
            value: "FREESTYLE",
            label: "Free Style",
        },
        {
            value: "DFA",
            label: "DFA",
        },
        {
            value: "NFA",
            label: "NFA",
        },
        {
            value: "PDA",
            label: "PDA",
        },
        {
            value: "NPDA",
            label: "NPDA",
        },
        {
            value: "MOORE",
            label: "Moore",
        },
        {
            value: "MEALY",
            label: "Mealy",
        },
        {
            value: "TURING",
            label: "Turing",
        },
    ];

    let open = $state(false);
    let value = $state("FREESTYLE");
    let triggerRef = $state<HTMLButtonElement>(null!);

    $effect(() => {
        if (value != "FREESTYLE") {
            alert(
                "This feature hasn't been implemented yet. We are working on it.\n\nIf you want to use NFA or DFA modes, check out the legacy version at (https://fsm-engine.vercel.app/) \n\nDevelopment of FSM Engine takes time and effort, and the team is very small (only 1 developer for now; so bear with me if new features, and fixes take time)"
            );
            value = "FREESTYLE";
        }
    });

    const selectedValue = $derived(
        frameworks.find((f) => f.value === value)?.label
    );

    // We want to refocus the trigger button when the user selects
    // an item from the list so users can continue navigating the
    // rest of the form with the keyboard.
    function closeAndFocusTrigger() {
        open = false;
        tick().then(() => {
            triggerRef.focus();
        });
    }
</script>

<Popover.Root bind:open>
    <Popover.Trigger bind:ref={triggerRef}>
        {#snippet child({ props })}
            <Button
                {...props}
                variant="outline"
                class="w-50 justify-between"
                role="combobox"
                aria-expanded={open}>
                {selectedValue || "Select Machine Type..."}
                <ChevronsUpDownIcon class="opacity-50" />
            </Button>
        {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-50 p-0">
        <Command.Root>
            <Command.Input placeholder="Select Machine Type..." />
            <Command.List>
                <Command.Empty>No framework found.</Command.Empty>
                <Command.Group value="frameworks">
                    {#each frameworks as framework (framework.value)}
                        <Command.Item
                            value={framework.value}
                            onSelect={() => {
                                value = framework.value;
                                closeAndFocusTrigger();
                            }}>
                            <CheckIcon
                                class={cn(
                                    value !== framework.value &&
                                        "text-transparent"
                                )} />
                            {framework.label}
                        </Command.Item>
                    {/each}
                </Command.Group>
            </Command.List>
        </Command.Root>
    </Popover.Content>
</Popover.Root>
