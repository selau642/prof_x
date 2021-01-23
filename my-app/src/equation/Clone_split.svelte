
<script>
import Container from './Container.svelte'
import Arrow from './Arrow.svelte'
import { tweened } from 'svelte/motion'
import { onMount } from 'svelte'
import { In } from './actions/interaction.js'
let show_clone_arrow = true
export let input

let {
    clone_id,
    tree,
    start_x,
    start_y,
    end_x,
    end_y,
	arrow_direction,
	arrow_color,
	e_tree_list
} = input

let this_clone



tree.props.isClone = true

const ty = tweened(0)
const tx = tweened(0)

onMount( async() =>{
	// pause movement:
	// throw new Error()
    await Promise.all([tx.set(end_x, {duration: 200}),
                    ty.set(end_y, {duration:200})])
	// show_clone_arrow = false
	this_clone.style.display = "none"
	tree = false
	//hide show_arrow 
	
	//drag end for non clone tree list
	In.runDragEnd( { e_tree_list } )

})

</script>
<div 
bind:this={this_clone}
id='clone_{clone_id}' 
class='draggable split'
style='left:{start_x}px; top:{start_y}px;
transform: translate({$tx}px, {$ty}px);'
>
	<div
	id={tree.name}
	>
	{#if arrow_direction == 'top' }
		<Arrow  
		arrow_direction = {arrow_direction}
		arrow_color = {arrow_color}
		isDraggable={true}
		/>
	{/if}
		<div 
		class='border_wrap border' >
			<Container tree={tree} />
		</div> 
	{#if arrow_direction == 'bottom'}
		<Arrow  
		arrow_direction = {arrow_direction}
		arrow_color = {arrow_color}
		isDraggable={true}
		/>
	{/if}
	</div>
</div>	
<style>
div
{
	font:30px Times;
	display:inline-block;
	cursor:pointer;
	/* padding: 0px 4px; */
	/* margin: 0px 2px; */
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	text-align:center;
	vertical-align:top;
}
.border
{
	border:1px solid rgb(0, 0, 200);
	border-radius: 4px;
}

.draggable
{
	position:absolute;
	background-color: rgb(255, 255, 255);
	z-index: 100;	
}

</style>