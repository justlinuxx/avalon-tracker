<script lang="ts">
    import { pushState } from "$app/navigation";
    import { page } from "$app/state";
    import type { Game } from "$lib/index.svelte";
    import SetupForm from "$lib/components/SetupForm.svelte";
    import GamePanel from "$lib/components/GamePanel.svelte";

    let game: Game | undefined = $state(undefined);
</script>

{#if !page.state.game_running}
    <SetupForm
        onsubmit={(gameData: Game) => {
            game = gameData;
            pushState("", { game_running: true });
        }}
    />
{:else if game}
    <GamePanel {game} />
{/if}
