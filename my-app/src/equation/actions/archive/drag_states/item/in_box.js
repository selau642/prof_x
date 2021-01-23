import { clone } from '../../../clone_stores.js.js'
import { op } from '../../../xTree.js.js' 
import { u } from '../../../utils/ui'
import { In } from '../../../interactionion'
//item-in_box

export let in_box = [
    {
        name:'set_in_box_borders',
        set_state_borders: set_item_borders
    },
    {
        name:'swap_left',
        check: check_swap_left,
        update_tree: update_swap_left,
        svelte_tick: tick_swap_left,
        next_state: "item-in_box"
    },
    {
        name:'swap_right',
        check: check_swap_right,
        update_tree: update_swap_right,
        svelte_tick: tick_swap_right,
        next_state: "item-in_box"
    },
    {
        name:'enter_bracket_from_left',
        check:  check_enter_bracket_from_left,
        update_tree: update_enter_bracket_from_left,
        svelte_tick: null,
        next_state: "item-in_bracket"
    },
    {
        name:'enter_bracket_from_right',
        check: check_enter_bracket_from_right,
        update_tree: update_enter_bracket_from_right,
        svelte_tick: null,
        next_state: "item-in_bracket"
    },
    {
        name:'cross_below_equal_sign-right_top_to_left_bottom',
        check: check_right_top_to_left_bottom,
        update_tree: update_right_top_to_left_bottom,
        svelte_tick: tick_right_top_to_left_bottom,
        next_state:'item-in_box' // or fraction_bottom
    },
    {
        name:'cross_below_equal_sign-left_bottom_to_right_top',
        check: check_left_bottom_to_right_top,
        update_tree: update_left_bottom_to_right_top,
        svelte_tick: tick_left_bottom_to_right_top,
        next_state:'item-in_box' // or fraction_bottom
    },
    {
        name:'cross_below_equal_sign-right_bottom_to_left_top',
        check: check_right_bottom_to_left_top,
        update_tree: update_right_bottom_to_left_top,
        svelte_tick: tick_right_bottom_to_left_top,
        next_state:'item-in_box' // or fraction_bottom
    },
    {
        name:'cross_below_equal_sign-left_top_to_right_bottom',
        check: check_left_top_to_right_bottom,
        update_tree: update_left_top_to_right_bottom,
        svelte_tick: tick_left_top_to_right_bottom,
        next_state:'item-in_box' // or fraction_bottom
    },
    {
        name:'exit_fr_top_from_left',
        check: check_exit_fr_top_from_left,
        update_tree: update_exit_fr_top_from_left,
        svelte_tick: tick_exit_fr_top_from_left,
        next_state: 'item-in_box'
    },
    {
        name:'exit_fr_top_from_right',
        check: check_exit_fr_top_from_right,
        update_tree: update_exit_fr_top_from_right,
        svelte_tick: tick_exit_fr_top_from_right,
        next_state: 'item-in_box'
    },
    {
        name:'enter_fr_top_from_left',
        check: check_enter_fr_top_from_left,
        update_tree: update_enter_fr_top_from_left,
        svelte_tick: tick_enter_fr_top_from_left,
        next_state: 'item-in_box'
    },
    {
        name:'enter_fr_top_from_right',
        check: check_enter_fr_top_from_right,
        update_tree: update_enter_fr_top_from_right,
        svelte_tick: tick_enter_fr_top_from_right,
        next_state: 'item-in_box'
    },
    {
        name: 'flip_from_fr_bot_to_top',
        check: check_flip_from_fr_bot_to_top,
        update_tree: update_flip_from_fr_bot_to_top,
        svelte_tick: tick_flip_from_fr_bot_to_top,
        next_state: 'item-in_box'
    },
    {
        name: 'flip_from_top_to_bottom',
        check: check_flip_from_fr_top_to_bottom,
        update_tree: update_flip_from_fr_top_to_bottom,
        svelte_tick: tick_flip_from_fr_top_to_bottom,
        next_state: 'item-in_box'
    }
]

/**
 * @this {In}
 */

