import type { interaction } from "../interaction";
import type { Tree, Border } from '../types/main'
import { u } from "../utils/ui.js"

export let zero = {
    float_left_to_right:{
        name: "cross_eq.zero.float_left_to_right",
        tree_type_list: ["zero"],
        isInContext: function(In: interaction): boolean {
            let dt_list = In.dt_list as Tree[]
            let dt  = dt_list[0]
            let { from, eq } = dt.props
            if( from == "sink"  
            && eq.name == 'eq_1'
            )
            {
                return true 
            } else {
                return false
            }
        },
        makeBorder: function( In: interaction): Border | Border[] {

            let { eq_sign_border } = In.getProps(['eq_sign_border'])
            let mid_y = ( eq_sign_border.top + eq_sign_border.bottom ) /2
            let right = eq_sign_border.right

            let updateUI = function( In: interaction): Tree[]{
                let new_dt_list = float_sy( In ) 
                return new_dt_list
            }

            return { 
                name: this.name,
                updateUI,
                top: mid_y,
                right 
            }
        }
    },
    float_right_to_left:{
        name: "cross_eq.zero.float_right_to_left",
        tree_type_list: ["zero"],
        isInContext: function(In: interaction): boolean {
            let dt_list = In.dt_list as Tree[]
            let dt  = dt_list[0]
            let { from, eq } = dt.props
            if( from == 'sink' 
            && eq.name == 'eq_2' 
            ){
                return true
            } else {
                return false 
            }
        },
        makeBorder: function( In: interaction): Border | Border[] {

            let { eq_sign_border } = In.getProps(['eq_sign_border'])
            let mid_y = (eq_sign_border.top + eq_sign_border.bottom)/2
            let left = eq_sign_border.left

            let updateUI = function( In: interaction): Tree[]{
                let new_dt_list = float_sy( In )
                return new_dt_list
            }

            return { 
                name: this.name,
                updateUI,
                top: mid_y,
                left 
            }
        }
    },
    sink_left_to_right:{
        name: "cross_eq.zero.sink_left_to_right",
        tree_type_list: ["zero"],
        isInContext: function(In: interaction): boolean {
            let dt_list = In.dt_list as Tree[]
            let dt  = dt_list[0]

            let { from, eq } = dt.props
            
            if( from == 'float' 
            && eq.name == 'eq_1'
            )
            {
                return true
            } else {
                return false
            }
        },
        makeBorder: function( In: interaction): Border | Border[] {

            let { eq_sign_border } = In.getProps(['eq_sign_border'])
            let mid_y = ( eq_sign_border.top + eq_sign_border.bottom )/2
            let right = eq_sign_border.right

            let updateUI = function( In: interaction): Tree[]{
                let new_dt_list = sink_sy( In ) 
                return new_dt_list
            }

            return { 
                name: this.name,
                updateUI,
                bottom: mid_y,
                right 
            }
        }
    },
    sink_right_to_left:{
        name: "cross_eq.zero.sink_right_to_left",
        tree_type_list: ["zero"],
        isInContext: function(In: interaction): boolean {
            let dt_list = In.dt_list as Tree[]
            let dt  = dt_list[0]

            let { from, eq } = dt.props
            
            if( from == "float" 
            && eq.name == 'eq_2'
            )
            {
                return true
            } else {
                return false 
            }
        },
        makeBorder: function( In: interaction): Border | Border[] {

            let { eq_sign_border } = In.getProps(['eq_sign_border'])

            let mid_y = ( eq_sign_border.top + eq_sign_border.bottom)/2
            let left = eq_sign_border.left

            let updateUI = function( In: interaction): Tree[]{
                let new_dt_list = sink_sy( In )
                return new_dt_list
            }

            return { 
                name: this.name,
                updateUI,
                bottom: mid_y, 
                left
            }
        }
    }
}

function float_sy( In:interaction ):Tree[]{
    // let { p_tree: start_tree } = In
    let dt_list = In.dt_list as Tree[]
    let dt = dt_list[0] 
    let { eq: dt_eq } = dt.props

    let eq_origin
    if( dt_eq.name == 'eq_1'){
        eq_origin = 'left_eq'
    } else if( dt_eq.name == 'eq_2'){
        eq_origin = 'right_eq'
    }

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
        // not possible
    }
    else if( eq.list.length > 1)
    {
        console.log( '[?]/a{D} = b + c')

        if( eq_origin == 'right_eq')
        {
            //go to left
            u.cutAllChildOf( dt_list )
            .paste()
            .into( eq )
            .at( 'end' )
        }
        else if( eq_origin == 'left_eq')
        {
            //go to right
            u.cutAllChild( dt_list )
            .paste()
            .into( eq )
            .at( 'start' )
        }

        // start_tree.updateProps()
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
            u.cutAllChildOf( dt_list )
            .paste()
            .into( bx )
            .at( 'start' )
            
            let second_i = bx[ bx.list[1] ]
            second_i.checkDot()
        }
        else if( eq_origin == 'right_eq' )
        {
            //go to left
            u.cutAllChildOf( dt_list )
            .paste()
            .into( bx )
            .at('end')
            
            let last_i = bx[ bx.list[ bx.list.length - 1]]
            last_i.checkDot()
        }

        // start_tree.updateProps()
        bx.updateProps()
        return u.e_tree_list
    }
}

function sink_sy( In:interaction ):Tree[]{
    let dt_list = In.dt_list as Tree[] 
    let dt = dt_list[0]

    let eq
    let { eq: dt_eq } = dt.props
    
    let eq_origin
    if( dt_eq.name == 'eq_1'){
        eq_origin = 'left_eq'
    } else if( dt_eq.name == 'eq_2'){
        eq_origin = 'right_eq'
    }

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
        // another zero not posibble
    }
    else if( eq.list.length > 1)
    {
        
        console.log( 'c+d = {X}a/b or {X}(a+b)')
        // case
        //  (a + b) = cd 
        //  (a + b) / {c} = d

        // let pasted_tree = u.getPastedTree()

        // let cut_tree_list = pasted_tree || dt_list       

        u.cutAllChildOf( dt_list )
         .paste()
         .under( eq )
        
        eq.updateProps()
        // start_tree.updateProps()      
        
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
                u.cutAllChildOf( dt_list )
                .paste()
                .into( bot )
                .at('start')
            }
            else if( eq_origin == 'right_eq')
            {
                // go to left
                u.cutAllChildOf( dt_list )
                .paste()
                .into( bot )
                .at('end')
            }

            eq.updateProps()
            // start_tree.updateProps()      

            return u.e_tree_list
        }
        else 
        {   
            console.log( 'c = {X}a/b or {X}(a+b)' )     

            // let pasted_tree = u.getPastedTree()
            // let cut_tree_list = pasted_tree || dt_list

            u.cutAllChildOf( dt_list )
             .paste()
             .under( eq )

            
            eq.updateProps()
            // start_tree.updateProps()      
            
            return u.e_tree_list
        }
    }
}