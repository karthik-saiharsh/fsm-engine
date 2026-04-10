<script lang="ts">
    import type { Snippet } from "svelte";
    import * as AlertDialog from "./ui/alert-dialog";
    import { buttonVariants } from "./ui/button";

    interface AlertProps {
        trigger: Snippet;
        title: string;
        desc: string;
        onSave?: () => void;
    }

    const { trigger, title, desc, onSave }: AlertProps = $props();
</script>

<AlertDialog.Root>
    <AlertDialog.Trigger class={buttonVariants({ variant: "outline" })}>
        {@render trigger()}
    </AlertDialog.Trigger>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>{title}</AlertDialog.Title>
            <AlertDialog.Description>
                {desc}
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action onclick={onSave}>Continue</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
