<script lang="ts">
	import { type Player, type Voting, Vote } from '#lib/index.svelte.js';

	let { players, voting }: { players: Player[]; voting: Voting } = $props();

	function selectVote(player: Player, vote: Vote) {
		if (voting.get(player.id) === vote) voting.delete(player.id);
		else voting.set(player.id, vote);
	}
</script>

<div class="flex flex-1 flex-col divide-y divide-secondary rounded-md border border-secondary">
	{#each players as player (player.id)}
		<div class="flex items-center justify-between gap-2 p-2">
			<span>{player.name}</span>
			<div class="overflow-hidden rounded-md border border-secondary *:p-1">
				<button
					class={voting.get(player.id) === Vote.Approve ? 'bg-approve text-black' : 'text-approve'}
					onclick={() => selectVote(player, Vote.Approve)}>Approve</button
				>
				<button
					class={voting.get(player.id) === Vote.Reject ? 'bg-reject text-black' : 'text-reject'}
					onclick={() => selectVote(player, Vote.Reject)}>Reject</button
				>
			</div>
		</div>
	{/each}
</div>
