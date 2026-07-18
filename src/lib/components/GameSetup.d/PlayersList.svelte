<script lang="ts">
  let { players, removePlayer }: { players: String[]; removePlayer: Function } =
    $props();
</script>

{#snippet PlayerRow(playerName: String)}
  <div class="p-2 flex items-center">
    <span class="flex-1">{playerName}</span>
    <button
      onclick={() => removePlayer(playerName)}
      class="hover:bg-red-700 animate rounded-md p-1">Delete</button
    >
  </div>
{/snippet}

<div
  class="flex flex-col divide-y divide-secondary border border-secondary bg-primary rounded-md"
>
  <div class="p-2">
    <h3 class="text-xl text-center font-bold">
      {players.length ? "Players" : "No Players"}
    </h3>
  </div>
  {#each players as player}
    {@render PlayerRow(player)}
  {/each}
</div>
