//Loc: Container.svelte, function afterUpdate
// afterUpdate( () => {
   
    // if( $isSwap && drag_elem )
    // {
    //     set_sib_x( drag_elem, { caller: "after_update"})
    //     $isSwap = false
    // }
    // else if( in_bracket == 'from_inside' )
    // {
    //     set_in_bracket( { caller: "after_update"})
    // }
    // else if( exit_bracket )
    // {
    //     op.tree = tree

    //     drag_elem = op.getChild( node_index ).getDOMNode() 
    //     set_sib_x( drag_elem, { caller: "after_update exit_bracket"})
    //     exit_bracket = false
    // }

    // if( drag_state == 'item' || drag_state == 'bracket')
    // {
    //     if( exit_bracket )
    //     {
    //         op.tree = tree
    //         drag_elem = op.getChild( node_index ).getDOMNode() 
    //         exit_bracket = false
    //     }

    //     // if( drag_elem )
    //     let msg = 'after_update:' + tree.name
    //     set_sib_x( drag_elem, { caller: msg })
    // }
    // else if( drag_state == 'box')
    // {
    //     if( drag_elem )
    //     {
    //         set_sib_x( drag_elem, { caller: "after_update"})
    //         $isSwap = false
    //     }
    // }
    // else if( drag_state == 'in_bracket')
    // {
    //     //no need to reset cause will auto undo
    // }


    // if(isUpdating)isUpdating = false
    
// })