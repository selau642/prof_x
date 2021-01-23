if( drag_state == 'box')
{
    if( drag_y < y_top  )
    {            
        // console.log("drag_x", drag_x )
        // console.log("prev_sib_x: ", prev_sib_x, ", next_sib_x: ", next_sib_x,
        //  ", eq_left_x:", eq_left_x, ", eq_right_x:", eq_right_x )
        if( drag_x < prev_sib_x )
        {
            console.log('box swap left')
            // obj.test( $test_obj_call)
            // obj()
            drag_state = 'box'
            isUpdating = true
            let item =  tree.list.splice(node_index, 1)[0]
            tree.list.splice( node_index - 1, 0, item )

            if( (node_index == 0 || node_index == 1) 
            && tree[tree.list[node_index]].props.type == 'box' )
            {
                check_equation_sign( tree )                        
                check_clone_sign( 0 )
            }
            

            
            tree = tree
            
            tick().then(async () => {
                isUpdating = false
                tree[item].updateArrowPosition("box")
                set_box_sib_x( drag_elem, { caller: "box swap_left tick"})
             
            })
               
        }
        else if( drag_x > next_sib_x)
        {
            //swap left to right
            //NOTE: Upgrade to non destructured array item reassignment
            // to only re-render on assignment
            // allows more control on when to re-render

            //[ tree[node_index], tree[node_index + 1] ] = [ tree[node_index + 1], tree[node_index] ] 
            console.log( "box swap right")
            drag_state = 'box'
            isUpdating = true

            let item =  tree.list.splice(node_index, 1)[0]
            tree.list.splice( node_index + 1, 0, item )
            

            //triggers rerendering
            //relative tree position
            //{0}, {drag_elem:1}
            if( (node_index == 0 || node_index == 1) 
            && tree[tree.list[node_index]].props.type == 'box' )
            {
                check_equation_sign( tree )                        
                check_clone_sign( 1 )
            }

            tree = tree
            tick().then( async () => {
                isUpdating = false
                tree[item].updateArrowPosition("box")
                set_box_sib_x( drag_elem, { caller: "box swap_right tick"}) 
                                                
            })
        }
        else if( drag_x < eq_left_x  
        && origin == 'right' )
        {
            // cross_eq_sign
            // right_to_left
            console.log( "cross_above_eq_sign <==")
            isUpdating = true
            let left_tree = op.getTreeByName('f_1-eq_1').tree
            $clone_obj[0].unsub()
                            
            //2. Store
            // node_index = 0
            op.tree = tree 
            op.cutChildTree(node_index)
            
            op.pasteChildTree( left_tree.full_name, left_tree.list.length )
            op.pasted_tree_names =  []
            //Svelte rerendering
            tree = tree
            left_tree = left_tree

            $isCrossOver = 'right_to_left' //onMount Box.svelte
            tick().then( () => {
                isUpdating = false
            })
        }
        else if( drag_x > eq_right_x 
        && origin == 'left' )
        {
            // cross_eq_sign
            // left_to_right
            isUpdating = true
            console.log("cross_above_equal_sign ==>")
            let right_tree = op.getTreeByName('f_1-eq_2').tree 

            $clone_obj[0].unsub()
            
            //2. Store
            // node_index = tree.list.length - 1
            op.tree = tree
            op.cutChildTree( node_index )
            op.pasteChildTree( right_tree.full_name, 0 )
            op.pasted_tree_names =  []
            tree = tree
            right_tree = right_tree
            
            $isCrossOver = "left_to_right" //onMount Box.svelte

            tick().then( () => {
                isUpdating = false
             })

        }
    }
}
else if( drag_state == 'item' || drag_state == 'bracket' )
{
    if( drag_y < y_top )
    {   //drag above over
        //top = 0 so drag_x < y_top means mouse above item
        if( drag_x < right_prev_bracket_x  ) 
        {
            console.log("enter bracket <<---")
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
            
            tick().then( () => {
                isUpdating = false
            })

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
        else if( drag_x > left_next_bracket_x ) 
        {   
            console.log("enter bracket --->>")
            drag_state = 'in_bracket'
            isUpdating = true
            $clone_obj[0].ref_elem = []
            
            op.cutChildTree( node_index )
            op.getChild( node_index ).pasteAllChild({ store_in_ref_elem: true, 
            arrow_type:"yellow" })
            //{ store_in_ref_elem: true } ref Item.svelte, not isDragging, onMount
            op.getParent(1)
            
            tree = tree
            tick().then(() => {
                isUpdating = false
            })
        }
        else if( drag_x < prev_sib_x )
        {
            console.log('item swap left')
            drag_state = 'item'
            isUpdating = true
            let item =  tree.list.splice(node_index, 1)[0]
            tree.list.splice( node_index - 1, 0, item )
            
            tree = tree
            tick().then(() => {
                isUpdating = false
                set_sib_x( drag_elem, { caller: "item swap_left tick"})                    
            }) 
        }
        else if( drag_x > next_sib_x)
        {
            //swap left to right
            //NOTE: Upgrade to non destructured array item reassignment
            // to only re-render on assignment
            // allows more control on when to re-render

            // Not this [ tree[node_index], tree[node_index + 1] ] = [ tree[node_index + 1], tree[node_index] ] 
            console.log( "item swap right")
            drag_state = 'item'
            isUpdating = true
            let item =  tree.list.splice(node_index, 1)[0]
            tree.list.splice( node_index + 1, 0, item )
            
            tree = tree
            tick().then(() => {
                isUpdating = false
                set_sib_x( drag_elem, { caller: "item swap_right tick"})                    
            })
        }
    }
}
else if( drag_state == 'in_bracket')
{

    if(    drag_x < left_next_bracket_x 
        || drag_x < left_prev_bracket_x  
        || drag_x < left_inside_bracket_x )
    {
        //1. identify item, 2. take out of bracket, 3. put to the left

        console.log( "exit bracket <<---")
        
        drag_state = 'item'
        isUpdating = true
        // console.log( "bracket_item_id:" + bracket_item_id )

        //1. identify item
        //2. take out of bracket

        op.undo_pasteAction()
        op.pasteIntoParent( node_index, { arrow_type: 'multi_top'} )
        op.pasted_tree_names = []               
                    
        // exit_bracket = true
        $clone_obj[0].ref_elem = null
        tree = tree
        
        tick().then(() => {
            isUpdating = false
            drag_elem = op.getChild( node_index ).getDOMNode() 
            set_sib_x( drag_elem, { caller: "exit bracket <<--- tick"})                    
        })
        //on release clone_element
        //Goto: 
        //1. Item.svelte, 
        //2. handleDragEnd, 
        //3. not array $clone_obj[clone_id].ref_elem
        //4. return to position      
        
    }
    else if(   drag_x > right_prev_bracket_x 
            || drag_x > right_next_bracket_x 
            || drag_x > right_inside_bracket_x )
    {
        console.log( "exit bracket --->>")
        drag_state = 'item'
        isUpdating = true
        //1. identify item, 2. take out of bracket, 3. put to the right

        //1. identify item
        //2. take out of bracket
        // console.log( clonedeep( op.tree) )
        op.undo_pasteAction()
        // console.log( clonedeep( op.tree) )
        node_index += 1

        op.pasteIntoParent( node_index, { arrow_type:"multi_top" } )
        op.pasted_tree_names = []

        
        // exit_bracket = true
        $clone_obj[0].ref_elem = null
    
        tree = tree
        
        tick().then(() => {
            isUpdating = false
            drag_elem = op.getChild( node_index ).getDOMNode() 
            set_sib_x( drag_elem, { caller: "exit_bracket --->> tick"})                    
        })
        //on drag end clone element
        //Goto: 
        //1. Item.svelte, 
        //2. handleDragEnd, 
        //3. not array $clone_obj[clone_id].ref_elem
        //4. return to position 
    }
}




//Other spare functions
function check_equation_sign( tree )
{
    //remove + sign
    op.tree = tree
    
    if( op.tree.list[0] )
    {
        let left_1st_props = op.getChild(0).getChild(0).tree.props

        if( left_1st_props.text == "+" )
        {
            left_1st_props.text = ""
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
        let left_2nd_props = op.getChild(1).getChild(0).tree.props
        let text_2 = left_2nd_props.text

        if( text_2 === '' )
        {
            left_2nd_props.text = '+'
      
        }
        else if( text_2 != "-" && text_2 != '+' )
        {
            // op.tree = tree
            // console.log( op.tree.name )
            let sib_elem =  op.getParent(1).tree.props
           
            let is_sibling_selected = sib_elem.selected //$props[tree.list[1]].selected

            let plus_elem = {
                    type:'bin',
                    text:'+',
                    selected: is_sibling_selected,
                    show_arrow:false
                }

            op.addChild('i', 'bin', plus_elem, 0)  

        }
    }
    
    // tree = tree

}

function check_clone_sign( drag_elem_position )
{
    let start_tree 
    let unsub = clone_obj.subscribe( obj => {
        start_tree = obj[0].tree
    })

    op.tree = start_tree
    if( drag_elem_position == 0 )
    {   
        let left_1st_props = op.getChild(0).tree.props
        let child_name = op.splitName(op.tree.name).item_name 
        if( left_1st_props.text == "+" )
        {
            left_1st_props.text = ""
            clone_obj.update( (obj) => {
                obj[0].tree[child_name] = obj[0].tree[child_name]
                return obj
            })
            // $clone_obj[0].tree[child_name] = $clone_obj[0].tree[child_name]
        }        
    }
    else if( drag_elem_position == 1 )
    {
        //position in tree:
        //{0}, {drag_elem:1}
        // console.log("In drag elem pos = 1")
        // op.tree = $clone_obj[0].tree
        
        op.tree = start_tree

        let left_1st_props = op.getChild(0).tree.props
        let text_2 = left_1st_props.text
        let child_name = op.splitName(op.tree.name).item_name 

        if(  text_2 === '' )
        {
            left_1st_props.text = '+'
            // $clone_obj[0].tree[child_name] = $clone_obj[0].tree[child_name]
            clone_obj.update( (obj) => {
                obj[0].tree[child_name] = obj[0].tree[child_name]
                return obj
            })
        }
        else if( text_2 != "-" && text_2 != '+' )
        {
            let plus_elem = {
                    type:'bin',
                    text:'+',
                    selected: true,
                    show_arrow:false
                }
            op.tree = start_tree
            op.addChild('i', 'bin', plus_elem, 0)
        }
    }
    // $clone_obj[0].tree = start_tree

    clone_obj.update( obj => {
        obj[0].tree = start_tree
        return obj
    })

    tick().then( () => {
        // $clone_obj[0].tree.updateArrowPosition()
        start_tree.updateArrowPosition()
    })

    unsub()
} 


//Set borders



function set_in_bracket( debug={caller: "Not Set"})
{
    op.tree = tree
    let bracket_elem =  op.getChild( node_index ).getDOMNode() 

    let { left, right, top } = bracket_elem.getBoundingClientRect()
    y_top = top
    left_inside_bracket_x = left
    right_inside_bracket_x = right

}

function set_box_sib_x( elem , debug={ caller: "Not Set"} )
{
    //sets all coordinate (x, y) variables for drag comparisons
    // 1. prev_sib_x, next_sib_x
    // 2. y_top
    // 3. node_index

    isUpdating = false

    prev_sib_x = undefined
    next_sib_x = undefined

    origin = undefined
    eq_left_x = undefined
    eq_right_x = undefined

    //(1 > null ) true (failed)
    //(1 > undefined ) false
    //(1 < undefined ) false

    // console.log(debug)
    let { top, left } = elem.getBoundingClientRect()

    y_top = top
    let i = 0
    let child = drag_elem

    while( (child = child.previousElementSibling) != null ) 
    { 
        if( child.innerHTML != '· ') 
        {
            i++//note the space after · 
        }
    }

    node_index = i
   
    let drag_prev = elem.previousElementSibling

    if( drag_prev )
    {
        let { left, right } = drag_prev.getBoundingClientRect()        
        prev_sib_x = ( right + left ) / 2
    }
    else
    {
        prev_sib_x = Number.NEGATIVE_INFINITY 
    }

    let drag_next = elem.nextElementSibling

    if( drag_next )
    {
        let { left, right } = drag_next.getBoundingClientRect()	
        next_sib_x = (left + right ) / 2

    } 
    else
    {
        next_sib_x = Number.POSITIVE_INFINITY
    }   		

    let eq_elem = document.getElementById('f_1')
    let b_eq_elem = eq_elem.getBoundingClientRect()
    
    eq_left_x = b_eq_elem.left
    eq_right_x = b_eq_elem.right

    if( eq_left_x > left && eq_right_x > left)
    {
        origin = 'left'
    }
    else if ( eq_left_x < left && eq_right_x < left )
    {
        origin = 'right'
    }
}

//default is item
function set_sib_x( elem , debug={ caller: "Not Set"} )
{

    //sets all coordinate (x, y) variables for drag comparisons
    // 1. prev_sib_x, next_sib_x
    // 2. y_top
    // 3. node_index
    // 4. left_prev_bracket_x
    // 5. right_prev_bracket_x
    // 6. left_next_bracket_x
    // 7. right_next_bracket_x

    prev_sib_x = undefined
    left_prev_bracket_x = undefined
    right_prev_bracket_x = undefined
    
    next_sib_x = undefined
    left_next_bracket_x = undefined
    right_next_bracket_x = undefined
    
    left_inside_bracket_x = undefined
    right_inside_bracket_x = undefined
    //(1 > null ) true (failed)
    //(1 > undefined ) false
    //(1 < undefined ) false

    // console.log(debug)
    let { left, right, top, width } = elem.getBoundingClientRect()
    let drag_elem_width = width
    y_top = top

    let i = 0
    let child = drag_elem

    while( (child = child.previousElementSibling) != null ) 
    { 
        if( child.innerHTML != '· ') 
        {
            i++//note the space after · 
        }
    }

    node_index = i
    
    op.tree = tree
    if( tree.list[ node_index - 1 ] )
    {
        prev_sib_type = op.getChild(node_index - 1).tree.props.type
    }
    else
    {
        prev_sib_type = null
    }

    op.tree = tree
    if( tree.list[ node_index + 1 ])
    {
        next_sib_type = op.getChild( node_index + 1).tree.props.type        
    }
    else
    {
        next_sib_type = null
    }
   
    let drag_prev = elem.previousElementSibling

    if( drag_prev )
    {
        let { left, right, width } = drag_prev.getBoundingClientRect()
        if( prev_sib_type == 'bracket')
        {
            right_prev_bracket_x = right
            // console.log( "prev_sib_type" )

            if( drag_elem_width < width / 2 )
            {
                left_prev_bracket_x = left + drag_elem_width
                // console.log( "drag_elem_width < width ")
                // console.log( drag_elem_width, "<", width )
            }
            else
            {
                left_prev_bracket_x = (left + right) / 2
                // console.log( "drag_elem_width >= width ")
                // console.log( drag_elem_width, ">=", width )
            }
        }
        else if( prev_sib_type == 'bin' )
        {	
            prev_sib_x = Number.NEGATIVE_INFINITY            
        }
        else
        {
            prev_sib_x = ( right + left ) / 2
            //not width / 2
        }
    }
    else
    {
        prev_sib_x = Number.NEGATIVE_INFINITY 
    }

    let drag_next = elem.nextElementSibling

    if( drag_next )
    {
        let { left, right, width } = drag_next.getBoundingClientRect()	
        if( next_sib_type == 'bracket')
        {
            left_next_bracket_x = left
            // console.log("next_sib_type")
            if( drag_elem_width < width / 2 )
            {
                right_next_bracket_x = right - drag_elem_width
                // console.log( "drag_elem_width < width ")
                // console.log( drag_elem_width, "<", width )
            }
            else
            {
                right_next_bracket_x  = (left + right) /2 
                // console.log( "drag_elem_width >= width ")
                // console.log( drag_elem_width, ">=", width )     
            }
        }
        else if( next_sib_type == 'bin' )
        {	
            next_sib_x = Number.POSITIVE_INFINITY
        }
        else
        {
            next_sib_x = (left + right ) / 2
        }
    } 
    else
    {
        next_sib_x = Number.POSITIVE_INFINITY
    }   		
}

// Portion of Cross Over Equal Sign
drag_elem = event.detail.box_elem

    In.dom_elem = event.detail.box_elem

    let count = tree.list.length    

    op.tree = tree
    let item_props
    let item_tree
    if( direction == 'right_to_left')
    {   
        //inside left Container
        //1. cutChildTree(...).changeSign() is not used
        //   because it doesn't account for only one element + change to ""
        item_tree = op.getChild( count - 1 ).getChild(0).tree              
        item_props = item_tree.props

        let text = item_props.text

        if( text  == '-' )
        {
            //remove minus -
            if( count - 1 == 0 )
            {
                //only one box in equation
                item_props.text = ''
            }
            else
            {
                item_props.text = '+'
            }

            item_tree = item_tree
            
        }
        else if ( text == '+' || text === '' )
        {
            item_props.text = '-'
            item_tree = item_tree
        }
        else
        {
            //original is positive + 
            //add negative -
            
            let minus_elem = {
                type:'bin',
                text:'-',
                selected: true,
                show_arrow:false
            }
            
            op.getParent(1)

            op.addChild("i", "bin", minus_elem, 0)

        }
       
    }
    else if( direction == 'left_to_right')
    {
        //inside right Container
        //1. cutChildTree(...).changeSign() flip the sign of cut tree, when cutting
        op.tree = tree
        item_tree = op.getChild( 0 ).getChild(0).tree              
        item_props = item_tree.props

        let text = item_props.text
        if( text  == '-' )
        {
            //remove minus -
            // if( count - 1 == 0 )
            // {
            //     //only one box in equation
                item_props.text = ''
            // }
            // else
            // {
                // item_props.text = '+'
            // }

            item_tree = item_tree
            
        }
        else if ( text == '+' || text === '' )
        {
            item_props.text = '-'
            item_tree = item_tree
        }
        else
        {
            //original is positive + 
            //add negative -
            
            let minus_elem = {
                type:'bin',
                text:'-',
                selected: true,
                show_arrow:false
            }

            op.getParent(1).addChild("i", "bin", minus_elem, 0)
            op.tree = op.tree
        }
        
        op.tree = tree
        if( tree.list[1] )
        {
            let item_tree_2 = op.getChild(1).getChild(0).tree
            let item_props_2 = item_tree_2.props
            let text_2 = item_props_2.text
            
            if( text_2 === '')
            {
                item_props_2.text = '+'
                item_tree_2 = item_tree_2
            }
            else
            {
                if(  text_2 != '+' && text_2 != '-' )
                {
                    let plus_elem = {
                        type:'bin',
                        text:'+',
                        selected:item_props_2.selected,
                        show_arrow:false
                    }

                    op.getParent(1).addChild('i','bin', plus_elem, 0)
                }
            }
        }
    }

    drag_state = 'box'
    isUpdating = false

    flip_clone_sign(direction, count)
    
    set_box_sib_x( drag_elem, { caller: "cross_over_equal_sign"} )
    if(direction == 'right_to_left')
    {
        node_index = Math.max(count - 1, 0)
    }
    else if( direction == 'left_to_right')
    {
        node_index = 0
    }