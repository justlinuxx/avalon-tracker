<script lang="ts">
  let { addPlayer }: { addPlayer: Function } = $props();

  let playerName: string = $state("");
  let input_element: HTMLInputElement;

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    addPlayer(playerName);
    playerName = "";
    input_element.focus();
  }
</script>

<form
  class="border border-secondary bg-primary rounded-md p-2 flex"
  onsubmit={(e) => handleSubmit(e)}
>
  <input
    type="text"
    placeholder="Name"
    class="flex-1 outline-none"
    bind:value={playerName}
    bind:this={input_element}
  />
  <button type="submit" class="p-1 rounded-md">Add Player</button>
</form>
