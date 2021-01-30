<script>

//Dragging
import { x_drag } from './actions/x_drag.js'
import { clone } from './actions/clone_stores.js'
import { op } from './actions/xTree.js'
// export let arrow_type;
// let [direction, arrow_color] = arrow_type.split("_")
export let tree = false
export let arrow_direction
export let arrow_color 
// color code = bx(red), i(blue), disable(grey), in_br(yellow)
// export let left = 0
export let isDraggable = false

let this_arrow
function arrow_mouse_down(e)
{
	// dispatch('arrow_mouse_down', {
	// 	e: e,
	// 	e_tree: tree
	// })
	let full_name = this_arrow.parentNode.full_name
	let drag_elem = document.getElementById(full_name + '-border')
	$clone = { 
		e,
		e_tree: tree,
		clone_tree: op.cloneFrom(tree), 
		drag_elem,
		arrow_direction,
		arrow_color
		}

}
</script>
{#if !isDraggable}
	<div class="arrow_wrapper"
		bind:this={this_arrow}
	>
		<span 
		id="{tree.full_name}-arrow"
		class="arrow flip-{arrow_direction} arrow-{arrow_color}"
		on:click|stopPropagation 
		on:mousedown={arrow_mouse_down}
		><span class='after'> </span></span>
		
	</div>
{:else}
	<div class="arrow_wrapper"
		bind:this={this_arrow}
	>
		<span 
		class="arrow flip-{arrow_direction} arrow-drag" 
		use:x_drag={isDraggable}
		on:x_drag_start
		on:x_drag_move
		on:x_drag_end
		on:mousedown
		><span class='after'> </span></span>
	</div>
{/if}


<style>
.arrow_wrapper{
	position:relative;
	left:50%; /* For positioning <Arrow /> at the end*/
	margin: 0px auto;
	z-index:1;
}

.arrow
{  
	position: absolute;
	cursor:pointer;
	opacity: 0.8;
}

.flip-top 
{
  height:21px;
  width:20px;
  left:-10px; /* 1/2 of width */
  top:-34px;
}

.after
{
	position:absolute;
	border: solid transparent;
    border-width: 10px;
    margin-left: -10px;
}

.flip-top .after
{
	bottom: -20px;
}

.flip-top:hover
{
  background:rgb(0, 255 , 0);
}

.arrow.flip-top:hover .after
{
  border-top-color:rgb(0, 255 , 0);
}

.flip-bottom 
{
  height:20px;
  width:20px;
  left: -10px;
  bottom:-34px;
}

.flip-bottom .after
{
	top: -20px;
}

.flip-bottom:hover
{
  background:rgb(0, 255 , 0);
}

.arrow.flip-bottom:hover .after
{
  border-bottom-color:rgb(0, 255 , 0);
}

.arrow-bx
{
	background: rgb(220, 20, 60);
}

.flip-top.arrow-bx .after
{
	border-top-color:  rgb(220, 20, 60);
}

.flip-bottom.arrow-bx .after
{
	border-bottom-color: rgb(220, 20, 60);
}

.arrow-i{
  background:rgb(33,70,220);
}

.flip-top.arrow-i .after
{
  border-top-color:rgb(33,70,220);
}

.flip-bottom.arrow-i .after
{
  border-bottom-color:rgb(33,70,220);
}

.arrow-drag{
  background:rgb(0,255, 0);
}

.flip-top.arrow-drag .after
{
  border-top-color:rgb(0,255, 0);
}

.flip-bottom.arrow-drag .after
{
  border-bottom-color:rgb(0,255, 0);
}

.arrow-in-br 
{
  background: #faa41a;
}

.flip-top.arrow-in-br .after 
{
  border-top-color: #faa41a;
}

.flip-bottom.arrow-in-br .after
{
  border-bottom-color: #faa41a;
}


.arrow-disable 
{
  background:rgb(120,120,120); 
}

.flip-top.arrow-disable .after
{
  border-top-color:rgb(120,120,120); 
}

.flip-bottom.arrow-disable .after
{
  border-bottom-color:rgb(120,120,120); 
}

</style>



