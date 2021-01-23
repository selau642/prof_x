import type { interaction } from "../interaction";
import type { Tree, Border } from '../types/main'
import { u } from "../utils/ui.js"

//   ( a / b ) / (c / d )
// down: a(top, top_i) => d (bot_fr_bot)  
export let flip_top_i_down  = {
    name: "flip.top_i.down",
    tree_type_list: ["sym","num", "br"],
    isInContext: function(In: interaction): boolean {
        let { p_tree } = In
        
        if( p_tree.type == "top" ){
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {
        let { p_tree } = In
        let { 
            dt_border,
            arrow_to_border
        } = In.getProps(["dt_border", "arrow_to_border"])

        let fr = p_tree.parentNode
        let { 
            left, 
            right 
        } = document.getElementById( fr.full_name )
                        .getBoundingClientRect()

        let { bottom } = dt_border
        bottom = bottom - arrow_to_border
        
        let updateUI = function( In: interaction): Tree[]{
            let { dt_list, p_tree } = In
            let fr = p_tree.parentNode
            let fr_bot = fr['bot_1']

            let {
                top: new_top,
                bot: new_bot
            } = u.makeFr( fr_bot )

            u.addOne( new_top )

            u.cut( dt_list )
            .paste()
            .into( new_bot )
            .at("start")

            p_tree.updateProps()
            fr_bot.updateProps()

            return [ new_bot ] 
        }

        return { 
            name: this.name,
            updateUI,
            bottom,
            left,
            right 
        }
    }
}

export let flip_top_down  = {
    name: "flip.top.down",
    tree_type_list: ["top"],
    isInContext: function(In: interaction): boolean {
        return true
    },
    makeBorder: function( In: interaction): Border | Border[] {

        let { p_tree } = In
        let { dt_border, arrow_to_border } = 
            In.getProps(["dt_border", "arrow_to_border"])

        let {
            left, right
        } = document.getElementById( p_tree.full_name )
                .getBoundingClientRect()
    
        let { bottom } = dt_border
        bottom = bottom - arrow_to_border
        let updateUI = function( In: interaction): Tree[]{
            let { dt_list, p_tree } = In            
            
            let fr_top = dt_list[0]
            let fr_bot = p_tree['bot_1']

            let {
                top: new_top,
                bot: new_bot
            } = u.makeFr( fr_bot )

            u.addOne( new_top )

            u.cutAllChildOf( dt_list )
            .paste()
            .into( new_bot )
            .at("start")

            u.addOne( fr_top )
            
            p_tree.updateProps()
            fr_bot.updateProps()

            return [ new_bot ] 
        }

        return { 
            name: this.name,
            updateUI,
            bottom,
            left,
            right 

        }
    }
}

export let flip_bx_i_down = {

}