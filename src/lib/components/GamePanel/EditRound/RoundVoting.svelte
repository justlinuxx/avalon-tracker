<script lang="ts">
  import type { Player, Voting } from "$lib";
  import { Vote } from "$lib";

  let { players, voting }: { players: Player[]; voting: Voting } = $props();

  function selectVote(player: Player, vote: Vote) {
    if (voting.get(player) === vote) voting.delete(player);
    else voting.set(player, vote);
  }
</script>

<div
  class="flex-1 flex flex-col divide-y divide-secondary border-secondary border rounded-md"
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
