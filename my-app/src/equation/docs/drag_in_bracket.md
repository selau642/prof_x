Drag & Drop into bracket:
a(b+c) => ab + ac 
1. Container.svelte 
    1. fn: item_mouse_down 
    if yellow arrow:
        bubble up 2 times and don't procceed
    else
        in_bracket = false
        set_sib_x() => setup all the borders to trigger swap or move into
        {
            if( next sib is bracket)
            right_next_bracket_x, left_next_bracket_x

            if( prev sib is bracket)
            right_prev_bracket_x, left_prev_bracket_x
        }

        setup the clone_element


2. If drag into bracket:
    1. op cut and parseAllChild( { store_in_ref_elem: true, arrow_type:'yellow' })

    2. Item.svelte, 
    if isDragging:
    onMount (){ 
        push into $clone[clone_id].ref_elem array
        unset store_in_ref_elem
    }

3. if release when in bracket: 
    Clone Element (Item.svelte)
    trigger: handleDragEnd, return to each ref_elem position

4. if drag out of bracket again:
    Trigger: Container.svelte
    => in_bracket = 'left_to_right' && drag_x < left_next_bracket_x
    
    1. console.log( "exit bracket <<---")
    2. in_bracket = false
    3. exit_bracket = true
    4. op.undo_pasteAction( node_index )    
        undo_pasteAction depends on pasted_tree_names when cutting
        note that node_index is the index of the bracket element
    5. op.pasted_tree_names = []               
    6. tree = tree
    7. $clone_obj[0].ref_elem = null

    8. afterUpdate()


