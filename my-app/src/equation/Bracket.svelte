<script>

import Arrow from './Arrow.svelte'
import Arrow_Top from './Arrow_Top.svelte'
import Arrow_Bottom from './Arrow_Bottom.svelte'
import Container from './Container.svelte'
import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()
import { op } from './actions/xTree.js'
// import { checkDot } from './tree/checkDot.js'
export let tree = null

let this_bracket_outer
let this_edit

let tree_props
let tree_name 
let arrow_type
let isEditable

$:if( tree &&  (!tree.updateProps || tree.full_name )  )
{
	tree.updateProps = () => {
		tree = tree 
	}

	//check previous sibling if also coeff
	// tree.checkDot = checkDot(tree)

	tree.runComponent = () => {
		for( let fn in tree.component_fn_list )
		{
			if( typeof ( fn ) === 'function' )
			{
				fn()
			}
		}
	}
}

$:if( tree )
{
	if( tree.parentNode )
	{
		tree_name = tree.parentNode.full_name + "-" + tree.name
	}
	else
	{
		//this is starting element which don't have a parent
		//for cloneElement case
		tree_name = tree.name
	}

	tree.full_name = tree_name
	tree_props = tree.props

	arrow_type = tree_props.arrow_type
	if( !arrow_type )
	{
		arrow_type = 'multi_top'
	}

	if(tree_props.isEditable)
	{
		isEditable = true
	}
	else
	{
		isEditable = false
	}
}


let arrow_left = 0
let arrow_y = -12
//selection end



//Draggable start

import { clone } from './actions/clone_stores.js'


import { onMount, afterUpdate, tick } from 'svelte';


//Draggable End


onMount( () => {
	if( tree_props )
	{
		tree.checkDot()
	}

	if(tree_props.store_in_ref_elem)
	{
		//mount multiple items inside a bracket
		$clone.ref_elem.push( this_bracket_outer )
		tree_props.store_in_ref_elem = false
	}

})


//Draggable End

function click_open(e)
{
	toggle_click_bracket(e)
}

function click_close(e)
{
	toggle_click_bracket(e)
}

function toggle_click_bracket(e)
{
	if( !tree_props.selected )
	{
		// console.log("toggle bracket select receive")
		tree_props.selected = true
		dispatch('select', {
			child_tree:tree
		});
		
		// select_in(tree)

	}
	else
	{
		// console.log("toggle bracket deselect receive")
		tree_props.selected = false
		dispatch('deselect', {
			child_tree:tree
		});
		
		// deselect_in(tree)
	}
}





//Dragging

function arrow_mouse_down(e)
{
	$clone = { 
		e,
		e_tree: tree,
		clone_tree: op.cloneFrom(tree), 
		drag_elem: this_bracket_outer
		}
}

function arrow_mouse_down_editable(e)
{
	let content = this_edit.innerText
	dispatch('deselect_editable', {
		e: e,
		e_tree: tree,
		new_sub_formula:content 
	})
}

function keydown(e)
{
	if(e.keyCode==13)
	{
		e.preventDefault()
		arrow_mouse_down_editable(e)
	}
}

function keyup(e)
{
	let { width } = this_box.getBoundingClientRect()
	arrow_left = width / 2 - 11
}

</script>

{#if !isEditable}{#if tree_props.cdot}<div 
class='cdot' 
 >&#183</div>{/if}<div 
	bind:this={this_bracket_outer}
	id={tree_name}
	class="bracket_outer {arrow_type}"
	class:show_arrow={tree_props.show_arrow}
	>
		<Arrow_Top tree={tree} />
		<div
		id={tree_name +'-border'}
		class="border_wrap"
		class:border={tree_props.show_arrow}
		>{#if tree.props.sign}<div class='br_sign'
		class:selected={tree_props.selected} 
		>{tree.props.sign}</div>{/if}
			<div 
			on:mousedown={click_open}
			class=open 
			class:selected={tree_props.selected}>(</div><div
			id={tree_name + '-inner_border'} class=bracket>
				<Container tree={tree}  
				on:select 
				on:deselect
				on:bubble_up
				/></div><div 
				class=close 
				on:mousedown={click_close} 
				class:selected={tree_props.selected}>)</div>
		</div>
		<Arrow_Bottom tree={tree} />
	</div>
{:else}
	<div 
		bind:this={this_bracket_outer}
		class="bracket_outer grey" 
		class:show_arrow = {tree_props.show_arrow}
		id={tree_name}
		><div
		bind:this={this_edit}
		contenteditable='true'
		class='editable'
		on:keydown={keydown}
		on:keyup={keyup}
		>
		{tree.props.sub_formula}
		</div>
		{#if tree_props.show_arrow}<Arrow 
			type={arrow_type}
			left={arrow_left} 
			on:mousedown={arrow_mouse_down_editable} />{/if}
	</div>
{/if}
<style>
.br_sign{
	margin-right: -4px;
}

div{
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
.selected
{
	color:rgb(255, 0, 0);
}

.bracket_outer
{
	position:relative;
	margin: 0px 2px;
}
/* .open
{
	font-size:28px;
}

.close
{
	font-size:28px;
} */

.open:hover {
	color:rgb(255, 0, 0);
}

.close:hover {
	color:rgb(255, 0, 0);
}

.border
{
	border:1px solid rgb(0, 0, 200);
	border-radius: 4px;
}

.editable
{
	min-width:50px;
	padding-left: 6px;
	margin: 0px 4px;
	letter-spacing:12px;
	background-color:rgb(255,255,255);
}

.grey
{
	background-color:rgb(120,120,120);
}

.cdot
{
	margin:0px -2px;
	padding:0px;
}

.selected{
	color: rgb(220, 20, 60);
}

.selected:hover{
	color:rgb(0,0, 0);
}
</style>