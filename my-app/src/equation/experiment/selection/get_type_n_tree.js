import { op } from '../../actions/xTree.js'
//#let get_tree_type_n_tree_obj ={
    //#params:{
        //#tree: "the tree to check. OR",
        //#or_tree_full_name: "the tree full name to check."
    //#},
    //#types:{
        //#item:{},
        //#item_no_outer_item:{},
        //#box_first_child:{},
        //#box_second_child:{},
        //#box:{}
    //#},
//#fn_get_m_type_n_tree:{
export let get_type_n_tree = function _get_type_n_tree( input )
{
    let { tree, full_name } = input
      //#set_params:{
          //#if_not_tree:{ getTreeByFullName:{}}
    if( !tree ) tree = op.getTreeByName( full_name ).tree
           //#if_no_full_name: { set:{ full_name: "tree_full_name"}}
    if( !full_name ) full_name = tree.full_name 
      //#},
      //#set_prefix:{
    let prefix = full_name.split('-').pop()
    .split('_').shift()
      //#},
    //match_type
    let m_type = false 
    let m_tree = false
    //#if_prefix_is_item:{
    if( prefix == 'i')
    {
          //#if_has_outer_item_parent:{
        let b_tree = tree.parentNode //bracket_tree
        if( b_tree.list.length > 1 )
        {
              //#set:{ m_type:"item" }
            m_type ='item'            
        }
          
          //#},
          //#else_if_no_outer_item_parent:{            
        else 
        {
            //#comment:"case [a]b = c  -->> single box in eq",
            //#set: { m_type:"item_no_outer_item" }
            m_type = 'item_no_outer_item'

        }
        //#},
        //#set: { m_tree:"tree" }
        m_tree = tree
    }
    //#},
    //#else_if_prefix_is_box:{
    else if( prefix == 'bx')
    {
        let box_tree_length = tree.list.length
        //#if_box_has_one_child:{
        if( box_tree_length == 1 )
        {
            //box[ item[y] ]  --> item[y]
            //#set:{
                //#m_type:'box_first_child',
            m_type = 'box_first_child'
                //#m_tree:'box_first_child'
            m_tree = op.setTree(tree).getChild(0).tree
            //#}
        }
        //#},
        //#if_box_has_two_child:{
        else if( box_tree_length == 2)
        {
            let first_type = op.setTree(tree).getChild(0).tree.props.type
            //#if_first_child_is_plus_minus:{
            if( first_type == 'bin')
            {
                //[-y]  --> -[y]
                  //#set:{
                    //#m_type:"box_second_child",
                m_type = 'box_second_child'
                    //#m_tree:"box_second_child"
                m_tree = op.setTree(tree).getChild(1).tree
                  //#}
            }
            //#},
            //#else_box_has_two_proper_childs:{
            else
            {
                // [{a}b] or [{3}a]
                //#set:{
                  //#type:'box',
                m_type = 'box'
                  //#tree: "tree"
                m_tree = tree
                //#}
            }
            //#}
        }    
        //#},
        //#else:{
        else
        {
              //#set:{
                //#type:'box',
            m_type = 'box'
                //#tree: 'tree'
            m_tree = tree
              //#}
        }
        //#}
    }
    //#},
    //#else_if_prefix_not_box_n_not_item:{      
    else
    {
        //#set: { 
          //#m_type: 'other',
        m_type = 'other'
          //#m_tree: 'tree'
        m_tree = tree
        //#}
    }
    //#},
    //#return:{
            //#m_type:{},
            //#m_tree:{}
    return { m_type, m_tree }
    //#}
}
//#}
//#}