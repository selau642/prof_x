// import { clone_obj } from '../../clone_stores.js'
import { op } from '../../../xTree.js.js'
import { u } from '../../../utils/ui'
import { In } from '../../../interactionion'

//fraction-in_fraction


export let b_in_fraction =    [
    {
        name: "set_state_borders",
        set_state_borders: set_fraction_bottom_borders
    },
    {
        name: "cross_above_equal_sign-left_to_right",
        check: check_left_to_right,
        update_tree: update_left_to_right,
        svelte_tick: tick_left_to_right,
        next_state: "item-in_box"
    }
    ,
    {
        name: "cross_above_equal_sign-right_to_left",
        check: check_right_to_left,
        update_tree: update_right_to_left,
        svelte_tick: tick_right_to_left,
        next_state: "fraction_bottom-cross_equal_sign" // top_fraction || box || item  
    }
    // ,
    // {
    //     name: "multiply_left",
    //     next_state: "bottom_fraction"
    // }, 
    // {
    //     name: "multiply_right",
    //     next_state: "bottom_fraction"
    // },
    // {
    //     name: "multiply_up_frac_line", // 2 layers up
    //     next_state: "top_fraction"
    // }
]



/**
 * @this {In}
 */
function set_fraction_bottom_borders()
{
    let { e_tree_list, e_tree_list:[e_tree], tree } = this.getPrevUpdate()

    let dom_elem = document.getElementById( e_tree.full_name )
    let { left, right } = dom_elem.getBoundingClientRect()

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
    

    
    //#set_var:{
        //#des: 'for multiply left, multiply right',
        //#left:{

    let box_tree = op.setTree(tree).getPrevPrefix('bx').tree
    let box_parent_tree = box_tree.parentNode
    let box_index = box_parent_tree.list.indexOf( box_tree.name )

    let prev_elem_index = box_index - 1
    // let prev_elem_type 
    // let prev_elem_full_name = false
    if( box_parent_tree.list[ prev_elem_index ] )
    {
        // let prev_tree = op.getChild( prev_elem_index ).tree
        // prev_elem_type = prev_tree.props.type
        // prev_elem_full_name = prev_tree.full_name
        this.border.left  = left
    }
    else
    {
        this.border.left = Number.NEGATIVE_INFINITY
        // prev_elem_type = null
    }
    //#},

    //#right:{
    op.tree = tree
    let next_elem_index = box_index + 1
    // let next_elem_type
    // let next_elem_full_name = false
    if( box_parent_tree.list[ next_elem_index ])
    {
        this.border.right = right
        // let next_tree = op.getChild( next_elem_index ).tree
        // next_elem_type = next_tree.props.type
        // next_elem_full_name = next_tree.full_name        
    }
    else
    {
        this.border.right = Number.POSITIVE_INFINITY
        // next_elem_type = null
    }
        //#}

    //#}

    //Equation Borders

    let eq_root = tree.full_name.split("-")[0]
    let eq_elem = document.getElementById(eq_root) 
    //To do: make more general for multiple equations
    let b_eq_elem = eq_elem.getBoundingClientRect()
    
    let eq_left = b_eq_elem.left
    let eq_right = b_eq_elem.right

    if( eq_left > left )
    {
        this.border.origin = 'left_eq'
        this.border.eq_left = eq_left
        this.border.eq_right = eq_right
    }
    else if ( eq_left < left )
    {
        this.border.origin = 'right_eq'
        this.border.eq_left = eq_left
        this.border.eq_right = eq_right
    }

    this.border.mid = ( b_eq_elem.top + b_eq_elem.bottom ) / 2
}
/**
 * @this {In}
 */
function check_left_to_right()
{
    return ( this.drag_x > this.border.eq_right  
        && this.border.origin == 'left_eq' 
        && this.drag_y + this.border.drag_clone_mid_offset
         < this.border.mid )
}
/**
 * @this {In}
 */
function update_left_to_right()
{
    update_bottom_sy.apply(this)        
}

function tick_left_to_right()
{

}
/**
 * @this {In}
 */
