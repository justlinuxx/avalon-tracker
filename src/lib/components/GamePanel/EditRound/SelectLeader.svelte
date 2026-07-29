<script lang="ts">
    import type { Player } from "$lib";

    let {
        players,
        selected_player = $bindable(),
    }: { players: Player[]; selected_player: Player } = $props();
</script>

<select
    bind:value={selected_player}
    class="border border-secondary rounded-md p-1"
>
    {#each players as player (player.id)}
        <option value={player}>{player.name}</option>
    {/each}
</select>
