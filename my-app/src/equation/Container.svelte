<script>

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

import { op } from './actions/xTree'
import { In } from './actions/interaction.js'
import { s } from './actions/selection.js'
// import { stopDragSelect } from './actions/clone_stores.js'
export let tree 
export let isRoot = false //used by Equation.svelte


function child_selected( event )
{
    s.select( event )
}

function child_deselected( event )
{
    s.deselect( event )
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


// function init_inside_bracket( e, e_tree )
// {
//     In.setTreeState({
//         drag_state: 'item-in_bracket',
//         e_tree: e_tree
//     }).setTreeBorders()

//     //make clone
//     let svelte_elem
//     let drag_type
//     let e_tree_name_type = e_tree.name.split("_")[0] 
//     if( e_tree_name_type == 'i') //IMPORTANT: no e_tree.props.type as item
//     {
//         svelte_elem = Item
//         drag_type = 'item'
//     }
//     else if( e_tree_name_type == 'br')
//     {
//         svelte_elem = Bracket
//         drag_type = 'item'
//     }
//     else if( e_tree_name_type == 'fr')
//     {
//         svelte_elem = Fraction 
//         drag_type = 'fraction'
//     }
    
//     makeClone({ 
//         e:e,
//         e_tree: e_tree,
//         svelte_elem: svelte_elem,
//         drag_type: drag_type
//         })    
// }
</script>
{#if tree}
    {#if tree.list.length == 0}
        <Box isZero=true />
    {:else}
        {#each tree.list as b (b)}
            {#if tree[b].type == 'sym'}
                <Item
                tree={tree[b]} 
                on:select={child_selected} 
                on:deselect={child_deselected} 
                on:deselect_editable={deselect_editable}
                />
            {:else if tree[b].type == 'num'}
                <Item
                tree={tree[b]} 
                on:select={child_selected} 
                on:deselect={child_deselected} 
                on:deselect_editable={deselect_editable}
                />
            {:else if tree[b].type == 'fr'}
                <Fraction 
                tree={tree[b]} 
                on:select={child_selected} 
                on:deselect={child_deselected} 
                on:deselect_editable={deselect_editable}
                />
            {:else if tree[b].type == 'top'}
                <Fraction_Top 
                tree={tree[b]} 
                on:select={child_selected} 
                on:deselect={child_deselected} 
                on:deselect_editable={deselect_editable}
                />
            {:else if tree[b].type == 'bot'}
                <Fraction_Bottom 
                tree={tree[b]} 
                on:select={child_selected} 
                on:deselect={child_deselected} 
                on:deselect_editable={deselect_editable}
                />
            {:else if tree[b].type == 'bx'}
                <Box 
                tree={tree[b]} 
                on:select={child_selected} 
                on:deselect={child_deselected} 
                on:deselect_editable={deselect_editable}
                isRoot={isRoot}
                />
            {:else if tree[b].type == 'br'}
                <Bracket 
                tree={tree[b]} 
                on:select={child_selected}
                on:deselect={child_deselected} 
                on:deselect_editable={deselect_editable}
                />
            {/if}
        {/each}
    {/if}
{/if}
