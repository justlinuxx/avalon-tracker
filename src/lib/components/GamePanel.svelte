<script lang="ts">
	import { goto } from '$app/navigation';
	import { Vote, type Game, type Player, type Round } from '#lib/index.svelte.js';
	import EditRound from './GamePanel/EditRound.svelte';
	import { page } from '$app/state';
	import { delete_game, save_game } from '#lib/cookies.remote.js';

	let { game }: { game: Game } = $props();

	let editing_round_id: number = $state(0);

	function handleRound(round: Round) {
		if (game.rounds.length <= round.id) game.add_round(round);
		else game.rounds[round.id] = round;
		save_game(game.to_json());

		goto('', {
			shallow: true,
			replace: true,
			state: { ...page.state, editing_round: false }
		});

		editing_round_id = game.rounds.length;
	}

	function nextLeader() {
		const last_round = game.rounds.at(-1);
		if (!last_round) return game.players[0];
		const last_leader = last_round.leader;
		return game.players.at((last_leader.id + 1) % game.players.length);
	}
</script>

{#snippet PlayerRow(player: Player)}
	<tr class="text-center *:min-w-16 *:p-2">
		<td>{player.name}</td>
		{#each game.rounds as round (round.id)}
			{const approved = $derived(round.voting.get(player.id) == Vote.Approve)}
			{const selected = $derived(round.selected_players.some((p) => p.id === player.id))}
			<td>
				<span
					class="p-1 {selected ? 'rounded-full border border-white font-extrabold' : ''}"
					class:text-approve={approved}
					class:text-reject={!approved}>{approved ? 'A' : 'R'}</span
				>
			</td>
		{/each}
	</tr>
{/snippet}

{#if !page.state.exporting_game}
	<div
		class="flex flex-col divide-y divide-secondary rounded-md border border-secondary bg-primary"
	>
		<h3 class="p-2 text-center text-4xl">Rounds</h3>
		<div class="flex divide-x divide-secondary">
			<div class="flex-1 overflow-x-auto">
				<table class="w-full divide-y divide-secondary">
					<tbody class="divide-y divide-secondary text-center">
						<tr class="p-2 *:min-w-16">
							<th class="p-2">Name</th>
							{#each game.rounds as round, index}
								<th class="p-2"
									><button
										onclick={() => {
											editing_round_id = index;
											goto('', { shallow: true, state: { ...page.state, editing_round: true } });
										}}>{index + 1} - {round.leader.name}</button
									></th
								>
							{/each}
						</tr>
						{#each game.players as player (player.id)}
							{@render PlayerRow(player)}
						{/each}
						<tr>
							<th class="p-2">Missions</th>
							{#each game.rounds as round (round.id)}
								{#if round.mission}
									<td>
										<span
											class="rounded-md border-2 px-2 {round.mission.num_fails > 0
												? 'border-fail'
												: 'border-success'}"
										>
											<span class="text-success"
												>{round.selected_players.length - round.mission.num_fails}</span
											>/<span class="text-fail">{round.mission.num_fails}</span>
										</span>
									</td>
								{:else}
									<td></td>
								{/if}
							{/each}
						</tr>
					</tbody>
				</table>
			</div>
			<button
				class="px-4 text-2xl font-bold"
				onclick={() => {
					editing_round_id = game.rounds.length;
					goto('', { shallow: true, state: { ...page.state, editing_round: true } });
				}}>+</button
			>
		</div>
	</div>
	{#key editing_round_id}
		{#if page.state.editing_round}
			<div class="my-2">
				<EditRound
					players={game.players}
					default={game.rounds[editing_round_id] || {
						id: game.rounds.length,
						leader: nextLeader()
					}}
					onsubmit={(round) => handleRound(round)}
				/>
			</div>
		{/if}
	{/key}
	<button
		class="my-2 rounded-md border border-secondary bg-primary p-2 text-xl"
		onclick={() => goto('', { shallow: true, state: { ...page.state, exporting_game: true } })}
		>Export Game</button
	>
	<button
		class="my-2 rounded-md border border-secondary bg-primary p-2 text-xl"
		onclick={() => {
			delete_game();
			goto('', { shallow: true, state: { game_running: false } });
		}}>Exit Game</button
	>
{:else}
	<code>{game.to_json()}</code>
{/if}
