import { op } from './xTree.js'
export let c ={
    changeSign: function ( show_arrow_list ) {

        let { length } = show_arrow_list
        if( length == 1  )
        { 
            this.singleItem( show_arrow_list[0] )   
        }
        else if( length == 2 )
        {
            // isBothItem, isSideBySide
            let isBothItem = true 
            let isSideBySide = true
            let isMinusOne = false

            let first_full_name = show_arrow_list[0]
            let second_full_name = show_arrow_list[1]
            let first_p_name 
            let second_p_name 
            
            let first_tree
            let second_tree 
            let arr_first_name = first_full_name.split("-")
            let arr_second_name = second_full_name.split("-")
            let first_name = arr_first_name.pop()
            let second_name = arr_second_name.pop()

            if( 
                first_name.search('num_') > -1
            )
            {
                first_p_name = arr_first_name.join('-')
                if( second_name.search('sym_') > -1 
                || second_name.search('num_') > - 1 
                || second_name.search('br_') > -1 )
                {
                    second_p_name = arr_second_name.join('-')
                }
                else
                {
                    isBothItem = false
                }
            }    
            else
            {
                isBothItem = false
            } 

            if( first_p_name != second_p_name 
            || !first_p_name 
            || !second_p_name )
            {
                isSideBySide = false
            }
            else
            {
                let list = op.getTreeByName( first_p_name ).tree.list
                let first_index = list.indexOf( first_name )
                let second_index = list.indexOf( second_name )
                if( first_index != second_index - 1 )
                {
                    isSideBySide = false
                }
                else
                {
                    first_tree = op.getTreeByName( first_full_name ).tree
                    
                    let { sign, text } = first_tree.props
                    if( sign == '-' && text == '1')
                    {
                        isMinusOne = true
                    }                    
                }
            }

            if( isSideBySide 
            && isBothItem 
            && isMinusOne )
            {
                
                let second_tree = op.getTreeByName( second_full_name ).tree
                this.mergeItems({
                    first_tree,
                    second_tree
                })
            }
            else
            {
                console.log("Error:selected elems not side by side or not items or not minus one.")
            }
        }
        else
        {
            console.log("Error: more than 2 elems selected.")
        }
    },
    singleItem: function( tree_name )
    {
        // item_tree or box_tree
        let tree = op.getTreeByName( tree_name ).tree
        let { type } = tree
            
        let p_tree = tree.parentNode  

        if( type == 'sym' 
        || type =='num' 
        || type == 'br' )
        {
            let index = p_tree.list.indexOf( tree.name )
            let i = tree // or br = tree
            let i_sign = i.props.sign
            if( i_sign )
            {   
                if( i_sign == '+' )
                {
                    // b*[+a] => b*[-1][-a]
                    tree.props.sign = '-'
                    
                    this.splitSign({ p_tree, index })

                    p_tree.updateProps()
                    i.checkDot()
                }
                else if( i_sign == '-' )
                {

                    // b*[-a] => b*[-1][a]
                    // remove -
                    if( i.props.text != '1')
                    {
                        tree.props.sign = undefined

                        this.splitSign({ p_tree, index })

                        p_tree.updateProps()
                        i.checkDot()
                    }
                    else
                    {
                        console.log("Not Splitting -1")
                    }
                }
            }
            else
            {
                // b[a] => b*[-1][-a]
                i.props.sign = '-'
                this.splitSign({ p_tree, index })
                
                p_tree.updateProps()
                i.checkDot()
            }
        }
        else if( type == 'bx' )
        {

            let bx = tree
            let bx_sign = bx.props.sign
            let bx_length = bx.list.length
            let i = bx[ bx.list[0] ]
            let i_type = i.type
            let i_sign = i.props.sign

            if( bx_length == 1 
            && i_type != 'fr')
            {
                // Exception:
                // [bx_sign(i_sign a)]
                // 1. bx_sign == i_sign
                // 2. bx_sign != i_sign                
                if( ( bx_sign == '+' || !bx_sign )
                && ( i_sign == '+' || !i_sign )
                )
                {   
                    // [a] || [+a]     => [--a] not [-(-1)a]  
                    bx.props.sign = '-'
                    i.props.sign = '-'
                }
                else if( bx_sign == '-' 
                && i_sign == '-')
                {
                    // [--a]    => [a] || [+a]
                    let b_index = bx.parentNode.list.indexOf( bx.name )
                    if( b_index === 0 )
                    {
                        bx.props.sign = undefined
                    }
                    else
                    {
                        bx.props.sign = '+'
                    }

                    i.props.sign = undefined

                }
                else
                {
                    // bx_sign != i_sign
                    if( bx_sign == '+' || !bx_sign )
                    {
                        // [+(-a)] || [(-a)] 
                        // => [-(a)] not [-(-1)-a] 
                        bx.props.sign = '-'
                        i.props.sign = undefined
                    }
                    else
                    {
                        // [-(a)]  
                        // =>  [+(-a)] || [(-a)]   not [+(-1)a] 
                        let b_index = bx.parentNode.list.indexOf( bx.name )
                        if( b_index === 0 )
                        {
                            bx.props.sign = undefined
                        }
                        else
                        {
                            bx.props.sign = '+'
                        }
                        i.props.sign = '-'
                    }
                }

                bx.updateProps()
            }
            else
            {
                // Exception: fr
                // [-abc/d] => [(-1)*(abc/d)]
                
                // not organised by signs because
                // don't know which item to put the -1

                // [abc]  => [-(-1)abc] || [- -abc] || [ (-1)(-1)abc] 
                // [+abc] => [-(-1)abc]
                // [+-abc] => [-(-1)-abc] => -[-1][-a]bc => -abc
                // [-abc] => [+(-1)abc] || [+ -abc] || 

                // [(-1)abc]   => [-abc]
                // [+(-1)abc]  => [-abc]
                // [-(-1)abc]  => [+abc] / [abc]

                if( bx_sign == '+' || !bx_sign )
                {
                    bx.props.sign = '-'
                }
                else if( bx_sign == '-')
                {
                    let b_index = bx.parentNode.list.indexOf( bx.name )
                    if( b_index === 0 )
                    {
                        bx.props.sign = undefined
                    }
                    else
                    {
                        bx.props.sign = '+'
                    }
                }
                
                let i = bx[ bx.list[0] ]
                let i_sign = i.props.sign
                
                if( i_sign =='-' 
                && i.props.text == '1' )
                {
                    // [?(-1)]
                    let next_i = bx[bx.list[1]]
                    op.removeThisTree(i)
                    next_i.checkDot()
                }
                else
                {
                    op.setTree(bx)
                    .addChild('num', 
                    {
                        selected:true,
                        show_arrow: false,                    
                        text: '1',
                        sign: '-',
                    }, 0)
                    i.checkDot()
                }

                bx.updateProps()
            }            
        }    
    },
    splitSign: function ( input )
    {
        let { p_tree, index,
            show_arrow = true } = input

        op.setTree( p_tree )
        op.addChild( 'num', { 
            selected: true,
            show_arrow,
            text: '1',
            sign: '-'
        }, index )
        .getChild( index )
        
    },
    mergeItems: function( input )
    {
        // [-1]*[a]  => [-a]
        // [-1]*[-a] => [a]

        let { first_tree, second_tree } = input
        let p_tree = first_tree.parentNode

        let s_tree_sign = second_tree.props.sign

        if( !s_tree_sign 
        || s_tree_sign == '+' )
        {
            // [-1]*[a]  => [-a]
            // [-1]*[+a]  => [-a]
            second_tree.props.sign = '-'
            op.removeThisTree( first_tree )
            p_tree.updateProps()
            second_tree.updateProps()
            second_tree.checkDot()
        }
        else if( s_tree_sign == '-')
        {
            // [-1]*[-a] => [a]
            second_tree.props.sign = undefined
            op.removeThisTree( first_tree )
            p_tree.updateProps()
            second_tree.updateProps()
            second_tree.checkDot()
        }        
    }
}