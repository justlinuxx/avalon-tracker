<script lang="ts">
	let { players, removePlayer }: { players: String[]; removePlayer: Function } = $props();
</script>

{#snippet PlayerRow(playerName: String)}
	<div class="flex items-center p-2">
		<span class="flex-1">{playerName}</span>
		<button onclick={() => removePlayer(playerName)} class="animate rounded-md p-1 hover:bg-red-700"
			>Delete</button
		>
	</div>
{/snippet}

<div class="flex flex-col divide-y divide-secondary rounded-md border border-secondary bg-primary">
	<div class="p-2">
		<h3 class="text-center text-xl font-bold">
			{players.length ? 'Players' : 'No Players'}
		</h3>
	</div>
	{#each players as player}
		{@render PlayerRow(player)}
	{/each}
</div>
