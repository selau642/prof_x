import { op } from "../actions/xTree.js"
import { p } from './path.js'
export let sym = {
    name: 'sym',
    regex: /[a-zA-Z]/,
    from:{
        eq: '(eq)-[bx]-sym-text',
        open_br: '(br)-[bx]-sym-text',
        close_br: '[(bx)]-sym-text',
        bx_sign: '[(bx)]-sym-text',
        i_sign: parse_i_sign('sym'), 
        sym: '[(bx)]-sym-text',
        num: '[(bx)]-sym-text',
        multiply: '[(bx)]-sym-text',
        divide: '[(bot)]-sym-text',
    }
}

export let num = {
    name: "num",
    regex: /[0-9]|\./, //add decimal
    from:{
        eq: '(eq)-[bx]-num-text',
        open_br: '(br)-[bx]-num-text',
        close_br: '[(bx)]-num-text',
        bx_sign: '[(bx)]-num-text',
        i_sign: parse_i_sign('num'),
        sym: '[(bx)]-num-text',
        num: append_number, //12 parse as twelve not one x two
        divide: '(bot)-[bx]-num-text',
        multiply: '[(bx)]-num-text',
    }
}

function append_number( loop_obj )
{
    let { token } = loop_obj
    op.storeTree()
    //(bx)-num
    let num_elem = op.getLastChild() // num
                    .tree

    num_elem.props.text += token
    op.reloadTree()
}

function parse_i_sign ( sym_or_num)
{
    return ( loop_obj ) =>
    {
        let { add_i_sign, token } = loop_obj

        if( sym_or_num == 'sym')
        {
            p.run('(bx)-[sym]-text', token)
            op.addSign( add_i_sign )
            op.getParent(1) //@ bx
            loop_obj.add_i_sign = false
        }
        else if( sym_or_num == 'num' )
        {
            p.run('(bx)-[num]-text', token)
            op.addSign( add_i_sign )
            op.getParent(1) //@ bx
            loop_obj.add_i_sign = false
        }
    }
}