function set_item_borders()
{
    let { 
    e_tree_list:{      // e_tree_list = list of items to drag
        length: et_l,
        0: min_tree, 
        [ et_l - 1 ]: max_tree 
        }, 
    tree } = this.getPrevUpdate() //tree = parent of event tree    

    let min_elem_index = tree.list.indexOf( min_tree.name )
    let max_elem_index = tree.list.indexOf( max_tree.name )
    
    let min_dom_elem = document.getElementById( min_tree.full_name )
    let max_dom_elem = document.getElementById( max_tree.full_name )

    let { left: drag_elem_left } = min_dom_elem.getBoundingClientRect()
    let { right: drag_elem_right } = max_dom_elem.getBoundingClientRect()

    // swap, drag into br, fr
    // not used for cross over eq
    let drag_elem_width = drag_elem_right - drag_elem_left
    
    let { height: drag_clone_height, 
        arrow_direction, 
        mouse_start_y,
        elem_start_y,
    } = this.drag_clone

    // not used
    // this.border.drag_clone_arrow_direction = arrow_direction
    
    if( arrow_direction == 'top')
    {
        // 0 is at top of screen 
        // meaning elem_start_y > mouse_start_y
        // elem_start_y - mouse_start_y > 0
        this.border.drag_clone_mid_offset = elem_start_y - mouse_start_y
    }
    else if( arrow_direction == 'bottom')
    {
        let elem_bot = elem_start_y + drag_clone_height
        // elem_bot - mouse_start_y < 0
        this.border.drag_clone_mid_offset = elem_bot - mouse_start_y
    }
    
    let eq_root = tree.full_name.split("-")[0]
    let eq_elem = document.getElementById(eq_root) 

    let b_eq_elem = eq_elem.getBoundingClientRect()

    let eq_left = b_eq_elem.left
    let eq_right = b_eq_elem.right

    if( eq_left > drag_elem_left 
    && eq_right > drag_elem_left)
    {
        this.border.origin = 'left_eq'
        this.border.eq_left = eq_left
        this.border.eq_right = eq_right
    }
    else if ( eq_left < drag_elem_left 
    && eq_right < drag_elem_left )
    {
        this.border.origin = 'right_eq'
        this.border.eq_left = eq_left
        this.border.eq_right = eq_right
    }

    this.border.mid = ( b_eq_elem.top + b_eq_elem.bottom )/2
    this.border.eq_mid = ( b_eq_elem.top + b_eq_elem.bottom )/2
    this.border.eq_top = b_eq_elem.top
    this.border.eq_bot = b_eq_elem.bottom 

    op.setTree(tree)
    let prev_elem_index = min_elem_index - 1
    let prev_elem_type 
    let prev_elem_full_name = false
    let prev_tree
    if( tree.list[ prev_elem_index ] )
    {
        prev_tree = op.getChild( prev_elem_index ).tree
        prev_elem_type = prev_tree.type
        prev_elem_full_name = prev_tree.full_name
        this.border.prev_elem_type = prev_elem_type
        this.border.prev_elem = prev_tree
    }
    else
    {
        prev_elem_type = null
    }

    op.tree = tree
    let next_elem_index = max_elem_index + 1
    let next_elem_type
    let next_elem_full_name = false
    let next_tree
    if( tree.list[ next_elem_index ])
    {
        next_tree = op.getChild( next_elem_index ).tree
        next_elem_type = next_tree.type
        next_elem_full_name = next_tree.full_name    
        this.border.next_elem_type = next_elem_type    
        this.border.next_elem = next_tree
    }
    else
    {
        next_elem_type = null
    }   

    if( prev_elem_full_name )
    {
        let drag_prev = document.getElementById(prev_elem_full_name + "-border" )
        let { left: prev_elem_left, right: prev_elem_right 
            , width: prev_elem_width } = drag_prev.getBoundingClientRect()

        if( prev_elem_type == 'br')
        {
            // this.border.prev_bracket_right = prev_elem_right

            // if( drag_elem_width < prev_elem_width / 2 )
            // {
            //     this.border.prev_bracket_left = prev_elem_left + drag_elem_width
            // }
            // else
            // {
            //     this.border.prev_bracket_left = (prev_elem_left + prev_elem_right) / 2
            // }
            if( this.border.origin == 'left_eq')
            {
                this.border.prev_bracket_right = drag_elem_right - drag_elem_width /2 - prev_elem_width / 2
                this.border.prev_bracket_left = drag_elem_right - drag_elem_width/2 - prev_elem_width 
            }
            else if ( this.border.origin == 'right_eq')
            {
                this.border.prev_bracket_right = prev_elem_left + drag_elem_width /2 + prev_elem_width / 2
                this.border.prev_bracket_left = prev_elem_left + drag_elem_width /2 
            }
        }
        else if( prev_elem_type == 'fr')
        {
            if( this.border.origin == 'left_eq')
            {
                let top = prev_tree['top_1']
                let i = top[ top.list[0] ]
                if( top.list.length == 1 
                && i.props.text == '1' )
                {
                    // 1/c * [a] => [a]/c
                    this.border.prev_fr_right = drag_elem_right - ( drag_elem_width / 2 + prev_elem_width /5 )  
                }
                else
                {
                    this.border.prev_fr_right = prev_elem_right
                }
            }
            else if ( this.border.origin == 'right_eq')
            {
                let top = prev_tree['top_1']
                let i = top[ top.list[0] ]
                if( top.list.length == 1 
                && i.props.text == '1' )
                {
                    this.border.prev_fr_right = prev_elem_left + drag_elem_width / 2 + prev_elem_width /2
                }
                else
                {
                    this.border.prev_fr_right = prev_elem_right
                }
            }
        }
        else
        {
            if( this.border.origin == 'left_eq')
            {
                this.border.prev_elem_mid = drag_elem_right - ( drag_elem_width / 2 + prev_elem_width )  
                //( prev_elem_right + prev_elem_left ) / 2
            }
            else if ( this.border.origin == 'right_eq')
            {
                this.border.prev_elem_mid = prev_elem_left + drag_elem_width / 2
            }
        }
    }
    else
    {
        this.border.prev_elem_mid = Number.NEGATIVE_INFINITY 
    }

   

    if( next_elem_full_name )
    {
        let drag_next = document.getElementById(next_elem_full_name + "-border")

        let { left: next_elem_left, right: next_elem_right, 
            width: next_elem_width } = drag_next.getBoundingClientRect()

        if( next_elem_type == 'br')
        {
            // this.border.next_bracket_left = next_elem_left

            // if( drag_elem_width < next_elem_width / 2 )
            // {
            //    this.border.next_bracket_right = next_elem_right - drag_elem_width
            // }
            // else
            // {
            //     this.border.next_bracket_right  = (next_elem_left + next_elem_right) /2 
            // }

            if( this.border.origin == 'left_eq')
            {
                this.border.next_bracket_left = next_elem_right - drag_elem_width /2 - next_elem_width / 2
                this.border.next_bracket_right = next_elem_right - drag_elem_width/2
            }
            else if ( this.border.origin == 'right_eq')
            {
                this.border.next_bracket_left = drag_elem_left + drag_elem_width /2 + next_elem_width / 2
                this.border.next_bracket_right = drag_elem_left + drag_elem_width /2 + next_elem_width
            }
        }
        else if( next_elem_type == 'fr')
        {
            if( this.border.origin == 'left_eq')
            {
                let top = next_tree['top_1']
                let i = top[ top.list[0] ]
                if( top.list.length == 1 
                && i.props.text == '1' )
                {
                    this.border.next_fr_left = next_elem_right - drag_elem_width/2 - next_elem_width / 2
                }
                else
                {
                    this.border.next_fr_left = next_elem_left
                }
            }
            else if ( this.border.origin == 'right_eq')
            {
                let top = next_tree['top_1']
                let i = top[ top.list[0] ]
                if( top.list.length == 1 
                && i.props.text == '1' )
                {
                    this.border.next_fr_left = drag_elem_left + drag_elem_width / 2 + next_elem_width /5 
                }
                else
                {
                    this.border.next_fr_left = next_elem_left
                }
            }
        }
        else
        {
            // this.border.next_elem_mid = (next_elem_left + next_elem_right ) / 2
            if( this.border.origin == 'left_eq')
            {
                this.border.next_elem_mid = next_elem_right - drag_elem_width / 2
                //( prev_elem_right + prev_elem_left ) / 2
            }
            else if ( this.border.origin == 'right_eq')
            {
                this.border.next_elem_mid = drag_elem_left + drag_elem_width / 2 + next_elem_width  
            }
        }
    } 
    else
    {
        this.border.next_elem_mid = Number.POSITIVE_INFINITY
    }   

    //Parent Type
    this.border.calculate_eq_borders = false
    let tree_type = tree.type

    // let g_tree_type = tree.parentNode.type 
    if( tree_type == 'bx' 
    //&& ( g_tree_type != 'top' && g_tree_type != 'bot' )
    )
    {
        this.border.parent_type = 'box'
        //eq_1-bx_1
        //1   , 
        
        let eq_tree = op.setTree(tree).getParent(1).tree

        if( eq_tree.type == 'eq' 
        && eq_tree.list.length == 1)
        {
            this.border.calculate_eq_borders = true    
        }
    }
    else if( tree_type == 'top' )
    {
        this.border.parent_type = 'fraction_top'

        let tree_dom = document.getElementById( tree.full_name ) 
        let { left: t_left, right: t_right  } = tree_dom.getBoundingClientRect()
        this.border.parent_left = t_left
        this.border.parent_right = t_right

        let fr = tree.parentNode
        
        // check if got nested grand child fr below
        // [fr]-top|bot-fr
        let fr_bot = fr['bot_1']
        // can have multiple bots?
        // a/ a/b c d/e


        //eq_1-bx_1-fr_1-top_1-bx_1-i_1
        // 3  , 2  , 1 , <== here   
        let eq_tree = op.setTree(tree).getParent(3).tree
        if( eq_tree.name.search('eq_') > -1 
        && eq_tree.list.length == 1)
        {
            this.border.calculate_eq_borders = true    
        }
    }
    else if( tree_type == 'bot')
    {
        this.border.parent_type = 'fraction_bottom'

        let tree_dom = document.getElementById( tree.full_name ) 
        let { left: p_left, right: p_right } = tree_dom.getBoundingClientRect()
        this.border.parent_left = p_left
        this.border.parent_right = p_right
        
        let fr = tree.parentNode
        
        // check if got nested parent fr above
        // fr-top|bot-[fr]
        let p_fr = fr.parentNode 
        if( p_fr.type == 'bot')
        {
            this.border.canFlipToTop = true
            let grand_fr = p_fr.parentNode 
            let fr_top = grand_fr['top_1'] // top 2 levels of fr
            let { bottom: flip_top } = document.getElementById( fr_top.full_name )
                                    .getBoundingClientRect()
    
            
            this.border.fr_top = fr_top
            this.border.flip_top = flip_top
        }

        //eq_1-bx_1-fr_1-bot_1-bx_1-i_1
        // 3  , 2  , 1 , <== here

        let eq_tree = op.setTree(tree).getParent(3).tree
        if( eq_tree.type == 'eq' 
        && eq_tree.list.length == 1)
        {
            this.border.calculate_eq_borders = true    
        }

    }

    //Equation Borders
    
}



