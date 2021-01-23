if( prev_sib_type == 'bracket' )
{
    if( drag_x < right_prev_bracket_x  ) 
    {
        console.log("enter bracket <<---")
        // in_bracket = "right_to_left"
        in_bracket = "from_inside"
        drag_state = 'in_bracket'
        isUpdating = true
        //put in bracket
        $clone_obj[0].ref_elem = []

        op.cutChildTree( node_index )
        node_index -= 1

        op.getChild( node_index ).pasteAllChild({ store_in_ref_elem: true , 
        arrow_type: 'yellow' })
        //{ store_in_ref_elem: true } ref Item.svelte, not isDragging, onMount
        op.getParent(1)
        
        tree = tree
        
        //Path 1: cut, paste and render
        //Goto:  
        //1. Item.svelte, 
        //2. onMount() => !isDraggable => tree_props.store_in_ref_elem
        //3. $clone_obj[0].ref_elem.push( this_item )
            
        //Path 2: on drag end clone element
        //Goto: 
        //1. Item.svelte, 
        //2. handleDragEnd, 
        //3. is array $clone_obj[clone_id].ref_elem
        //4. create new_clone item
        //5. isSplit => onMount => return_to_position
    }
}
else
{
    if( drag_x < prev_sib_x )
    {
        console.log('swap left')
        drag_state = 'item'
        isUpdating = true
        let item =  tree.list.splice(node_index, 1)[0]
        tree.list.splice( node_index - 1, 0, item )
        tree = tree
        
        if( (node_index == 0 || node_index == 1) 
        && tree[tree.list[node_index]].props.type == 'box' )
        {
            check_equation_sign( tree )                        
            check_clone_sign( 0 )
        }
        
        $isSwap = 'right_to_left'
        
        //Goto: Container.svelte, function afterUpdate                    
    }
}

if( next_sib_type == 'bracket' )
{
    if( drag_x > left_next_bracket_x ) 
    {   
        console.log("enter bracket --->>")
        // in_bracket = "left_to_right"
        in_bracket = "from_inside"
        drag_state = 'in_bracket'
        isUpdating = true
        $clone_obj[0].ref_elem = []
        
        op.cutChildTree( node_index )
        op.getChild( node_index ).pasteAllChild({ store_in_ref_elem: true, 
        arrow_type:"yellow" })
        //{ store_in_ref_elem: true } ref Item.svelte, not isDragging, onMount
        op.getParent(1)
        
        tree = tree
        
    }
    
}
else
{
    if( drag_x > next_sib_x)
    {
        //swap left to right
        //NOTE: Upgrade to non destructured array item reassignment
        // to only re-render on assignment
        // allows more control on when to re-render

        //[ tree[node_index], tree[node_index + 1] ] = [ tree[node_index + 1], tree[node_index] ] 
        console.log( "swap right")
        drag_state = 'item'
        isUpdating = true
        let item =  tree.list.splice(node_index, 1)[0]
        tree.list.splice( node_index + 1, 0, item )
        tree = tree

        //triggers rerendering
        //relative tree position
        //{0}, {drag_elem:1}
        if( (node_index == 0 || node_index == 1) 
        && tree[tree.list[node_index]].props.type == 'box' )
        {
            check_equation_sign( tree )                        
            check_clone_sign( 1 )
        }
        $isSwap = "left_to_right"
        
        //Goto: Container.svelte, function afterUpdate
    }
}