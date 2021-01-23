import { writable } from 'svelte/store'

// export let stopDragSelect = writable(false)
export let blockSelect = writable(false)
export let clone = writable({ init: true } )
export let mouse_x = writable(0)
export let mouse_y = writable(0)



