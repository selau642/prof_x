//#fn_add_for_yellow_arrow:{
function add_yellow_arrow( input )
{
    let { tree, loop_obj } = input

    // 1. action == 'add' vs 'remove'
    // add : 1. check if not single item box
    //      2. match_tree_name_list
    //      3. set arrow_type = 'yellow'
    // remove: 1. check if tree.props.arrow_type = yellow
    //      2. no need match_tree_name_list
    //      3. set arrow_type = 'multi_top' 
        
        //#set_is_not_box:{
    let p_tree = tree.parentNode
    let prefix = tree.name.split('_')[0]
    let is_not_box = ( prefix != 'bx' )
        //#},
        //#set_bracket_tree_length:{
    let { b_tree } = loop_obj //b_tree = bracket_tree
    if( !b_tree )
    {
        loop_obj.b_tree = b_tree = p_tree.parentNode
    }

    let { b_tree_length } = loop_obj
    if( !b_tree_length)
    {
        loop_obj.b_tree_length = b_tree_length 
            = p_tree.parentNode.list.length
    }

    
    let bracket_not_single_child = (b_tree_length != 1)
        //#},
    
        //#if_not_box_n_bracket_not_single_child:{
    if(  is_not_box && bracket_not_single_child  )
    {
            //#set_match_tree_list_with_s_tree:{
        let t_depth = tree.full_name.split("-").length
        let t_sub_formula = tree.props.sub_formula

        let match_tree_list = []
        let match_tree_name_list = []
            //#},
    
            //#ots_show_arrow_list:{
        let { show_arrow_list } = loop_obj
        
        if( !show_arrow_list )
        {
                //#get_show_arrow_list:{
            loop_obj.show_arrow_list = show_arrow_list 
                = op.getShowArrowList( b_tree.full_name )
                //#},
                
                //#if_tree_not_in_show_arrow_list:{
            let tree_index = show_arrow_list.indexOf( tree.full_name )
            if( tree_index == -1)
            {
                    //#add_tree_into_show_arrow_list:{
                show_arrow_list.push( tree.full_name )
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
                        //#push_into_match_tree_list:{
                    match_tree_list.push( arrow_item_tree )
                    match_tree_name_list.push( arrow_item_tree.full_name )
                        //#}
                }
                    //#}
            }
                //#}
        }
            //#},
            //#if_found_all_matching_outer_item:{
        if( b_tree_length == match_tree_list.length ) // plus 1 count of tree
        {
                //#loop_all_match_item:{
            for( let match_tree of match_tree_list )
            {   
                    //#match_tree:{
                      //#set_arrow_yellow:{},  
                match_tree.props.arrow_type = 'yellow'
                      //#set_pasted_tree_names:{},
                match_tree.props.pasted_tree_names = match_tree_name_list
                      //#updateProps:{}
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
    //#},
    //#fn_remove_yellow_arrow:{
function remove_yellow_arrow( input )
{    
    let { tree, loop_obj } = input
    // 1. action == 'add' vs 'remove'
    // add : 1. check if not single item box
    //      2. match_tree_name_list
    //      3. set arrow_type = 'yellow'
    // remove: 1. check if tree.props.arrow_type = yellow
    //      2. no need match_tree_name_list
    //      3. set arrow_type = 'multi_top' 

    let p_tree = tree.parentNode
    let prefix = tree.name.split('_')[0]
    let is_not_box = ( prefix != 'bx' )

    let { b_tree } = loop_obj //b_tree = bracket_tree
    if( !b_tree )
    {
        loop_obj.b_tree = b_tree = p_tree.parentNode
    }

    let { b_tree_length } = loop_obj
    if( !b_tree_length)
    {
        loop_obj.b_tree_length = b_tree_length 
            = p_tree.parentNode.list.length
    }

    let is_tree_yellow =  (tree.props.arrow_type == 'yellow')
    
        //#if_is_not_box_n_is_tree_yellow:{
    if( is_not_box && is_tree_yellow )
    {
            //#set_match_tree_list_with_s_tree:{
        let t_depth = tree.full_name.split("-").length
        let t_sub_formula = tree.props.sub_formula

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
               
                //#if_tree_not_in_show_arrow_list:{
            let tree_index = show_arrow_list.indexOf( tree.full_name )
            if( tree_index == -1)
            {
                    //#add_tree_into_show_arrow_list:{
                show_arrow_list.push( tree.full_name )
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
                        //#push_into_match_tree_list:{
                    match_tree_list.push( arrow_item_tree )
                    match_tree_name_list.push( arrow_item_tree.full_name )
                        //#}
                }
                    //#}
            }
                //#}
        }
            //#},
            //#if_found_all_matching_outer_item:{
        if( b_tree_length == match_tree_list.length  ) // plus 1 count of tree
        {
                //#loop_all_match_item:{
            for( let match_tree of match_tree_list )
            {   
                    //#match_tree:{
                      //#set_arrow_type_multi_top:{},
                match_tree.props.arrow_type = 'multi_top'
                      //#remove_pasted_tree_names:{},
                match_tree.props.pasted_tree_names = false
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


let fn_show_arrow_by_type = {
    //function show_arrow_by_type( input )
    //{
    //    let { tree, type } = input
        if_m_type_eq_item:{
    //    if( type =='item')
    //    {
            m_tree_update_props:{}
    //        tree.updateProps()
    //    }
        },
        if_m_type_eq_box_first_child:{
    //    else if( type == 'box_first_child' )
    //    {
    //        //case [y]
            parent_tree:{
    //        let parent_tree = tree.parentNode
                hide_arrow:{},
    //        parent_tree.props.show_arrow = false
                deselect:{},
    //        parent_tree.props.selected = false
                update_props:{}
    //        parent_tree.updateProps()
            }
    //    }
        },
        if_m_type_eq_box_second_child:{
    //    else if( type == 'box_second_child')
    //    {
    //        // case -[y]
            
            parent_tree:{
    //        let parent_tree = tree.parentNode
            hide_arrow:{},
    //        parent_tree.props.show_arrow = false
            deselect_parent:{},
    //        parent_tree.props.selected = false
    //        //deselect_first_child:{}
    //        let first_child = parent_tree[parent_tree.list[0]]
    //        first_child.props.selected = false
            update_props:{}
    //        parent_tree.updateProps()
            }
    //    }
        }
    //}
    
    }
    }