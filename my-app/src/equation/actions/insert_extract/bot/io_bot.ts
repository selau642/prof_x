import type { interaction } from "../../interaction";
import type { Tree, Border } from '../../types/main'
import { u } from "../../utils/ui.js"

/**
 *  1/[a] * 1/b => 1/[a]b
 */
export let insert_bot_into_bot_from_left = {
    name: "insert.bot.into_bot.from_left",
    tree_type_list: ["bot"],
    isInContext: function(In: interaction): boolean {
        let { fr_nt } = In.getProps(["fr_nt"])
        
        if( fr_nt.type == "fr" ){
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {
        let { p_tree } = In
        let { right } = document.getElementById( p_tree.full_name )
                            .getBoundingClientRect()

        let updateUI = function( In: interaction): Tree[]{
            let { dt_list, p_tree:fr } = In
            let p_fr = fr.parentNode
            let { fr_nt } = In.getProps(["fr_nt"])

            let nt_bot = fr_nt['bot_1']
            u.cutAllChildOf( dt_list )
            .paste()
            .into( nt_bot )
            .at("start")

            u.removeThisTree( p_tree )

            nt_bot.updateProps()
            p_fr.updateProps()

            return u.e_tree_list 
        }

        return { 
            name: this.name,
            updateUI,
            right 
        }
    }
}

export let insert_bot_into_bot_from_right = {
    name: "insert.bot.into_bot.from_right",
    tree_type_list: ["bot"],
    isInContext: function(In: interaction): boolean {
        let { p_tree_pt } = In.getProps(["p_tree_pt"])
        
        if( p_tree_pt.type == "fr" ){
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {
        let { p_tree } = In
        let { left } = document.getElementById( p_tree.full_name )
                            .getBoundingClientRect()
        let updateUI = function( In: interaction): Tree[]{
            let { dt_list, p_tree: fr } = In
            let p_fr = fr.parentNode
            let { fr_pt } = In.getProps(["fr_pt"])

            let nt_bot = fr_pt['bot_1']
            u.cutAllChildOf( dt_list )
            .paste()
            .into( nt_bot )
            .at("end")

            u.removeThisTree( p_tree )

            nt_bot.updateProps()
            p_fr.updateProps()

            return u.e_tree_list 
        }

        return { 
            name: this.name,
            updateUI,
            left 
        }
    }
}

export let extract_bot_out_of_bot_from_left = {
    name: "extract.bot.out_of_bot.from_left",
    tree_type_list: ["bot"],
    isInContext: function(In: interaction): boolean {
        let { p_tree:fr } = In
        let top = fr['top_1']
        let top_i = top[ top.list[0] ]
        // not 1/[b]
        if( !(top.list.length == 1
        && top_i.props.text == "1" ) ){
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {
        let { p_tree } = In
        let { left } = document.getElementById( p_tree.full_name )
                            .getBoundingClientRect()

        let updateUI = function( In: interaction): Tree[]{
            let { dt_list, p_tree: fr } = In
            let top = fr['top_1']
            let p_fr = fr.parentNode
            let fr_index = p_fr.list.indexOf( fr.name )
            /** 
             * a/[b] =>  1/[b]  * a(top)
            */
            let ct_list = top.list.map( ct_name => top[ct_name] )

            u.cutAllChildOf( [top] )
            .paste()
            .into( p_fr )
            .at( fr_index + 1)

            for( let ct of ct_list ){
                
                ct.props.show_arrow = false
                ct.props.selected = false
                ct.updateProps()
            }

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

export let extract_bot_out_of_bot_from_right = {
    name: "extract.bot.out_of_bot.from_right",
    tree_type_list: ["bot"],
    isInContext: function(In: interaction): boolean {
        let { p_tree:fr } = In
        let top = fr['top_1']
        let top_i = top[ top.list[0] ]
        // not 1/[b]
        if( !( top.list.length == 1
        && top_i.props.text == "1") ){
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {
        let { p_tree } = In
        let { right } = document.getElementById( p_tree.full_name )
                            .getBoundingClientRect()

        let updateUI = function( In: interaction): Tree[]{
            let { dt_list, p_tree: fr } = In
            let top = fr['top_1']
            let p_fr = fr.parentNode
            let fr_index = p_fr.list.indexOf( fr.name )
            /** 
             * a/[b] => a(top) *  1/[b]
            */

            let ct_list = top.list.map( ct_name => top[ct_name] )

            u.cutAllChildOf( [top] )
            .paste()
            .into( p_fr )
            .at( fr_index )

            for( let ct of ct_list ){
                ct.props.show_arrow = false
                ct.props.selected = false
                ct.updateProps()
            }

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