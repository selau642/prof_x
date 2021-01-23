Remove || tree.props.isClone

export let isDraggable = false
export let clone_id = 0
export let start_x = 0
export let start_y = 0

//for onMount event client mouse position
export let client_x = 0
export let client_y = 0
import { tweened } from 'svelte/motion'

Remove import 
clone_obj, clone_drag_move
import { beforeUpdate, onDestroy } from 'svelte'

Remove
const tx = tweened(0, {
	duration: 0
})

const ty = tweened(0,{
	duration: 0
})

Remove
handledrag start, move, end

Remove HTML
{:else}<!--isDraggable--> 
	<div 
		bind:this={this_box}
		class=box 
		class:show_arrow={tree_props.show_arrow}
		class:draggable ={true}
		style='left:{start_x}px; top:{start_y}px; transform: translate({$tx}px, {$ty}px);'
		><Container 
		tree={tree} 
		/>{#if tree_props.show_arrow}<Arrow 
		type={arrow_type}
		left={arrow_left} 
		isDraggable={isDraggable}
		on:x_drag_start={handleDragStart}
		on:x_drag_move={handleDragMove}
		on:x_drag_end={handleDragEnd}
		on:mousedown
		/>{/if}</div>
{/if}

Remove CSS 
.draggable
{
	position:absolute;
	background-color: rgb(255, 255, 255);
	z-index: 100;	
}
