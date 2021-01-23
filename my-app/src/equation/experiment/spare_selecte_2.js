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