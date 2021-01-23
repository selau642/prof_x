import { op } from "../../../xTreeree"
import { u } from '../../../utils/ui.js'
import { In } from "../../../interactionion"

export let t_in_fraction = [
    {
        name: "set_state_borders",
        set_state_borders: set_fraction_top_borders
    },
    {
        name: "cross_below_equal_sign-right_to_left",
        check: check_right_to_left,
        update_tree: update_right_to_left,
        svelte_tick: tick_right_to_left,
        next_state: "item-in_box" // top_fraction || box || item  
    },
    {
        name: "cross_below_equal_sign-left_to_right",
        check: check_left_to_right,
        update_tree: update_left_to_right,
        svelte_tick: tick_left_to_right,
        next_state: "item-in_box" // top_fraction || box || item
    },
    {
        name:'exit_fr_from_left',
        check: check_exit_fr_from_left,
        update_tree: update_exit_fr_from_left,
        svelte_tick: tick_exit_fr_from_left,
        next_state: 'item-in_box'
    },
    {
        name:'exit_fr_from_right',
        check: check_exit_fr_from_right,
        update_tree: update_exit_fr_from_right,
        svelte_tick: tick_exit_fr_from_right,
        next_state: 'item-in_box'
    },
]

/**
 * @this {In}
 */
function set_fraction_top_borders()
{
    let { e_tree_list:[e_tree], tree } = this.getPrevUpdate()
    let dom_elem = document.getElementById( e_tree.full_name )                        

    let { left, right } = dom_elem.getBoundingClientRect()        

    this.border.left = left
    this.border.right = right
    let top_width = right - left

    let bot = tree['bot_1']
    let bot_dom_elem = document.getElementById( bot.full_name + '-border' )
    let { left: bot_left, right: bot_right } = bot_dom_elem.getBoundingClientRect()
    this.border.bot_left = bot_left
    this.border.bot_right = bot_right 
    let bot_width = bot_right - bot_left 


    this.border.left_minus = right - top_width/2 - bot_width
    this.border.right_plus = left + top_width/2 + bot_width
    //Equation Borders    

    let eq_root = tree.full_name.split("-")[0]
    let eq_elem = document.getElementById(eq_root) 
    //To do: make more general for multiple equations
    //borders_of_equation_element
    let b_eq_elem = eq_elem.getBoundingClientRect()
    
    let eq_left = b_eq_elem.left
    let eq_right = b_eq_elem.right

    if( eq_left > left )
    {
        this.border.origin = 'left_eq'
        // this.border.eq_left = eq_left
        // this.border.eq_right = eq_right
    }
    else if ( eq_left < left )
    {
        this.border.origin = 'right_eq'
        // this.border.eq_left = eq_left
        // this.border.eq_right = eq_right
    }

    let { height: drag_clone_height, 
        arrow_direction, 
        mouse_start_y,
        elem_start_y,
    } = this.drag_clone

    this.border.drag_clone_arrow_direction = arrow_direction
        
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

    this.border.mid = ( b_eq_elem.bottom + b_eq_elem.top ) / 2
}


/**
 * @this {In}
 */
function check_right_to_left()
{
    let test = ( this.drag_x < this.border.eq_left  
        && this.border.origin == 'right_eq' 
        && this.drag_y + this.border.drag_clone_mid_offset 
        > this.border.mid )

    return test
}


/**
 * @this {In}
 */
function update_right_to_left()
{
    update_top_sy.apply(this)
}

function tick_right_to_left()
{

}


/**
 * @this {In}
 */
function check_left_to_right()
{
    let test = ( this.drag_x > this.border.eq_right  
        && this.border.origin == 'left_eq' 
        && this.drag_y + this.border.drag_clone_mid_offset
        > this.border.mid )

    // console.log( "check_left_to_right: drag_x:", this.drag_x, "drag_y", this.drag_y,
    // "json:", JSON.stringify( this.border ) )

    return test
}


/**
 * @this {In}
 */
function update_left_to_right()
{
    update_top_sy.apply( this )
}

function tick_left_to_right()
{

}


/**
 * @this {In}
 */
