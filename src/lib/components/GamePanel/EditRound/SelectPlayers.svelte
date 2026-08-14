<script lang="ts">
    import type { Player } from "#lib/index.svelte.js";

    let {
        players,
        selected_players = $bindable(),
    }: { players: Player[]; selected_players: Player[] } = $props();

    function is_selected(player: Player): boolean {
        return selected_players.some((p) => p.id === player.id);
    }

    function selectPlayer(player: Player) {
        if (!is_selected(player)) selected_players.push(player);
        else
            selected_players = selected_players.filter(
                (selected_player) => selected_player.id != player.id,
            );
    }
</script>

<div class="flex gap-2 mt-1">
    {#each players as player (player.id)}
        <button
            class="border border-secondary rounded-md p-1 {is_selected(player)
                ? 'bg-secondary text-black'
                : ''}"
            onclick={() => selectPlayer(player)}>{player.name}</button
        >
    {/each}
</div>
