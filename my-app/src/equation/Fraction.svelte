<script>
import Arrow from './Arrow.svelte'
import Arrow_Top from './Arrow_Top.svelte'
import Arrow_Bottom from './Arrow_Bottom.svelte'

import Container from './Container.svelte'
import { createEventDispatcher, tick } from 'svelte';
const dispatch = createEventDispatcher();
import { op } from './actions/xTree'
import { u } from './actions/utils/ui.js'

// import { checkDot } from './tree/checkDot.js' 

let this_fraction
let this_edit
export let tree = null

//handle case box isZero 
let tree_name
let tree_props  
let tree_type
let arrow_type = 'top_blue'
let arrow_left = 0


$:if( tree &&  (!tree.updateProps || tree.full_name )  )
{
	// tree.updateFraction = () => {
	// 	//check if got fraction
	// 	tree.props.contain_fraction = true //formatting issue
	// 	tree[ tree.list[0] ].props.fraction_sibling = true		
	// }

	tree.renderFraction = () => {
		// console.log( 'renderFraction' )
		// before alignment
		//	  ___
		// (a|+ b|)
		//	 |	/|
		//	 |	d|

		// 1. pull box up 
		//	  _____   
		//   | + b |  // box margin-top: negtive 
		// (a|   / |)
		//	 |	 d |
		
		// Exception Clone no need pull box up

		// 2. push plus sign down, 
		//	  ____   
		// 	 |	  |   // box padding-top: positive 
		// (a| + b|) 
		//	 |   /|
		//   |   d|

		// 3. pull fraction up
		//    ____
		//	 |   b|	  // fraction margin-top: negative
		// (a| + /|)
		//	 |	 d|	

		// Step 1, 2 is call even alignment
		// serves to pull the border up without pulling the content
		
		// Special Cases:
		// 1. fr_bot & clone_elem
		// there is no need to move border_wrap up
		// so only apply padding to push down content

		let frac_tree = tree
		let div_frac = op.setTree( frac_tree ).getDOMNode()

        let top_tree = tree['top_1']
                
        let div_top = op.setTree( top_tree ).getDOMNode()
        let div_line = document.getElementById(top_tree.full_name + '-line')

        let eq_sign_mid = 20
        let { top:l_top } = div_line.getBoundingClientRect()
		let { top } = div_top.getBoundingClientRect()

		let diff = l_top - top - eq_sign_mid
		diff = Math.round(1000 * diff ) /1000

		// shift(div_frac).margin().up().by({ px: diff })
		// pull fraction up
		frac_tree.props.offset_y = diff

        
		// let frac_tree_full_name = frac_tree.full_name 
		
		let p_tree = frac_tree.parentNode

		let loop
		if( p_tree.props.isClone )
		{
			// without marginTop +a/b the plus 
			// will not move to the frac line
			div_frac.style.marginTop = -diff + 'px'
			let div_border = div_frac.parentNode
			div_border.style.paddingTop = diff + 'px'
			loop = false
		}
		else
		{
			div_frac.style.marginTop = -diff + 'px'
			loop = true
		}

        // let loop = true
		while( loop 
		//&& p_tree //for clone with no eq to terminate
		)
        {
			//Loop Upward ParentNode
			// console.log( p_tree.full_name )
			let  { type } = p_tree
			
			if( type == 'eq' 
			//|| type == 'root' // for Clone.svelte
			)
            {
                //Terminate without further action
                loop = false
			}
			// else if( p_tree.props.isClone )
			// {
			// 	// Special case
			// 	console.log("Clone Fraction")
			// 	// let div_border = this_fraction.parentNode
			// 	// let new_offset = tree.props.offset_y
			// 	// div_border.style.paddingTop = new_offset + 'px'
			// 	loop = false
			// }
            else
            {
				u.add( frac_tree )
				 .to( p_tree )
				 .andUpdateDiv()

				if( type == 'bot' 
				|| type == 'root'				
				|| !p_tree.parentNode )
				{
					// Terminate after action: 
					// pull border_wrap up 
					// or push content down

					loop = false
				}
				else
				{
					// Continue looping
					p_tree = p_tree.parentNode
				}
            }
        }
    }

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
	arrow_type = tree_props.arrow_type
	if( !arrow_type )
	{
		arrow_type = 'top_blue'
	}
	tree_props.arrow_type = arrow_type
	// must be carefull of infinite loops here:
}

$:if( tree_props.selected )
{
	tree['top_1'].props.fraction_selected = true
}
else
{
	tree['top_1'].props.fraction_selected = false
}

//Dragging


export let isZero = false

import { clone } from './actions/clone_stores.js'
import { onMount, afterUpdate } from 'svelte';


function arrow_mouse_down(e)
{
	// console.log(this_fraction)
	$clone = { 
		e,
		e_tree: tree,
		clone_tree: op.cloneFrom(tree), 
		drag_elem: this_fraction 
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
	let { width } = this_fraction.getBoundingClientRect()
	arrow_left = width / 2 - 11
}


onMount( () => {
	// console.log(tree_name)
	if( tree_props )
	{
		tree.renderFraction()
		//check previous sibling if also coeff
		// tree.checkDot = checkDot(tree)

		tree.updateProps = () => {
			tree = tree 
		}
		
		if(tree_props.store_in_ref_elem)
		{
			//mount multiple items inside a bracket
			$clone.ref_elem.push( this_fraction )
			tree_props.store_in_ref_elem = false
		}
	}
	else
	{
		//drag over equal sign
		//so zero value appears
	}
})

</script>
{#if tree_props.cdot}<div 
class='cdot' 
>&#183</div>{/if}<div 
bind:this={this_fraction}
id={tree_name}
class="fraction {arrow_type}"
class:selected={tree_props.selected} 
class:show_arrow={tree_props.show_arrow}
><Arrow_Top tree={tree} />
	<div 
	id={tree_name +'-border'}
	class="border_wrap"
	class:border={tree_props.show_arrow}
	>{#if tree.props.sign}<div 
	class:selected={tree_props.selected} 
	>{tree.props.sign}</div>{/if}
		<Container
		tree={tree}
		on:select
		on:deselect
		on:bubble_up
		/>
	</div>
	<Arrow_Bottom tree={tree} />		
</div>
<style>
.cdot
{
	margin:0px -2px;
	padding:0px;
}

div
{
	font:30px Times;
	display:inline-block;
	cursor:pointer;
	/* padding: 0px 0px;
	margin: 0px 0px; */
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	vertical-align:top;
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

.selected{
	color: rgb(220, 20, 60);
}

.selected:hover{
	color:rgb(0,0, 0);
}
</style>