function update_top_sy()
{
    // [?] = {D = event_tree} / a
    let { e_tree_list, e_tree_list:[e_tree], 
        tree: start_tree } = this.getPrevUpdate({clear:true})

    let { origin } = this.border
    /**
     * @type {Object} (eq_) <.> in: < [?] > = {D}/a
     */
    
    let eq
    if( origin == 'left_eq')
    {
        //go to right
        eq = op.setTree( start_tree )
            .getPrevPrefix('f_').getChild(1).tree
    }
    else if( origin == 'right_eq')
    {
        //go to left
        eq = op.setTree( start_tree )
            .getPrevPrefix('f_').getChild(0).tree
    }    

    if( eq.list.length == 0 )
    {
        // 0 = {D}/a
        console.log( '0 = {X}/a')

        u.cut( e_tree_list )

        this.setNextUpdate({
            e_tree_list: [eq],
            drag_state: 'item-in_zero',
            enter_zero: 'from_top_to_bottom'
        })

        start_tree.updateProps()
    }
    else if( eq.list.length > 1)
    {
        console.log('b + c +[...] =  {D}/a')

        u.cut( e_tree_list )
        .paste()
        .under(eq)

        this.setNextUpdate({
            drag_state: u.drag_state, //'fraction_bottom-in_fraction'
            e_tree_list: u.e_tree_list
        }) 
        
        start_tree.updateProps()
        eq.updateProps()
        
    }
    else if( eq.list.length == 1)
    {   
        // console.log( '+[?] = {D}/a' )
        
    //    let { 
    //     box_tree: des_box_tree,
    //     item_tree: des_item_tree, 
    //     index: des_item_index,
    //     item_name: des_item_name } = u.getNonSignItem( des_tree )
        let bx = eq[ eq.list[0] ]
        let i = bx[ bx.list[0] ]
        let { type } = i
        // console.log( des_item_tree )
        if( type == 'sym'
        || type == 'num' 
        || type == 'br')
        {
            console.log( 'b = {D}/a' )

            u.cut( e_tree_list )
            .paste()
            .under( eq )
            
            this.setNextUpdate({
                drag_state: u.drag_state,
                e_tree_list: u.e_tree_list
            })

            start_tree.updateProps()
            bx.updateProps()

        }
        else if( type == 'fr' )
        {
            if( bx.props.sign )
            {
                console.log( '+b/c = {D}/a')
            }
            else
            {
                console.log( 'b/c = {D}/a' )
            }

            let fr = i 
            let bot = fr['bot_1']
            
            if( origin == 'right_eq')
            {
                //go to left
                u.cut( e_tree_list )
                .paste()
                .into( bot )
                .at( 'end' )
                .savePastedTree()
            }
            else if( origin == 'left_eq')
            {
                //go to right
                u.cut( e_tree_list )
                .paste()
                .into( bot )
                .at( 'start' )
                .savePastedTree()
            }

            this.setNextUpdate({
                drag_state: u.drag_state,
                e_tree_list: u.e_tree_list
            })

            bot.updateProps()               
            start_tree.updateProps()
        }
    }

    let frac_tree = e_tree.parentNode
    frac_tree.renderFraction()
}

/**
 * @this {In}
 */
function check_exit_fr_from_left()
{

    if( this.drag_y < this.border.mid )
    {
        // console.log( this.border.left, "<=", this.border.bot_left )
        if( this.border.origin == 'left_eq' 
        && this.border.left <= this.border.bot_left 
        )
        {
            // console.log("exit left")
            return ( this.drag_x < this.border.left_minus )            
        }
        else 
        {
            return ( this.drag_x < this.border.left )
        }
    }
    else
    {
        return false
    }
}


/**
 * @this {In}
 */
function update_exit_fr_from_left()
{
    let { e_tree_list, tree } = this.getPrevUpdate({clear:true})
    u.cut(e_tree_list)

    let fr = tree
    let bx = fr.parentNode

    let index = bx.list.indexOf( fr.name )

    u.paste()
    .into( bx)
    .at( index )
    bx.updateProps()
    fr.checkDot()

    this.setNextUpdate({
        drag_state: "item-in_box", //item-in_bracket 
        e_tree_list: u.e_tree_list
    })
}

function tick_exit_fr_from_left()
{

}

/**
 * @this {In}
 */
function check_exit_fr_from_right()
{

    if( this.drag_y < this.border.mid )
    {
        if( this.border.origin == 'right_eq' 
        && this.border.right >= this.border.bot_right 
        )
        {
            return ( this.drag_x > this.border.right_plus )            
        }
        else 
        {
            return ( this.drag_x > this.border.right )
        }
    }
    else
    {
        return false
    }
    
}

/**
 * @this {In}
 */
function update_exit_fr_from_right()
{
    let { e_tree_list, tree } = this.getPrevUpdate({clear:true})
    u.cut(e_tree_list)

    let fr = tree
    let bx = fr.parentNode

    let index = bx.list.indexOf( fr.name )
    index ++

    u.paste()
    .into( bx)
    .at( index )
    bx.updateProps()
    fr.checkDot()

    this.setNextUpdate({
        drag_state: "item-in_box", //item-in_bracket 
        e_tree_list: u.e_tree_list
    })
}

function tick_exit_fr_from_right()
{
    
}