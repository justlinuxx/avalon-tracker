<script lang="ts">
    import { pushState } from "$app/navigation";
    import { page } from "$app/state";
    import { Game } from "$lib/index.svelte";
    import SetupForm from "$lib/components/SetupForm.svelte";
    import GamePanel from "$lib/components/GamePanel.svelte";
    import { load_game, save_game } from "$lib/cookies.remote";
    import { onMount } from "svelte";

    let game: Game | undefined = $state(undefined);
    let saved_game = await load_game();
    if (saved_game) game = Game.load_from_json(saved_game);

    onMount(() => {
        if (game) pushState("", { game_running: true });
    });
</script>

{#if !page.state.game_running}
    <SetupForm
        onsubmit={(gameData: Game) => {
            game = gameData;
            save_game(game.to_json());
            pushState("", { game_running: true });
        }}
    />
{:else if game}
    <GamePanel {game} />
{/if}
