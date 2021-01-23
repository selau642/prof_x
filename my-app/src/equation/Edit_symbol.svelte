<script>

import { error_msg } from './actions/equation_stores.js'
import { op } from './actions/xTree.js'

function edit_symbol()
{
    //change bracket sign + to -, - to +
    let show_arrow_list = op.getShowArrowList()

    if( show_arrow_list.length != 1  ) return

   
    op.getTreeByName( show_arrow_list[0]).tree.props.isEditable = true 
    op.tree.props.arrow_type = 'grey'
    op.tree.updateProps()
   
}

function add_symbol()
{
    //TO DO:
    //consider multiple formula case
    document.getElementById('btn_deselect').click()
    op.addSymbolToEquation() 
    //by default add a box at the right side equation f_1-eq_1

}

function remove_symbol()
{
    let show_arrow_list = op.getShowArrowList()

    if( show_arrow_list.length != 1  ) return
    
    let check = confirm("Are you sure you want to remove item?")
    if( check )
    {
        let tree = op.getTreeByName( show_arrow_list[0] ).tree
        op.getParent(1).removeChildShallow( tree.name )
        op.tree.updateProps()
    }
}

</script>
<div id='edit'>
    <div class='btn clear_left' on:click={add_symbol}>Add Symbol</div>
    <div class='btn clear_left' on:click={edit_symbol}>Edit Symbol</div>
    <div class='btn clear_left' on:click={remove_symbol}>Remove Symbol</div>
    <div style='clear:both'></div>
</div>
<style>
#edit
{
    width:fit-content;
    font-size:20px;
    margin: 2px 0px;
}
.clear_left{
    clear:left;
}
.btn
{
    font-family:Arial, Helvetica, sans-serif;
    text-align:center;
    float:left;
    margin: 4px 2px;
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