import { clone } from '../../../clone_stores.js.js'
import { op } from '../../../xTree.js.js'
import { u } from '../../../utils/ui.js'
import { In } from '../../../interactionion'


export let box = [
        {
            name:'set_state_borders',
            set_state_borders: set_box_borders
        },
        {
            name:'swap_left',
            check: check_swap_left,
            update_tree: update_swap_left,
            svelte_tick: tick_swap_left
        },
        {
            name:'swap_right',
            check: check_swap_right,
            update_tree: update_swap_right,
            svelte_tick: tick_swap_right
        },
        {
            name:'cross_above_equal_sign-left_to_right',
            check: check_above_left_to_right,
            update_tree: update_above_left_to_right,
            svelte_tick: tick_above_left_to_right
        },
        {
            name:'cross_above_equal_sign-right_to_left',
            check: check_above_right_to_left,
            update_tree: update_above_right_to_left,
            svelte_tick: tick_above_right_to_left
        },
        {
            name:'cross_below_equal_sign-left_to_right',
            check: check_below_left_to_right,
            update_tree: update_below_left_to_right,
            svelte_tick: tick_below_left_to_right
        }
        ,
        {
            name:'cross_below_equal_sign-right_to_left',
            check: check_below_right_to_left,
            update_tree: update_below_right_to_left,
            svelte_tick: tick_below_right_to_left
        }
    ]

/**
 * @this {In}
 */

