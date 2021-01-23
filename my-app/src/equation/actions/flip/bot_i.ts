import type { interaction } from "../interaction";
import type { Tree, Border } from '../types/main'
import { u } from "../utils/ui.js"

/** No flipping for fr 
 * ab/c[d] => (ab* 1/[d])/c 
 * ab/[d] => cannot flip up
*/

export let flip_up  = {
    name: "flip.bot_i.up",
    tree_type_list: ["sym","num", "br"],
    isInContext: function(In: interaction): boolean {
        let { p_tree } = In
        if( p_tree.type == "bot" 
        && p_tree.list.length > 1 ){
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {
        let { p_tree } = In
        let { top } = document.getElementById( p_tree.full_name )
                        .getBoundingClientRect()

        let updateUI = function( In: interaction): Tree[]{
            let { dt_list, p_tree } = In
            //* ab/c[d] => (ab* 1/[d])/c 
            let fr = p_tree.parentNode  
            let fr_top = fr['top_1']
            let { 
                top: new_top, 
                bot: new_bot
            } = u.makeFr( fr_top )

            u.addOne( new_top )

            u.cut( dt_list )
            .paste()
            .into( new_bot )
            .at('start')
            
            fr_top.updateProps()
            p_tree.updateProps()
            return [ new_bot ] 
        }

        return { 
            name: this.name,
            updateUI,
            top 
        }
    }
}

/** No flip down for fraction
 *  (ab/[d]) / c => ab/c[d]
 *  ab/[d] => no flip
 */
export let flip_down  = {
    name: "flip.bot_i.down",
    tree_type_list: ["sym","num", "br"],
    isInContext: function(In: interaction): boolean {
        let { p_tree } = In
        let fr_top = p_tree.parentNode //fr 
                   .parentNode // nested top
        // check for nested fraction
        // (ab/[d]) must be in top
        if( p_tree.type == 'bot' 
        && fr_top.type == 'top'
        ){
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {

        let { p_tree } = In
        let fr_top = p_tree.parentNode  // fr
                           .parentNode  // nested top
                           
        let { bottom } = document.getElementById( fr_top.full_name ) 
                            .getBoundingClientRect()

        let updateUI = function( In: interaction): Tree[]{
            let { dt_list, p_tree } = In 

            //*  (ab/[d]) / c => ab/c[d]
            let fr = p_tree.parentNode
            let p_fr_top = fr.parentNode     // nested top
            let p_fr = p_fr_top.parentNode   // parent fr

            let p_fr_bot = p_fr['bot_1']

            // case p_tree(fr_bot).list.length == 1 
            // will select bot, so not handled by case bot_i
            u.cut( dt_list )
            .paste()
            .into( p_fr_bot )
            .at("end")

            // if fr_top has item
            let fr_top = fr['top_1']
            let top_i = fr_top[ fr_top.list[0] ]

            if( fr_top.list.length == 1 
            && top_i.props.text == '1' ){
                // {1}/[]
                u.remove( fr )
            } else {
                // {ab}/[] => {ab}
                // transferTop
                let index_fr_top = p_fr_top.list.indexOf( fr_top.name )
                u.cutAllChildOf( fr_top )
                .paste()
                .into( p_fr_bot )
                .at( index_fr_top )

                u.remove( fr )
            }

            p_tree.updateProps()
            p_fr_bot.updateProps()
        
            return dt_list 
        }

        return { 
            name: this.name,
            updateUI,
            bottom 
        }
    }
}

