import { command, getRequestEvent, query } from '$app/server';

export let save_game = command('unchecked', (game: string) => {
	getRequestEvent().cookies.set('game', game, { path: '/' });
});

export let load_game = query((): string | undefined => {
	const game_raw = getRequestEvent().cookies.get('game');
	return game_raw;
});

export let delete_game = command(() => {
	getRequestEvent().cookies.delete('game', { path: '/' });
});
