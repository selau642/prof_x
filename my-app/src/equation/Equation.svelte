<script>
// import katex from 'katex'
import clonedeep from 'lodash.clonedeep'

import { onMount, tick } from 'svelte'
import Container from './Container.svelte'
import Arrow from './Arrow.svelte'

import { x_drag } from './actions/x_drag.js'
import { op } from './actions/xTree.js'
import { f } from './parsing/parse_formula.js'
import { In } from './actions/interaction.js'

export let formula = false;
// export let rerender = true;
let tree
let left_x_tree  
let mid_tree = "="
let right_x_tree 
let f_id = 'f_1'
let left_id 
let right_id
let prev_formula = false
$:if( formula != prev_formula )
{
	// $:if( formula )
	// weird bug where this section is double rendered on load
	// prev_formula comparison to prevent double rendering

	if( !formula )
	{
		 tree[f_id]['eq_1'].list = []
		 tree[f_id]['eq_2'].list = []
	}
	else
	{
		prev_formula = formula 
	
	// rerender = false
	// tree = ''
	// tick().then(() =>{

		tree = f.parseFormula( formula )
		op.root = tree
		f_id = tree.list[0]

		left_id = `${f_id}-eq_1`
		right_id = `${f_id}-eq_2`
		if( tree[f_id]['eq_1'].list )
		{
			left_x_tree = tree[f_id]['eq_1']
		}

		if( tree[f_id]['eq_2'].list )
		{
			right_x_tree = tree[f_id]['eq_2']
		}	
		
		tree[f_id]['eq_1'].full_name = `${f_id}-eq_1`
			
		tree[f_id]['eq_2'].full_name =`${f_id}-eq_2`

		tree[f_id]['eq_1'].updateProps = () =>
			{
				left_x_tree = left_x_tree
			}

		tree[f_id]['eq_2'].updateProps = () =>
			{
				right_x_tree = right_x_tree
			}
	// })
	}
}

let this_eq
let tx = 0
let ty = 0
export let cy_test

let cal_left
let cal_top

if( cy_test )
{
	cal_left = 600
	cal_top = 250
}
else
{
	cal_left = 600
	cal_top = 80
}

let this_mid

onMount( () => {
	f_id = tree.list[0]
	left_id = `${f_id}-eq_1`
	right_id = `${f_id}-eq_2`
	tree[f_id]['eq_1'].updateProps = () =>
		{
			left_x_tree = left_x_tree
		}

	tree[f_id]['eq_1'].full_name = `${f_id}-eq_1`

	tree[f_id]['eq_2'].updateProps = () =>
		{
			right_x_tree = right_x_tree
		}
		
	tree[f_id]['eq_2'].full_name =`${f_id}-eq_2`
})

//dragging middle equal sign
function eq_drag_start(event)
{

}

function eq_drag_move(event)
{
	let {x, y, dx, dy} = event.detail
	
	tx += dx
	ty += dy
}

function eq_drag_end(event)
{
}





		// on:select={final_right_selected} 
		// on:deselect={final_right_deselected}
</script>
<div 
bind:this={this_eq}
id={f_id}
data-cy='formula'
class=eq
style='top:{cal_top}px;left:{cal_left}px;transform:translate({tx}px, {ty}px);'

>

	<div class="left" 
		id={left_id}
	>
		<Container 
		tree={left_x_tree} 
		isRoot={true}
		/>
	</div>
	<div
	bind:this={this_mid}
	id='{f_id}-eq_sign'
	class='mid'
	data-cy='eq'
	use:x_drag = {true}
	on:x_drag_start = {eq_drag_start}
	on:x_drag_move = {eq_drag_move}
	on:x_drag_end = {eq_drag_end}	
	>
		{mid_tree}
	</div>
	<div class="right"
		id = {right_id}
	>
		<Container 
		tree={right_x_tree}  
		isRoot={true}
		/>
	</div>
</div>
<style>

.eq
{
	font: 30px Times;
	position:absolute;
	padding:2px;
	border:1px solid rgb(100,100,100);
	width:min-content;

}

.eq:hover
{
	cursor:pointer;
}

.left
{
	display:inline-block;
	white-space: nowrap;
	position:absolute;
	width:auto;
	padding-right:10px;
	right:100%;
	top:0%;
}

.mid
{
    margin:1px;
	/* border:1px solid RGB(125,125,125);
	border-radius:2px; */
    padding: 0px;
	display:inline-block;
	white-space: nowrap;

		-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	text-align:center;
	vertical-align:middle;
}

.right
{
	display:inline-block;
	white-space: nowrap;
	position:absolute;
	width:auto;
	left:100%;
	top:0%;
	padding-left:10px;
}

#error_msg
{
	padding:10px 4px;
	font:20px Arial;
	
}
</style>