// swap_left
/**
 * @this {In}
 */
function check_swap_left()
{
    // move drag elem left
    return ( 
        this.border.prev_elem_type != 'fr' 
    &&  this.drag_x < this.border.prev_elem_mid 
    // && this.drag_y < this.border.mid 
    ) 
       
}

/**
 * @this {In}
 */
function update_swap_left()
{
    let { e_tree_list, tree } = this.getPrevUpdate({clear:true})

    u.move( e_tree_list )
    .left()

    this.setNextUpdate({
        drag_state:'item-in_box',
        e_tree_list
        })

    tree.updateProps()
}

/**
 * @this {In}
 */
function tick_swap_left()
{
    // let { tree, e_tree_list } = this.getPrevUpdate()  

    // for( let e_tree of e_tree_list )
    // {
    //     e_tree.checkDot()
    // }

    // let max_tree = e_tree_list[ e_tree_list.length - 1]

    // let max_index = tree.list.indexOf( max_tree.name )

    // if( max_index + 1 < tree.list.length )
    // {
    //     let d_tree =  op.setTree(tree).getChild( max_index + 1 ).tree
    //     let { type } = d_tree
    //     if( type == 'sym' 
    //     || type == 'num'  
    //     || type == 'br'
    //     || type == 'fr')
    //     {
    //         d_tree.checkDot()
    //     }
    // }

}


