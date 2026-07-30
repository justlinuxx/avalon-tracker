<script lang="ts">
    import { pushState, replaceState } from "$app/navigation";
    import {
        Vote,
        type Game,
        type Player,
        type Round,
    } from "$lib/index.svelte";
    import EditRound from "./GamePanel/EditRound.svelte";
    import { page } from "$app/state";

    let { game }: { game: Game } = $props();

    let editing_round_id: number = $state(0);

    function handleRound(round: Round) {
        if (game.rounds.length <= round.id) game.add_round(round);
        else game.rounds[round.id] = round;
        replaceState("", { ...page.state, editing_round: false });
        editing_round_id = game.rounds.length;
    }

    function nextLeader() {
        const last_round = game.rounds.at(-1);
        if (!last_round) return game.players[0];
        const last_leader = last_round.leader;
        return game.players.at((last_leader.id + 1) % game.players.length);
    }
</script>

{#snippet PlayerRow(player: Player)}
    <tr class="text-center *:p-2 *:min-w-16">
        <td>{player.name}</td>
        {#each game.rounds as round (round.id)}
            {@const approved = round.voting.get(player) == Vote.Approve}
            {@const selected = round.selected_players.some(
                (p) => p.id === player.id,
            )}
            {@const game_leader = round.leader === player}
            <td>
                <span
                    class="p-1 {selected
                        ? 'font-extrabold rounded-full border border-white'
                        : ''}"
                    class:text-approve={approved}
                    class:text-reject={!approved}>{approved ? "A" : "R"}</span
                >
            </td>
        {/each}
    </tr>
{/snippet}

{#if !page.state.exporting_game}
    <div
        class="flex flex-col border border-secondary bg-primary rounded-md divide-y divide-secondary"
    >
        <h3 class="text-4xl p-2 text-center">Rounds</h3>
        <div class="flex divide-x divide-secondary">
            <div class="flex-1 overflow-x-auto">
                <table class="w-full divide-y divide-secondary">
                    <tbody class="divide-y divide-secondary text-center">
                        <tr class="p-2 *:min-w-16">
                            <th class="p-2">Name</th>
                            {#each game.rounds as round, index}
                                <th class="p-2"
                                    ><button
                                        onclick={() => {
                                            editing_round_id = index;
                                            pushState("", {
                                                ...page.state,
                                                editing_round: true,
                                            });
                                        }}
                                        >{index + 1} - {round.leader
                                            .name}</button
                                    ></th
                                >
                            {/each}
                        </tr>
                        {#each game.players as player (player.id)}
                            {@render PlayerRow(player)}
                        {/each}
                        <tr>
                            <th class="p-2">Missions</th>
                            {#each game.rounds as round (round.id)}
                                {#if round.mission}
                                    <td>
                                        <span
                                            class="border-2 rounded-md px-2 {round
                                                .mission.num_fails > 0
                                                ? 'border-fail'
                                                : 'border-success'}"
                                        >
                                            <span class="text-success"
                                                >{round.selected_players
                                                    .length -
                                                    round.mission
                                                        .num_fails}</span
                                            >/<span class="text-fail"
                                                >{round.mission.num_fails}</span
                                            >
                                        </span>
                                    </td>
                                {:else}
                                    <td></td>
                                {/if}
                            {/each}
                        </tr>
                    </tbody>
                </table>
            </div>
            <button
                class="px-4 text-2xl font-bold"
                onclick={() => {
                    editing_round_id = game.rounds.length;
                    pushState("", { ...page.state, editing_round: true });
                }}>+</button
            >
        </div>
    </div>
    {#key editing_round_id}
        {#if page.state.editing_round}
            <div class="my-2">
                <EditRound
                    players={game.players}
                    default={game.rounds[editing_round_id] || {
                        id: game.rounds.length,
                        leader: nextLeader(),
                    }}
                    onsubmit={(round) => handleRound(round)}
                />
            </div>
        {/if}
    {/key}
    <button
        class="bg-primary border border-secondary rounded-md p-2 text-xl my-2"
        onclick={() => pushState("", { ...page.state, exporting_game: true })}
        >Export Game</button
    >
{:else}
    <code>{JSON.stringify(game)}</code>
{/if}
