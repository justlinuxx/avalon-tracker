<script lang="ts">
  import {
    createRound,
    type Mission,
    type Player,
    type Round,
    type Voting,
  } from "$lib";

  type Vote = "approve" | "reject";
  let {
    players,
    round_id,
    default_leader: leader,
    onsubmit,
  }: {
    players: Player[];
    round_id: number;
    default_leader?: Player;
    onsubmit: (arg: Round) => void;
  } = $props();

  // svelte-ignore state_referenced_locally
  if (!leader) leader = players[round_id % players.length];
  let selected_players: Player[] = $state([]);

  let votes: Record<number, Vote> = $state({});

  let num_fails = $state(0);

  function selectPlayer(player: Player) {
    if (selected_players.indexOf(player) == -1) selected_players.push(player);
    else
      selected_players = selected_players.filter(
        (selected_player) => selected_player != player,
      );
  }

  function handleSubmit() {
    let voting: Voting = { approved: [], rejected: [] };
    let predict_votes: Player[] = [];
    let mission: Mission | undefined;

    for (const player of players) {
      if (!votes.hasOwnProperty(player.id)) {
        predict_votes.push(player);
        continue;
      }
      if (votes[player.id] == "approve") voting.approved.push(player);
      else voting.rejected.push(player);
    }

    if (predict_votes.length > 0) {
      if (voting.approved.length <= voting.rejected.length)
        voting.approved.push(...predict_votes);
      else voting.rejected.push(...predict_votes);
    }

    if (voting.rejected.length < voting.approved.length) {
      mission = {
        selectedPlayers: selected_players,
        roundId: round_id,
        numFails: num_fails,
      };
    }

    onsubmit(
      createRound({
        id: round_id,
        leader,
        selectedPlayers: selected_players,
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
              class={votes[player.id] == "approve"
                ? "bg-approve text-black"
                : "text-approve"}
              onclick={() => (votes[player.id] = "approve")}>Approve</button
            >
            <button
              class={votes[player.id] == "reject"
                ? "bg-reject text-black"
                : "text-reject"}
              onclick={() => (votes[player.id] = "reject")}>Reject</button
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
