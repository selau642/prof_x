import type { interaction } from '../interaction'
import type { Tree, Border } from '../types/main'
import { u } from "../utils/ui.js"
// import { clone } from '../clone_stores.js'
import { op } from '../xTree.js'

// TO DO: handle {x}/a = 0 case, in symmetry function
export let i = {
    sink_left_to_right:{
        name: "cross_eq.i.sink_left_to_right",
        tree_type_list: ["sym", "num", "br", "fr"],
        isInContext: function(In: interaction): boolean {
            let { eq_origin } = 
            In.getProps(['eq_origin'])
            let { dt_list: [ dt ], p_tree } = In
            
            let eq_tree
            //if( p_tree.type == 'bx' ){
                //eq_1-bx_1-sym_1
                //  2  - 1 
                eq_tree = op.setTree( dt ).getParent(2).tree
            //} else if( p_tree.type == 'top'){
                //eq_1-bx_1-fr_1-top_1-sym_1
                //  4  - 3  - 2  - 1 
            //    eq_tree = op.setTree( dt ).getParent(4).tree
            //}

            if( eq_origin == 'left_eq'
            && ( p_tree.type == 'bx' ) 
            // p_tree.type == fr )
            && eq_tree
            && eq_tree.type == 'eq'  
            && eq_tree.list.length == 1
            ){
                return true
            } else {
                return false
            } 
        },
        makeBorder: function( In: interaction): Border {
            let { 
                arrow_to_border, 
                eq_sign_border 
            } = In.getProps(['arrow_to_border', 'eq_sign_border']) 

            let { bottom, right } = eq_sign_border

            bottom = bottom - arrow_to_border 

            let updateUI = function( In: interaction): Tree[]{
                let new_dt_list = sink_sy(In)
                return new_dt_list
            }

            return { 
                name: this.name,
                updateUI,
                // same effect as:
                // drag_y + distance_to_dc_top > mid_y
                bottom, 
                right
            }
        }
    },
    sink_right_to_left:{
        name: "cross_eq.i.sink_right_to_left",
        tree_type_list: ["sym", "num", "br", "fr"],
        isInContext: function(In: interaction): boolean {
            let { eq_origin } = 
            In.getProps(['eq_origin'])
            let { dt_list: [ dt ], p_tree } = In
            
            let eq_tree
            //if( p_tree.type == 'bx' ){
                //eq_1-bx_1-sym_1
                //  2  - 1 
                eq_tree = op.setTree( dt ).getParent(2).tree
            //} else if( p_tree.type == 'top'){
                //eq_1-bx_1-fr_1-top_1-sym_1
                //  4  - 3  - 2  - 1 
            //    eq_tree = op.setTree( dt ).getParent(4).tree
            //}

            if( eq_origin == 'right_eq'
            && ( p_tree.type == 'bx' )
            //|| p_tree.type == 'top' )
            && eq_tree
            && eq_tree.type == 'eq'  
            && eq_tree.list.length == 1
            ){
                return true
            } else {
                return false
            }
        },
        makeBorder: function( In: interaction): Border {
            let { 
                arrow_to_border, 
                eq_sign_border 
            } = In.getProps(['arrow_to_border', 'eq_sign_border']) 

            let { bottom, left } = eq_sign_border

            bottom = bottom - arrow_to_border
            // let mid_y = ( top + bottom )/2

            let updateUI = function( In: interaction): Tree[]{
                let new_dt_list = sink_sy(In)
                return new_dt_list
            }

            return { 
                name: this.name, 
                updateUI,
                // same effect as:
                // drag_y + distance_to_dc_top > mid_y
                bottom, 
                left 
            }
        }
    },
    float_left_to_right:{
        name: "cross_eq.i.float_left_to_right",
        tree_type_list: ["sym", "num", "br","fr"],
        isInContext: function(In: interaction): boolean {
            let { eq_origin } = In.getProps(['eq_origin'])
            let { dt_list: [ dt ], p_tree } = In

            //eq_1-bx_1-fr_1-bot_1-sym_1
            //  4  - 3  - 2  - 1 
            let eq_tree = op.setTree( dt ).getParent(4).tree

            if( eq_origin == 'left_eq' 
            && p_tree.type == 'bot' 
            && eq_tree.type == 'eq'
            && eq_tree.list.length == 1
            ){
                return true
            } else {
                return false
            }
        },
        makeBorder: function( In: interaction): Border {

            let { 
                arrow_to_border, 
                eq_sign_border 
            } = In.getProps(['arrow_to_border', 'eq_sign_border'])

            let { bottom, right } = eq_sign_border

            let updateUI = function( In: interaction): Tree[]{
                let new_dt_list = float_sy( In )
                return new_dt_list
            }

            return { 
                name: this.name,
                updateUI,
                top: bottom - arrow_to_border,
                right 
            }
        }
    },
    float_right_to_left:{
        name: "cross_eq.i.float_right_to_left",
        tree_type_list: ["sym", "num", "br", "fr"],
        isInContext: function(In: interaction): boolean {
            let { eq_origin } = In.getProps(['eq_origin'])
            let { dt_list: [ dt ], p_tree } = In

            //eq_1-bx_1-fr_1-bot_1-sym_1
            //  4  - 3  - 2  - 1 
            let eq_tree = op.setTree( dt ).getParent(4).tree

            if( eq_origin == 'right_eq' 
            && p_tree.type == 'bot' 
            && eq_tree.type == 'eq'
            && eq_tree.list.length == 1
            ){
                return true
            } else {
                return false
            }
        },
        makeBorder: function( In: interaction): Border {
            let { 
                arrow_to_border, 
                eq_sign_border 
            } = In.getProps(['arrow_to_border', 'eq_sign_border'])

            let { bottom, left } = eq_sign_border

            let updateUI = function( In: interaction): Tree[]{
                let new_dt_list = float_sy( In )
                return new_dt_list
            }

            return { 
                name: this.name,
                updateUI,
                top: bottom - arrow_to_border,
                left 
            }
        }
    }
}



