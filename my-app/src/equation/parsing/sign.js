import { op } from "../actions/xTree.js"
import { p } from './path.js'
export let sign = {
    name: "sign",
    regex: /\+|-/,
    from:{
        eq: check_negative_sign,
        open_br: check_negative_sign,
        
        sym: [if_close_fraction, else_close_box ],
        num: [if_close_fraction, else_close_box], 
        close_br: [if_close_fraction, else_close_box],
        
        divide: divide,
        multiply: multiply      
    }

}

function check_negative_sign( loop_obj )
{
    let { token } = loop_obj
    if( token == '-' )
    {
        // op.addChild('sign')
        // .getLastChild()
        // .addText( token )
        p.run('(eq)-[bx]')
        op.addSign(token)
        
        loop_obj.change_type = 'bx_sign'
    }
}

function if_close_fraction( loop_obj )
{
    let { arr_bracket, token } = loop_obj
    if( arr_bracket.length > 0 
    && arr_bracket[arr_bracket.length - 1] == 0)
    {
        // end of fraction
        // (...)/(...) [+] a
        // a/b [+] c
        // console.log( 'close_fraction:')
        // console.log( op.tree.full_name )
        arr_bracket.pop()
        loop_obj.arr_bracket = arr_bracket
        
        p.run('[p]-bx-fr-(bot)')
        // op.getParentOf('fr')
        // // eq-bx-[i]-fr

        // op.getParentOf('bx')
        // // [eq]-bx-i-fr
        // // @box
        p.run('(eq)-[bx]')
        op.addSign(token)

        loop_obj.change_type = 'bx_sign'
        // op.addChild('bx').getLastChild()
        // op.addChild('i').getLastChild()
        // op.addChild('sign').getLastChild()
        //   .addText( token )

        return { end_loop: true }
    }
}

function else_close_box( loop_obj )
{
    // default
    let { token } = loop_obj
    // close box
    p.run('[eq]-(bx)')
    
    // make new box containing sign
    p.run('(eq)-[bx]')
    op.addSign(token)

    loop_obj.change_type = 'bx_sign'
    return { end_loop: true }
}

function divide( loop_obj )
{
    let { token } = loop_obj 
    // p.run( '([bot])-sign', token )
    loop_obj.change_type = 'i_sign'
    loop_obj.add_i_sign = token 
}

function multiply( loop_obj )
{
    let { token } = loop_obj 
    // p.run( '[(bx)]-sign' , token )
    loop_obj.change_type = 'i_sign'
    loop_obj.add_i_sign = token
}

function check_sign()
{
    // TO DO:
    // minus x minus = plus
    // plus x minus = minus
    // etc
}
