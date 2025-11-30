import type { interaction } from '../interaction'
import type { Tree, Tree_List, Border } from '../types/main'
import { u } from "../utils/ui.js"

export let bot = {
float_left_to_right:{
    name: "cross_eq.fr_bot.float_left_to_right",
    tree_type_list: ["bot"],
    isInContext: function(In: interaction): boolean {
        let { p_tree } = In
        let { eq_origin } = In.getProps(['eq_origin'])
        let is_eq = p_tree.parentNode // bx
                        .parentNode
        
        if( is_eq.type == 'eq'
        && is_eq.list.length == 1 // only child 
        && eq_origin == 'left_eq'
        ){
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {

        let { 
            eq_sign_border,  
            arrow_to_border
        } = In.getProps([
            "eq_sign_border",
            "arrow_to_border"])

        let top = eq_sign_border.bottom - arrow_to_border
        let right = eq_sign_border.left

        let updateUI = function( In: interaction): Tree[]{
            let new_dt_list = bottom_float_sy( In )
            return new_dt_list
        }

        return { 
            name: this.name,
            updateUI,
            top,
            right 
        }
    }
},

float_right_to_left: {
    name: "cross_eq_fr_bot_float_right_to_left",
    tree_type_list: ["bot"],
    isInContext: function(In: interaction): boolean {
        let { p_tree } = In
        let { eq_origin } = In.getProps(['eq_origin'])
        let is_eq = p_tree.parentNode // bx
                        .parentNode
        
        if( is_eq.type == 'eq'
        && is_eq.list.length == 1 // only child 
        && eq_origin == 'right_eq'
        ){
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {

        let { 
            arrow_to_border, 
            eq_sign_border 
        } = In.getProps(["arrow_to_border", "eq_sign_border"])

        let top = eq_sign_border.bottom - arrow_to_border
        let left = eq_sign_border.left
        
        let updateUI = function( In: interaction): Tree[]{
            let new_dt_list = bottom_float_sy(In)
            return new_dt_list
        }

        return { 
            name: this.name,
            updateUI,
            top,
            left 
        }
    }
}
}

/** bottom float symmetrical */
function bottom_float_sy( In: interaction ){
    let { dt_list, 
        dt_list:[ dt ],
        p_tree } = In 
    
    let start_tree = p_tree

    let { eq_origin } = In.getProps(['eq_origin'])
    let start_p_tree = start_tree.parentNode
    
    let eq
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
    

    if( eq.list.length == 0 )
    {
        // TO DO: handle zero case 
        console.log( '[?]/{X} = 0')
        u.cut( dt_list )
        .paste()
        .intoZero()
        .setZeroProps({
            from: "float",
            eq
        })

        start_p_tree.updateProps()
        return u.e_tree_list // [ zero_tree ]
    }
    else if( eq.list.length > 1)
    {
        console.log("[?]/{X} = a + b + [...]")
        
        if( eq_origin == 'left_eq')
        {
            //go to right
            u.cut( dt_list )
            .paste()
            .into( eq )
            .at('start')
            .savePastedTree()
        }
        else if( eq_origin == 'right_eq')
        {
            //go to left
            u.cut( dt_list )
            .paste()
            .into( eq )
            .at('end')
            .savePastedTree()
        }

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

        return u.e_tree_list
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

            if( eq_origin == 'left_eq')
            {
                //go to right

                u.cut( dt_list )
                .paste()
                .into( bx )
                .at('start')
                .savePastedTree()
            }
            else if( eq_origin == 'right_eq')
            {
                //go to left
                u.cut( dt_list )
                .paste()
                .into( bx )
                .at('end')
                .savePastedTree()
            }
            
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

            return u.e_tree_list
        }
    }
}