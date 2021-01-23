import { intros } from "svelte/internal";
import type { interaction } from "../../interaction";
import type { Tree, Border } from '../../types/main'
import { u } from "../../utils/ui.js"

/**
 *  1/[a] * b => b/[a]
 */

export let insert_bot_into_i_from_left = {
    name: "insert.bot.into.i.from_left",
    // left of i
    tree_type_list: ["bot"],
    isInContext: function(In: interaction): boolean {
        let { p_tree: fr } = In
        let top = fr["top_1"]
        let top_i = top[ top.list[0] ]

        let { fr_nt } = In.getProps(["fr_nt"])
        let i_list = ["sym", "num", "br"]
        if( i_list.indexOf( fr_nt.type ) > -1
        && top.list.length == 1
        && top_i.props.text == '1' ){
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {

        let { dt_border } = In.getProps(["dt_border"])
        let { right } = dt_border 

        let updateUI = function( In: interaction): Tree[]{
            let { fr_nt } = In.getProps(["fr_nt"])
            let { dt_list, p_tree: fr } = In

            let p_fr = fr.parentNode
            let top = fr["top_1"] 

            // let { show_arrow, selected } = fr_nt.props

            u.cut( [fr_nt] )
            .paste()
            .into( top )
            .at("start") 

            top.props.show_arrow = false
            top.props.selected = false
            
            fr_nt.props.show_arrow = false 
            fr_nt.props.selected = false 

            top.updateProps()
            p_fr.updateProps() 

            return dt_list
        }

        return { 
            name: this.name,
            updateUI,
            right
        }
    }
}

/**
 *  b * 1/[a] => b/[a]
 */

export let insert_bot_into_i_from_right = {
    name: "insert.bot.into.i.from_right",
    // right of b
    tree_type_list: ["bot"],
    isInContext: function(In: interaction): boolean {
        let { p_tree: fr } = In
        let top = fr["top_1"]
        let top_i = top[ top.list[0]]

        let { fr_pt } = In.getProps(["fr_pt"])
        let i_list = ["sym", "num", "br"]
        if( i_list.indexOf( fr_pt.type ) > -1 
        && top.list.length == 1
        && top_i.props.text == '1'){
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {

        let { dt_border } = In.getProps(["dt_border"])
        let { left } = dt_border

        let updateUI = function( In: interaction): Tree[]{
            let { fr_pt } = In.getProps(["fr_pt"])
            let { dt_list, p_tree: fr } = In

            let p_fr = fr.parentNode
            let top = fr["top_1"] 

            // let { show_arrow, selected } = fr_pt.props

            u.cut( [fr_pt] )
            .paste()
            .into( top )
            .at("start") 

            top.props.show_arrow = false
            top.props.selected = false

            fr_pt.props.show_arrow = false 
            fr_pt.props.selected = false

            top.updateProps()
            p_fr.updateProps() 

            return dt_list
        }

        return { 
            name: this.name,
            updateUI,
            left 
        }
    }
}