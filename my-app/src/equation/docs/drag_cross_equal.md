Drag Left to Right Box
1. upward propagate:
<Arrow on:mousedown={arrow_mouse_down}> => Box.svelte
<Box on:arrow_mouse_down={box_mouse_down}> => Container.svelte
 box_mouse_down(){
     ... $clone_obj = [drag_obj]
     isRoot => 
     elem_drag_start ^
     set $clone_obj[0].cross_unsub
 }
 <Container on:elem_drag_start={elem_drag_start_left}> => Equation.svelte
 
 2. Equation.svelte handle cross over = sign detection:
 $:if( drag_x ... )
 {
    1. detect cross over left_to_right equal sign:
    2. unsub clone obj
        $clone_obj[clone_id].unsub()
    3. cut left & paste right
    4. Rerender trees
    right_x_tree = right_x_tree
    left_x_tree = left_x_tree

    IMPORTANT:
    $isCrossOver = 'right_to_left'
 }

 3. Destroy cut box on left_x_tree
 left_x_tree: Box.svelte => onDestroy emit "cross_over_destroy" => Container.svelte
 Container fn cross_over_destroy (){
     1. checks & corrects sign of first element in remaining tree
    +a + b => a + b
 }

 4. Mount new box in right_x_tree 
 right_x_tree: Box.svelte => onMount => dispatch 'cross_over_equal_sign' => Container.svelte
    1. use temp_name as tree_name
    2. dispatch event on condition to Container.svelte
    if( $isCrossOver && tree_props.show_arrow )
    {

        dispatch("cross_over_equal_sign", {
            box_elem: this_box,
            direction: $isCrossOver
        })

        $isCrossOver = false
        
    }


5. Container.svelte
fn cross_over_equal_sign () {
    $clone_obj[clone_id].unsub = () => {
        op.updateDictName()
    }
}

