import type { interaction } from "../interaction";
import type { Tree, Border } from '../types/main'
import { u } from "../utils/ui.js"

/** (?/bot)/(top) */
export let flip_bot_down = {
    name: "flip.bot.down",
    tree_type_list: ["bot"],
    isInContext: function(In: interaction): boolean {
        let { p_tree: fr } = In 
        let p_top = fr.parentNode
        if( p_top.type == "top"){
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {
        let { p_tree: fr } = In
        let { arrow_to_top } = In.getProps(["arrow_to_top"])
        let p_top = fr.parentNode
        // let p_fr = p_top.parentNode
        
        let { bottom, left, right } = document
                .getElementById(p_top.full_name)
                .getBoundingClientRect()

        let updateUI = async function( In: interaction): Tree[]{
            /** (?/bot)/(top) */
            let { dt_list, p_tree: fr } = In

            let bot = dt_list[0]
            let p_top = fr.parentNode
            let top = fr["top_1"]_
            let top_i = top[ top.list[0] ]
            if( !(top.list.length == 1
            && top_i.props.text == "1" ))
            {
                // transfer top child
                let top_child_list = top.list.map( tree_name =>
                            top[tree_name] )
                let fr_index = p_top.list.indexOf( fr.name )                

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
                .into( p_top )
                .at( fr_index )

                // recover top show_arrow, selected
                top_arrow_list.map( obj => {
                    let { tree, show_arrow, selected } = obj
                    tree.props.show_arrow = show_arrow
                    tree.props.selected = selected
                    tree.updateProps()
                }) 
            }

            let p_fr = p_top.parentNode
            let p_bot = p_fr["bot_1"]
            u.cutAllChildOf( [bot] )
            .paste()
            .into( p_bot )
            .at("start") 

            // bubbles up
            u.removeFr( fr ) 

            p_top.updateProps()
            p_bot.updateProps()

            await u.tick()
            p_fr.renderFraction()

            return u.e_tree_list 
        }

        return { 
            name: this.name,
            updateUI,
            bottom: bottom - arrow_to_top,
            // left,
            // right 
        }
    }
}

/** (?/(bot_i)*i)/(top) */
export let flip_bot_i_down ={
    name: "flip.bot_i.down",
    tree_type_list: ["sym","num", "br"],
    isInContext: function(In: interaction): boolean {
        let { p_tree: bot } = In
        let fr = bot.parentNode  
        let p_top = fr.parentNode
        if( bot.type == 'bot' 
        && p_top.type == 'top'
        ){
            // bot_i in top_bot
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {

        let { p_tree: bot } = In
        let { arrow_to_top } = In.getProps(["arrow_to_top"])
        let fr = bot.parentNode
        let p_top = fr["top_1"]
                           
        let { bottom } = document.getElementById( p_top.full_name ) 
                            .getBoundingClientRect()

        let updateUI = function( In: interaction): Tree[]{
            /** (?/(bot_i)*i)/(top) */
            let { dt_list, p_tree:bot } = In 

            let fr = bot.parentNode
            let p_top = fr.parentNode     // nested top
            let p_fr = p_top.parentNode   // parent fr
            let p_bot = p_fr['bot_1']

            u.cut( dt_list )
            .paste()
            .into( p_bot )
            .at("start")

            bot.updateProps()
            p_bot.updateProps()
            return dt_list 
        }

        return { 
            name: this.name,
            updateUI,
            bottom: bottom - arrow_to_top 
        }
    }
}

/** (?/bot)/(top) */

export let flip_top_up ={
    name: "flip.top.up",
    tree_type_list: ["bot"],
    isInContext: function(In: interaction): boolean {
        let { p_tree: fr } = In
        let top = fr["top_1"]

        let topHasFr = top.list.filter(
            tree_name => tree_name.search("fr") > -1
        )

        if( topHasFr 
        && topHasFr.length >= 1 ){
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {
        /** (?/bot)/(top) */
        let { dt_list, p_tree:bot } = In

        let fr = bot.parentNode
        let top = fr["top_1"]

        let { 
            bottom, 
            left, 
            right 
        } = document.getElementById( top.full_name )
                    .getBoundingClientRect()

        let updateUI = function( In: interaction): Tree[]{
            /** (?/bot)/(top) */
            
            let { dt_list:[ dt ] , p_tree: fr } = In
            let bot = dt
            let top = fr["top_1"]
             
            let { 
                top: new_top,
                bottom: new_bot
            } = u.makeFr( top, 0 )

            u.addOne( new_top )

            u.cutAllChildOf( bot ) 
            .paste()
            .into( new_bot )
            .at("start")

            let p_fr = fr.parentNode 
            let fr_index = p_fr.list.indexOf( fr.name )

            let top_child_list = top.list.map( tree_name =>{
                let tree = top[ tree_name ]
                return {
                    tree,
                    show_arrow: tree.props.show_arrow,
                    selected: tree.props.selected
                }
            })

            u.cutAllChildOf( top )
            .paste()
            .into( p_fr )
            .at( fr_index )

            top_child_list.map( obj => {
               let { tree, show_arrow, selected } = obj 
               tree.props.show_arrow = show_arrow
               tree.props.selected = selected
            })

            u.removeFr( fr )

            p_fr.updateProps()

            return [ new_bot ] 
        }

        return { 
            name: this.name,
            updateUI,
            top: bottom,
            //left,
            //right 
        }
    }
}

/** (?/bot)/((top_i)*i) */
export let flip_top_i_up ={
    name: "flip.top_i.up",
    tree_type_list: ["sym", "num", "br"],
    isInContext: function(In: interaction): boolean {
        let { p_tree: bot } = In
        if( bot.type == "bot" ){
            return true 
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border | Border[] {
        let { p_tree: bot } = In 
        let { arrow_to_bottom } = In.getProps(["arrow_to_bottom"])
        let fr = bot.parentNode
        let top = fr["top_1"]
        let { 
            bottom,
            // left,
            // right
        } = document.getElementById( top.full_name )
            .getBoundingClientRect()

        let updateUI = async function( In: interaction): Tree[]{
            let { dt_list, p_tree:bot } = In 
            let fr = bot.parentNode
            let top = fr["top_1"]

            let {
                top: new_top,
                bot: new_bot
            } = u.makeFr( top, 0 )

            u.addOne( new_top )
            
            u.cut( dt_list )
            .paste()
            .into( new_bot )
            .at("start")
           
            bot.updateProps()
            top.updateProps()

            // let new_fr = new_top.parentNode
            // u.add( new_fr )
            // .to( top )
            // .andUpdateDiv()

            await u.tick()
            // bubble up
            fr.renderFraction()

            return [ new_bot ] 
        }

        return { 
            name: this.name,
            updateUI,
            top: bottom - arrow_to_bottom,
            // left,
            // right 
        }
    }
}