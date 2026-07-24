// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    interface PageState {
      game_running?: boolean = false,
      editing_round?: boolean = false,
      exporting_game?: boolean = false,
    }
    // interface Platform {}
  }
}

export { };
