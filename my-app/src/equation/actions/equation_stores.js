import { writable } from 'svelte/store'

export let isSelecting = writable(false) //use for select and deselect btn

export let tree = writable({})
export let dict = writable({})
export let op = writable({})
export let error_msg = writable('Message:')