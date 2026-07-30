<script lang="ts">
    import {
        createRound,
        type Mission,
        type Player,
        type Round,
        type Voting,
        Vote,
    } from "$lib/index.svelte";
    import { SvelteMap } from "svelte/reactivity";
    import SelectLeader from "./EditRound/SelectLeader.svelte";
    import SelectPlayers from "./EditRound/SelectPlayers.svelte";
    import RoundVoting from "./EditRound/RoundVoting.svelte";

    let {
        players,
        default: default_values,
        onsubmit,
    }: {
        players: Player[];
        default: Partial<Round>;
        onsubmit: (arg: Round) => void;
    } = $props();

    let round_id = $state(default_values.id || 0);

    let leader: Player = $state(default_values.leader || players[0]);

    let selected_players: Player[] = $state(
        default_values.selected_players || [],
    );

    let voting: Voting = new SvelteMap(default_values.voting);

    let num_fails = $state(default_values.mission?.num_fails || 0);
    $inspect(voting);

    function selectPlayer(player: Player) {
        if (selected_players.indexOf(player) == -1)
            selected_players.push(player);
        else
            selected_players = selected_players.filter(
                (selected_player) => selected_player != player,
            );
    }

    function selectVote(player: Player, vote: Vote) {
        if (voting.get(player) === vote) voting.delete(player);
        else voting.set(player, vote);
    }

    function handleSubmit() {
        let mission: Mission | undefined;

        let approved_num = voting
            .values()
            .reduce(
                (count, vote) => (vote == Vote.Approve ? count + 1 : count),
                0,
            );
        let rejected_num = voting.size - approved_num;

        for (const player of players) {
            if (!voting.has(player)) {
                if (approved_num > rejected_num)
                    voting.set(player, Vote.Reject);
                else voting.set(player, Vote.Approve);
            }
        }

        approved_num = voting
            .values()
            .reduce(
                (count, vote) => (vote == Vote.Approve ? count + 1 : count),
                0,
            );
        rejected_num = voting.size - approved_num;

        if (approved_num > players.length / 2) {
            mission = {
                selected_players,
                round_id,
                num_fails,
            };
        }

        onsubmit(
            createRound({
                id: round_id,
                leader,
                selected_players,
                voting,
                mission,
            }),
        );
    }
</script>

<div
    class="bg-primary border border-secondary rounded-md flex flex-col divide-y divide-secondary *:p-2"
>
    <div>
        <label for="leader" class="text-xl">Leader: </label>
        <SelectLeader {players} bind:selected_player={leader} />
    </div>
    <div>
        <h4 class="text-xl">Selected players</h4>
        <SelectPlayers {players} bind:selected_players />
    </div>
    <div>
        <h4 class="text-xl">Voting</h4>
        <RoundVoting {players} {voting} />
    </div>
    <div>
        <h4 class="text-xl">Mission</h4>
        <span>Number of fails: {num_fails}</span>
        <div
            class="border border-secondary inline-flex divide-x divide-secondary rounded-md text-xl *:px-5"
        >
            <button
                onclick={() =>
                    (num_fails = Math.min(
                        num_fails + 1,
                        selected_players.length,
                    ))}>+</button
            >
            <button onclick={() => (num_fails = Math.max(num_fails - 1, 0))}
                >-</button
            >
        </div>
    </div>
    <button class="font-bold text-xl" onclick={() => handleSubmit()}
        >Save Round</button
    >
</div>
