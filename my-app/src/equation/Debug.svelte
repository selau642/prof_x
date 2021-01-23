<script>
import { In } from './actions/interaction.js'
import clonedeep from 'lodash.clonedeep'
// import { tree } from './actions/equation_stores.js'
import { op } from './actions/xTree.js'

function print_selected_tree()
{

    let show_arrow_list = op.getShowArrowList()
    if( show_arrow_list.length > 0)
    {
        for( let item of show_arrow_list )
        {
        console.log( clonedeep( op.getTreeByName( item ).tree ))
        }
    }
    else
    {
        console.log("No tree selected.")
    }
}

function print_root_tree()
{
    console.log( op.root )
}

function print_op()
{
    console.log(op)
}
</script>
<div id='print_controls'>
    <div class='title'>Print to Console:</div>
    <div id='btn_print' on:click={print_selected_tree}>Selected Tree</div>
    <div id='btn_print' on:click={print_root_tree}>Root Tree</div>
    <div id='btn_print' on:click={print_op}>Operator</div>
    <div style='clear:both'></div>
</div>
<style>

.title
{
	margin:4px;
}


#print_controls{
    padding:4px;
    border:1px solid rgb(0,0,0);
    border-radius: 4px;
    width:fit-content;
    font:20px Arial;
    user-select: none;
}

#btn_print
{
    font-family:Arial, Helvetica, sans-serif;
    text-align:center;
    width:fit-content;
    border:1px solid rgb(0,0,0);
    padding:4px;
    margin: 2px 0px;
    border-radius:4px;
    min-width: 26px;
    background-color: rgb(255, 255, 255);
}

#btn_print:hover
{
    background-color: rgb(84, 228, 84);
    cursor:pointer;
}
</style>