/**
 * @this {In}
 */
function check_swap_right()
{
    // move drag elem right
    return ( 
        this.border.next_elem_type != 'fr' 
    && this.drag_x > this.border.next_elem_mid 
    // && this.drag_y < this.border.mid 
    )    
}

/**
 * @this {In}
 */
function update_swap_right()
{
    let { e_tree_list, tree } = this.getPrevUpdate({ clear:true })
    u.move( e_tree_list )
    .right()
    
    this.setNextUpdate({
            drag_state: 'item-in_box',
            e_tree_list
        })

    tree.updateProps()
}


/**
 * @this {In}
 */
function tick_swap_right()
{
    // let { e_tree_list, tree } = this.getPrevUpdate()
    
    
    // for( let e_tree of e_tree_list )
    // {
    //     if( e_tree.checkDot )
    //     {
    //         e_tree.checkDot()
    //     }
    //     else
    //     {
    //         console.log( e_tree )
    //     }
    // }

    // let min_tree = e_tree_list[0]

    // let min_index = tree.list.indexOf( min_tree.name )

    // if( min_index - 1 >= 0 )
    // {
    //     let d_tree =  op.setTree(tree).getChild( min_index - 1 ).tree
    //     if( d_tree.name.search("i_") > -1 )
    //     {
    //         d_tree.checkDot()
    //     }
    // }
}


