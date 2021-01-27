import { 
    flip_top_down,
    flip_top_i_down,
    flip_bot_up,
    flip_bot_i_up,
 } from './top'

 import{
    flip_bot_down,
    flip_bot_i_down,
    flip_top_up,
    flip_top_i_up
 } from './bot'
 
 /**
  * (top_top/top_bot) / (bot_top/bot_bot)
  * Simplify to:
  * (top)   / (?/bot)
  * (?/bot) / (top)
  */

export let flip ={
    top: {
        down: flip_top_down, 
        up: flip_top_up 
    },
    top_i: {
        down: flip_top_i_down, // i in top
        up: flip_top_i_up
    },
    // bx: { down: flip_bx_down }
    // bx_i: { down: flip_bx_i_down }
    bot: {
        up: flip_bot_up,
        down: flip_bot_down
    },
    bot_i: {
        up: flip_bot_i_up,
        down: flip_bot_i_down
    }
}