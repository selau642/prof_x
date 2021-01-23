import { op } from '../../actions/xTree.js'
import { get_type_n_tree } from './get_type_n_tree.js'
//#export let show_arrow_obj = {
    //#description:"operates on tree to show arrow including checking for yellow arrows.",
    //#params:{
        //#tree: 'tree to remove yellow arrow',
        //#tree_type: 'type according to get_type_n_tree',
        //#loop_obj: 'for use when calling fn in loops'    
    //#},
//#fn_op_show_arrow:{
export let op_show_arrow = function _op_show_arrow( input )
{
    let { tree, tree_type, loop_obj } = input
    //#set:{

    //#i_tree: 'tree',
    let i_tree = tree //input_tree
    //#if_not_tree_type:{
    if( !tree_type )
    {
        //#set:{ 
        let check_tree = get_type_n_tree({ tree:tree })
        //#tree: {call_get_type_n_tree:"tree"}, 
        tree = check_tree.m_tree
        //#tree_type:{ call_get_type_n_tree:"tree"}
        tree_type = check_tree.m_type
        //#}
    }
     //#}
    //#},
    //#set:{
    let p_tree = tree.parentNode
    let prefix = tree.name.split('_')[0]
        //#is_box:{ test_prefix:'bx'},
    let is_box = ( prefix == 'bx' )
    let { b_tree } = loop_obj //b_tree = bracket_tree
    //#b_tree: 'p_tree.parentNode',
    //#loop_obj: 'b_tree',
    if( !b_tree )
    {
        loop_obj.b_tree = b_tree = p_tree.parentNode
    }
        //#b_tree_length: 'p_tree.parentNode.list.length',
        //#loop_obj: 'b_tree_length',
    let { b_tree_length } = loop_obj
    if( !b_tree_length)
    {
        loop_obj.b_tree_length = b_tree_length 
            = p_tree.parentNode.list.length
    }
        //#item_no_outer_sibling:{ test_b_tree_length:1 }
    let item_no_outer_sibling = (b_tree_length == 1)
    //#},    
    //#if_is_box:{
    if( is_box )
    {
        //#input_tree_show_arrow:{},
        i_tree.props.show_arrow = true

        //#loop_input_tree_child:{
        let i_tree_list = [ ...i_tree.list ] 
        let i_tree_loop_obj = {}
        for( let child_name of i_tree_list)
        {
            let child_tree = i_tree[ child_name ]
            //#call_op_hide_arrow:{ tree:"child_tree", loop_obj:'i_tree_loop_obj'}
            op_hide_arrow({
                tree: child_tree,
                loop_obj:i_tree_loop_obj
            })
        }
        //#}
    }
    //#},
    //#else_if_item_no_outer_sibling:{
    else if( item_no_outer_sibling )
    {
        //#i_tree_show_arrow:{}
        i_tree.props.show_arrow = true
    }    
    //#},
    //#if_not_box_n_item_has_outer_sibling:{
    else 
    {
        //#set:{
            //#t_depth:'tree_split_full_name_length',
        let t_depth = tree.full_name.split("-").length
            //#t_sub_formula: 'tree_sub_formula',
        let t_sub_formula = tree.props.sub_formula
            //#match_list:"blank array",
        let match_list = []
            //#pasted_tree_names:"blank_array"
        // let pasted_tree_names = []
        let pasted_tree_list = []
        //#},

        //#ots_show_arrow_list:{
        let { show_arrow_list } = loop_obj
        
        if( !show_arrow_list )
        {
            //#get_show_arrow_list:{
            loop_obj.show_arrow_list = show_arrow_list 
                = op.getShowArrowList( b_tree.full_name )
            //#},            
            //#if_tree_in_show_arrow_list:{
            let tree_index = show_arrow_list.indexOf( tree.full_name )
            if( tree_index > -1)
            {
                //#remove_tree_name:{
                show_arrow_list.splice( tree_index, 1)
                //#}
            }
            //#}
        }
        //#},
        //#loop_count_match_outer_tree:{
        
        for( let arrow_item_name of show_arrow_list )
        {
            //1. check prefix type first 
            //      then check depth
            //2. then check sub_formula match

            //#check_prefix_check_depth:{
              //#destructure_call_get_type_n_tree:{},
            let { m_type, m_tree } = get_type_n_tree({ full_name: arrow_item_name })
              //#set:{ m_depth:'m_tree_full_name_split_length'}
            if( !m_tree ) console.log( 'arrow_item_name', arrow_item_name ) 
            let m_depth = m_tree.full_name.split('-').length

            //#},
            //#if_match_depth:{
            if( m_depth == t_depth )
            {
                let m_sub_formula = m_tree.props.sub_formula
                //#if_match_sub_formula:{
                if( m_sub_formula == t_sub_formula )
                {
                    //#match_list_push:{ obj:{ type:'m_type', tree:'m_tree'} },
                    match_list.push( {
                        type: m_type,
                        tree: m_tree                        
                    } )
                    //},
                    //#pasted_tree_names_push:{ m_tree_full_name:{}}
                    // pasted_tree_names.push( m_tree.full_name )
                    pasted_tree_list.push( m_tree )
                }
                //#}
            }
            //#}
        }
        //#},
        //#if_not_all_match_outer_item:{
        if( b_tree_length - 1 != match_list.length 
            && match_list.length == 0 )
        {
            //no yellow arrow, just show normal arrow
            //#input_tree_show_arrow:{}
            i_tree.props.show_arrow = true
        }
        //#},
        //#else_if_found_all_match_outer_item:{
        else //if( b_tree_length - 1 == match_list.length ) // plus 1 count of tree
        {
            //#match_list_push:{ obj:{type:"tree_type", tree:"tree"}
            match_list.push({ 
                type: tree_type, 
                tree: tree
            }) 
            //#},
            //#pasted_tree_names_push:{ m_e_tree_full_name:{} },
            // pasted_tree_names.push( tree.full_name )
            pasted_tree_list.push( tree )
            //#loop_all_match_item:{
            for( let obj of match_list )
            {   
                let { tree, type } = obj

                //#m_tree:{

                    //#show_arrow_yellow:{},
                tree.props.arrow_type = 'top_yellow'
                tree.props.show_arrow = true
                    //#set_pasted_tree_names:{},
                // tree.props.pasted_tree_names = pasted_tree_names
                tree.props.pasted_tree_list = pasted_tree_list
                tree.props.yellow_type = type
                //#},
                tree.updateProps()
                //#if_m_type_eq_item:{
                // if( type =='item')
                // {
                        //#m_tree_update_props:{}
                //     tree.updateProps()
                // }
                //#},
                //#if_m_type_eq_box_first_child:{
                if( type == 'box_first_child' )
                {
                    //case [y]
                    //#parent_tree:{
                    let parent_tree = tree.parentNode
                        //#hide_arrow:{},
                    parent_tree.props.show_arrow = false
                        //#deselect:{},
                    parent_tree.props.selected = false
                        //#update_props:{}
                    parent_tree.updateProps()
                    //#}
                }
                //#},
                //#if_m_type_eq_box_second_child:{
                else if( type == 'box_second_child')
                {
                    // case -[y]
                    
                    //#parent_tree:{
                    let parent_tree = tree.parentNode
                    //#hide_arrow:{},
                    parent_tree.props.show_arrow = false
                    //#deselect_parent:{},
                    parent_tree.props.selected = false
                    //deselect_first_child:{}
                    let first_child = parent_tree[parent_tree.list[0]]
                    first_child.props.selected = false
                    //#update_props:{}
                    parent_tree.updateProps()
                    //#}
                }
                //#}
                
            }
            //#}
        }
        //#}
    }
    //#}

//#}
}
//#}



