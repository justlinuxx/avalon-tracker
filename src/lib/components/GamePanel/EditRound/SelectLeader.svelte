<script lang="ts">
    import type { Player } from "$lib";
    import Select from "$lib/components/Select.svelte";

    let {
        players,
        selected_player = $bindable(),
    }: { players: Player[]; selected_player: Player } = $props();
</script>

<Select options={players} bind:value={selected_player} value_row="name" />
