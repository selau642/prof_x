import { op } from '../xTree.js'

export let get_type_n_tree = function _get_type_n_tree( input )
{
    let { tree, full_name } = input
    if( !tree ) tree = op.getTreeByName( full_name ).tree          
    if( !full_name ) full_name = tree.full_name 

    
    // let prefix = full_name.split('-').pop()
    // .split('_').shift()
    let prefix = tree.name.split('_')[0]
    let m_type = false 
    let m_tree = false

    if( prefix == 'i')
    {
        let b_tree = tree.parentNode //bracket_tree
        if( b_tree.list.length > 1 )
        {
            // [a]b {+ c}= d 
            // {sibling}
            m_type = 'item_parent_w_sibling' 
        }            
        else 
        {
            // [a]b = c, single box in equation
            // {no sibling}
            m_type = 'item_parent_x_sibling'
        }
        m_tree = tree
    }
    else if( prefix == 'bx')
    {
        let box_tree_length = tree.list.length

        if( box_tree_length == 1 )
        {
            //box[ item[y] ]  --> item[y]
            m_type = 'box_one_child'
            m_tree = op.setTree(tree).getChild(0).tree

        }
        else if( box_tree_length == 2)
        {
            let first_type = op.setTree(tree).getChild(0).tree.props.type

            if( first_type == 'bin')
            {
                // [+y]  -->  +[y]
                // or
                // [-y]  -->  -[y]
                m_type = 'box_second_child'
                m_tree = op.setTree(tree).getChild(1).tree
            }
            else
            {
                // normal box
                // [{a}b] 
                // or
                // [{3}a]

                m_type = 'box'
                m_tree = tree
            }
        }    
        else
        {
            m_type = 'box'
            m_tree = tree
        }

    }
    else
    {
        m_type = 'other'
        m_tree = tree

    }
    return { m_type, m_tree }

}