function set_box_borders()
{
    let { e_tree_list:[ e_tree ], 
         tree: box_parent_tree } = this.getPrevUpdate()
    
    let dom_elem = document.getElementById( e_tree.full_name )
    let { top, bottom, 
    left: drag_elem_left, right: drag_elem_right,
    width: drag_elem_width } = dom_elem.getBoundingClientRect()
    
    
    this.border.top = top
    this.border.mid = ( top + bottom ) / 2
    
    let eq_root = box_parent_tree.full_name.split("-")[0]
    let eq_elem = document.getElementById(eq_root) 
    //To do: make more general for multiple equations
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

    //swap left
    let drag_prev = dom_elem.previousElementSibling
    
    if( drag_prev )
    {
        let { left: prev_elem_left, right: prev_elem_right,
        width: prev_elem_width } = drag_prev.getBoundingClientRect()        
        
        // this.border.prev_elem_mid = ( right + left ) / 2
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
    else
    {
        this.border.prev_elem_mid = Number.NEGATIVE_INFINITY 
    }


    //swap right
    let drag_next = dom_elem.nextElementSibling

    if( drag_next )
    {
        let { left: next_elem_left, right: next_elem_right,
        width: next_elem_width } = drag_next.getBoundingClientRect()	
        // this.border.next_elem_mid = (left + right ) / 2
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
    else
    {
        this.border.next_elem_mid = Number.POSITIVE_INFINITY
    } 

    //set cross over equal sign

    //check if f_1-eq_1-bx_1 

    if( box_parent_tree.type == 'eq' )
    {
        this.border.is_last_box = ( box_parent_tree.list.length == 1 )
    }
}

/**
 * @this {In}
 */
function check_swap_left()
{
    return ( this.drag_x < this.border.prev_elem_mid 
    // && this.drag_y < this.border.top 
    )      
}

/**
 * @this {In}
 */
function update_swap_left()
{   
    let {  e_tree_list, 
        e_tree_list:[ e_tree ], 
        tree } = this.getPrevUpdate({clear:true})

    
    u.move( e_tree_list )
    .left()
    
    let elem_index = tree.list.indexOf( e_tree.name )
    if( elem_index == 0 )
    // && e_tree.props.type == 'box' )
    {
        check_equation_sign.call( this, tree )                        
        check_clone_sign.call( this, elem_index )
    }
    
    this.setNextUpdate({
            drag_state: 'box',
            e_tree_list
        })

    tree.updateProps()
}

function tick_swap_left()
{

}



//# Swap Right


/**
 * @this {In}
 */
function check_swap_right()
{
    return ( this.drag_x > this.border.next_elem_mid 
    //&& this.drag_y < this.border.top 
    )
}

/**
 * @this {In}
 */
function update_swap_right()
{
    let { e_tree_list,
         e_tree_list: [e_tree], 
         tree } = this.getPrevUpdate({clear:true})
    //    let e_tree = e_tree_list[0]
    
    
    u.move( e_tree_list )
    .right()
    //triggers rerendering
    //relative tree position
    //{0} => {drag_elem:1}
    let elem_index = tree.list.indexOf( e_tree.name )
    if( elem_index == 1 )
    // && e_tree.props.type == 'box' )
    {
        check_equation_sign.call( this, tree )                        
        check_clone_sign.call( this, elem_index )
    }

    this.setNextUpdate({
        drag_state: "box",
        e_tree_list
    })

    tree.updateProps()
}

function tick_swap_right()
{

}


// Checking Functions


function check_equation_sign( eq )
{
    //check 1st and 2nd left item of tree
    let eq_length = eq.list.length

    if( eq_length > 0)
    {
        //tree has 1 elem
        let first_elem = eq[ eq.list[0] ]
        let first_cs = change_sign_of_( first_elem )
        
        first_cs
        .if_is("+")
        .changeTo("")
    }

    if( eq_length >= 2)
    {
        let second_elem = eq[ eq.list[1] ]
        let second_cs = change_sign_of_( second_elem )

        second_cs
        .if_is("")
        .changeTo("+")
        .if_is_not("+")
        .and_is_not("-")
        .add("+")
    }
}


function check_clone_sign( drag_elem_position )
{
    let edit_clone = false
    let clone_tree 
    let disable_clone = clone.subscribe( obj => {
        clone_tree = obj.clone_tree
    })

    if( drag_elem_position == 0 )
    {   
        edit_clone = true
        change_sign_of_( clone_tree )
        //.getFirstItemOfBox(0)
        .if_is("+")
        .changeTo("")             
    }
    else if( drag_elem_position == 1 )
    {
        //position in tree:
        //{0}, {drag_elem:1}
        edit_clone = true

        change_sign_of_( clone_tree)
        //.getFirstItemOfBox(0)
        .if_is("")
        .changeTo("+")
        .if_is_not("+").and_is_not("-")
        .add("+")
        
    }

    if( edit_clone )
    {
        clone.update( obj => {
            obj.clone_tree = clone_tree
            obj.action = "edit"
            return obj
        })
    }

    disable_clone()
} 



// Start Cross Over Equal Sign




/**
 * @this {In}
 */
function check_above_left_to_right()
{
    return (  this.border.origin == 'left_eq'
            && this.drag_x > this.border.eq_right 
            && this.drag_y < this.border.mid )
}
/**
 * @this {In}
 */
function update_above_left_to_right()
{
    let { 
        e_tree_list:[e_tree], 
        tree } = this.getPrevUpdate({clear:true})
    
    let right_tree = op.setTree(tree).getPrevPrefix('f_').getChild(1).tree 
        
    //change elem before cutting
    flip_sign.call( this, {
        e_tree,
        dest_tree_length: right_tree.list.length
    })

    flip_clone_sign.call( this, {
        direction: 'left_to_right',
        dest_tree_length: right_tree.list.length
    })

    // op.tree = tree
    op.cutThisTree( e_tree )
    //allow midstep to modify cut tree
    op.pasteChildTree({
        paste_tree: right_tree, 
        paste_index: 0 
    })

    // let box_tree = op.setTree(right_tree).getChild(0).tree   
    // op.pasted_tree_names =  []

    // this.var['exit_tree'] = tree
    // this.var['enter_tree'] = right_tree
    // this.var['e_tree'] = box_tree

    check_equation_sign.call( this,  tree )
    check_equation_sign.call( this,  right_tree )

    // this.global.elem_index = 0

    this.setNextUpdate({
        drag_state:'box',
        e_tree_list: [ e_tree ]
    })


    tree.updateProps()
    right_tree.updateProps()

    // GoTo:
    // onMount Box.svelte => event cross_over_equal_sign
    // fn_cross_over_equal_sign, trigger new drag_x, drag_y
}

/**
 * @this {In}
 */
function tick_above_left_to_right()
{
    tick_cross_over.call(this)
}

/**
 * @this {In}
 */
function check_above_right_to_left()
{
     return ( this.drag_x < this.border.eq_left  
        && this.border.origin == 'right_eq' 
        && this.drag_y < this.border.mid )
}

/**
 * @this {In}
 */
function update_above_right_to_left()
{

    let { e_tree_list:[e_tree], tree } = this.getPrevUpdate()
    let left_tree = op.setTree(tree)
    .getPrevPrefix('f_').getChild(0).tree 
                  
    flip_sign.call( this, {
        e_tree,
        dest_tree_length: left_tree.list.length
    })
    // console.log( e_tree.full_name )

    flip_clone_sign.call( this, {
        direction: 'right_to_left',
        dest_tree_length: left_tree.list.length
    })

    
    // op.setTree(tree)
    op.cutThisTree( e_tree )

    let last_index = left_tree.list.length
    op.pasteChildTree({ 
        paste_tree: left_tree,
        paste_index: last_index
     })
    // op.pasted_tree_names =  []

    let box_tree = op.setTree(left_tree).getChild( last_index ).tree
    
    // this.var['exit_tree'] = tree
    // this.var['enter_tree'] = left_tree
    // this.var['e_tree'] = box_tree

    check_equation_sign.call( this,  tree )
    check_equation_sign.call( this,  left_tree )

    this.setNextUpdate({
        drag_state:'box',
        e_tree_list:[box_tree]
    })
    
    tree.updateProps()
    left_tree.updateProps()
 
    // GoTo:
    // onMount Box.svelte => event cross_over_equal_sign
    // fn_cross_over_equal_sign, trigger new drag_x, drag_y
}

/**
 * @this {In}
 */
function tick_above_right_to_left()
{
    tick_cross_over.call(this)    
}

function tick_cross_over()
{
}


function flip_sign( input )
{
    let { e_tree, dest_tree_length } = input
 
    // let props = op.setTree(e_tree).getChild(0).tree.props
    // let first_elem_text = props.text

    let { sign, sub_formula } = e_tree.props
    if( sign == '+' )
    {
        e_tree.props.sign = '-'
        e_tree.props.sub_formula = '-' + sub_formula.substr(1) 
    }
    else if( sign == '-' )
    {   
        if( dest_tree_length == 0)
        {
            e_tree.props.sign = false
            e_tree.props.sub_formula = sub_formula.substr(1) 
        }
        else
        {
            e_tree.props.sign = "+"
            e_tree.props.sub_formula = "+" + sub_formula.substr(1) 
        }
    }
    else
    {
        let fraction_sibling_minus = false
        if( e_tree.props.contain_fraction )
        {
            fraction_sibling_minus = true
        }
        e_tree.props.sign = "-"
        e_tree.props.sub_formula = "-" + sub_formula
    }
} 

/**
 * 
 * @param {Object} input
 * @param {string} input.direction
 * @param {number} input.dest_tree_length  
 */
function flip_clone_sign( input )
{
    let { direction = false, dest_tree_length = false } = input

    clone.update( obj => {
        
        
        let { clone_tree } = obj
        
        let { sign } = clone_tree.props 

        if( sign == '+')
        {
            clone_tree.props.sign = '-'
        }
        else if( sign == '-' )
        {
            if( direction == 'right_to_left' )
            {
                if( dest_tree_length == 0 )
                {
                    clone_tree.props.sign = ''
                }
                else
                {
                    clone_tree.props.sign = '+'
                }
            }
            else if( direction == 'left_to_right' )
            {
                clone_tree.props.sign = ''
            }
        }
        else
        {
            clone_tree.props.sign = '-'
        }

        // let cs = change_sign_of_( clone_tree )
        //           //.getFirstItemOfBox(0)
        
        // cs.if_is("+")
        // .changeTo("-")
        
        // .if_is("-")
        // .and_is( direction == 'right_to_left')
        // .and_is( dest_tree_length == 0 )
        // .changeTo("")
        
        // .if_is("-")
        // .and_is( direction == 'right_to_left')
        // .and_is( dest_tree_length > 0 )
        // .changeTo("+")
        
        // //left to right will always be first element 
        // .if_is("-")
        // .and_is( direction == 'left_to_right' )
        // .changeTo("")
        
        // .if_is_not("-").and_is_not("+")
        // .add("-")

        obj.clone_tree = clone_tree
        obj.action = "edit" 
        return obj
    })
} 

function change_sign_of_( tree )
{

    return {
        tree,
        end:false,
        end_value: false,
        update_list:[],  
        /**@param {string|boolean} input */
        if_is:function( input ){
            if( this.end ) return this 

            if( typeof(input) == 'string')
            {
                let { tree } = this
                let test = ( tree.props.sign === input )
                this.if_chain = test
            }
            else if( typeof(input) == 'boolean')
            {
                this.if_chain = input
            }

            return this
        },
        if_is_not: function( text )
        {
            if( this.end ) return this 

            let { tree } = this
            let test = ( tree.props.sign !== text )
            this.if_chain = test

            return this
        },
        or_is: function( input )
        {
            if( this.end ) return this 

            if( typeof(input) == 'string')
            {
                let { tree } = this
                let test = ( tree.props.sign === input )
                this.if_chain = ( this.if_chain || test )
            }
            else if( typeof(input) == 'boolean')
            {
                this.if_chain = ( this.if_chain || input )
            }
            return this
        },
        or_is_not: function( text ){
            if( this.end ) return this 

            let { tree } = this
            let test = ( tree.props.sign !== text )
            this.if_chain = ( this.if_chain || test )
            return this
        },
        and_is: function( input )
        {
            if( this.end ) return this 

            if( typeof(input) == 'string')
            {
                let { tree } = this
                let test = ( tree.props.sign === input )
                this.if_chain = ( this.if_chain && test )
            }
            else if( typeof(input) == 'boolean')
            {
                this.if_chain = (this.if_chain && input )
            }
            return this
        },
        and_is_not: function( text ){
            if( this.end ) return this 

            let { tree } = this
            let test = ( tree.props.sign !== text )
            this.if_chain = ( this.if_chain && test )
            return this
        },
        changeTo:function( text )
        {
            let { if_chain, tree, end } = this
            if( end ) return this

            if( !if_chain )
            {
                this.if_chain = true
                return this
            } 

            
            tree.props.sign = text
            if( tree.props.show_arrow )
            {
                tree.props.sub_formula = 
                text + tree.props.sub_formula.substring(1)
            }

            if( tree.props.contain_fraction )
            {
                if( text == '-')
                {
                   tree.props.fraction_sibling_minus = true
                   tree.props.fraction_sibling_plus = false
                }
                else if( text == '+')
                {
                    tree.props.fraction_sibling_minus = false
                    tree.props.fraction_sibling_plus = true
                }
            }

            this.update_list.push( tree )
            this.end_value = text
            this.end = true
            return this
        },
        add: function( text )
        {
            let { if_chain, tree, end } = this
            
            
            if( end ) return this
            
            if( !if_chain )
            {
                this.if_chain = true 
                return this
            } 
 
            tree.props.sign = text 
             
            if( text == "+" || text == "-")
            {
                if( tree.props.contain_fraction )
                {
                    if( text == '+')
                    {
                        tree.fraction_sibling_plus = true
                    }
                    else if( text == '-' )
                    {
                        tree.fraction_sibling_minus = true
                    }
                }
            }
            // else if( isSymbol.test(text) )
            // {
            //     new_elem.type = 'sym'
            //     op.setTree(box_tree)
            //     .addChild('i', 'symbol', new_elem, 0)
            // }
            // else if( isCoeff.test( text ) )
            // {
            //     new_elem.type = 'num'
            //     op.setTree(box_tree)
            //     .addChild('i', 'coeff', new_elem, 0)
            // }

            
            
            if( tree.props.show_arrow )
            {
                tree.props.sub_formula = 
                "+" + tree.props.sub_formula.substring(1)
            }

            this.update_list.push( tree )
            this.end_value = text
            this.end = true 

            return this 
        },
        getUpdateArrowList:function()
        {
            return this.update_list
        }
    }
}

/**
 * @this {In}
 */
function check_below_left_to_right()
{
    return ( this.border.is_last_box
        && this.border.origin == 'left_eq' 
        && this.drag_x > this.border.eq_right  
        && this.drag_y > this.border.mid )
}

/**
 * @this {In}
 */
function update_below_left_to_right()
{   
    update_below_sy.apply(this)
}

function tick_below_left_to_right()
{

}

/**
 * @this {In}
 */
function update_below_sy()
{
     //copy from top.js
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
        console.log( '0 = {X}')

        //Do nothing
        //0 != 1
    }
    else if( eq.list.length > 1)
    {
        console.log('b + c +[...] =  {X}')

        u.cutAllChildOf( e_tree_list )
        .paste()
        .under( eq )

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
        
        let bx = eq[ eq.list[0] ]
        let i = bx[ bx.list[0] ]
        let { type } = i
        if( type == 'num'
        || type == 'sym' 
        || type == 'br')
        {
            console.log( 'b = {X}' )

            u.cutAllChildOf( e_tree_list )
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
                console.log( '+b/c = {X}')
            }
            else
            {
                console.log( 'b/c = {X}' )
            }

            let fr = i
            let bot = fr['bot_1']            

            if( origin == 'right_eq')
            {
                //go to left
                u.cutAllChildOf( e_tree_list )
                .paste()
                .into( bot )
                .at( 'end' )
                .savePastedTree()
            }
            else if( origin == 'left_eq')
            {
                //go to right
                u.cutAllChildOf( e_tree_list )
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
}


/**
 * @this {In}
 */
function check_below_right_to_left()
{
    return ( this.border.is_last_box
        && this.border.origin == 'right_eq' 
        && this.drag_x < this.border.eq_left  
        && this.drag_y > this.border.mid )
}

/**
 * @this {In}
 */
function update_below_right_to_left()
{   
    update_below_sy.apply(this)
}

function tick_below_right_to_left()
{

}