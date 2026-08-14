<script lang="ts">
	import { dev } from '$app/env';
	import { Game, type Player } from '#lib/index.svelte.js';
	import AddPlayer from './SetupForm/AddPlayer.svelte';
	import PlayersList from './SetupForm/PlayersList.svelte';

	let { onsubmit }: { onsubmit: Function } = $props();

	let players: string[] = $state([]);

	if (dev) players = ['Peter', 'Heli', 'Janko', 'Hanka', 'Mia'];

	function addPlayer(playerName: string) {
		playerName = playerName.trim();
		if (playerName == '' || players.indexOf(playerName) != -1) {
			playerName = '';
			return;
		}
		players.push(playerName);
	}

	function removePlayer(targetPlayer: String) {
		players = players.filter((player) => targetPlayer != player);
	}

	function parse_players(): Player[] {
		let parsed_players: Player[] = [];
		for (let i = 0; i < players.length; i++) {
			parsed_players.push({
				id: i,
				name: players[i]
			});
		}
		return parsed_players;
	}
</script>

<div class="flex flex-col gap-2">
	<PlayersList {players} {removePlayer} />
	<AddPlayer {addPlayer} />
	<button
		class="rounded-md border border-secondary bg-primary p-2 text-xl font-bold"
		onclick={() => onsubmit(new Game({ players: parse_players() }))}>Create Game</button
	>
</div>