function check_right_to_left()
{
    let test = ( this.drag_x < this.border.eq_left  
        && this.border.origin == 'right_eq' 
        && this.drag_y + this.border.drag_clone_mid_offset
        < this.border.mid )
    return test
}
/**
 * @this {In}
 */
function update_right_to_left()
{
    update_bottom_sy.apply(this)
}

function tick_right_to_left()
{

}
/**
 * @this {In}
 */
function update_bottom_sy()
{
    let { e_tree_list, 
        e_tree_list:[e_tree], tree } = this.getPrevUpdate({clear:true})
    
    let start_tree = tree

    let { origin } = this.border 
    //start_tree == fraction
    let start_p_tree = start_tree.parentNode
    
    let eq
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
    

    if( eq.list.length == 0 )
    {
        console.log( '[?]/{X} = 0')
        u.cut( e_tree_list )

        this.setNextUpdate({
            e_tree_list: [ eq ],
            drag_state: 'item-in_zero',
            enter_zero: 'from_bottom_to_top'
        })


        start_p_tree.updateProps()
    }
    else if( eq.list.length > 1)
    {
        console.log("[?]/{X} = a + b + [...]")
        
        if( origin == 'left_eq')
        {
            //go to right
            u.cut( e_tree_list )
            .paste()
            .into( eq )
            .at('start')
            .savePastedTree()
        }
        else if( origin == 'right_eq')
        {
            //go to left
            u.cut( e_tree_list )
            .paste()
            .into( eq )
            .at('end')
            .savePastedTree()
        }

        this.setNextUpdate({
            e_tree_list: u.e_tree_list,
            drag_state: u.drag_state
        })

        if( u.transfer_fraction_top )
        {
            //case (a+b)/{D} , a+b will be transfered out
            start_p_tree.parentNode.updateProps()
        }
        else
        {
            start_p_tree.updateProps()
        }
        eq.updateProps()
        
    }
    else if( eq.list.length == 1)
    {      
        
        let bx = eq[ eq.list[0] ]
        let i = bx[ bx.list[0] ]
        let { type } = i
        if( type == 'sym'
        || type == 'num' 
        || type == 'br'
        || type == 'fr' )
        {
            console.log( '[?]/{D} = a' )

            if( origin == 'left_eq')
            {
                //go to right

                u.cut( e_tree_list )
                .paste()
                .into( bx )
                .at('start')
                .savePastedTree()
            }
            else if( origin == 'right_eq')
            {
                //go to left
                u.cut( e_tree_list )
                .paste()
                .into( bx )
                .at('end')
                .savePastedTree()
            }

            this.setNextUpdate({
                    e_tree_list: u.e_tree_list,
                    drag_state: u.drag_state
                })
            
            eq.updateProps()
            if( u.transfer_fraction_top )
            {
                //case (a+b)/{D} , a+b will be transfered out
                start_p_tree.parentNode.updateProps()
            }
            else
            {
                start_p_tree.updateProps()
            }
        }
        // else if( type == 'fr' )
        // {
        //     if( bx.props.sign )
        //     {
        //         console.log( '[?]/{D} = +a/b')
        //     }
        //     else
        //     {
        //         console.log( '[?]/{D} = a/b' )
        //     }

        //     let fr = i
        //     let top = fr['top_1']
            
        //     if( origin == 'left_eq')
        //     {
        //         u.cut( e_tree_list )
        //         .paste()
        //         .into( top )
        //         .at('start')
        //         .savePastedTree()
        //         // this.global.elem_index = 0
        //     }
        //     else if( origin == 'right_eq')
        //     {
        //         u.cut( e_tree_list )
        //         .paste()
        //         .into( top )
        //         .at('end')
        //         .savePastedTree()
                
        //         // let last_index = des_top_tree.list.length - 1
        //         // this.global.elem_index = last_index 
        //     }

        //     this.setNextUpdate({
        //         e_tree_list: u.e_tree_list,
        //         drag_state: u.drag_state
        //     })

        //     if( u.transfer_fraction_top )
        //     {
        //         //case (a+b)/{D} , a+b will be transfered out
        //         start_p_tree.parentNode.updateProps()
        //     }
        //     else
        //     {
        //         start_p_tree.updateProps()
        //     }
            
        //     eq.updateProps()
        // }
    }
}