// import { op } from '../../xTree.js'
import { op_show_arrow, op_hide_arrow } from './op_arrow.js'

//#export let select_obj ={
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
//#select_:{
export let select = function _select( event )
{
    //#extract_tree_from_event:{
    let e_tree = event.detail.child_tree
    //#},
    //#if_e_tree_is_bracket:{
	if( e_tree.props.type == 'bracket')
	{
		//#call_build_sub_formla_downward:{
        // select_in is done by build_sub_formula_inward
        build_sub_formula_inward( e_tree )
		//#},
		//#e_tree_updateProps:{
		e_tree.updateProps()	
		//#}
	}	
    //#},
    //#call_select_out:{
    select_out( e_tree )    
    //#}
}
//#},
//#select_in:{
function select_in( e_tree )
{
    //#if_got_tree_list:{
    let tree_list = e_tree.list 
    if( tree_list )
	{	
        //#loop_e_tree_child:{
        let sub_formula = ''
		for(let child_name of tree_list)
		{
			let child_tree = e_tree[ child_name ]
			let child_props = child_tree.props
            // if(!child_props.selected)
            // {
                //tried to be efficient in not looping selected child
                //but will missed the opportunity to update sub_formula
                //updating sub_formula in deselect does not solve the problme
                //if keep user keep selecting without deselect action.
                //error comes from +/- sign changes and no update to sub_formula
            // }

            //#select_e_tree_child:{
            child_props.selected = true
            //#},
            //#e_tree_child_hide_arrow:{
            child_props.show_arrow = false
            //#},

            //#if_e_tree_has_list_n_list_lenght_not_zero:{
            let tree_list = child_tree.list
            if( tree_list && tree_list.length > 0 )
            {
                //#recursive_call_fn_select_in:{
                select_in( child_tree )
                //#}
            }
            //#},

            //#set_sub_formula:{
            sub_formula += child_props.sub_formula
            //#}
            
            // if( child_props.text || child_props.text === "")
            // {
            //     sub_formula += child_props.text
            // }
            // else
            // {
            //    sub_formula += child_props.sub_formula
            // }
        }
        //#},
        //#if_e_tree_is_bracket:{
        if( e_tree.props.type == 'bracket')
        {
            //#add_bracket_into_sub_formula:{
            sub_formula = "(" + sub_formula + ")"
            //#}
        }
        //#},
        //#e_tree_set_sub_formula:{ 
        e_tree.props.sub_formula = sub_formula
        //#}
    }
    //#}
}
//#},
//#select_out:{ 
function select_out( e_tree )
{
    //#climb_tree:{
    let p_tree = e_tree.parentNode
    //#},

    //#count_selected_child:{
    let selected_child_count = 0
    let selectable_child_count = 0    

    for( let child of p_tree.list )
    {
        let child_props = p_tree[child].props
        if( child_props.selected ) selected_child_count ++
        if( child_props.type !='bin') selectable_child_count ++
    }
    //#},

    //#if_all_child_selected:{
    if( selected_child_count == selectable_child_count )
    {
        //Action 2:Enlarge Selection

        // 2 cases:
        // Case 1: Normal Case (Enlarge Selection)
        //1. hide child show_arrow
        //2. build sub_formula
        //3. dispatch upward

        // Case 2: Root level Special Case (Enlarge Selection): 
        // when isRoot=true
        // Since there is no higher level than root,
        // recursion terminates here:
        // at root level will have 

        // 3 special actions:
        // 1. no hiding child_arrows
        // 2. no upward dispatch
        // 3. click child show_arrow = true

       //#build_sub_formula_outward:{           
       build_sub_formula_outward( p_tree ) 
       //#},
       //#if_not_root:{
       let isRoot = (p_tree.name.search('eq_') > -1)
        
        if( !isRoot )
        {
            //#p_tree:{
                //#select:{},
            p_tree.props.selected = true
                //#update_props:{}
            p_tree.updateProps()
            //#},
            //#recursive_call_select_out:{
            select_out( p_tree )
            //#}
        }
        //#},
        //#else_is_root:{
        else
        {
            //#if_e_tree_is_box:{
            if( e_tree.props.type == 'box')
            {
                //#e_tree_show_arrow:{
                e_tree.props.show_arrow = true
                //#}                
            }
            //#}
        }
       //#}
    }
    //#},
    //#if_not_all_child_selected:{
    else
    {

        //#if_is_fraction:{        
        // if( e_tree.name.split('_')[0] == 'fr')
        // {
        //     //#set_p_tree_selected:{}
        //     console.log( "if_is_fraction select out")
        //     p_tree.props.selected = true
        //     p_tree.updateProps()
        //     //#recursive_select_out_on_p_tree:{}
        //     select_out( p_tree )
        // }
        //#}
        //#else
        //#{
        // else
        // {
            //#call_op_show_arrow:{
            op_show_arrow({
                tree: e_tree,
                loop_obj:{}
            })
            //#}
        // }
        //#}
    }
    //#}
}
//#},
//#build_sub_formula_inward:{
function build_sub_formula_inward( tree )
{
    let sub_formula = ''
    let prev_child_text = ''
    let isCoeff = /[0-9]|\./
    let tree_list = tree.list
    let isRoot = (tree.name.split('_')[0] == 'eq')
    
    //#loop_tree_list:{
    for( var child_name of tree_list )
    {
        let child_tree = tree[ child_name ]
        let child_props = child_tree.props 
        //#if_child_tree_not_is_root:{
        if( !isRoot ) 
        {
            //#child_tree_show_arrow:{
            child_props.show_arrow = false
            //#}
        } //else: isRoot, don't hiding child arrow
        //#},
        // //#if_child_tree_is_bin:{
        // if( child_props.type == 'bin')
        // {
            //#select_child_tree:{
            child_props.selected = true //to handle 'bin' case
            //#}
        // }
        // //#},

        //#if_child_tree_has_list:{
        let child_tree_list = child_tree.list
        if( child_tree_list && child_tree_list.length > 0 )
        {
            //#recursive_call_build_sub_formula_inward:{}
            build_sub_formula_inward( child_tree )
        }
        //#},

        //#if_child_tree_is_item:{
        if( child_props.text || child_props.text === "" )
        {   
            //#if_prev_child_text_is_coeff:{
            if( isCoeff.test(prev_child_text) )
            {
                //#add_with_star_multiplier:{
                sub_formula = sub_formula +  "*" + child_props.text
                //#}
            }
            //#},
            //#else:{
            else
            {
                //#add_without_start_multiplier:{
                sub_formula += child_props.text
                //#}
            }
            //#},
            //#reset_prev_child_text:{
            prev_child_text = child_props.text
            //#}
        }
        //#},
       //#else_if_child_tree_is_not_item:{
        else
        {
            //#if_child_tree_is_fraction_bottom:{
            if( child_props.type == 'bottom' )
            {
                //#add_with_backslash_divide:{
                sub_formula = sub_formula + "/" + child_props.sub_formula
                //#}
            }
            //#},
           //#else:{
            else
            {
                //#add_without_backslash_divide:{
                sub_formula += child_props.sub_formula
                //#}
            }
            //#}
        }
        //#}
    }
    //#},
    //#if_tree_is_bracket:{
    if( tree.props.type == 'bracket')
    {
        //#add_open_close_bracket_to_subformula:{
        sub_formula = '(' + sub_formula + ')'
        //#}
    }
    //#},
    //#tree_set_props_subformula:{
    tree.props.sub_formula = sub_formula
    //#}
}    
//#},
//#build_sub_formula_outward:{
function build_sub_formula_outward( tree )
{
    let sub_formula = ''
    let prev_child_text = ''
    let isCoeff = /[0-9]|\./
    let tree_list = tree.list
    if( !tree_list ) console.log( tree )
    let isRoot = (tree.name.search('eq_') > -1)
    //#loop_child_tree:{
    for( var child of tree_list )
    {
        let child_props = tree[ child ].props 

        //#if_not_root:{
        if( !isRoot ) 
        {
            //hide arrow to enlarge selection
            //#child_tree_show_arrow:{
            child_props.show_arrow = false
            //#}

        } //else: isRoot, don't hiding child arrow
        //#},
        //#if_child_tree_is_bin:{
        if( child_props.type == 'bin')
        {
            //#select_child_tree:{
            child_props.selected = true //to handle 'bin' case
            //#}
        }
        //#},
        //#if_child_tree_is_item:{
        if( child_props.text || child_props.text === "" )
        {   
            //#if_previous_child_is_coeff:{
            if( isCoeff.test(prev_child_text) )
            {
                //#add_with_star_multiplier:{
                sub_formula = sub_formula + "*" + child_props.text
                //#}
            }
            //#},
            //#else:{
            else
            {
                //#add_without_star_multiplier:{
                sub_formula += child_props.text
                //#}
            }
            //#},
            //#reset_previous_child_text_to_current_child:{
            prev_child_text = child_props.text
            //#}
        }
        //#},
        //#else:{
        else
        {
            //#if_child_tree_is_fraction_bottom:{
            if( child_props.type == 'bottom' )
            {
                //#add_with_backslash_divider:{
                sub_formula = sub_formula + "/" + child_props.sub_formula
                //#}
            }
            //#},
            //#else_if_child_tree_is_not_fraction_bottom:{
            else
            {
                //#add_wtihout_backslash_divider:{
                sub_formula += child_props.sub_formula
                //#}
            }
            //#}
        }
        //#}
    }
    //#},
    //#if_tree_is_bracket:{
    if( tree.props.type == 'bracket')
    {
        //#add_open_close_bracket_to_subformula:{
        sub_formula = '(' + sub_formula + ')'
        //#}
    }
    //#},
    //#tree_set_props_subformula:{
    tree.props.sub_formula = sub_formula
    //#}
}    
//#},
//#select_end:{
function select_end( e_tree )
{
    console.log( 'select_end_e_tree')
    console.log( e_tree )
    //#destructure_call_check_tree_type:{
    let { item_tree, item_type, bracket_tree,
        is_not_item, is_item_but_no_grand_parent_sibling
    } = check_tree_type( e_tree )
    //#},

    //#if_is_item_but_no_grand_parent_sibling:{
    if( is_item_but_no_grand_parent_sibling )
    {

        //#e_tree_show_arrow:{
        e_tree.props.show_arrow = true
        // e_tree.updateProps()
        //#}
    }
    //#},
    //#else_if_is_not_item:{
    else if( is_not_item )
    {
        console.log( 'is_not_item')
        //#e_tree_show_arrow:{
        e_tree.props.show_arrow = true
        // e_tree.updateProps()
        //#},

        //#loop_e_tree_child:{
        let e_tree_list = e_tree.list
        let e_tree_loop_obj = {}
        for( let child_name of e_tree_list )
        {
              //#call_op_hide_arrow_on_child_tree:{
            let child_tree = e_tree[ child_name ]
            op_hide_arrow({
                tree: child_tree,
                loop_obj: e_tree_loop_obj
                })
              //#}
        }
        //#}
    }
    //#},
    //#else:{
    else
    {

        //#call_op_show_arrow:{
        op_show_arrow({ 
            tree: item_tree,
            loop_obj:{}
         })
          //#}
    }
    //#}
}
//#},
//#check_tree_type:{
function check_tree_type( e_tree )
{
    let p_tree = e_tree.parentNode
    let e_tree_type = e_tree.props.type

    //#set_test_is_box:{
    let is_box = ( e_tree_type == 'box' 
                || e_tree_type == 'top' )
    //#},
    //#set_test_is_item:{
    let is_item = ( e_tree_type == 'symbol' 
                || e_tree_type == 'coeff' 
                || e_tree_type == 'bracket' )
    //#},
    //#if_is_box:{
    let tree_obj = {}
    if( is_box )
    {
        //#if_child_tree_length_eq_1:{
        let child_tree_length = e_tree.list.length 
        if( child_tree_length == 1)
        {
            // box[ item[a]]  -->>   item[a]
            //#set_item_tree_n_type_n_bracket_tree:{
            tree_obj['item_tree'] = e_tree[ e_tree.list[0] ]
            tree_obj['item_type'] = 'child 0' 
            //child position 0 of [ {a} ], {a} item, [] is box
            tree_obj['bracket_tree'] = p_tree
            //#}
        }
        //#},
        //#if_child_tree_length_eq_2:{
        else if( child_tree_length == 2)
        {
            //#if_first_item_is_plus_minus:{
            let first_item_is_plus_minus = 
                (e_tree[ e_tree.list[0] ].props.type == 'bin')
            if( first_item_is_plus_minus )
            {
                // [+a]  -->>   +[a]
                //#set_item_tree_n_type_n_bracket_tree:{
                tree_obj['item_tree'] = e_tree[ e_tree.list[1] ]
                tree_obj['item_type'] = 'child 1'
                tree_obj['bracket_tree'] = p_tree
                //#}
            }
            //#},
            //#else:{
            else
            {
                // [ab]
                //#set_is_not_item:{
                tree_obj['is_not_item'] = true
                //#}
            }
            //#}
        }
        //#},
        //#else:{
        else
        {
            // [abc]
            //#set_is_not_item:{
            tree_obj['is_not_item'] = true
            //#}
        }
        //#}
    }
    //#},
    //#else_if_is_item:{
    else if( is_item )
    {
        //#if_no_outer_parent:{
        let b_tree = p_tree.parentNode //bracket_tree
        let no_outer_item_parent = (b_tree.list.length == 1)
        if( no_outer_item_parent )
        {
            //#set_is_item_but_no_bracket_tree_sibling:{
            // case [a]b = c  -->> single box in eq
            tree_obj['is_item_but_no_grand_parent_sibling'] = true
            //#}
        }
        //#},
        //#else:{
        else
        {
            //#set_item_tree_n_type_n_bracket_tree:{
            tree_obj['item_tree'] = e_tree
            tree_obj['item_type'] = 'original'
            tree_obj['bracket_tree'] = b_tree
            //#}
        }
        //#}
    }
    //#},
    //#else:{
    else
    {
        //#set_is_not_item:{
        tree_obj['is_not_item'] = true
        //#}
    }
    //#},
    //#return_tree_obj:{
        //#item_tree:{},
        //#item_type:{},
        //#braket_tree:{},
        //#is_not_item:{},
        //#is_item_but_no_grand_parent_sibling:{}
      return tree_obj
    //#}
}
//#}

//#}


//#let fs = require('fs')
//#fs.writeFileSync(__dirname + '/select_obj.js', JSON.stringify(select_obj, null, 2))