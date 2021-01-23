import { clone } from '../../../clone_stores.js.js'
import { op } from '../../../xTree.js.js' 
import { u } from '../../../utils/ui'
import { In } from '../../../interactionion'
//item-in_box

export let in_zero = [
    {
        name:'set_in_box_borders',
        set_state_borders: set_item_borders
    },
    {
        name:'cross_below_equal_sign-right_top_to_left_bottom',
        check: check_right_top_to_left_bottom,
        update_tree: update_right_top_to_left_bottom,
        svelte_tick: tick_right_top_to_left_bottom,
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
        name:'cross_below_equal_sign-right_top_to_left_bottom',
        check: check_left_bottom_to_right_top,
        update_tree: update_left_bottom_to_right_top,
        svelte_tick: tick_left_bottom_to_right_top,
        next_state:'item-in_box' // or fraction_bottom
    }]
/**
 * @this {In}
 */
function set_item_borders()
{
    let { e_tree_list, e_tree_list:[e_tree], enter_zero } = this.getPrevUpdate()
    let dom_elem = document.getElementById( e_tree.full_name )
    let zero_box = dom_elem.getElementsByClassName('box')[0]
    let { top, left } = zero_box.getBoundingClientRect()

    if( enter_zero == 'from_bottom_to_top')
    {
        this.border.direction = "top_to_bottom"
    }
    else if( enter_zero == 'from_top_to_bottom')
    {
        this.border.direction = 'bottom_to_top'
    }

    this.border['top'] = top
    let eq_tree = e_tree
    // special case:
    // e_tree=tree = f_1-eq_2
    let eq_root = eq_tree.full_name.split("-")[0]
    
    let eq_elem = document.getElementById(eq_root) 
    //To do: make more general for multiple equations
    let {left: eq_left, right: eq_right } = eq_elem.getBoundingClientRect()

    
    if( eq_left > left && eq_right > left)
    {
        this.border.origin = 'left_eq'
        this.border.eq_left = eq_left
        this.border.eq_right = eq_right
    }
    else if ( eq_left < left && eq_right < left )
    {
        this.border.origin = 'right_eq'
        this.border.eq_left = eq_left
        this.border.eq_right = eq_right
    }
}

/**
 * @this {In}
 */
function check_right_top_to_left_bottom()
{
    return ( this.border.direction == "top_to_bottom"
        && this.drag_x < this.border.eq_left  
        && this.border.origin == 'right_eq' 
        && this.drag_y > this.border.top )
}

/**
 * @this {In}
 */
function update_right_top_to_left_bottom()
{
    update_top_to_bottom.apply(this)    //symmetry left, right    
}

function tick_right_top_to_left_bottom()
{
    
}

/**
 * @this {In}
 */
function check_right_bottom_to_left_top()
{
    return ( this.border.direction == "bottom_to_top"
        && this.drag_x < this.border.eq_left  
        && this.border.origin == 'right_eq' 
        && this.drag_y < this.border.top )
}

/**
 * @this {In}
 */
function update_right_bottom_to_left_top()
{
    update_bottom_to_top.apply(this)    //symmetry left, right    
}

function tick_right_bottom_to_left_top()
{
    
}

/**
 * @this {In}
 */
function check_left_top_to_right_bottom()
{
    return ( this.border.direction == 'top_to_bottom' 
        && this.drag_x > this.border.eq_right  
        && this.border.origin == 'left_eq' 
        && this.drag_y > this.border.top )
}

/**
 * @this {In}
 */
function update_left_top_to_right_bottom()
{
    update_top_to_bottom.apply(this)    //symmetry left, right
}

function tick_left_top_to_right_bottom()
{
    
}

/**
 * @this {In}
 */
function check_left_bottom_to_right_top()
{
    return ( this.border.direction == 'bottom_to_top' 
        && this.drag_x > this.border.eq_right  
        && this.border.origin == 'left_eq' 
        && this.drag_y < this.border.top )
}

/**
 * @this {In}
 */
function update_left_bottom_to_right_top()
{
    update_bottom_to_top.apply(this)    //symmetry left, right
}

