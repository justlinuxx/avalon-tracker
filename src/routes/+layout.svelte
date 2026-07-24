<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<main
  class="bg-background min-h-screen overflow-x-scroll text-white p-2 flex flex-col"
>
  {@render children()}
</main>
