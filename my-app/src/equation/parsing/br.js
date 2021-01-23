import { op } from "../actions/xTree.js"
import { p } from "./path.js"

export let open_br = {
    name: "open_br",
    regex: /\(/,
    fn_before: plus_arr_bracket,
    from: {
        eq: '(eq)-bx-[br]',
        open_br: '(br)-bx-[br]',
        close_br: '(bx)-[br]',
        bx_sign: '(bx)-[br]',    // +( , -(
        i_sign: parse_i_sign,
        sym: '(bx)-[br]',
        num: '(bx)-[br]',
        divide: '(bot)-bx-[br]'
    }
}

export let close_br = {
    name: "close_br",
    regex: /\)/,
    fn_before: minus_arr_bracket,
    from: {
        any: get_parent_of_br
    }
}

function get_parent_of_br()
{
    // general enought to cover
    // 1. ... +a/b)
    // 2. ... +b)
    // [bx]-br-(...)

    op.getParentOf('br')
    // op.getParentOf('i') //@bx
}

function plus_arr_bracket( loop_obj )
{
    let { arr_bracket } = loop_obj
    if( arr_bracket.length > 0)
    {
        arr_bracket = arr_bracket.map( elem => elem + 1)
    }

    loop_obj.arr_bracket = arr_bracket
}

function minus_arr_bracket( loop_obj )
{
    let { arr_bracket } = loop_obj 
    let count_divide = arr_bracket.length
    if( count_divide > 0)
    {
        arr_bracket = arr_bracket.map( elem => elem -1 )
        if( arr_bracket[ count_divide - 1] == -1 )
        {
            arr_bracket.pop()
        }	
    }

    loop_obj.arr_bracket = arr_bracket
}

function parse_i_sign( loop_obj )
{
    let { add_i_sign } = loop_obj
    p.run('(bx)-[br]')
    op.addSign( add_i_sign )
    loop_obj.add_i_sign = false

}