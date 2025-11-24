import { writable } from 'svelte/store';

export const tokenStore = writable('');
export const visibleStore = writable(true); // control modal visibility