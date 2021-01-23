import type { interaction } from "../../interaction";
import type { Tree, Border } from '../../types/main'
import { u } from "../../utils/ui.js"
/**
 *  1/[a]b => 1/[a]* 1/b
 */
export let extract_i_out_of_bot_from_left = {
    name: "extract.i.out_of_bot.from_left",
    tree_type_list: ["sym","num", "br"],
    isInContext: function(In: interaction): boolean {
        let { dt_list:[dt], p_tree:bot } = In
        let dt_index = bot.list.indexOf( dt.name )

        if( bot.type == "bot" 
        && bot.list.length > 1 
        && dt_index === 0 // is left most element 
        ){
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {
        let { p_tree: bot } = In
        let { left } = document.getElementById( bot.full_name )
                            .getBoundingClientRect()

        let updateUI = function( In: interaction): Tree[]{
            let { dt_list, p_tree: bot } = In
            let fr = bot.parentNode
            let p_fr = fr.parentNode
            let fr_index = p_fr.list.indexOf( fr.name )
            
            let { 
                top: new_top, 
                bot: new_bot
            } = u.makeFr( p_fr, fr_index )

            u.addOne( new_top )

            u.cut( dt_list )
            .paste()
            .into( new_bot )
            .at("start")

            for( let tree of dt_list ){
                tree.props.show_arrow = false
                tree.updateProps()
            }

            new_bot.props.show_arrow = true
            new_bot.props.selected = true
            // new_bot not yet rendered no updateProps
            // new_bot.updateProps()
            p_fr.updateProps()
            return [ new_bot ] 
        }

        return { 
            name: this.name,
            updateUI,
            left 
        }
    }
}

export let extract_i_out_of_bot_from_right = {
    name: "extract.i.out_of_bot.from_right",
    tree_type_list: ["sym","num", "br"],
    isInContext: function(In: interaction): boolean {
        let { dt_list:[dt], p_tree: bot } = In
        let dt_index = bot.list.indexOf( dt.name ) 
        if( bot.type == "bot" 
        && bot.list.length > 1 
        && dt_index == bot.list.length - 1 // right most element
        ){
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {
        let { p_tree: bot } = In
        let { right } = document.getElementById( bot.full_name )
                            .getBoundingClientRect()

        let updateUI = function( In: interaction): Tree[]{
            let { dt_list, p_tree:bot } = In
            let fr = bot.parentNode
            let p_fr = fr.parentNode
            let fr_index = p_fr.list.indexOf( fr.name )
            
            let { 
                top: new_top, 
                bot: new_bot
            } = u.makeFr( p_fr, fr_index + 1 )

            u.addOne( new_top )

            u.cut( dt_list )
            .paste()
            .into( new_bot )
            .at("start")
            
            for( let tree of dt_list ){
                tree.props.show_arrow = false
                tree.updateProps()
            }

            new_bot.props.show_arrow = true
            new_bot.props.selected = true
 
            // new_bot.updateProps()
            p_fr.updateProps()
            return [ new_bot ] 
        }

        return { 
            name: this.name,
            updateUI,
            right 
        }
    }
}
