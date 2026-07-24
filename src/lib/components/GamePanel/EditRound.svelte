<script lang="ts">
  import {
    createRound,
    type Mission,
    type Player,
    type Round,
    type Voting,
    Vote,
  } from "$lib";
  import { SvelteMap } from "svelte/reactivity";

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
    if (selected_players.indexOf(player) == -1) selected_players.push(player);
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
      .reduce((count, vote) => (vote == Vote.Approve ? count + 1 : count), 0);
    let rejected_num = voting.size - approved_num;

    for (const player of players) {
      if (!voting.has(player)) {
        if (approved_num > rejected_num) voting.set(player, Vote.Reject);
        else voting.set(player, Vote.Approve);
      }
    }

    approved_num = voting
      .values()
      .reduce((count, vote) => (vote == Vote.Approve ? count + 1 : count), 0);
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
    <select
      name="leader"
      class="border border-secondary rounded-md p-1"
      bind:value={leader}
    >
      {#each players as player (player.id)}
        <option value={player}>{player.name}</option>
      {/each}
    </select>
  </div>
  <div>
    <h4 class="text-xl">Selected players</h4>
    <div class="flex gap-2 mt-1">
      {#each players as player (player.id)}
        <button
          class="border border-secondary rounded-md p-1 {selected_players.indexOf(
            player,
          ) == -1
            ? ''
            : 'bg-secondary text-black'}"
          onclick={() => selectPlayer(player)}>{player.name}</button
        >
      {/each}
    </div>
  </div>
  <div>
    <h4 class="text-xl">Voting</h4>
    <div
      class="flex-1 flex flex-col divide-y divide-secondary border border-secondary rounded-md"
    >
      {#each players as player (player.id)}
        <div class="flex p-2 items-center gap-2 justify-between">
          <span>{player.name}</span>
          <div class="rounded-md border border-secondary *:p-1 overflow-hidden">
            <button
              class={voting.get(player) === Vote.Approve
                ? "bg-approve text-black"
                : "text-approve"}
              onclick={() => selectVote(player, Vote.Approve)}>Approve</button
            >
            <button
              class={voting.get(player) === Vote.Reject
                ? "bg-reject text-black"
                : "text-reject"}
              onclick={() => selectVote(player, Vote.Reject)}>Reject</button
            >
          </div>
        </div>
      {/each}
    </div>
  </div>
  <div>
    <h4 class="text-xl">Mission</h4>
    <span>Number of fails: {num_fails}</span>
    <div
      class="border border-secondary inline-flex divide-x divide-secondary rounded-md text-xl *:px-5"
    >
      <button onclick={() => num_fails++}>+</button>
      <button onclick={() => (num_fails = Math.max(num_fails - 1, 0))}>-</button
      >
    </div>
  </div>
  <button class="font-bold text-xl" onclick={() => handleSubmit()}
    >Add Round</button
  >
</div>
