import { 
    insert_i_into_top_from_left,
    insert_i_into_top_from_right,
    extract_i_from_top_from_left,
    extract_i_from_top_from_right
 } from './i/io_top'

import { 
    insert_i_into_br_from_left,
    insert_i_into_br_from_right,
    extract_i_from_br_from_left,
    extract_i_from_br_from_right
} from './i/io_br'

import {
    extract_top_from_top_from_left,
    extract_top_from_top_from_right
} from './top/o_top'

import {
    extract_i_out_of_bot_from_left,
    extract_i_out_of_bot_from_right
} from './i/o_bot'

import {
    insert_bot_into_bot_from_left,
    insert_bot_into_bot_from_right,
    extract_bot_out_of_bot_from_left,
    extract_bot_out_of_bot_from_right
} from './bot/io_bot'

import {
    insert_bot_into_i_from_left,
    insert_bot_into_i_from_right
} from './bot/i_i'

export let insert = {
    i: {
        into: { 
            fr: {
                from_left: insert_i_into_top_from_left,
                from_right: insert_i_into_top_from_right 
            }, 
            br: {
                from_left: insert_i_into_br_from_left,
                from_right: insert_i_into_br_from_right
            }
        },
    },
    bot: {
        into:{
            bot: {
                from_left: insert_bot_into_bot_from_left,
                from_right: insert_bot_into_bot_from_right
            },
            i: {
                from_left: insert_bot_into_i_from_left,
                from_right: insert_bot_into_i_from_right
            }
        }
    }
}

export let extract = {
    i: {
        from:{
            fr: {
                from_left: extract_i_from_top_from_left, 
                from_right: extract_i_from_top_from_right
            }, 
            bot:{
                from_left: extract_i_out_of_bot_from_left,
                from_right: extract_i_out_of_bot_from_right
            },
            br:{
                from_left: extract_i_from_br_from_left,
                from_right: extract_i_from_br_from_right
            } 
        }
    },
    top:{
        from:{
            top:{
                from_left: extract_top_from_top_from_left,
                from_right: extract_top_from_top_from_right
            }
        }
    },
    bot:{
        from:{
            bot: {
                from_left: extract_bot_out_of_bot_from_left,
                from_right: extract_bot_out_of_bot_from_right
            }
        }
    }

}