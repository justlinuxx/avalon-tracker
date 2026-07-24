<script lang="ts">
  import { dev } from "$app/environment";
  import { createGame } from "$lib";
  import AddPlayer from "./SetupForm/AddPlayer.svelte";
  import PlayersList from "./SetupForm/PlayersList.svelte";

  let { onsubmit }: { onsubmit: Function } = $props();

  let players: string[] = $state([]);

  if (dev) players = ["Peter", "Heli", "Janko", "Hanka", "Mia"];

  function addPlayer(playerName: string) {
    playerName = playerName.trim();
    if (playerName == "" || players.indexOf(playerName) != -1) {
      playerName = "";
      return;
    }
    players.push(playerName);
  }

  function removePlayer(targetPlayer: String) {
    players = players.filter((player) => targetPlayer != player);
  }
</script>

<div class="flex flex-col gap-2">
  <PlayersList {players} {removePlayer} />
  <AddPlayer {addPlayer} />
  <button
    class="border border-secondary bg-primary rounded-md p-2 font-bold text-xl"
    onclick={() => onsubmit(createGame({ players }))}>Create Game</button
  >
</div>
