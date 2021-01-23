import type { interaction } from "../interaction";
import type { Tree } from '../types/main'

import { op } from "../xTree"

export class makeProps{

    /** parent_tree border */
    p_tree_border( In: interaction ){
        let { p_tree } = In
        let p_tree_b = document.getElementById( p_tree.full_name ) 
                        .getBoundingClientRect()
        return p_tree_b
    }
    
    /** previous tree */
    pt( In: interaction ){
        // used by bx & item
        let { dt_list, p_tree } = In
        
        let first_dt = dt_list[0]
        let index = p_tree.list.indexOf( first_dt.name )
        let pt_index = index - 1 
        if( pt_index >= 0)
        {
            let pt_name = p_tree.list[ pt_index ]
            return p_tree[ pt_name ]
        }
        else
        {
            return false
        } 
    }

    /** next tree */
    nt( In: interaction ){
         // used by bx & item
        let { dt_list, p_tree } = In

        let last_dt = dt_list[ dt_list.length - 1]
        let index = p_tree.list.indexOf( last_dt.name )
        let nt_index = index + 1
        if( nt_index <= p_tree.list.length - 1)
        {
            let nt_name = p_tree.list[ nt_index ]
            return p_tree[ nt_name ]
        }
        else
        {
            return false
        } 
    }
    /** fr */
    fr( In:interaction ){
        let { p_tree } = In
        let { type: p_tree_type } = p_tree
        let fr 
        if ( p_tree_type == "fr"){
            // dt = top || bot
            fr = p_tree
        } else if ( p_tree_type == "top" || p_tree_type == "bot" ){
            // dt = i
            fr = p_tree.parentNode
        }
        return fr  
    }
    /** fraction next tree */
    fr_nt( In: interaction ){
        let { fr } = In.getProps(["fr"])
        let p_fr = fr.parentNode
        let index = p_fr.list.indexOf( fr.name )

        let nt_index = index + 1
        if( nt_index <= p_fr.list.length - 1)
        {
            let nt_name = p_fr.list[ nt_index ]
            return p_fr[ nt_name ]
        }
        else
        {
            return false
        }
    }
    /** fraction previous tree */
    fr_pt( In: interaction ){
        let { fr } = In.getProps(["fr"])
        let p_fr = fr.parentNode
        let index = p_fr.list.indexOf( fr.name )
        let pt_index = index - 1 
        if( pt_index >= 0)
        {
            let pt_name = p_fr.list[ pt_index ]
            return p_fr[ pt_name ]
        }
        else
        {
            return false
        }
    }

    /** parent_tree next tree */
    p_tree_nt( In: interaction ){
        let { p_tree } = In
        let gp_tree = p_tree.parentNode

        let index = gp_tree.list.indexOf( p_tree.name )
        let nt_index = index + 1
        if( nt_index <= gp_tree.list.length - 1)
        {
            let nt_name = gp_tree.list[ nt_index ]
            return gp_tree[ nt_name ]
        }
        else
        {
            return false
        }
    }

    /** parent_tree previous tree */
    p_tree_pt( In: interaction ){
        let { p_tree } = In
        let gp_tree = p_tree.parentNode 

        let index = gp_tree.list.indexOf( p_tree.name )
        let pt_index = index - 1 
        if( pt_index >= 0)
        {
            let pt_name = gp_tree.list[ pt_index ]
            return gp_tree[ pt_name ]
        }
        else
        {
            return false
        }
    }

    /** fixed width of plus sign */
    plus_width(){
        // manual update
        let plus_size = 17
        let padding_left = 4
        return plus_size + padding_left 
    }

