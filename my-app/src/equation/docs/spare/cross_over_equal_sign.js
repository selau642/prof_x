function cross_over_equal_sign( event )
{
    return
    //Already destroy and create by parent Equation.svelte
    
    //NOTE: 
    //1. common bug is to forget to set BOTH updateProps=true and tree=tree
    //  this cause svelte to not able to render correctly
    let { box_elem, e_tree } = event.detail
    // drag_elem = box_elem

    check_equation_sign( tree )

    In.setTreeBorders({
        drag_state: 'box',
        tree: tree, 
        e_tree: e_tree
    })
    

    let unsub_drag_move = clone_drag_move.subscribe( obj => {
        drag_x = obj.x
        drag_y = obj.y
    })


    let clone_id = 0
    $clone_obj[clone_id].unsub = clone_unsub( unsub_drag_move )

    // tree = tree //super important to add this so that svelte can render all updateProps

}

function cross_over_destroy( event )
{
    //triggers when Box removed from tree during cross over
    //the context is inside the Right Side Container Only that the Box was removed
    //reason this exist is because containers are different context
    return 
    op.tree = tree
    // isUpdating = false
    if( tree.list.length != 0)
    {
        let item = op.getChild(0).getChild(0).tree.props
        if( item.text == '+' )
        {   
            op.tree.props.text = ''
            op.tree.updateProps()
        }
    } 
}

function check_equation_sign( tree )
{
    //check 1st and 2nd left item of tree
    op.tree = tree
    
    if( op.tree.list[0] )
    {
        //1st item
        let box_tree = op.getChild(0).tree
        let item_tree = op.getChild(0).tree
        
        if( item_tree.props.text == "+" )
        {
            item_tree.props.text = ""
            item_tree.updateProps()
            if( box_tree.props.show_arrow )
            {
                box_tree.updateArrowPosition("container.svelte cross over")
            }
        }        
    }
    else
    {
        console.log( "tree[0] is empty")
    }
    //add + sign
    op.tree = tree
    if( op.tree.list[1] )
    {
        //2nd Item
        let box_tree = op.getChild(1).tree
        let item_tree = op.getChild(0).tree
        let text = item_tree.props.text

        if( text === '' )
        {
            item_tree.props.text = '+'
            item_tree.updateProps()            
        }
        else if( text != "-" && text != '+' )
        {
            // op.tree = tree
            // console.log( op.tree.name )
              
            let is_sibling_selected = op.getParent(1).tree.props.selected //$props[tree.list[1]].selected

            let plus_elem = {
                    type:'bin',
                    text:'+',
                    selected: is_sibling_selected,
                    show_arrow:false
                }

            op.addChild('i', 'bin', plus_elem, 0)  
        }
        box_tree.updateProps()
    }

}