/** sink symmetry */
function sink_sy( In: interaction )
{

    let { dt_list, p_tree } = In 
    // f_1-eq_2-bx_1-fr_1-top_1

    
    let eq
    let { eq_origin } = In.getProps(['eq_origin']) 
    
    if( eq_origin == 'left_eq' )
    {
        //go to right
        eq = In.getProps(['right_eq_tree']).right_eq_tree 
    }
    else if( eq_origin == 'right_eq' )
    {
        //go to left
        eq = In.getProps(['left_eq_tree']).left_eq_tree 
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
        console.log( '0 = {X}a/b or 0={X}(a+b)' )

        u.cut( dt_list )
        .paste()
        .intoZero()
        .setZeroProps({
            from: "sink",
            eq
        })

        u.checkAndRemoveBracket( p_tree )

        p_tree.updateProps()
        eq.updateProps()

        return u.e_tree_list 
    }
    else if( eq.list.length > 1)
    {
        
        console.log( 'c+d = {X}a/b or {X}(a+b)')
        // case
        //  (a + b) = cd 
        //  (a + b) / {c} = d

        // let pasted_tree = u.getPastedTree()

        // let cut_tree_list = pasted_tree || dt_list       

        u.cut( dt_list )
         .paste()
         .under( eq )
        
        u.checkAndRemoveBracket( p_tree )

        eq.updateProps()
        p_tree.updateProps()      
        
        return u.e_tree_list
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

            // let get_pasted_tree = u.getPastedTree()
            // let cut_tree_list = get_pasted_tree || dt_list
            
            if( eq_origin == 'left_eq')
            {
                // go to right
                u.cut( dt_list )
                .paste()
                .into( bot )
                .at('start')
            }
            else if( eq_origin == 'right_eq')
            {
                // go to left
                u.cut( dt_list )
                .paste()
                .into( bot )
                .at('end')
            }

            u.checkAndRemoveBracket( p_tree )

            eq.updateProps()
            p_tree.updateProps()      

            return u.e_tree_list
        }
        else 
        {   
            console.log( 'c = {X}a/b or {X}(a+b)' )     

            // let pasted_tree = u.getPastedTree()
            // let cut_tree_list = pasted_tree || dt_list

            u.cut( dt_list )
             .paste()
             .under( eq )

            u.checkAndRemoveBracket( p_tree )
            
            eq.updateProps()
            p_tree.updateProps()      
            
            return u.e_tree_list
        }
    }
}
/** float symmetry */
function float_sy( In: interaction ){
    let { dt_list, p_tree: start_tree } = In
    let { eq_origin } = In.getProps(['eq_origin'])

    let eq //right_tree
    if( eq_origin == 'left_eq')
    {
        //go to right
        eq = In.getProps(['right_eq_tree']).right_eq_tree 
    }
    else if( eq_origin == 'right_eq')
    {
        //go to left
        eq = In.getProps(['left_eq_tree']).left_eq_tree 
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

        u.cut( dt_list )
        .paste()
        .intoZero()
        .setZeroProps({
            from:"float",
            eq
        })

        start_tree.updateProps()
        return u.e_tree_list 
    }
    else if( eq.list.length > 1)
    {
        console.log( '[?]/a{D} = b + c')

        if( eq_origin == 'right_eq')
        {
            //go to left
            u.cut( dt_list )
            .paste()
            .into( eq )
            .at( 'end' )
        }
        else if( eq_origin == 'left_eq')
        {
            //go to right
            u.cut( dt_list )
            .paste()
            .into( eq )
            .at( 'start' )
        }

        start_tree.updateProps()
        eq.updateProps()

        return u.e_tree_list
    }
    else if( eq.list.length == 1)
    {
        let bx = eq[ eq.list[0] ]
        
        console.log( '[?]/a{D} = b' )

        if( eq_origin == 'left_eq')
        {
            //go to right
            u.cut( dt_list )
            .paste()
            .into( bx )
            .at( 'start' )
            
            let second_i = bx[ bx.list[1] ]
            second_i.checkDot()
        }
        else if( eq_origin == 'right_eq' )
        {
            //go to left
            u.cut( dt_list )
            .paste()
            .into( bx )
            .at('end')
            
            let last_i = bx[ bx.list[ bx.list.length - 1]]
            last_i.checkDot()
        }


        start_tree.updateProps()
        bx.updateProps()
        return u.e_tree_list
    }
}