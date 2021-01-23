import type { interaction } from '../../interaction'
import type { Tree, Border } from '../../types/main'
import { u } from "../../utils/ui.js"

export let extract_top_from_top_from_left={
    name: "extract.top.from.top.from_left",
    tree_type_list: ["top"],
    isInContext: function(In: interaction): boolean {
        return true 
    },
    makeBorder: function( In: interaction): Border | Border[] {
        let { dt_border, p_tree_border } = 
                In.getProps(['dt_border', 'p_tree_border'])
        
        let { left } = p_tree_border 
        //let { bottom: top } = dt_border

        let updateUI = function( In: interaction): Tree[]{
            let { dt_list, p_tree } = In
            let bx = p_tree.parentNode
            let position = bx.list.indexOf( p_tree.name )

            u.cut( dt_list ) 
            .paste()
            .into( bx )
            .at( position )

            bx.updateProps()
            p_tree.updateProps()
            
            return u.e_tree_list 
        }

        return { 
            name: this.name,
            updateUI,
            left,
            // top
        }
    }
}

export let extract_top_from_top_from_right={
    name: "extract.top.from.top.from_right",
    tree_type_list: ["top"],
    isInContext: function(In: interaction): boolean {
        return true 
    },
    makeBorder: function( In: interaction): Border | Border[] {
        let { dt_border, p_tree_border } = 
                In.getProps(['dt_border', 'p_tree_border'])
        
        let { right } = p_tree_border 
        // let { top } = dt_border

        let updateUI = function( In: interaction): Tree[]{
            let { dt_list, p_tree } = In
            let bx = p_tree.parentNode
            let position = bx.list.indexOf( p_tree.name )
            position += 1

            u.cut( dt_list ) 
            .paste()
            .into( bx )
            .at( position )

            bx.updateProps()
            p_tree.updateProps()
            return u.e_tree_list 
        }

        return { 
            name: this.name,
            updateUI,
            right,
            // top
        }
    }
}