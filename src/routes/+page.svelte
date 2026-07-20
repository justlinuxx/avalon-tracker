<script lang="ts">
  import { pushState } from "$app/navigation";
  import { page } from "$app/state";
  import type { Game } from "$lib";
  import GameDashboard from "$lib/components/GameDashboard.svelte";
  import GameSetup from "$lib/components/GameSetup.svelte";

  let game: Game | undefined = $state(undefined);
</script>

{#if !page.state.game_running}
  <GameSetup
    onsubmit={(gameData: Game) => {
      game = gameData;
      pushState("", { game_running: true });
    }}
  />
{:else if game}
  <GameDashboard {game} />
{/if}
