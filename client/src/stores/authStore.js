import { writable } from 'svelte/store';

export const auth = writable({
  loggedin: false,
});