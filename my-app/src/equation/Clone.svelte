<script lang="ts">

import { clone,  mouse_x, mouse_y, 
	blockSelect } from './actions/clone_stores.js'
import { tweened } from 'svelte/motion'
import { tick } from 'svelte';

import Container from './Container.svelte'
import Clone_split from './Clone_split.svelte'
import Arrow from './Arrow.svelte'
import { op } from './actions/xTree.js'
import { In } from './actions/interaction'

let this_clone
let this_border
let tree 
// let show_clone_arrow = false
let arrow_direction
let arrow_color
let arrow_left = 0 //px

let mouse_start_x
let mouse_start_y
let elem_start_x
let elem_start_y


let start_drag_elem 
let stop_drag_move
let clone_list = []

let disable_clone = clone.subscribe( async(input) => {
	let { action = 'clone', 
		e, e_tree, clone_tree, drag_elem, 
		arrow_direction, arrow_color } = input as { [key:string]: any}

	if( action == 'clone' && e)
	{
		// console.log( drag_elem )
		makeClone( {e, e_tree, clone_tree, 
		drag_elem, arrow_direction, arrow_color } )
	}
	else if( action == 'edit')
	{
		//change clone sign
		tree = wrap(clone_tree)
		await tick()
		//recalculate arrow
		let { width } = this_clone.getBoundingClientRect()
		arrow_left = width / 2 - 11
	}
})


async function makeClone( obj )
{
	$blockSelect = true
	let { e, e_tree, clone_tree, 
	drag_elem } = obj

	arrow_direction = obj.arrow_direction
	arrow_color = obj.arrow_color

	clone_list = []
	start_drag_elem = drag_elem 
    if( drag_elem == undefined )
    {
        drag_elem = document.getElementById( e_tree.full_name + '-border' )
	}

	// drag_elem = drag_elem.getElementsByClassName('border_wrap')[0]

	let { left, top, height } = drag_elem.getBoundingClientRect()
	
	let { clientX:client_x, clientY:client_y } = e

	elem_start_x = left 
	elem_start_y = top 
	mouse_start_x = client_x
	mouse_start_y = client_y
	$tx = 0
	$ty = 0

	tree = wrap( clone_tree )

	await tick()

	this_clone.style.display = 'block'
	let { width } = this_clone.getBoundingClientRect()
	arrow_left = width / 2 - 11

	// pause movement:
	// throw new Error()

	let a_event = new Event('mousedown', {bubbles:true}) as any
	a_event.clientX = client_x
	a_event.clientY = client_y

	this_clone.getElementsByClassName('arrow')[0].dispatchEvent(a_event)

	//setup In

	let name = e_tree.type
	// // let state_obj = {
	// // 	'bx': 'box',
	// // 	// 'i': 'item-in_box',
	// // 	'sym': 'item-in_box',
	// // 	'num': 'item-in_box',
	// // 	'br': 'item-in_box',
	// // 	'bot': 'fraction_bottom-in_fraction',
	// // 	'top': 'fraction_top-in_fraction'
	// // }


	// let item_is_in_bracket = (arrow_color == 'in-br')
	// let drag_state = item_is_in_bracket ? 'item-in_bracket': state_obj[name]
	let drag_clone = { 
		height, //drag clone elem height
		elem_start_x,
		elem_start_y,
		mouse_start_x,
		mouse_start_y,
		arrow_direction
	}

	In.initialise()
	.setDragClone( drag_clone )
	.setContext([ e_tree ])
	.setBorders()

	// In.setTreeState({
	// 	drag_clone,
    //     drag_state,
    //     e_tree
    // }).setTreeBorders()
}



function wrap(tree)
{
	// odd_type = [ 'f','bx', 'top', 'bot']
	// even_type = [ 'i', 'br', 'fr', 'eq' ]
	tree.props.show_arrow = false
	tree.props.isClone = true
	if( tree.props.cdot ) tree.props.cdot = false

	let new_tree = op.growNewTree().tree
	new_tree.full_name = new_tree.name
	new_tree.list.push( tree.name )
	new_tree[ tree.name ] = tree

	tree.parentNode = new_tree
	new_tree.props = {}
	return new_tree
}


//Dragging

const tx = tweened(0, {
	duration: 0
})

const ty = tweened(0,{
	duration: 0
})


function handleDragStart(event) 
{	 
	// un-used
}

function handleDragMove(event) 
{
	let { x, y } = event.detail

	// In.check_n_update_tree( x, y )

	In.detect_cross_border( x, y )

	tx.update( value => {
		return x - mouse_start_x 	
		})


	ty.update( value => {
		return y - mouse_start_y 
		})

	$mouse_x = x
	$mouse_y = y
	//go to clone.js -> In 
}

let scroll_x
let scroll_y

