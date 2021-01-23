<script>
import Arrow from './Arrow.svelte'
import Arrow_Top from './Arrow_Top.svelte'
// import Arrow_Bottom from './Arrow_Bottom.svelte'
import Container from './Container.svelte'
import clonedeep from 'lodash.clonedeep'
import { createEventDispatcher, tick } from 'svelte';
const dispatch = createEventDispatcher();
import { op } from './actions/xTree.js'

let this_top
let this_edit
export let tree = null
let isEditable


//handle case box isZero 
let tree_name
let tree_props  
let tree_type
let arrow_type = 'top_i'
let arrow_left = 0

$:if( tree &&  (!tree.updateProps || tree.full_name )  )
{

	tree.updateProps = () => {
		tree = tree 
	}

	
	tree.runComponent = () => {
		for( let fn in tree.component_fn_list )
		{
			if( typeof ( fn ) === 'function' )
			{
				fn() //anonymous function to get into context
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
	//style toggling
	tree_type = tree_props.type

	// if( !tree_props.arrow_type )
	// {
	// 	arrow_type = 'top_blue'
	// }
	tree_props.arrow_type = arrow_type
	
	if(tree_props.isEditable)
	{
		isEditable = true
	}
	else
	{
		isEditable = false
	}	
}



//Dragging

export let isZero = false

import { clone } from './actions/clone_stores.js'
import { onMount, afterUpdate } from 'svelte';

function arrow_mouse_down(e)
{
	$clone = { 
		e,
		e_tree: tree,
		clone_tree: op.cloneFrom(tree), 
		drag_elem: this_top 
		}
}

function arrow_mouse_down_editable(e)
{
	let content =this_edit.innerText

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
	let { width } = this_top.getBoundingClientRect()
	arrow_left = width / 2 - 11
}

onMount( () => {

	if( tree_props )
	{
		if(tree_props.store_in_ref_elem)
		{
			//mount multiple items inside a bracket
			$clone.ref_elem.push( this_top )
			tree_props.store_in_ref_elem = false
		}
	}
	else
	{
		//drag over equal sign
		//so zero value appears
	}
})

afterUpdate(()=>{
	
	if( isEditable )
	{
		setTimeout( ()=>{
			this_edit.focus()
		}, 0)
	
		//after selection, go to end of text

		let range, selection;
		if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
		{
			range = document.createRange();//Create a range (a range is a like the selection but invisible)
			range.selectNodeContents(this_edit);//Select the entire contents of the element with the range
			range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
			selection = window.getSelection();//get the selection object (allows you to change selection)
			selection.removeAllRanges();//remove any selections already made
			selection.addRange(range);//make the range you have just created the visible selection
		}
	}
})
</script>
{#if !isEditable}
	<div 
	bind:this={this_top}
	id={tree_name}
	class="top {arrow_type}"
	class:clone_top = {tree_props.isClone}
	class:show_arrow = {tree_props.show_arrow}
	>
		<Arrow_Top tree={tree} />
		<div 
		id={tree_name +'-border'}
		class="border_wrap"
		class:border={tree_props.show_arrow}
		class:clone_top = {tree_props.isClone}
		>{#if tree.props.sign}<div 
		class='bx_sign'
		class:selected={tree_props.selected}
		>{tree.props.sign}</div>{/if}<Container 
				tree={tree}
				on:select
				on:deselect
				on:bubble_up
				/>
		</div>
	</div>
	{#if !tree_props.isClone }
		<div 
		class='fraction_line'
		id='{tree_name}-line'
		class:fraction_selected={tree_props.fraction_selected}
		></div>
	{/if}
{:else}<!--isEditable-->
	<div class='top'
	bind:this={this_top}
	class:show_arrow={tree_props.show_arrow }		
	>
		<div
		bind:this={this_edit}
		contenteditable='true'
		class='editable'
		on:keydown={keydown}
		on:keyup={keyup}
		>{tree.props.sub_formula}</div>
		{#if tree_props.show_arrow}<Arrow 
			type={arrow_type}
			left={arrow_left}
			on:mousedown={arrow_mouse_down}
				/>{/if}
	</div>
	<div class='fraction_line'></div>
{/if}
<style>
div
{
	font:30px Times;
	display:inline-block;
	cursor:pointer;
	padding: 0px 0px;
	margin: 0px 2px;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	text-align:center;
	vertical-align:middle;
}

.clone_top
{
	padding:0px;
	margin-top:-2px; 
	/* not clear why margin-top, trial and error */
}

.selected{
	color:rgb(255,0,0);
}

.selected:hover{
	color:rgb(0,0,0);
}

.border
{
	border:1px solid rgb(0, 0, 200);
	border-radius: 4px;
}

.top
{
	position:relative;
	display:block;
}

.draggable
{
	position:absolute;
	background-color: rgb(255, 255, 255);
	z-index: 100;	
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


.top_wrapper{
	position:relative;
}

.contain_fraction
{
	padding-top:20px;
}

.fraction_line
{
	border-bottom:1px solid rgb(0, 0, 0);
	margin:0px 4px;
	display:block;
}

.fraction_selected
{
	border-bottom:1px solid rgb(255, 0, 0);
	margin:0px 4px;
	display:block;
}
</style>