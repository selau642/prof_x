import type { interaction } from '../interaction'
import type { Tree, Border } from '../types/main'
import { u } from "../utils/ui.js"
import { clone } from '../clone_stores.js'
import { 
    check_equation_sign, 
    flip_sign, 
    match_sign
} from '../utils/sign'

export let bx = {
    // b +[a]= 
    // b = -a ...
    above_left_to_right: {
        name: "cross_eq.bx.above_left_to_right",
        tree_type_list: ['bx'],
        isInContext: function(In: interaction): boolean {
            let { dt_list:[ dt ], p_tree } = In
            let { eq_origin } = In.getProps(['eq_origin'])
            let dt_index = p_tree.list.indexOf( dt.name ) 

            if( p_tree.type == 'eq'
            && eq_origin == 'left_eq'
            && dt_index == p_tree.list.length - 1 ){
                return true
            } else {
                return false
            }
        },
        makeBorder: function( In: interaction): Border {
            let { eq_sign_border } = In.getProps(['eq_sign_border']) 
            // let { eq, right_eq, dt_border } =
                // In.getProps(['eq', 'right_eq', 'dt_border'])

            let { top, bottom, right } = eq_sign_border
            let mid_y = (top + bottom)/2 
            
            // let {
            //         elem: right_eq_elem, 
            //         border: right_eq_border 
            //     } = right_eq
            // let { width: de_width } = dt_border 

            // let inner_padding_left = parseFloat(
            //         window
            //         .getComputedStyle( right_eq_elem, null)
            //         .getPropertyValue('padding-left').replace('px', '')
            //         )

            // let right = right_eq_border.left + inner_padding_left + de_width / 2 

            let updateUI = function( In: interaction): Tree[] {

                let { left_eq_tree, right_eq_tree } = 
                    In.getProps(['left_eq_tree', 'right_eq_tree']) 

                let { dt_list: [ dt ] } = In

                flip_sign( dt )

                u.cutBox( dt )
                .paste()
                .into( right_eq_tree )
                .at( 'start' )

                check_equation_sign( left_eq_tree ) 
                check_equation_sign( right_eq_tree )
                left_eq_tree.updateProps()
                right_eq_tree.updateProps()
                match_sign( clone, dt )
                
                return [ dt ] 
            }

            return { 
                name: this.name,
                updateUI,  
                top: mid_y,
                right
            }
        }
    },
    // ... =[a]+b
    // ...[-a]=b
    above_right_to_left: {
        name: "cross_eq.bx.above_right_to_left",
        tree_type_list: ['bx'],
        isInContext: function(In: interaction): boolean {
            let { dt_list:[ dt ], p_tree } = In
            let { eq_origin } = In.getProps(['eq_origin'])
            let dt_index = p_tree.list.indexOf( dt.name ) 

            if( p_tree.type == 'eq'
            && eq_origin == 'right_eq'
            && dt_index === 0  ){
                return true
            } else {
                return false
            }
        },
        makeBorder: function( In: interaction): Border {
            let { eq_sign_border } = In.getProps(['eq_sign_border'])
            let { top, bottom, left } = eq_sign_border
            let mid_y = (top + bottom)/2 
            
            let updateUI = function( In: interaction): Tree[] {

                let { left_eq_tree, right_eq_tree } = 
                    In.getProps(['left_eq_tree', 'right_eq_tree']) 

                let { dt_list: [ dt ] } = In

                flip_sign( dt )

                u.cutBox( dt )
                .paste()
                .into( left_eq_tree )
                .at( 'end' )

                check_equation_sign( left_eq_tree ) 
                check_equation_sign( right_eq_tree )
                left_eq_tree.updateProps()
                right_eq_tree.updateProps()
                match_sign( clone, dt )
                return [ dt ] 
            }

            
            return { 
                name: this.name,
                updateUI,  
                top: mid_y,
                left
            }
       }
    },

    below_left_to_right: {
        name: "cross_eq.box.below_left_to_right",
        tree_type_list: ["bx"],
        isInContext: function(In: interaction): boolean {
            let { eq_origin } = In.getProps(['eq_origin'])
            let { p_tree } = In

            if( p_tree.type == 'eq' 
                && eq_origin == 'left_eq' 
                && p_tree.list.length == 1 // is only box in p_tree
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
            } = In.getProps(["arrow_to_border","eq_sign_border"])

            let { top, bottom, right } = eq_sign_border
            let mid_sign = ( top + bottom )/2 - arrow_to_border 
 
            let updateUI = function( In: interaction): Tree[]{
                let new_dt_list = updateUI_below_sy( In )
                return new_dt_list
            }

            return { 
                name: this.name,
                updateUI, 
                bottom: mid_sign,
                right
            }
        }
    },
    
    below_right_to_left:{
        name: "cross_eq.bx.below_right_to_left",
        tree_type_list: ["bx"],
        isInContext: function(In: interaction): boolean {
            let { eq_origin } = In.getProps(['eq_origin'])
            let { p_tree } = In
             
            if( p_tree.type == 'eq' 
                && eq_origin == 'right_eq' 
                && p_tree.list.length == 1 // is only box in p_tree
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
            } = In.getProps(["arrow_to_border", "eq_sign_border"])

            let { top, bottom, left } = eq_sign_border
            let mid_sign = ( top + bottom )/2 - arrow_to_border 
 
            let updateUI = function( In: interaction): Tree[]{
                let new_dt_list = updateUI_below_sy( In )
                return new_dt_list
            }

            return { 
                name: this.name,
                updateUI,
                bottom: mid_sign, 
                left
            }
        }
    }
}

/** update below symmertry function */
function updateUI_below_sy(In: interaction)
{
    let { dt_list, dt_list:[ dt ], 
        p_tree: start_tree } = In 

    let { eq_origin } = In.getProps(['eq_origin'])
    
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
        console.log( '0 = {X}' )

        u.cutAllChildOf( dt_list )
        .paste()
        .intoZero()
        .setZeroProps({
            from: "sink",
            eq
        })

        start_tree.updateProps()
        eq.updateProps()

        return u.e_tree_list
    }
    else if( eq.list.length > 1)
    {
        console.log('b + c +[...] =  {X}')

        u.cutAllChildOf( dt_list )
        .paste()
        .under( eq )
        
        start_tree.updateProps()
        eq.updateProps()
        
        return u.e_tree_list // frac bottom
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

            u.cutAllChildOf( dt_list )
            .paste()
            .under( eq )
            
            start_tree.updateProps()
            bx.updateProps()

            return u.e_tree_list
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

            if( eq_origin == 'right_eq')
            {
                //go to left
                u.cutAllChildOf( dt_list )
                .paste()
                .into( bot )
                .at( 'end' )
                .savePastedTree()
            }
            else if( eq_origin == 'left_eq')
            {
                //go to right
                u.cutAllChildOf( dt_list )
                .paste()
                .into( bot )
                .at( 'start' )
                .savePastedTree()
            }

            bot.updateProps()               
            start_tree.updateProps()
            return u.e_tree_list
        }
    }
}