import { flip_top_down, flip_top_i_down } from './top'

/** flip above fr or below */
/** 4 types of main action
 *  ( a / b ) / (c / d)
 *   a -> d , d -> a
 *   b -> c , c -> b
 *  
 * Names each:
 *   a = top, top_i, top_fr_top, top_fr_top_i
 *   b = top_fr_bot, top_fr_bot_i
 *   c = bot, bot_i, bot_fr_top, bot_fr_top_i
 *   d = bot_fr_bot, bot_fr_bot_i 
 *  
 *   ( a / b ) / (c / d )
 * Action Rules:
 *  down: a(top, top_i) => d (bot_fr_bot)               ...special case bx go down, 1/(1/bx)
 *  up  : d(bot_fr_bot) => a (top, top_i)
 *  down: b(top_fr_bot, top_fr_bot_i) => c (bot, bot_i)
 *  up  : c(bot, bot_i) => b (top_fr_bot)
 */ 

export let flip ={
    top_i:{
        down: flip_top_i_down,
    },
    top: {
        down: flip_top_down
    }
}