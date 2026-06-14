<script lang="ts">
    import CheckIcon from "@lucide/svelte/icons/check";
    import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
    import { tick } from "svelte";
    import * as Command from "../ui/command/index";
    import * as Popover from "../ui/popover/index";
    import { Button } from "../ui/button/index";
    import { cn } from "../../utils";
    import ProjectClass from "../../brain/store.svelte";
    import { EngineTypes } from "@fsm/engine";

    const frameworks: { value: string; label: string; typ?: EngineTypes }[] = [
        {
            value: "FREESTYLE",
            label: "Free Style",
            typ: EngineTypes.FREE,
        },
        {
            value: "DFA",
            label: "DFA",
            typ: EngineTypes.DFA,
        },
        {
            value: "NFA",
            label: "NFA",
            typ: EngineTypes.NFA,
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

    const selectedValue = $derived(
        frameworks.find((f) => f.value === value)?.label
    );

    // We want to refocus the trigger button when the user selects
    // an item from the list so users can continue navigating the
    // rest of the form with the keyboard.
    function closeAndFocusTrigger(index: number) {
        open = false;
        tick().then(() => {
            triggerRef.focus();
        });

        // Alert if un available state chosen
        if (index > 1) {
            alert(
                "Only DFA mode is available for now. I are working on implementing the other machines as well. Hang on, give me some time."
            );
            return;
        }

        // Set new value
        value = frameworks[index].value;

        // Call the backend to change Machine Type
        ProjectClass.changeProjectType(
            frameworks[index].typ ?? EngineTypes.FREE
        );
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
                    {#each frameworks as framework, index}
                        <Command.Item
                            value={framework.value}
                            onSelect={() => {
                                closeAndFocusTrigger(index);
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