function tick_left_bottom_to_right_top()
{
    
}


/**
 * @this {In}
 */
function update_top_to_bottom()
{
    let { e_tree_list: [start_tree] } = this.getPrevUpdate()

    let { origin } = this.border 
    let eq
    if( origin == 'left_eq' )
    {
        //des is right side
        eq = op.setTree(start_tree)
        .getPrevPrefix('f_').getChild(1).tree 
    }
    else if( origin == 'right_eq')
    {
        //des is left side
        eq = op.setTree(start_tree)
        .getPrevPrefix('f_').getChild(0).tree 
    }
    
    // let { 
    //     box_tree: des_box_tree,
    //     item_tree: des_item_tree, 
    //     index: des_item_index,
    //     item_name: des_item_name } = u.getNonSignItem( des_tree )

    let bx = eq[ eq.list[0] ]
    let i = bx[ bx.list[0] ]
    let { type } = i

    if( type == 'sym'
    || type == 'num'
    || type == 'br')
    {   
        console.log( 'c = {X}0' )     
        // refactor_5
        u.paste()
        .under( bx )       

        this.setNextUpdate({
                e_tree_list: u.e_tree_list,
                drag_state: u.drag_state
            })
        
        eq.updateProps()
    }
    else if( type == "fr" )
    {
        if( bx.props.sign )
        {
            console.log( '+c/d = {X}0' )
        }
        else
        {
            console.log( 'c/d = {X}0' )
        }

        let fr = i
        let bot = fr['bot_1']

        if( origin == 'right_eq')
        {
            //paste into left
            u.paste()
            .into( bot )
            .at( 'end' )
        }
        else if( origin == 'left_eq')
        {
            // paste into right
            u.paste()
            .into( bot )
            .at( 'start' )
        }

        this.setNextUpdate({
                e_tree_list: u.e_tree_list,
                drag_state: u.drag_state
            })
        
        eq.updateProps()               
    }
}

/**
 * @this {In}
 */
function update_bottom_to_top()
{
    let { e_tree_list:[ start_tree ] } = this.getPrevUpdate()

    let { origin } = this.border 
    let eq
    if( origin == 'left_eq' )
    {
        //des is right side
        eq = op.setTree(start_tree)
        .getPrevPrefix('f_').getChild(1).tree 
    }
    else if( origin == 'right_eq')
    {
        //des is left side
        eq = op.setTree(start_tree)
        .getPrevPrefix('f_').getChild(0).tree 
    }

    // let { 
    //     box_tree: des_box_tree,
    //     item_tree: des_item_tree, 
    //     index: des_item_index,
    //     item_name: des_item_name } = u.getNonSignItem( des_tree )

    let bx = eq[ eq.list[0] ]
    let i = bx[ bx.list[0] ] 
    let { type } = i

    if( type == 'sym'
    || type == 'num'
    || type == 'br')
    {   
        console.log( 'c = 0/{X}' )     
        // refactor_5
        

        if( origin == 'right_eq')
        {
            // paste into left
            u.paste()
            .into( bx ) //left
            .at( 'end' ) 
        }
        else if( origin == 'left_eq')
        {
            //paste into right
            u.paste()
            .into( bx ) 
            .at( 'start' ) 
        }
        
        this.setNextUpdate({
                e_tree_list: u.e_tree_list,
                drag_state: u.drag_state
            })
        
        eq.updateProps()
    }
    else if( type == "fr" )
    {
        if( bx.props.sign )
        {
            console.log( '+c/d = 0/{X}' )
        }
        else
        {
            console.log( 'c/d = 0/{X}' )
        }

        let fr = i
        let top = fr['top_1']

        if( origin == 'right_eq')
        {
            //paste into left
            u.paste()
            .into( top ) 
            .at( 'end' ) 
        }
        else if( origin == 'left_eq')
        {
            //paste into right
            u.paste()
            .into( top ) 
            .at( 'start' ) 
        }
  
        this.setNextUpdate({
                e_tree_list: u.e_tree_list,
                drag_state: u.drag_state
            })

        top.updateProps()               
    }
}
