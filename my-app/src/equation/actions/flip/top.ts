import type { interaction } from "../interaction";
import type { Tree, Border } from '../types/main'
import { u } from "../utils/ui.js"

/** 
 * top_i to bot 
 * (top_i)*i/(?/bot) 
*/
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

/**
 * top to bot
 * (top)/(?/bot) 
 */
export let flip_top_down  = {
    name: "flip.top.down",
    tree_type_list: ["top"],
    isInContext: function(In: interaction): boolean {
        return true
    },
    makeBorder: function( In: interaction): Border | Border[] {
        let { p_tree: fr } = In
        let { dt_border, arrow_to_border } = 
            In.getProps(["dt_border", "arrow_to_border"])

        let {
            left, right
        } = document.getElementById( fr.full_name )
                .getBoundingClientRect()
    
        let { bottom } = dt_border
        bottom = bottom - arrow_to_border
        let updateUI = function( In: interaction): Tree[]{
            let { dt_list, p_tree: fr } = In            
            
            let fr_top = dt_list[0]
            let fr_bot = fr['bot_1']

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
            
            fr.updateProps()
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

/**
 * bot to top
 * (top)/(?/bot)
 */
export let flip_bot_up = {
    name: "flip.bot.up",
    tree_type_list: ["bot"],
    isInContext: function(In: interaction): boolean {
        let { p_tree: fr} = In
        let p_bot = fr.parentNode
        // let top = fr['top_1']
        // let top_i = top[ top.list[0] ]
        if( p_bot.type == 'bot' 
        // && top.list.length == 1
        // && top_i.props.text == '1' 
        //&& top_i.props.sign == 
        ){
            // nested double bot
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {
        let { p_tree: fr} = In
        let { arrow_to_border } = In.getProps(["arrow_to_border"])
        let p_bot = fr.parentNode
        let p_fr = p_bot.parentNode
        let p_top = p_fr['top_1']
        let { bottom } = document.getElementById( p_top.full_name )
                    .getBoundingClientRect()

        let updateUI = function( In: interaction): Tree[]{
            /**
            * bot to top
            * (top)/(?/bot)
            */
            let { dt_list:[dt], p_tree:fr } = In
            let bot = dt 
            let top = fr['top_1']
            let top_i = top[ top.list[0] ]
            let p_bot = fr.parentNode
            let p_fr = p_bot.parentNode
            let p_top = p_fr['top_1']

            if( !(top.list.length == 1 
            && top_i.props.text == '1') )
            {
                // need transfer out item tree in top
                let top_child_list = top.list.map( tree_name =>
                            top[tree_name] )
                let fr_index = p_bot.list.indexOf( fr.name )                

                let top_arrow_list = top_child_list.map( tree =>{ 
                    return { 
                        tree,
                        show_arrow: tree.props.show_arrow, 
                        selected: tree.props.selected
                    }
                })

                // (?/bot) => (1/bot)*(?)
                u.cut( top_child_list )
                .paste()
                .into( p_bot )
                .at( fr_index )

                // recover top show_arrow, selected
                top_arrow_list.map( obj => {
                    let { tree, show_arrow, selected } = obj
                    tree.props.show_arrow = show_arrow
                    tree.props.selected = selected
                    tree.updateProps()
                }) 
            }

            u.cutAllChildOf( [bot] )
            .paste()
            .into( p_top )
            .at("start")

            u.removeThisTree( fr )
        
            p_top.updateProps()
            p_bot.updateProps()
            return u.e_tree_list
        }

        return { 
            name: this.name,
            updateUI,
            top: bottom - arrow_to_border
        }
    }
}

/**
 * bot_i to top
 * (top)/(?/(bot_i)*i)
 */
export let flip_bot_i_up = {
    name: "flip.bot_i.up",
    tree_type_list: ["sym","num", "br"],
    isInContext: function(In: interaction): boolean {
        let { p_tree: bot } = In
        let fr = bot.parentNode
        let p_bot = fr.parentNode
        
        if( bot.type == "bot" 
        && p_bot.type == "bot" 
        ){
            // nested double bot
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {
        let { p_tree: bot } = In

        let fr = bot.parentNode
        let p_bot = fr.parentNode
        let p_fr = p_bot.parentNode
        let p_top = p_fr["top_1"]
        let { bottom, left, right } = document.getElementById( p_top.full_name )
                        .getBoundingClientRect()

        let updateUI = function( In: interaction): Tree[]{
            // (top)/(?/(bot_i)*i)
            let { dt_list, p_tree:bot } = In

            let fr = bot.parentNode
            let p_bot = fr.parentNode
            let p_fr = p_bot.parentNode
            let p_top = p_fr["top_1"]

            u.cut( dt_list )
            .paste()
            .into( p_top )
            .at('start')
            
            bot.updateProps()
            p_top.updateProps()

            return dt_list
        }

        return { 
            name: this.name,
            updateUI,
            top: bottom,
            // left,
            // right
        }
    }
}