import { clone } from '../../../clone_stores.js.js'
import { op } from '../../../xTree.js.js'
import { u } from '../../../utils/ui.js.js'
import { In } from '../../../interactionion'

//item-in_bracket

export let in_bracket = [
    {   
        name:'set_in_bracket_borders',
        set_state_borders: set_in_bracket_borders
    },
    {
        name:'exit_bracket_from_left',
        check: check_exit_bracket_from_left,
        update_tree: update_exit_bracket_from_left,
        svelte_tick: tick_exit_bracket_from_left,
        next_state: "item-in_box"
    },
    {
        name:'exit_bracket_from_right',
        check: check_exit_bracket_from_right,
        update_tree: update_exit_bracket_from_right,
        svelte_tick: tick_exit_bracket_from_right,
        next_state: "item-in_box"
    }
]


/**
 * @this {In}
 */
function set_in_bracket_borders()
{
    let { e_tree_list:[e_tree] } = this.getPrevUpdate()
    
    let box_tree = e_tree.parentNode
    let br_tree = box_tree.parentNode 

    //special case reset elem_index when DOM and Elem_index is not the same thing

    // op.pasted_tree_names = e_tree.props.pasted_tree_names //set by child_selected => yellow arrow
    //sets all coordinate (x, y) variables for drag comparisons
    // 2. y_top
    // 3. node_index
    // 6. left_inside_bracket_x
    // 7. right_inside_bracket_x
    let br_elem = document.getElementById( br_tree.full_name )
    let { left, right, top } = br_elem.getBoundingClientRect()
    this.border.top = top

    let e_tree_list = [e_tree.props.pasted_tree_list ]
    this.nextUpdate.e_tree_list = e_tree_list
    this.nextUpdate.enter_bracket = 'from_inside'
    this.nextUpdate.original_tree = e_tree

    if( br_tree.type == 'br' 
    && br_tree.list.length == e_tree_list.length )
    {
        this.nextUpdate.isSubBracket = false
        this.border.inside_bracket_right = right
        this.border.inside_bracket_left = left        
    }
    else
    {
        // get max_right, max_left
        // 1. max_right = most right parent element
        // 2. max_left = most left parent element
        // let { pasted_tree_list } = e_tree.props
        // let right_most_e_tree
        // let max_right

        // let left_most_e_tree
        // let max_left
        // for( let tree of pasted_tree_list )
        // {
        //     let p_tree = tree.parentNode
        //     let div_tree = document.getElementById( p_tree.full_name )
        //     let { left, right } = div_tree.getBoundingClientRect()
            
        //     if( !max_left 
        //     || ( max_left && max_left > left ) )
        //     {
        //         max_left = left
        //         left_most_e_tree = tree
        //     }

        //     if( !max_right 
        //     || ( max_right && max_right < right ) )
        //     {
        //         max_right = right
        //         right_most_e_tree = tree
        //     }
        // }

       
        // for cases, bracket is removed
        // [a]b + [a]c => [a](b+c)
        // need use e_tree_list to infer the side bracket positions
        let br_side_obj 
            = u.getBrSidePositions( e_tree_list  )

        let { 
            max_left_tree: max_left_i, 
            max_right_tree: max_right_i 
        } = br_side_obj

        let max_left_bx = max_left_i.parentNode
        let div_left_tree = document.getElementById( max_left_bx.full_name )
        let { left: max_left } = div_left_tree.getBoundingClientRect()

        let max_right_bx = max_right_i.parentNode
        let div_right_tree = document.getElementById( max_right_bx.full_name )
        let { left: max_right } = div_right_tree.getBoundingClientRect()

        this.nextUpdate.isSubBracket = true
        this.nextUpdate.br_side_obj = br_side_obj
        this.border.inside_bracket_right = max_right
        this.border.inside_bracket_left = max_left   
    }
}

/**
 * @this {In}
 */