//#let hide_arrow_obj = {
    //#params:{
        //#tree: 'tree to remove yellow arrow',
        //#loop_obj: 'for use when calling fn in loops'    
    //#},
    //#fn_hide_arrow:{
export let op_hide_arrow = function _op_hide_arrow( input )
{    

    let { tree, loop_obj } = input
    // 1. action == 'add' vs 'remove'
    // add : 1. check if not single item box
    //      2. match_tree_name_list
    //      3. set arrow_type = 'yellow'
    // remove: 1. check if tree.props.arrow_type = yellow
    //      2. no need match_tree_name_list
    //      3. set arrow_type = 'multi_top' 

    //#set:{
        //#p_tree:'tree.parentNode',
    let p_tree = tree.parentNode
        //#is_tree_yellow_arrow: { test:'tree_arrow_type_eq_yellow'}
    let is_tree_yellow_arrow =  (tree.props.arrow_type.search('yellow') > -1 )
    //#},
    //#if_not_is_tree_yellow_arrow:{
    if( !is_tree_yellow_arrow )
    {
          //#tree_hide_arrow:{}
        tree.props.show_arrow = false
    }
    //#},
    //#else_if_is_tree_yellow_arrow:{
    else //if( is_tree_yellow_arrow )
    {
        //#set:{
            //#bracket_tree:{
        let { b_tree } = loop_obj //b_tree = bracket_tree
        if( !b_tree )
        {
            loop_obj.b_tree = b_tree = p_tree.parentNode
        }
            //#},
            //#bracket_tree_length:{
        let { b_tree_length } = loop_obj
        if( !b_tree_length)
        {
            loop_obj.b_tree_length = b_tree_length 
                = p_tree.parentNode.list.length
        }
            //#},
            //#tree_depth:{},
        let t_depth = tree.full_name.split("-").length
            //#tree_sub_formula:{},
        let t_sub_formula = tree.props.sub_formula
            //#match_tree_list:{},
        let match_tree_list = []
        let match_tree_name_list = []
        //#},

        //#ots_show_arrow_list:{
        let { show_arrow_list } = loop_obj
        
        if( !show_arrow_list )
        {
            //#get_show_arrow_list_with_yellow_arrow:{
            loop_obj.show_arrow_list = show_arrow_list 
                = op.getShowArrowList( b_tree.full_name, 'yellow' )
            //#},
            
            //#if_tree_in_show_arrow_list:{
            let tree_index = show_arrow_list.indexOf( tree.full_name )
            if( tree_index > -1)
            {
                //#remove_tree_name:{
                show_arrow_list.splice( tree_index, 1)
                //#}
            }
            //#}
        }
        //#},
        //#loop_count_match_outer_tree:{
        
        for( let arrow_item_name of show_arrow_list )
        {
            //#if_same_depth:{
            let arrow_item_depth = arrow_item_name.split('-').length
            let is_same_depth = ( arrow_item_depth == t_depth )
            if( is_same_depth )
            {
                //#if_same_sub_formula:{
                let arrow_item_tree = op.getTreeByName( arrow_item_name ).tree
                let arrow_item_sub_formula = arrow_item_tree.props.sub_formula
                let is_same_subformula = (arrow_item_sub_formula == t_sub_formula)
                if( is_same_subformula )
                {
                   //#match_tree_list:{ push: 'arrow_item_tree'}, 
                    match_tree_list.push( arrow_item_tree )
                   //#match_tree_name_list:{ push: 'arrow_item_tree_full_name'}
                    match_tree_name_list.push( arrow_item_tree.full_name )                    
                }
                //#}
            }
            //#}
        }
        //#},

        //#if_found_all_matching_outer_item:{
        if( 
            // b_tree_length - 1 == match_tree_list.length 
            match_tree_list.length > 0 
        ) // plus 1 count of tree
        {

            //#tree_hide_arrow:{}
            tree.props.show_arrow = false
            tree.props.arrow_type = 'top_blue'
            tree.props.pasted_tree_list = false
            //#match_list_push:{ push:'tree'},
            // match_tree_list.push( tree ) 
            //#loop_all_match_item:{
            for( let match_tree of match_tree_list )
            {   
                //#match_tree:{
                    //#set_arrow_type_multi_top:{},
                
                match_tree.props.arrow_type = 'top_blue'
                    //#remove_pasted_tree_names:{},
                // match_tree.props.pasted_tree_names = false
                match_tree.props.pasted_tree_list = false


                ////reverse previous actions
                let { yellow_type: type } = match_tree.props
                //#if_m_type_eq_box_first_child:{

                if( type == 'box_first_child' )
                {
                    //case [y]
                    //#parent_tree:{
                    let parent_tree = match_tree.parentNode
                        //#hide_arrow:{},
                    parent_tree.props.show_arrow = true
                        //#deselect:{},
                    parent_tree.props.selected = true
                        //#update_props:{}
                    parent_tree.updateProps()
                    //#}
                    match_tree.props.show_arrow = false
                }
                //#},
                //#if_m_type_eq_box_second_child:{
                else if( type == 'box_second_child')
                {
                    // case -[y]
                    
                    //#parent_tree:{
                    let parent_tree = match_tree.parentNode
                    //#hide_arrow:{},
                    parent_tree.props.show_arrow = true
                    //#deselect_parent:{},
                    parent_tree.props.selected = true
                    //deselect_first_child:{}
                    let first_child = parent_tree[parent_tree.list[0]]
                    first_child.props.selected = true
                    //#update_props:{}
                    parent_tree.updateProps()
                    //#}
                    match_tree.props.show_arrow = false
                }
                //#}
                     //#update_props:{}
                     match_tree.updateProps()
                //#}
            }
            //#}
        }
        //#}
    }
    //#}
//#}
}
//#}
//#