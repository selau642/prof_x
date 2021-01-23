<script>
export let isRoot = false

import clonedeep from 'lodash.clonedeep'
import { createEventDispatcher, afterUpdate, 
onMount, tick, beforeUpdate } from 'svelte'
const dispatch = createEventDispatcher()

import Box from './Box.svelte'
import Bracket from './Bracket.svelte'
import Item from './Item.svelte'
import Fraction from './Fraction.svelte'
import Fraction_Top from './Fraction_Top.svelte'
import Fraction_Bottom from './Fraction_Bottom.svelte'
import { clone_obj, clone_drag_move } from './actions/clone_stores.js'

import { isSelecting } from './actions/equation_stores.js'
import { op } from './actions/xTree'
import { In } from './actions/interaction.js'
import { select } from './actions/selection/select.js'
import { deselect } from './actions/selection/deselect.js'
//remove uid_s, uid_obj

export let tree 

$:if( tree && !tree.runContainer )
{
    tree.runContainer = () => {
        
        if( tree.container_fn_list )
        {
            
            for( let fn of tree.container_fn_list )
            {
                if( typeof ( fn ) === 'function' )
                {
                    fn()
                }
            }
            
            if( tree.cleanContainer ) tree.cleanContainer() 
        }
    }

    tree.receiveClone = () => {
        $clone_obj[0].unsub()
        console.log("received Clone:", tree.full_name)
        
        let unsub_drag_move = clone_drag_move.subscribe( obj => {
            drag_x = obj.x
            drag_y = obj.y
        })

        $clone_obj[0].unsub = clone_unsub( unsub_drag_move )
    }
}

let tree_name 
let tree_props
$:if( tree ) // || tree.updateProps
{
    //Container inherits tree of parent
    //if parent is box it inherits the box props
   
    tree_name = tree.name
    tree_props = tree.props

    if( tree_props.check_equation_sign )
    {
        tree_props.check_equation_sign = false
        check_equation_sign( tree )
    }
}



//Start: Refactor select/deselect into Container

//Item select => box_child_selected
function child_selected( event )
{
    select( event )
}

function child_deselected( event )
{
    deselect( event )
}

//End: Refactor select/deselect into Container

//deselect editable box/item
function deselect_editable(event)
{   
    let check = confirm("Are you sure you want to change?")
    let { e, e_tree, new_sub_formula} = event.detail

    if( !check )
    {
        e_tree.props.isEditable = false
        e_tree.props.arrow_type = false //fall back to default arrow type
        e_tree.updateProps()
        return
    }


    if( new_sub_formula.search("=") > -1)
    {
        alert("Formula cannot contain equal(=) sign.")
        return
    }

    //TO DO: need to clean input? 

    let check_blank = new_sub_formula.replace(/\s/,'')
    if( check_blank.length == 0)
    {
        new_sub_formula = '?'
    }    

    op.insert_subFormula( new_sub_formula, e_tree) 
    
}

// let drag_state = false

let isUpdating = false
let drag_elem 
// for afterUpdate re-init boundaries, Box, Item, Bracket except Yellow in bracket

//all
let drag_x
let drag_y

//Loc: Container.svelte, function Drag
// In.debug = true
// $:if( ( drag_x || drag_y ) )
// {
//     In.check_n_update_tree( drag_x, drag_y )
// }



function item_mouse_down(event)
{
    let { e_tree, e } = event.detail

    if( e_tree.props.arrow_type =='yellow')
    {
        let bracket_tree = tree.parentNode

        if( !bracket_tree.container_fn_list ) bracket_tree.container_fn_list = []
        
        let enter_fn  = () => {
               init_insid.
               e_bracket(e, e_tree)
            }
  
        bracket_tree.container_fn_list.push( enter_fn )
        bracket_tree.cleanContainer = () => {
            bracket_tree.container_fn_list = []
        }

        bracket_tree.runContainer()
        return
    }

    In.setTreeState({
        drag_state: 'item-in_box',
        e_tree: e_tree
    }).setTreeBorders()

    makeClone({ 
        e:e, 
        e_tree:e_tree,
        svelte_elem: Item, 
        drag_type:'item'
        })
}

// function fraction_mouse_down(event)
// {
//     //not used
//     let { e_tree, e } = event.detail
     
//     let elem = e.currentTarget
    
//     // drag_elem = elem.parentNode

//     // set_sib_x( drag_elem, { caller: "fraction_mouse_down"} )
    
//     makeClone({ e:e, e_tree:e_tree, 
//      svelte_elem: Fraction, drag_type:'fraction'})
// }

function fraction_bottom_mouse_down(event)
{
    let { e_tree, e } = event.detail

    In.setTreeState({
        drag_state: 'fraction_bottom-in_fraction',
        e_tree: e_tree
    }).setTreeBorders()

    makeClone({ e:e, e_tree:e_tree, 
     svelte_elem: Fraction_Bottom, drag_type:'fraction'})
}

function fraction_top_mouse_down(event)
{
    let { e_tree, e } = event.detail

    In.setTreeState({
        drag_state: 'fraction_top-in_fraction',
        e_tree: e_tree
    }).setTreeBorders()

    makeClone({ e:e, e_tree:e_tree, 
     svelte_elem: Fraction_Top, drag_type:'fraction'})
}


function box_mouse_down(event)
{

    let { e_tree, e } = event.detail

    In.setTreeState({
        drag_state: 'box',
        e_tree: e_tree
    }).setTreeBorders()

    makeClone({e:e, e_tree:e_tree, 
        svelte_elem: Box, drag_type: "box"})
}

function bracket_mouse_down(event)
{
    let { e_tree, e } = event.detail
    
    In.setTreeState({
        drag_state: 'item-in_box',
        e_tree: e_tree
    }).setTreeBorders()

    makeClone( {e:e, e_tree: e_tree, 
    svelte_elem:Bracket, drag_type:"bracket"} )    
}