   /** get eq.border, eq.origin */
    eq_origin( In: interaction ){
        let { dt_list } = In

        /** f_1-eq_2-bx_1-(...) */
        let first_dt = dt_list[0]

        if( Array.isArray( first_dt ) ){
            first_dt = first_dt[0]
        }

        /** ['f_1', 'eq_2', 'bx_1' ] */
        let arr_t = first_dt.full_name.split('-')

        let f = arr_t[0]
        let eq = arr_t[1]

        let origin:string
        let eq_num = parseInt( eq.split('_')[1] )
        if( eq_num == 1 )
        {
            origin = 'left_eq'
        } else if( eq_num == 2) {
            origin = 'right_eq'
        }

        return origin
        // if( eq_left > drag_elem_left 
        // && eq_right > drag_elem_left)
        // {
        //     this.border.origin = 'left_eq'
        //     this.border.eq_left = eq_left
        //     this.border.eq_right = eq_right
        // }
        // else if ( eq_left < drag_elem_left 
        // && eq_right < drag_elem_left )
        // {
        //     this.border.origin = 'right_eq'
        //     this.border.eq_left = eq_left
        //     this.border.eq_right = eq_right
        // }
    }

    eq_sign_border( In: interaction ){
        let { f } = In.getProps(['f'])

        let eq_sign_id = `${f.name}-eq_sign`
        let eq_sign_elem = document.getElementById( eq_sign_id )
        let border = eq_sign_elem.getBoundingClientRect()
        return border
    }
    
    /** imaginary bracket border
     *  [ab]c + [ab]d + e => [ab](c+d) + e
     *  (............)
     */
    im_br_border( In: interaction ) 
    {
        let { dt_list } = In
        // [a_1*b_1]c + [a_2*b_2]d + [a_3*b_3]e

        // dt_list =
        // [[a_1,         a_2,         a_3],
        //  [b_1,         b_2,         b_3]]

        let arr_i = dt_list[0]
        
        let max_left_index
        let max_left_bx

        let max_right_index
        let max_right_bx
        
        let first_i = arr_i[0]
        let first_bx = first_i.parentNode
        let br_list = first_bx.parentNode.list

        for( let i of arr_i )
        {
            let bx = i.parentNode
            let index = br_list.indexOf(bx.name)

            if( max_left_index === undefined
            || index <= max_left_index)
            {
                max_left_index = index
                max_left_bx = bx 
            }

            if( max_right_index === undefined
            || index >= max_right_index )
            {
                max_right_index = index
                max_right_bx = bx 
            }
        }

        if( max_left_index === undefined )
        {
            new Error("max_left_index not found.")
        }
        else if( max_right_index === undefined )
        {
            new Error("max_right_index not found.")
        }
        else
        {
            return { max_left_index, max_left_bx, 
                max_right_index, max_right_bx } 
        }
    }

    dt_br_border(In:interaction){
        let { dt_list } = In
        let first_i = dt_list[0][0]
        let gp_tree = first_i.parentNode
                        .parentNode
        
        if( gp_tree.type == 'br' )
        {
            let {
                left, right, width
            } = document.getElementById( gp_tree.full_name + "-inner_border")
                .getBoundingClientRect()

            return { 
                left,
                right,
                width
            }
        } else {
            let { im_br_border } = In.getProps(['im_br_border'])

            let {
                max_left_bx, 
                max_right_bx
            } = im_br_border 

            let { left } = document.getElementById( max_left_bx.full_name )
                            .getBoundingClientRect()
            
            let { right } = document.getElementById( max_right_bx.full_name )
                            .getBoundingClientRect()
            
            let width = right - left
            return { left, right, width }
        }
    }

