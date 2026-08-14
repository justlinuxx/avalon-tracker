<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Avalon Tracker</title>
</svelte:head>
<main class="flex min-h-screen flex-col overflow-x-scroll bg-background p-2 text-white">
	{@render children()}
</main>