function init_inside_bracket( e, e_tree )
{
    In.setTreeState({
        drag_state: 'item-in_bracket',
        e_tree: e_tree
    }).setTreeBorders()

    //make clone
    let svelte_elem
    let drag_type
    let e_tree_name_type = e_tree.name.split("_")[0] 
    if( e_tree_name_type == 'i') //IMPORTANT: no e_tree.props.type as item
    {
        svelte_elem = Item
        drag_type = 'item'
    }
    else if( e_tree_name_type == 'br')
    {
        svelte_elem = Bracket
        drag_type = 'item'
    }
    else if( e_tree_name_type == 'fr')
    {
        svelte_elem = Fraction 
        drag_type = 'fraction'
    }
    
    makeClone({ 
        e:e,
        e_tree: e_tree,
        svelte_elem: svelte_elem,
        drag_type: drag_type
        })    
}


function makeClone( obj )
{
    let { e, e_tree, svelte_elem, drag_type } = obj

    let elem = e.currentTarget
    let drag_elem = elem.parentNode

    let { top, left } = drag_elem.getBoundingClientRect()

    let deep_clone_tree = op.cloneFrom( e_tree )
    deep_clone_tree.props.isClone = true
    // let deep_clone_tree = e_tree directly
    // won't work because 
    // 1. it will interfere with deselect after drag end
    // 2. cause the left arrows to be difficult to handle

    $clone_drag_move = { x:0, y:0 }

    let unsub_drag_move = clone_drag_move.subscribe( obj => {
        drag_x = obj.x
        drag_y = obj.y
    })

    let clone_id = 0

    let drag_obj = {
        clone_id: clone_id,
        ref_elem: null, 
        clone_elem: svelte_elem,
        tree: deep_clone_tree,
        client_x: e.clientX,
        client_y: e.clientY,
        start_x: left,
        start_y: top,
        offset_x:0,
        offset_y:0,
        end_x: null,
        end_y: null,
        isDraggable:true 
    }

    drag_obj.unsub = clone_unsub( unsub_drag_move )

    $clone_obj = [ drag_obj ]  
}

function clone_unsub( unsub_drag_move, clone_id = 0 )
{
    // function maker
    //1. use to transfer context of listening to drag_x and drag_y
    //2. unsub_drag_move is the context 
    //    let unsub_drag_move = clone_drag_move.subscribe( obj => {
    //     drag_x = obj.x
    //     drag_y = obj.y
    //    })
    //3. clone_drag_move is the $clone_drag_move from clone_store.js


    // Call By:
    // 1. fn_makeClone()
    // 2. fn_cross_over_equal_sign
    //  to transfer new context 
    //  of drag_x and drag_y to clone elem
    return () => {
        unsub_drag_move()
        op.pasted_tree_names = []
        drag_x = undefined
        drag_y = undefined
        if( !Array.isArray($clone_obj[clone_id].ref_elem) )
        {
            //drag_elem is global
            //drag_elem is for drag into bracket and outside bracket
            // $clone_obj[clone_id].ref_elem = drag_elem
            $clone_obj[clone_id].ref_elem = In.dom_elem
        }
        drag_elem = null
    }
}

// function bubble_up(event)
// {   
//    let { e_tree, e, counter } = event.detail
//    counter -= 1
//    if( counter == 0)
//    {
//        if( e_tree.props.arrow_type == 'yellow')
//        {
//            init_inside_bracket( e, e_tree)
//        }
//    }
//    else
//    {
//        //continue to bubble
//         dispatch('bubble_up', {
// 		    e: e,
//             e_tree: e_tree,
//             counter: counter
// 	    })
//    }
// }


</script>
{#if tree}
    {#if tree.list.length == 0}
        <Box isZero=true />
    {:else}
        {#each tree.list as b (b)}{#if tree[b].props.type == 'symbol'
         || tree[b].props.type == 'coeff' || tree[b].props.type == 'bin'}
                <Item 
                tree={tree[b]} 
                on:select={child_selected} 
                on:deselect={child_deselected} 
                on:deselect_editable={deselect_editable}
                on:arrow_mouse_down={item_mouse_down}
                />
            {:else if tree[b].props.type == 'fraction'}
                <Fraction 
                tree={tree[b]} 
                on:select={child_selected} 
                on:deselect={child_deselected} 
                on:deselect_editable={deselect_editable}
                />
            {:else if tree[b].props.type == 'top'}
                <Fraction_Top 
                tree={tree[b]} 
                on:select={child_selected} 
                on:deselect={child_deselected} 
                on:deselect_editable={deselect_editable}
                on:arrow_mouse_down={fraction_top_mouse_down}
                />
            {:else if tree[b].props.type == 'bottom'}
                <Fraction_Bottom 
                tree={tree[b]} 
                on:select={child_selected} 
                on:deselect={child_deselected} 
                on:deselect_editable={deselect_editable}
                
                on:arrow_mouse_down={fraction_bottom_mouse_down}
                />
            {:else if tree[b].props.type == 'box'}
                <Box 
                tree={tree[b]} 
                on:select={child_selected} 
                on:deselect={child_deselected} 
                on:deselect_editable={deselect_editable}
                on:arrow_mouse_down={box_mouse_down}
                isRoot={isRoot}
                />
            {:else if tree[b].props.type == 'bracket'}
                <Bracket 
                tree={tree[b]} 
                on:select={child_selected}
                on:deselect={child_deselected} 
                on:deselect_editable={deselect_editable}
                on:arrow_mouse_down={bracket_mouse_down}
                />
            {/if}
        {/each}
    {/if}
{/if}