/**
 * @this {In}
 */
function check_enter_bracket_from_left()
{
    // enter bracket -->>
    return ( this.drag_x > this.border.next_bracket_left
    && this.drag_y + this.border.drag_clone_mid_offset
    < this.border.mid )
}


/**
 * @this {In}
 */
function update_enter_bracket_from_left()
{
    // enter bracket -->>
    let { e_tree_list, tree } = this.getPrevUpdate({ clear: true })

    clone.update( obj => {
        obj.action = 'clear_ref_elem'
        obj.ref_elem = []
        return obj
    })
    
    // ==>> enter
    // console.log( e_tree_list )
    u.cut( e_tree_list )
    let br = tree[ tree.list[ u.getCutIndex() ] ]
    
    u.paste()
    .intoBracket( br )
    .at('start')
    
    let bx = br.parentNode
    let isSubBracket 
    if( bx.list.length == 1 
    && bx.type == 'bx'
    && !br.props.sign )
    {
        if ( bx.props.sign == '+' )
        { 
            // a + [c](b + d) 
            // a {+}[c]b +[c]d  
            // create the {+}
            let bx = br[ br.list[0] ]
            bx.props.sign = '+'
            u.removeBracket( br )
            isSubBracket = true
        } 
        else if( !bx.props.sign )
        {
            u.removeBracket( br )
            isSubBracket = true
        }
    }
    else
    {
        br.checkDot()
        isSubBracket = false
    }

    this.skip_set_borders = true

    this.setNextUpdate({
        enter_bracket:'from_left',
        isSubBracket,
        drag_state: u.drag_state, //item-in_bracket 
        e_tree_list: u.e_tree_list
    })

    this.clone.split_clone_list = u.e_tree_list  
    
    tree.updateProps()
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


/**
 * @this {In}
 */
function check_enter_bracket_from_right()
{
    // enter bracket <<--
    return ( this.drag_x < this.border.prev_bracket_right 
        && this.drag_y + this.border.drag_clone_mid_offset
        < this.border.mid )
}


/**
 * @this {In}
 */
function update_enter_bracket_from_right()
{
    let { e_tree_list, tree } = this.getPrevUpdate({ clear: true })

    clone.update( (obj) => {
        obj.action = 'clear_ref_elem'
        obj.ref_elem = []
        return obj
    })
    // ==>> enter
    
    u.cut( e_tree_list )
    // special case of 
    // ={X}(a+b)
    // because after cut it becomes
    // = a+b 

    let br = tree[ tree.list[ u.getCutIndex() - 1 ] ]

    u.paste()
    .intoBracket( br )
    .at('start')

    let bx = br.parentNode
    let isSubBracket
    if( bx.list.length == 1 
    &&  bx.type == 'bx'
    && !br.props.sign )
    {
        if ( bx.props.sign == '+' )
        { 
            // a + [c](b + d) 
            // a {+}[c]b +[c]d  
            // create the {+}
            let bx = br[ br.list[0] ]
            bx.props.sign = '+'
            u.removeBracket( br )
            isSubBracket = true
        } 
        else if( !bx.props.sign )
        {
            u.removeBracket( br )
            isSubBracket = true
        }
    }
    else
    {
        br.checkDot()
        isSubBracket = false
    }

    this.setNextUpdate({
        enter_bracket: 'from_right',
        isSubBracket,
        drag_state: u.drag_state,
        e_tree_list: u.e_tree_list
    })

    this.clone.split_clone_list = u.e_tree_list
    this.skip_set_borders = true

    tree.updateProps()
    
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

/**
 * @this {In}
 */
function check_right_top_to_left_bottom()
{
    // console.log( "check_right_top_to_left_bottom")
    // console.log( this.border.parent_type )
    // console.log( this.border.calculate_eq_borders )
    // console.log( this.drag_x + "<" + this.border.eq_left )
    // console.log( this.border.origin )
    // console.log( this.drag_y + ">" + this.border.mid )

    return ( ( this.border.parent_type == 'fraction_top' 
            || this.border.parent_type == 'box' )
        && this.border.calculate_eq_borders
        && this.drag_x < this.border.eq_left  
        && this.border.origin == 'right_eq' 
        && this.drag_y + this.border.drag_clone_mid_offset
        > this.border.mid )
}

/**
 * @this {In}
 */
function update_right_top_to_left_bottom()
{
    update_fraction_top_to_bottom_sy.apply(this)  
}

function tick_right_top_to_left_bottom()
{

}

/**
 * @this {In}
 */
function check_left_top_to_right_bottom()
{
    
    return ( ( this.border.parent_type == 'fraction_top' 
            || this.border.parent_type == 'box' )
        && this.border.calculate_eq_borders
        && this.drag_x > this.border.eq_right  
        && this.border.origin == 'left_eq' 
        && this.drag_y + this.border.drag_clone_mid_offset 
            > this.border.mid )
}

/**
 * @this {In}
 */
function update_left_top_to_right_bottom()
{
    update_fraction_top_to_bottom_sy.apply(this)
}

function tick_left_top_to_right_bottom()
{

}


/**
 * @this {In}
 */
function check_left_bottom_to_right_top()
{
    // console.log("left bot to right top")
    // console.log( this.border.parent_type )
    // console.log( this.border.calculate_eq_borders )
    // console.log( this.drag_x + ">" + this.border.eq_right )
    // console.log( this.border.origin )
    // console.log( this.drag_y + "<" + this.border.mid )
    return ( this.border.parent_type == 'fraction_bottom' 
        && this.border.calculate_eq_borders
        && this.drag_x > this.border.eq_right  
        && this.border.origin == 'left_eq' 
        && this.drag_y + this.border.drag_clone_mid_offset
        < this.border.eq_bot )

}


/**
 * @this {In}
 */
function update_left_bottom_to_right_top()
{  
    update_fraction_bottom_to_top_sy.apply(this)   
}

function tick_left_bottom_to_right_top()
{

}


/**
 * @this {In}
 */
function check_right_bottom_to_left_top()
{
    return ( this.border.parent_type == 'fraction_bottom' 
        && this.border.calculate_eq_borders
        && this.drag_x < this.border.eq_left  
        && this.border.origin == 'right_eq' 
        && this.drag_y + this.border.drag_clone_mid_offset
        < this.border.eq_bot )
}


/**
 * @this {In}
 */
function update_right_bottom_to_left_top()
{
    update_fraction_bottom_to_top_sy.apply( this )
}

function tick_right_bottom_to_left_top()
{

}


/**
 * @this {In}
 */
function update_fraction_bottom_to_top_sy()
{
    //[?]/a{D = item} = [?]
    let { e_tree_list, tree: start_tree } = 
            this.getPrevUpdate({clear:true})

    let { origin } = this.border

    let eq //right_tree
    if( origin == 'left_eq')
    {
        //go to right
        eq = op.setTree(start_tree)
         .getPrevPrefix('f_').getChild(1).tree 
    
    }
    else if( origin == 'right_eq')
    {
        //go to left
        eq = op.setTree(start_tree)
        .getPrevPrefix('f_').getChild(0).tree 
    }

    // left 
    // - 0 item
    // - 1 item
    //     - is item
    //     - is fraction
    // - >1 item

    if( eq.list.length == 0)
    {
        console.log( '[?]/a{D} = 0' )

        u.cut( e_tree_list )

        this.setNextUpdate({
            e_tree_list: [eq],
            drag_state: 'item-in_zero',
            enter_zero: 'from_bottom_to_top'
        })

        start_tree.updateProps()
    }
    else if( eq.list.length > 1)
    {
        console.log( '[?]/a{D} = b + c')

        if( origin == 'right_eq')
        {
            //go to left
            u.cut( e_tree_list )
            .paste()
            .into( eq )
            .at( 'end' )
        }
        else if( origin == 'left_eq')
        {
            //go to right
            u.cut( e_tree_list )
            .paste()
            .into( eq )
            .at( 'start' )
        }

        this.setNextUpdate({
            e_tree_list: u.e_tree_list,
            drag_state: u.drag_state
        })

        start_tree.updateProps()
        eq.updateProps()
    }
    else if( eq.list.length == 1)
    {
        let bx = eq[ eq.list[0] ]
        
        console.log( '[?]/a{D} = b' )

        if( origin == 'left_eq')
        {
            //go to right
            u.cut( e_tree_list )
            .paste()
            .into( bx )
            .at( 'start' )
            
            let second_i = bx[ bx.list[1] ]
            second_i.checkDot()
        }
        else if( origin == 'right_eq' )
        {
            //go to left
            u.cut( e_tree_list )
            .paste()
            .into( bx )
            .at('end')
            
            let last_i = bx[ bx.list[ bx.list.length - 1]]
            last_i.checkDot()
        }

        this.setNextUpdate({
            e_tree_list: u.e_tree_list,
            drag_state: u.drag_state
        })

        start_tree.updateProps()
        bx.updateProps()
    }
}


/**
 * @this {In}
 */
function update_fraction_top_to_bottom_sy()
{

    //[?] = {D}a/b
    /**
     * @type {Object} <.> in: [?] = < {D}a/b >
     */

    let { e_tree_list, tree: start_tree } = this.getPrevUpdate() 
    // f_1-eq_2-bx_1-fr_1-top_1

    
    /**
     * @type {Object} <.> in: < [?] > = {D}a/b
     */
    let eq
    let { origin } = this.border 
    
    if( origin == 'left_eq' )
    {
        //go to right
        eq = op.setTree(start_tree)
        .getPrevPrefix('f_').getChild(1).tree 
    }
    else if( origin == 'right_eq' )
    {
        //go to left
        eq = op.setTree(start_tree)
        .getPrevPrefix('f_').getChild(0).tree 
    }
    // right case tree:
    // right side(cut side) 
    // 1. drag item
    // 2. pasted_tree_name


    // left case tree:
    // left side(paste side) has 
    // 1. 0 item
    // 2. 1 item
    //     - is item
    //     - is fraction
    // 3. more than 1 item

    if( eq.list.length == 0)
    {
        console.log( '0 = {X}a/b' )

        u.cut( e_tree_list )
       
        this.setNextUpdate({
            e_tree_list: [eq],
            drag_state: 'item-in_zero',
            enter_zero: 'from_top_to_bottom'
        })

        start_tree.updateProps()
        eq.updateProps()
    }
    else if( eq.list.length > 1)
    {
        
        console.log( 'c+d = {X}a/b or {X}(a+b)')
        // case
        //  (a + b) = cd 
        //  (a + b) / {c} = d

        let pasted_tree = u.getPastedTree()

        let cut_tree_list = pasted_tree || e_tree_list       

        u.cut( cut_tree_list )
         .paste()
         .under( eq )
        
        this.setNextUpdate({
                e_tree_list: u.e_tree_list,
                drag_state: u.drag_state
            })

        eq.updateProps()
        start_tree.updateProps()      

    }
    else if( eq.list.length == 1 )
    {

        //copy to in_zero.js
        let bx = eq[ eq.list[0] ]
        let i = bx[ bx.list[0] ]        
       
        let { type } = i
        // eq-bx-i-(br|sym|num|fr-top-bx-i)
        if( type == 'fr' )
        {
            console.log( 'c/d = {X}a/b or {X}(a+b)' )
            let fr = i
            let bot = i['bot_1']

            let get_pasted_tree = u.getPastedTree()
            let cut_tree_list = get_pasted_tree || e_tree_list
            
            if( origin == 'left_eq')
            {
                // go to right
                u.cut( cut_tree_list )
                .paste()
                .into( bot )
                .at('start')
            }
            else if( origin == 'right_eq')
            {
                // go to left
                u.cut( cut_tree_list )
                .paste()
                .into( bot )
                .at('end')
            }

            this.setNextUpdate({
                e_tree_list: u.e_tree_list,
                drag_state: u.drag_state
                })

            eq.updateProps()
            start_tree.updateProps()      

        }
        else 
        {   
            console.log( 'c = {X}a/b or {X}(a+b)' )     

            let pasted_tree = u.getPastedTree()
            let cut_tree_list = pasted_tree || e_tree_list

            u.cut( cut_tree_list )
             .paste()
             .under( eq )

            this.setNextUpdate({
                e_tree_list: u.e_tree_list,
                drag_state: u.drag_state
            })
            
            eq.updateProps()
            start_tree.updateProps()      
            
        }
    }
}


/**
 * @this {In}
 */
function check_exit_fr_top_from_left()
{
    return ( this.border.parent_type == 'fraction_top' 
    && this.drag_x < this.border.parent_left  
    && this.drag_y + this.border.drag_clone_mid_offset
    < this.border.mid )
}


/**
 * @this {In}
 */
function update_exit_fr_top_from_left()
{
    let { e_tree_list, tree } = this.getPrevUpdate({clear:true})
    u.cut(e_tree_list)
    
    let fr = tree.parentNode
    let bx = fr.parentNode

    let index = bx.list.indexOf( fr.name )

    u.paste()
    .into( bx)
    .at( index )
    bx.updateProps()
    fr.checkDot()

    this.setNextUpdate({
        drag_state: "item-in_box", //item-in_bracket 
        e_tree_list
    })
}

function tick_exit_fr_top_from_left()
{

}

/**
 * @this {In}
 */
function check_exit_fr_top_from_right()
{
    return ( this.border.parent_type == 'fraction_top' 
    && this.drag_x > this.border.parent_right  
    && this.drag_y + this.border.drag_clone_mid_offset 
    < this.border.mid )
}

/**
 * @this {In}
 */
function update_exit_fr_top_from_right()
{
    let { e_tree_list, tree } = this.getPrevUpdate({clear:true})
    u.cut(e_tree_list)
    
    let fr = tree.parentNode
    let bx = fr.parentNode

    let index = bx.list.indexOf( fr.name )
    index++

    u.paste()
    .into( bx)
    .at( index )

    bx.updateProps()
    fr.checkDot()

    this.setNextUpdate({
        drag_state: "item-in_box", //item-in_bracket 
        e_tree_list
    })
}

function tick_exit_fr_top_from_right()
{

}

/**
 * @this {In}
 */
function check_enter_fr_top_from_left()
{
    // move drag elem left
    return (
       this.border.prev_elem_type == 'fr'
    && this.drag_x < this.border.prev_fr_right 
    && this.drag_y + this.border.drag_clone_mid_offset 
    < this.border.mid // above mid
    )
}

/**
 * @this {In}
 */
function update_enter_fr_top_from_left()
{
    let { e_tree_list, tree } = this.getPrevUpdate({clear:true})
    let { prev_elem: fr} = this.border

    let top = fr['top_1']

    u.cut(e_tree_list)

    u.paste()
    .into( top )
    .at('end')

    top.updateProps()
    tree.updateProps()

    this.setNextUpdate({
        drag_state: "item-in_box", //item-in_bracket 
        e_tree_list
    })

}

function tick_enter_fr_top_from_left()
{

}

/**
 * @this {In}
 */
function check_enter_fr_top_from_right()
{
    // move drag elem right
    // console.log( this.border.next_elem_type, "==fr")
    // console.log( this.drag_x, ">", this.border.next_fr_left )
    // console.log( this.drag_y, ">=", this.border.mid )
    return (
        this.border.next_elem_type == 'fr'
        && this.drag_x > this.border.next_fr_left
        && this.drag_y + this.border.drag_clone_mid_offset 
        < this.border.mid //above mid
    )
}

/**
 * @this {In}
 */
function update_enter_fr_top_from_right()
{
    let { e_tree_list, tree } = this.getPrevUpdate({clear:true})
    let { next_elem: fr} = this.border

    let top = fr['top_1']

    u.cut(e_tree_list)

    u.paste()
    .into( top )
    .at('start')

    top.updateProps()
    tree.updateProps()

    this.setNextUpdate({
        drag_state: "item-in_box", //item-in_bracket 
        e_tree_list
    })
}

function tick_enter_fr_top_from_right()
{

}

/**
 * @this {In}
 */
function check_flip_from_fr_bot_to_top()
{
    return ( this.border.canFlipToTop 
    && this.border.parent_type == 'fraction_bottom'
    && this.border.parent_left < this.drag_x 
    && this.drag_x < this.border.parent_right
    && this.drag_y + this.border.drag_clone_mid_offset
    < this.border.flip_top )
}

/**
 * @this {In}
 */
function update_flip_from_fr_bot_to_top()
{
    let { e_tree_list, tree } = this.getPrevUpdate({clear:true})
    let { fr_top } = this.border
    
    u.cut( e_tree_list )

    u.paste()
    .into( fr_top )
    .at('start')

    fr_top.updateProps()
    tree.updateProps()

    this.setNextUpdate({
        drag_state: "item-in_box", //item-in_bracket 
        e_tree_list
    })

}

function tick_flip_from_fr_bot_to_top()
{

}

function check_flip_from_fr_top_to_bottom()
{

}

function update_flip_from_fr_top_to_bottom()
{

}

function tick_flip_from_fr_top_to_bottom()
{

}