function getScroll() {
    if (window.pageYOffset != undefined) {
        return {x: pageXOffset, y: pageYOffset};
    } else {
        var sx, sy, d = document,
            r = d.documentElement,
            b = d.body;
        sx = r.scrollLeft || b.scrollLeft || 0;
        sy = r.scrollTop || b.scrollTop || 0;
        return {x: sx, y: sy};
    }
}
async function handleDragEnd(event)
{
	//return animation
	clone_list = []
	if( !In.clone || !In.clone.split_clone_list )
	{
		// let { e_tree_list, e_tree_list:[e_tree], 
		// //for in-bracket 
		// original_tree=false } = In.getPrevUpdate()

		let { 
			dt_list: e_tree_list, 
			dt_list: [ dt ], 
			// used by in_bracket.js, drag_state='item-from_inside'
			original_tree=false
		} = In

		let drag_elem
		if( original_tree )
		{
			// start from item-in_bracket, 
			// and release item-in_bracket
			drag_elem = document.getElementById( original_tree.full_name + '-border' )
					// .getElementsByClassName('border_wrap')
			e_tree_list = [ original_tree ]
		}
		else
		{
			if( dt.type != "zero"){
				drag_elem = document.getElementById( dt.full_name + '-border')
			} else {
				let { eq: dt_eq } = dt.props
				drag_elem = document.getElementById( dt_eq.full_name )
                                .getElementsByClassName("box")[0]
			}	
		}
		
		let { left: return_x, top: return_y } = drag_elem.getBoundingClientRect()
		
		let scroll = getScroll()
	    let end_scroll_x = scroll.x
		let end_scroll_y = scroll.y

		let end_x = return_x - elem_start_x - scroll_x + end_scroll_x 
		let end_y = return_y - elem_start_y - scroll_y + end_scroll_y 

		await Promise.all([tx.set(end_x, {duration: 200}),
						ty.set(end_y, {duration:200})])	
		// hide show_arrows
		In.runDragEnd( { e_tree_list } )		
		// show_clone_arrow = false
		let debug_freeze = false
		this_border.style.paddingTop = '0px'
		if( !debug_freeze )
		{
			this_clone.style.display = 'none'
			tree = false
		}
	}
	else
	{
		
		let tree_list = In.clone.split_clone_list
		// tree_list = [
		//	[tree_1, tree_1, tree_1], 
		//	[tree_2, tree_2, tree_2]
		//]
		let clone_id = 0
		let current_x = elem_start_x + $tx + scroll_x
		let current_y = elem_start_y + $ty + scroll_y


		let scroll = getScroll()
	    let end_scroll_x = scroll.x
		let end_scroll_y = scroll.y

		let first_sub_list = tree_list[0]
		for( let sub_tree of first_sub_list )
		{		
			let drag_elem = document.getElementById( sub_tree.full_name )
			let { left, top } = drag_elem.getBoundingClientRect()
			let return_x = left
			let return_y = top
			let end_x = return_x - current_x + end_scroll_x
			let end_y = return_y - current_y + end_scroll_y

			//transpose out items
			let e_tree_list = []
			for( let sub_list of tree_list )
			{
				e_tree_list.push( sub_list[ clone_id ] )
			}

			let obj = {
				clone_id,
				e_tree_list,
				tree,
				start_x:current_x,
				start_y:current_y,
				end_x,
				end_y,
				arrow_direction,
				arrow_color,
				arrow_left					
			}

			clone_list.push( obj )

			clone_id ++ 
		}

		clone_list = clone_list
		await tick()

		//goto onMount Clone_split.svelte
		// for In.runDragEnd()
	}	
}

</script>
<svelte:window bind:scrollX={scroll_x} bind:scrollY={scroll_y} />
{#if clone_list.length == 0 }
	{#if tree}
	<div 
	bind:this={this_clone}
	id='clone' 
	data-cy='clone'
	class='draggable no_split'
	style='left:{elem_start_x}px; top:{elem_start_y}px;
	transform: translate({$tx + scroll_x}px, {$ty + scroll_y}px);'
	>
		<div
		id={tree.name}
		>
			{#if arrow_direction == 'top'}
				<Arrow  
				arrow_direction = {arrow_direction}
				arrow_color = {arrow_color}
				isDraggable={true}
				on:x_drag_start={handleDragStart}
				on:x_drag_move={handleDragMove}
				on:x_drag_end={handleDragEnd}
				/>
			{/if}

			<div 
			bind:this = {this_border}
			class='border_wrap border' >
			<!-- {#if tree.props.sign}<div 
			class='sign selected'
			class:bx_sign={tree.type == 'bx'}
			>{tree.props.sign}</div>{/if} -->
			<Container tree={tree} />
			</div> 		
			{#if arrow_direction == 'bottom'}
				<Arrow  
				arrow_direction = {arrow_direction}
				arrow_color = {arrow_color}
				isDraggable={true}
				on:x_drag_start={handleDragStart}
				on:x_drag_move={handleDragMove}
				on:x_drag_end={handleDragEnd}
				/>
			{/if}
		</div>
	</div>	
	{/if}
{:else}
<!-- split clone into pieces -->
	{#each clone_list as clone (clone.clone_id)}
		<Clone_split input={clone} />
	{/each}
{/if}
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
	background-color: rgb(255, 255, 255);
}
.draggable
{
	position:absolute;
	text-align:center;
	vertical-align: top;
	
	z-index: 100;	
}

/* .bx_sign
{
	padding-left: 4px;
} */

/* .sign{
	display:inline-block;
	font:30px Times;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	text-align:center;
	vertical-align:top;
}
.selected{
	color: rgb(220, 20, 60);
} */
</style>