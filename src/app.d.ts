// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    interface PageState {
      game_running?: boolean = false,
      phase?: "normal" | "voting" | "exporting" = "normal"
    }
    // interface Platform {}
  }
}

export { };
