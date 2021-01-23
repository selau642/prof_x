import type { interaction } from "../interaction";
import type { Tree, Border } from '../types/main'
import { u } from "../utils/ui.js"

let action = {
    name: "",
    tree_type_list: ["bx"],
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