function check_exit_bracket_from_left()
{
    // exit bracket <<---

    // special left and right bracket case:
    // item in the middle
    // (a+b){c}(d+e) => (a{c} + b{c})(d + e)
    // results in a flickering bug that 
    // triggers exit_bracket_from left in (d+e)
    // due to next_bracket_left of (d+e) triggered
    
    // but don't detect this:
    // prev_bracket_left | {drag_x} | prev_bracket_right | [next_bracket_left] | next_bracket_right  
    
    // detect this:
    // prev_bracket_left | prev_bracket_right | [next_bracket_left] | <=== {drag_x} | next_bracket_right  
    
    // console.log('check_exit_bracket_from_left')

    let { enter_bracket } = this.getPrevUpdate()

    if( enter_bracket == 'from_left')
    {
        //left and right brackets special case
        return ( this.drag_x < this.border.next_bracket_left )
    }
    else if( enter_bracket == 'from_right')
    {
        return ( this.drag_x < this.border.prev_bracket_left )
    }
    else if( enter_bracket == 'from_inside')
    {
        return ( this.drag_x < this.border.inside_bracket_left )
    }   
}

/**
 * @this {In}
 */
function update_exit_bracket_from_left()
{
    // exit bracket <<---
    let { e_tree_list:br_tree_list, 
        e_tree_list:[[e_tree]],
        isSubBracket,
        br_side_obj
     } = this.getPrevUpdate({ clear: true })

    // br_tree_list =
    //   (  a       + b     +c  )
    // [ [tree_1, tree_1, tree_1],
    //   [tree_2, tree_2, tree_2] ]

    
    let eq_tree = e_tree
                .parentNode //bx
                .parentNode //eq | br | top | bot
    // let yellow_count = br_tree_list[0].length
    // let child_count = bracket_tree.list.length
    let bracket_tree
    let has_insert_bracket = false
    if( isSubBracket )
    {
        // [b]a+[b]c+d => [b](a+c)+d

        // let right_p_tree = right_most_e_tree.parentNode
        // let right_position = eq_tree.list.indexOf( right_p_tree.name)
        
        // let left_p_tree = left_most_e_tree.parentNode
        // let left_position = eq_tree.list.indexOf(left_p_tree.name)
        // {()}[b]a+[b]c+d =>
        // {( [b]a + [b]c )} + d
        if( !br_side_obj )
        {
            // when skip_set_border from 
            // item-in_box,  update_enter_br_from_
            // br_side_obj not set
            br_side_obj = u.getBrSidePositions( br_tree_list )
        }
        let { max_left_index } = br_side_obj

        bracket_tree = u.insertBracketInto( eq_tree )
                        .at( max_left_index )
                        .getBracketTree()

        has_insert_bracket = true

        let p_tree_list = br_tree_list[0].map((tree)=>{
            return tree.parentNode
        })
        
        p_tree_list = u.sort( p_tree_list ).by( eq_tree.list )

        // +a[b]+c[b] => 
        // b({remove+}a+c)
        let first_bx = p_tree_list[0]
        if( first_bx.props.sign == '+')
        {
            first_bx.props.sign = false
        }

        u.cut( p_tree_list )
        .paste()
        .into( bracket_tree )
        .at('start')
    }
    else 
    {
        // a[b]+[b]+d[b] => [b](a+1+d)
       
        if( eq_tree.name.search('eq') > -1)
        {
            //insert bracket
            bracket_tree = u.insertBracket( eq_tree )
            has_insert_bracket = true 
        }
        else
        {
            bracket_tree = eq_tree
        }
    }

    let p_br_tree = bracket_tree.parentNode
    let b_index = p_br_tree.list.indexOf( bracket_tree.name )

    let next_e_tree_list = []
    for( let sub_tree_list of br_tree_list )
    {
        u.cut( sub_tree_list )
        
        let cut_tree_list = u.getCutTree()
        let single_tree = cut_tree_list[0]
        next_e_tree_list.push( single_tree )
        let single_tree_list = [ single_tree ]

        u.paste( single_tree_list )
        .into( p_br_tree )
        .at( b_index )
        b_index ++
    }

    bracket_tree.checkDot()
    
    clone.update( (obj) => {
        obj.action ='clear_ref_elem'
        obj.ref_elem = null
        return obj
    })
    
    this.setNextUpdate({
        e_tree_list: next_e_tree_list,
        drag_state: 'item-in_box'
    })

    this.clone.split_clone_list = false //handledragend
    
    if( has_insert_bracket )
    {
        // p_br_tree = bx which was inserted
        // and does not have updateProps set yet
        p_br_tree.parentNode.updateProps()
    }
    else
    {
        p_br_tree.updateProps()
    }
    //on release clone_element
    //Goto: 
    //1. Item.svelte, 
    //2. handleDragEnd, 
    //3. not array $clone_obj[clone_id].ref_elem
    //4. return to position 
}

