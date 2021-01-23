<script>
import Container from './Container.svelte'
import Item from "./Item.svelte"
import Arrow from './Arrow.svelte'
import Arrow_Top from './Arrow_Top.svelte'
import Arrow_Bottom from './Arrow_Bottom.svelte'
import { createEventDispatcher, tick } from 'svelte'
const dispatch = createEventDispatcher()
import { op } from './actions/xTree'


export let tree = null
export let isRoot = false

//handle case box isZero 
let tree_name
let tree_props  
let arrow_type
let isEditable 

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

$:if( tree  ) 
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

	if( tree.props.arrow_type)
	{
		arrow_type = tree.props.arrow_type
	}
	else
	{
		arrow_type = 'top_red'
	}

	if(tree.props.isEditable)
	{
		isEditable = tree.props.isEditable
	}
	else
	{
		isEditable = false
	}
}

let this_edit
let this_box

let arrow_left = 0 //px
let arrow_y = -12
//Selection end

//Draggable start
export let isZero = false
import { onMount, afterUpdate } from 'svelte'
import { blockSelect } from './actions/clone_stores';
import { c } from './actions/change_sign';

//Draggable End
if( !isZero )
{
	afterUpdate( () => {
		if( isEditable )
		{
			setTimeout( ()=>{
				this_edit.focus()
			}, 0)

			//after selection, go to end of text 
			let range,selection;
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

}

// Dragging



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
{#if isZero}
	<div 
	bind:this={this_box}
	class=box 
	><Item isZero=true/>
	</div>
{:else if !isEditable}<div 
	bind:this={this_box}
	id={tree_name}
	class="box {arrow_type}"
	class:show_arrow = {tree_props.show_arrow}
	>
		<Arrow_Top tree={tree} />
		<div 
		id={tree_name +'-border'}
		class="border_wrap"
		class:border={tree_props.show_arrow}
		>{#if tree.props.sign}<div 
		class='bx_sign'
		class:selected={tree_props.selected}
		>{tree.props.sign}</div>{/if}<Container tree={tree} 
			on:select
			on:deselect
			on:bubble_up
			/>
		</div>
		<Arrow_Bottom tree={tree} />
	</div>
{:else}<!--isEditable--> 
	<div 
	bind:this={this_box}
	id={tree_name}
	class="box grey" 
	class:show_arrow={tree_props.show_arrow}		
		>
		<div
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
		on:mousedown={arrow_mouse_down_editable}
		left={arrow_left} />{/if}
	</div>
{/if}	
<style>
.box
{
	position:relative;
	margin:0px 2px;
}

.bx_sign
{
	padding-left: 4px;
}

.border
{
	border:1px solid rgb(0, 0, 200);
	border-radius: 4px;
}

.editable
{
	min-width:50px;
	padding: 0px 6px;
	margin: 0px 4px;
	letter-spacing:12px;
	background-color:rgb(255,255,255);
}

.grey
{
	background-color:rgb(120,120,120);
}

div
{
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
}

.selected:hover{
	color:rgb(0,0, 0);
}
</style>