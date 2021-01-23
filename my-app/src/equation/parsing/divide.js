import { op } from "../actions/xTree.js"
// let { p } = require('./path')

// fr-top-[bx]-i
// bx is needed to allow -top / -bot signs

export let divide = {
    name: "divide",
    regex: /\//g,
    from:{
        close_br: close_br_to_divide,
        sym: sym_to_divide,
        num: num_to_divide
    }
}


export let multiply = {
    name: "multiply",
    regex: /\*/,
    from: {}
}

function close_br_to_divide( loop_obj )
{
    // eq-{(bx)-i-br-bx-i-sym}
    // eq-{(bx)-i-sym-text}
    // =>>
    // eq-(bx)-i-sign-text
    // eq-(bx)-fr-top-{-i-br-bx-i-sym}
    any_to_divide( loop_obj )
}

function sym_to_divide( loop_obj )
{
    // box_tree = this.tree.parentNode	
    any_to_divide( loop_obj )
}

function num_to_divide( loop_obj )
{
    any_to_divide( loop_obj )
}

function any_to_divide( loop_obj )
{
    // let box_tree 
    let bx = op.tree

    op.getParent(1) // at eq
    // eq-(bx)-fr-top-{sym}

    // let { i, fr, top: paste_tree } 
    // = op.setTree(eq)
    // .make( '(eq)-bx-{fr}-{top}', { selected: true })
    // .getMakeBranch()

    let p_bx = op.addChild('bx').getLastChild().tree
    let fr = op.addChild('fr').getLastChild().tree

    op.addChild('top')		
    
    if( bx.props.sign )
    {
        //redo
        p_bx.props.sign = bx.props.sign
    }

    let top = op.getChild('top_1').tree
    
    //@ box-frac-top

    op.setTree(bx).cutAllChildTree()
    op.removeThisTree( bx )
    op.setTree(top).pasteAllChildTree()
    // op.pasteChildTree({
    //     cut_tree: op.getFirstTempTree(), 
    //     paste_tree: top, 
    //     paste_index: 0, 
    //     new_props: { show_arrow:false }
    // })


    // transfer old box i_sign to fraction i_sign
    // let bx_list_length = bx.list.length
    // let i = bx[ bx.list[ bx_list_length - 1] ]
    // let first_elem = i[ i.list[0] ] // @sign

    // if( first_elem.type == 'i_sign' )
    // {
    //     op.cutThisTree( first_elem )
    //     op.pasteChildTree({
    //         cut_tree: op.getFirstTempTree(), 
    //         paste_tree: fr_sign_tree, 
    //         paste_index: 0, 
    //         new_props: { show_arrow:false }
    //     })
    // }
    
    // @frac
    op.setTree(fr)
    .addChild('bot')
    .getLastChild()

    
    // count_divide ++
    let { arr_bracket=[] } = loop_obj
    arr_bracket.push(0)
    loop_obj.arr_bracket = arr_bracket
}

