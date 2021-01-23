<script>
import { error_msg } from './actions/equation_stores.js'
import { op } from './actions/xTree.js'
import { u } from './actions/utils/ui.js'
// import { tooltip } from './actions/tooltip_stores.js'
import { c } from './actions/change_sign.js'

import { x_drag } from './actions/x_drag.js'
import { tick } from 'svelte'

function change_sign(e)
{
    //change bracket sign + to -, - to +
    let show_arrow_list = op.getShowArrowList()
    c.changeSign( show_arrow_list )
    
}

async function add_bracket()
{
    let tree_list = u.getArrowFrom('document')
			.whereArrowTypeIs('all')
    if( u.check( tree_list )
        .isSideBySide() )
    {
        let [ first_tree ] = tree_list
        let p_tree = first_tree.parentNode
        let first_index = u.getPositionOf( first_tree )

        let bracket_tree = u.insertBracketInto(p_tree)
                            .at( first_index )
                            .getBracketTree()
        // console.log(tree_list)
        u.cut( tree_list )
        .paste()
        .into( bracket_tree )
        .at('start')

        p_tree.updateProps()
        await tick()
        
        document.getElementById( bracket_tree.full_name )
            .getElementsByClassName('open')[0].click()
    }
}

// async function add_bracket()
// {
//     let show_arrow_list = op.getShowArrowList()
//     // console.log(show_arrow_list)
//     if( show_arrow_list.length == 0 ) return

//     let add_bracket =  op.addBracket( show_arrow_list )
//     if( add_bracket === true)
//     {
//         //Update props first before updateDictName()
//         // console.log( op.protected_name_list )
//         op.getParent(2)
//         op.tree.updateProps()
//     }
//     else if( add_bracket == 'not_side_by_side')
//     {
//         $error_msg = 'Cannot add bracket. Please select elements side by side to add bracket.'
//     }
//     else if( add_bracket == 'not_same_parent')
//     {
//         $error_msg = 'Cannot add bracket. Please select elements with same parent to add bracket.'
//     }
// }

function remove_bracket()
{
    //remove bracket if no sibling
    let show_arrow_list = op.getShowArrowList()
    if( show_arrow_list.length != 1  ) return

    let remove_bracket =  op.removeBracket( show_arrow_list )
    if( remove_bracket === true)
    {
        op.tree.updateProps()
        // op.updateDictName()
    }
    else if( remove_bracket == "no_bracket_found")
    {
        $error_msg = 'No bracket to remove.'
    }
    else if( remove_bracket =='bracket_has_sibling')
    {
        $error_msg = 'Cannot remove bracket. Bracket has siblings.'
    }
    
}

let cal_top = 100
let cal_left = 850
let tx = 0
let ty = 0

function tool_drag_start(event)
{
    // console.log("tool drag_start")
}

function tool_drag_move(event)
{
	let {x, y, dx, dy} = event.detail
	
	tx += dx
	ty += dy
    // console.log("tool drag_move, tx:", tx, ", ty:", ty)
}

function tool_drag_end(event)
{
    // console.log("tool drag_end")
}

</script>
<div 
    id='bracket_controls'
    style='top:{cal_top}px;left:{cal_left}px;transform:translate({tx}px, {ty}px);'
	use:x_drag = {true}
	on:x_drag_start = {tool_drag_start}
	on:x_drag_move = {tool_drag_move}
	on:x_drag_end = {tool_drag_end}	
>
    <div class='title'>Options:</div>
    <div class='btn' on:click={add_bracket}>()</div>
    <div class='btn' on:click={remove_bracket}>(X)</div>
    <div class='btn' on:click={change_sign}>-1</div>
    <div style='clear:both'></div>
</div>
<style>
.title
{
    user-select: none;
}

#bracket_controls
{
    cursor:pointer;
    width:fit-content;
    padding:5px;
    border: 1px solid rgb( 0, 0, 0 );
    border-radius: 4px;
    position:absolute;
    font:20px Arial;
    margin: 2px 0px;
    user-select: none;
    z-index:100;
}

.btn
{
    font-family:Arial, Helvetica, sans-serif;
    text-align:center;
    float:left;
    margin: 0px 2px;
    width:fit-content;
    border:1px solid rgb(0,0,0);
    padding:4px;
    border-radius:4px;
    min-width: 26px;
    background-color: rgb(255, 255, 255);

}

.btn:hover
{
    background-color: rgb(84, 228, 84);
    cursor:pointer;
}
</style>