    /** Returns the dimensions of [abc]
     *  if multiple items
     *  [abc]d+[abc]e
     *  will do [abc]
     */
    dt_border(In: interaction){
        let { dt_list } = In
        
        let min_tree: Tree
        let max_tree: Tree
        if( !Array.isArray( dt_list[0]) ){
            min_tree = dt_list[0]
            max_tree = dt_list[ dt_list.length - 1 ]
        } else {
            min_tree = dt_list[0][0]
            max_tree = dt_list[ dt_list.length - 1][0]
        }

        let min_elem = document.getElementById( min_tree.full_name as string )
        let max_elem = document.getElementById( max_tree.full_name as string )
        let min_e_border = min_elem.getBoundingClientRect()
        let max_e_border = max_elem.getBoundingClientRect()

        let top: number | number[]
        if( min_e_border.top == max_e_border.top ){
            top = min_e_border.top
        } else {
            top = [ min_e_border.top, max_e_border.top ]
        }

        let bottom: number | number[]
        if( min_e_border.bottom == max_e_border.bottom ){
            bottom = min_e_border.bottom
        } else {
            bottom = [ min_e_border.bottom, min_e_border.bottom ]
        }

        let left = min_e_border.left
        let right = max_e_border.right
        let width = right - left

        let mid_x = (left + right)/2

        let min_top = min_e_border.top
        let min_bottom = min_e_border.bottom
        let mid_y = (min_top + min_bottom)/2
        return { left, right, width, 
            mid_x, mid_y, top, bottom }

    }

    f( In: interaction){
        let { dt_list:[ dt ] } = In
        if( Array.isArray(dt) ){
            dt = dt[0]
        }

        if( dt.type == 'zero' ){
            dt = dt.props.eq
        }

        let f = op.setTree( dt )
        .getPrevPrefix('f_')
        .tree
        return f
    }

    left_eq_tree( In: interaction ){
        let { f } = In.getProps(['f'])
        let tree = f['eq_1']        
        return tree
    }
    
    left_eq_elem( In: interaction ){
        let { left_eq_tree } = In.getProps(['left_eq_tree'])
        let elem = document.getElementById( left_eq_tree.full_name )
        return elem
    }

    left_eq_border( In: interaction ){
        let { left_eq_elem } = In.getProps(['left_eq_elem'])
        let border = left_eq_elem.getBoundingClientRect()
        return border
    }

    left_eq( In: interaction ){
        let { left_eq_tree, left_eq_elem, left_eq_border } = 
           In.getProps(['left_eq_tree', 'left_eq_elem', 'left_eq_border'])

        return { 
            tree: left_eq_tree,
            elem: left_eq_elem,
            border: left_eq_border }
    }

    right_eq_tree( In: interaction ){
        let { f } = In.getProps(['f'])
        let tree = f['eq_2']        
        return tree
    }

    right_eq_elem( In: interaction ){
        let { right_eq_tree } = In.getProps(['right_eq_tree'])
        let elem = document.getElementById( right_eq_tree.full_name )
        return elem
    }

    right_eq_border( In: interaction ){
        let { right_eq_elem } = In.getProps(['right_eq_elem'])
        let border = right_eq_elem.getBoundingClientRect()
        return border
    }

    right_eq( In: interaction ){
        let { right_eq_tree, right_eq_elem, right_eq_border } = 
           In.getProps(['right_eq_tree', 'right_eq_elem', 'right_eq_border'])

        return { 
            tree: right_eq_tree,
            elem: right_eq_elem,
            border: right_eq_border
        }
    }
    
    /** Distance from arrow to nearest border
     *  1. top arrow to top border
     *  2. bottom arrow to bottom border
     */
    arrow_to_border( In: interaction ){
        let { 
                height: dc_height, // drag_clone_height 
                arrow_direction, 
                mouse_start_y,
                elem_start_y,
            } = In.drag_clone

        // 0 is at top of screen
        // goal: drag_clone_top > mid_y
        // not drag_y > mid_y

        let arrow_to_border 
        if( arrow_direction == 'top')
        {
            // meaning elem_start_y > mouse_start_y
            // elem_start_y - mouse_start_y > 0
            arrow_to_border = elem_start_y - mouse_start_y
        }
        else if( arrow_direction == 'bottom')
        {
            // elem_bot - mouse_start_y < 0
            arrow_to_border = elem_start_y + dc_height - mouse_start_y
        }
        
        return arrow_to_border
    }
}