<script>
import Arrow from './Arrow.svelte'
import Arrow_Top from './Arrow_Top.svelte'
import Arrow_Bottom from './Arrow_Bottom.svelte'

import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()
// import { isSelecting } from './actions/equation_stores.js'
import { op } from './actions/xTree.js'
// import { checkDot } from './tree/checkDot'

let this_item
let this_edit
export let tree = null
export let isZero = false
let isEditable

//handle case box isZero 
let tree_name
let tree_props  
let tree_type
let arrow_type 
let cdot = false


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

	let { text } = tree.props
	tree.props.sub_formula= text
}

let is_empty = false
$:if( tree ) 
{
	let parent_box = tree.parentNode
	if( parent_box )
	{
		tree_name = parent_box.full_name + "-" + tree.name
		// if( parent_box.contain_fraction )
		// {
		// 	if( !tree.props.fraction_sibling ) tree.props.fraction_sibling = true
		// }
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
	// if( tree_props.text === "" || tree_props.text == '0')
	// {
	// 	// item zero should haver reach here 
	// 	// cause box should be zero 
	// 	// and sets isZero = true 
	// 	is_empty = true
	// 	tree_type = 'empty' //empty is a css class for item props.text = ''
	// 	//GO TO: render !isDraggable !isEditable case
	// 	//<div class = 'empty'>...</div>
	// }
	// else
	// {
	// 	is_empty = false
	// 	tree_type = tree_props.type
	// }

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

//Dragging



import { clone } from './actions/clone_stores.js'
import { onMount, afterUpdate } from 'svelte'
import ArrowBottom from './Arrow_Bottom.svelte'
import ArrowTop from './Arrow_Top.svelte'


function arrow_mouse_down(e)
{
	$clone = { 
		e,
		e_tree: tree,
		clone_tree: op.cloneFrom(tree), 
		drag_elem: this_item 
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
	let { width } = this_item.getBoundingClientRect()
	arrow_left = width / 2 - 11
}

onMount( () => {

	if( tree_props )
	{
		if( !tree.checkDot )
		{
			console.log( tree.full_name )
			console.log( tree.props.text )
		}
		tree.checkDot()
		// if(tree_props.type == 'coeff')
		// {
		// 	// delegate to child_tree sign and coeff
		// 	tree.checkDot()
		// }

		if(tree_props.store_in_ref_elem)
		{
			//mount multiple items inside a bracket
			$clone.ref_elem.push( this_item )
			tree_props.store_in_ref_elem = false
		}
	}
	else
	{
		//drag over equal sign
		//so zero value appears
	}
})

// afterUpdate(()=>{
// 	if( isEditable )
// 	{
// 		setTimeout( ()=>{
// 			this_edit.focus()
// 		}, 0)
	
// 		//after selection, go to end of text

// 		let range,selection;
// 		if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
// 		{
// 			range = document.createRange();//Create a range (a range is a like the selection but invisible)
// 			range.selectNodeContents(this_edit);//Select the entire contents of the element with the range
// 			range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
// 			selection = window.getSelection();//get the selection object (allows you to change selection)
// 			selection.removeAllRanges();//remove any selections already made
// 			selection.addRange(range);//make the range you have just created the visible selection
// 		}
// 	}
// })

function dispatch_container(e)
{
	if(!tree_props.selected)
	{
		// console.log("Click")
		tree_props.selected = true

		dispatch('select', {
			child_tree:tree
		});
	}
	else
	{
		// console.log("Unclick")
		tree_props.selected = false
		dispatch('deselect', {
			child_tree: tree
		});
	}
}
</script>
{#if isZero}
	<div 
	bind:this={this_item}
	class=symbol
	>0</div>
{:else}
	{#if tree_props.cdot}<div 
	class='cdot' 
	>&#183</div>{/if}<div 
	bind:this={this_item}
	id={tree_name}
	class="item {arrow_type} {tree.type}"
	class:empty={is_empty}
	class:selected={tree_props.selected} 
	class:show_arrow={tree_props.show_arrow}
	on:click = { dispatch_container }	
	>
		<Arrow_Top tree={tree} />
		<div 
		id={tree_name +'-border'}
		class="border_wrap min_item_width"
		class:empty={is_empty}
		class:not_empty={!is_empty}
		class:border = {tree_props.show_arrow} 
		>{#if tree.props.sign}{tree.props.sign}{/if}{tree.props.text}
		</div>
		<Arrow_Bottom tree={tree} />
	</div>
{/if}
<style>
.symbol, .coeff, .open, .close{
	position:relative;
}
/* .symbol:hover, .coeff:hover, .open:hover, .close:hover{
	color:rgb(255, 0, 0);
} */

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

.empty{
	padding:0px;
	margin:0px;
}

.item
{
	margin: 0px 1px;
	color: rgb(0, 0, 0);
}

.item:hover{
	color: rgb(220, 20, 60);
}

.selected{
	color: rgb(220, 20, 60);
}

.selected:hover{
	color:rgb(0,0, 0);
}

.border
{
	border:1px solid rgb(33,70,220);
	border-radius: 4px;
}

.not_empty
{
	padding:0px 0px;
	margin:0px;
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

.cdot
{
	margin:0px -2px;
	padding:0px;
}

.min_item_width{
	min-width: 20px;
}
</style>