import { op_show_arrow, op_hide_arrow } from './op_arrow.js'

//#export let deselect_obj ={
 //#params: { 
    //#e_tree:'event_tree',
 //#}, 
 //#names:{
    //#p_tree:'parent_tree', 
    //#g_tree:'grand_parent_tree, this is usually the bracket_tree', 
    //#b_tree:'bracket_tree, the tree containing the bracket',
    //#s_tree:'sibling_tree',
    //#outer_item_tree:'box, bracket or items that showing arrows',
    //#otv_var_name:'one_time_setup: set this variable first time and reuse',
     //#},
//#deselect:{
export let deselect = function _deselect( event )
{
	//#extract_e_tree_from_event:{	
	let e_tree = event.detail.child_tree
	//#},
	//#if_e_tree_is_bracket:{
	if( e_tree.props.type == 'bracket')
	{
		//#call_deselect_in:{
		deselect_in( e_tree )	
		//#},
		//#e_tree_updateProps:{
		e_tree.updateProps()	
		//#}
	}	
	//#},
	//#call_deselect_up:{
	deselect_out( e_tree )
	//#}
}         	
//#},
//#fn_deselect_in:{
function deselect_in( e_tree )
{
	//#if_e_tree_have_list:{
	if(e_tree.list)
	{
		//#loop_child_tree_list:{
		for(let child_name of e_tree.list)
		{
			//#child_tree_deselect_n_hide_arrow:{
			let child_tree = e_tree[ child_name ]
			let child_props = child_tree.props
			child_props.selected= false
			child_props.show_arrow = false
			//#},
			//#if_child_tree_has_child:{
			let child_tree_list = child_tree.list
			if( child_tree_list && child_tree_list.length > 0 )
			{
				//#recursive_fn_deselect_in_child_tree:{
				deselect_in( child_tree )
				//#}
			}
			//#}
		}
		//#}
	}
	//#}
}	
//#},
//#fn_deselect_out:{
function deselect_out( e_tree )
{   

	 //#climb_tree:{
    let p_tree = e_tree.parentNode
	 //#},
     //#if_p_tree_is_selected:{
    if( p_tree.props.selected )
    {
        //#make_sibling_list:{
        let p_tree_list = [...p_tree.list]
        let e_tree_index = p_tree_list.indexOf( e_tree.name )
        p_tree_list.splice( e_tree_index, 1)
        let s_tree_list = p_tree_list
        //#},
        let s_tree_obj = {}
         //#loop_all_siblings:{
        for( let key of s_tree_list)
        {
            let s_tree = p_tree[key]
            // if( s_tree.name != e_tree.name )
            // {
            //#if_sibling_is_plus_minus_n_is_selected:{
            if( s_tree.props.type == 'bin' 
            && s_tree.props.selected )
            {
                //#deselect_s_tree:{
                s_tree.props.selected = false
                s_tree.props.show_arrow = false
                //#}
            }
            //#},
            //#else_if_other_sibling:{
            else
            {
                    //#s_tree_show_default_arrow:{
                // s_tree.props.show_arrow = true
                // s_tree.props.arrow_type = false
                    //#},

                //#call_yellow_arrow:{
                op_show_arrow({ 
                        tree:s_tree,
                        loop_obj: s_tree_obj
                    })
                //#}
            }
            //#}
            // }
        }
        //#},

        //#if_p_tree_is_root:{
        let isRoot = ( p_tree.name.search('eq_') > -1 )
        if( isRoot )
        {
            //#test:{
            //#if_e_tree_is_box:{
            let e_tree_type = e_tree.props.type
            if( e_tree_type == 'box')
            {
                //#e_tree_hide_arrow:{
                e_tree.props.show_arrow = false
                console.log("box deselect hide arrow")
                //#}
                // tree.updateProps()
                // e_tree.updateProps()
            }
            //#},
            //#else_if_is_bracket:{
            else if( e_tree_type == 'bracket')
            {
                //#e_tree_hide_arrow:{
                e_tree.props.show_arrow = false
                //#}
                // tree.updateProps()
                // e_tree.updateProps()
            }
            //#}
            //#}
        }
        //#},
        //#else_if_not_root:{
        else
        {
            //#p_tree_deselect:{
            p_tree.props.selected = false
            p_tree.updateProps()
            //#},
            
            //#recursive_fn_deselect_out_p_tree:{
            deselect_out(p_tree)
            //#}
        }    
        //#}
    }
    //#},
    //#else_if_p_tree_not_selected:{
    else
    {
        op_hide_arrow({
                tree:e_tree,
                loop_obj:{},
            })    
    }
    //#}
}
//#} //deselect_out_method

//#} //deselect_out_obj
//#let fs = require('fs')
//#fs.writeFileSync(__dirname + '/deselect_obj.js', JSON.stringify(deselect_obj, null, 2))
//#