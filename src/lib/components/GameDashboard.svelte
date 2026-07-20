<script lang="ts">
  import { pushState, replaceState } from "$app/navigation";
  import type { Game, Player, Round } from "$lib";
  import AddRound from "./AddRound.svelte";
  import { page } from "$app/state";

  let { game }: { game: Game } = $props();
  replaceState("", { phase: "normal", ...page.state });

  $inspect(game);

  function handleRound(round: Round) {
    game.rounds.push(round);
    history.back();
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
      {@const approved = round.voting.approved.indexOf(player) != -1}
      {@const selected = round.selectedPlayers.indexOf(player) != -1}
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

{#if page.state.phase == "normal"}
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
                <th class="p-2">{index + 1} - {round.leader.name}</th>
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
                    <span class="text-success"
                      >{round.selectedPlayers.length -
                        round.mission.numFails}</span
                    >/<span class="text-fail">{round.mission.numFails}</span>
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
        onclick={() => pushState("", { ...page.state, phase: "voting" })}
        >+</button
      >
    </div>
  </div>
{:else if page.state.phase == "voting"}
  <AddRound
    players={game.players}
    round_id={game.rounds.length}
    default_leader={nextLeader()}
    onsubmit={(round) => handleRound(round)}
  />
{/if}
