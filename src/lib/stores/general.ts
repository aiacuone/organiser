import { writable } from 'svelte/store';

export const darkMode = writable({
	boolean: true,
	darkStyles: {
		string: 'background:rgb(30, 30, 30); color:white',
		color: 'white',
		background: 'rgb(30, 30, 30)'
	},
	lightStyles: { string: 'background:white; color:black', background: 'white', color: 'black' }
});
