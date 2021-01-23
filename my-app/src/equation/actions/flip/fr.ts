import type { interaction } from "../interaction";
import type { Tree, Border } from '../types/main'
import { u } from "../utils/ui.js"
/** No flipping for fr */
export let bot_flip_up  = {
    name: "flip.bot.up",
    tree_type_list: ["bot"],
    isInContext: function(In: interaction): boolean {
        return false
    },
    makeBorder: function( In: interaction): Border | Border[] {

        let updateUI = function( In: interaction): Tree[]{
            let dt_list:Tree[]
            return dt_list
        }

        return { 
            name: this.name,
            updateUI 
        }
    }
}

export let top_flip_down  = {
    name: "flip.top.down",
    tree_type_list: ["top"],
    isInContext: function(In: interaction): boolean {
        return false
    },
    makeBorder: function( In: interaction): Border | Border[] {

        let updateUI = function( In: interaction): Tree[]{
            let dt_list:Tree[]
            return dt_list
        }

        return { 
            name: this.name,
            updateUI 
        }
    }
}