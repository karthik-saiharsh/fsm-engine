<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Dock from '$lib/components/Dock.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main class="w-screen h-screen overflow-hidden bg-primary">
	{@render children?.()}
	<Dock />
</main>
