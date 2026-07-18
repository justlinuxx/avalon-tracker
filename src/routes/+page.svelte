<script lang="ts">
  import type { Game } from "$lib";
  import GameDashboard from "$lib/components/GameDashboard.svelte";
  import GameSetup from "$lib/components/GameSetup.svelte";

  let game: Game | undefined = $state(undefined);
</script>

{#if !game}
  <GameSetup onsubmit={(gameData: Game) => (game = gameData)} />
{:else}
  <GameDashboard {game} />
{/if}