function tick_exit_bracket_from_left()
{

}

/**
 * @this {In}
 */
function check_exit_bracket_from_right()
{
    // exit bracket --->>
    // see check_exit_bracket_from_left() for documentation
    let { enter_bracket } = this.getPrevUpdate()
    if( enter_bracket == 'from_right')
    {
        return ( this.drag_x > this.border.prev_bracket_right )
    }
    else if( enter_bracket == 'from_left')
    {
        return ( this.drag_x > this.border.next_bracket_right )
    }
    else if( enter_bracket == 'from_inside' )
    {
        return ( this.drag_x > this.border.inside_bracket_right )
    }
    
}

/**
 * @this {In}
 */
function update_exit_bracket_from_right()
{
    // exit bracket --->>
    let { e_tree_list:br_tree_list, 
        e_tree_list:[[e_tree]],
        isSubBracket,
        br_side_obj } = this.getPrevUpdate({ clear: true })

    // br_tree_list =
    //   (  a[de]   + b[de] +c[de] )   =>
    //   (  a       + b     +c     )[de] 
    // [ [sym_d, sym_d, sym_d],
    //   [sym_e, sym_e, sym_e] ]


    let eq_tree = e_tree.parentNode.parentNode
    let bracket_tree 
    let has_insert_bracket = false

    if( isSubBracket )
    {
        // [b]a+[b]c+d => (a+c)[b]+d
        // let left_p_tree = left_most_e_tree.parentNode
        // let left_position = eq_tree.list.indexOf( left_p_tree.name )
        // {()}[b]a+[b]c + d =>
        // {( [b]a + [b]c )} + d

        if( !br_side_obj )
        {
            // when skip_set_border from 
            // item-in_box,  update_enter_br_from_
            // br_side_obj not set
            br_side_obj = u.getBrSidePositions( br_tree_list )
        }

        let { max_left_index } = br_side_obj

        bracket_tree = u.insertBracketInto( eq_tree )
                        .at( max_left_index )
                        .getBracketTree()
        
        has_insert_bracket = true

        let p_tree_list = br_tree_list[0].map( (tree)=>{
                return tree.parentNode
            })

        p_tree_list = u.sort( p_tree_list ).by( eq_tree.list )

        let first_bx = p_tree_list[0]
        if( first_bx.props.sign == '+')
        {
            first_bx.props.sign = false
        }

        u.cut( p_tree_list )
        .paste()
        .into( bracket_tree )
        .at('start')
    }
    else
    {
        if( eq_tree.type == 'eq')
        {
            //insert bracket
            bracket_tree = u.insertBracket( eq_tree )
            has_insert_bracket = true 
        }
        else
        {
            bracket_tree = eq_tree
        }
    }

    let p_br_tree = bracket_tree.parentNode
    let b_index = p_br_tree.list.indexOf( bracket_tree.name )
    b_index = b_index + 1
    let new_e_tree_list = []
    for( let sub_tree_list of br_tree_list )
    {
        u.cut( sub_tree_list )
        
        let cut_tree_list = u.getCutTree()
        let single_tree = cut_tree_list[0]
        new_e_tree_list.push( single_tree )
        let single_tree_list = [ single_tree ]

        u.paste( single_tree_list )
        .into( p_br_tree )
        .at( b_index )
        b_index ++
    }
    
    clone.update( (obj) => {
        obj.action = 'clear_ref_elem'
        obj.ref_elem = null
        return obj
    })


    this.setNextUpdate({
        e_tree_list: new_e_tree_list,
        drag_state: 'item-in_box'
    })

    this.clone.split_clone_list = false //handledragend

    if( has_insert_bracket )
    {
        // p_br_tree = bx which was inserted
        // and does not have updateProps set yet
        p_br_tree.parentNode.updateProps()
        
    }
    else
    {
        p_br_tree.updateProps()
    }
    // this.stop_updating = true
    //on release clone_element
    //Goto: 
    //1. Item.svelte, 
    //2. handleDragEnd, 
    //3. not array $clone_obj[clone_id].ref_elem
    //4. return to position 
}

function tick_exit_bracket_from_right()
{

}