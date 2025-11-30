import type { interaction } from '../../interaction'
import type { Tree, Border } from '../../types/main'
import { u } from "../../utils/ui.js"
/** Enter from the fr's left side 
 *  drag_elem move left  
 */
export let insert_i_into_top_from_left = {
    name: "insert.i.into.top.from_left",
    tree_type_list: ["sym", "num", "br", "fr"],
    isInContext: function(In: interaction): boolean {
        let { nt } = In.getProps(['nt'])
        if( nt 
        && nt.type == 'fr'){
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border {
        let { eq_origin, nt, 
            dt_border, eq_sign_border } = 
                In.getProps(['eq_origin', 'nt', 
                'dt_border', 'eq_sign_border'])

        let top = ( eq_sign_border.top + eq_sign_border.left ) / 2

        let { left: ne_left, right: ne_right,
            width: ne_width } = 
                document.getElementById(nt.full_name)
                        .getBoundingClientRect()

        let { left: de_left, right: de_right } = dt_border
        let de_width = de_right - de_left

        let right 
        if( eq_origin == 'left_eq')
        {
            let top = nt['top_1']
            let i = top[ top.list[0] ]
            if( top.list.length == 1 
            && i.props.text == '1' )
            {
                right = ne_right - de_width/2 - ne_width / 2
            }
            else
            {
                right = ne_left
            }
        }
        else if ( eq_origin == 'right_eq')
        {
            let top = nt['top_1']
            let i = top[ top.list[0] ]
            if( top.list.length == 1 
                && i.props.text == '1' )
            {
                right = de_left + de_width / 2 + ne_width /5 
            }
            else
            {
                right = ne_left
            }
        }

        let updateUI = function( In: interaction): Tree[]{
            let { nt: fr } = In.getProps(['nt'])
            let { dt_list, p_tree } = In

            let top = fr['top_1']

            u.cut( dt_list )

            u.paste()
            .into( top )
            .at('start')

            top.updateProps()
            p_tree.updateProps()

            return dt_list as Tree[]
        }

        return { 
            name: this.name,
            updateUI,
            //top,
            right 
        }
    }
}

export let insert_i_into_top_from_right = {
    name: "insert.i.into.top.from_right",
    tree_type_list: ["sym", "num", "br", "fr"],
    isInContext: function(In: interaction): boolean {
        let { pt } = In.getProps(['pt'])
        if( pt 
         && pt.type == 'fr'){
            return true 
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border {
        let { eq_origin, pt, 
            dt_border, eq_sign_border } =
                In.getProps(['eq_origin', 'pt', 
                'dt_border', 'eq_sign_border'])
    
        let top = ( eq_sign_border.top + eq_sign_border.bottom ) / 2

        let { left: pe_left, right: pe_right, 
        width: pe_width } = document.getElementById( pt.full_name )
                            .getBoundingClientRect()
        
        let { right: de_right, left: de_left } = dt_border
        let de_width = de_right - de_left

        let left
        if( eq_origin == 'left_eq')
        {
            let top = pt['top_1']
            let i = top[ top.list[0] ]
            if( top.list.length == 1 
            && i.props.text == '1' )
            {
                // 1/c * [a] => [a]/c
                left = de_right - ( de_width / 2 + pe_width /5 )  
            }
            else
            {
                left = pe_right
            }
        }
        else if ( eq_origin == 'right_eq')
        {
            let top = pt['top_1']
            let i = top[ top.list[0] ]
            if( top.list.length == 1 
            && i.props.text == '1' ){
            
                left = pe_left + de_width / 2 + pe_width /2
            }
            else
            {
                left = pe_right
            }
        }

        let updateUI = function( In: interaction): Tree[]{
            let { pt: fr } = In.getProps(['pt'])
            let { dt_list, p_tree } = In

            let top = fr['top_1']
            u.cut(dt_list)

            u.paste()
            .into( top )
            .at('end')

            top.updateProps()
            p_tree.updateProps()

            return dt_list as Tree[]
        }

        return { 
            name: this.name,
            updateUI,
            //top,
            left 
        }
    }
}

/** i exit from left
 *  i drag to left
 */

export let extract_i_from_top_from_left = {
    name: "extract.i.into.top.from_right",
    tree_type_list: ["sym", "num", "br", "fr"],
    isInContext: function(In: interaction): boolean {
        let { p_tree } = In
        let { pt } = In.getProps(['pt'])
        if( !pt 
        && p_tree.type == 'top' ){
           return true 
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border {
        let { p_tree: top } = In

        let { left } = 
                document.getElementById( top.full_name )
                        .getBoundingClientRect()
        
        // let { eq_sign_border, arrow_to_border } =
        //      In.getProps(['eq_sign_border', 'arrow_to_border'])

        //let bottom = ( eq_sign_border.top + eq_sign_border.bottom )/2 
        //                - distance_to_dc_top

        let updateUI = function( In: interaction): Tree[]{
            let { dt_list, p_tree } = In

            u.cut(dt_list)
            let fr = p_tree.parentNode
            let bx = fr.parentNode

            let index = bx.list.indexOf( fr.name )

            u.paste()
            .into( bx)
            .at( index )
            bx.updateProps()
            fr.checkDot()
            return dt_list as Tree[]
        }

        return { 
            name:this.name,
            updateUI,
            left,
            //bottom
        }
    }
}
/** i exit fr from right side */
export let extract_i_from_top_from_right = {
    name: "extract.i.from.top.from_right",
    tree_type_list: ["sym", "num", "br", "fr"],
    isInContext: function(In: interaction): boolean {
        let { p_tree } = In
        let { nt } = In.getProps(['nt'])
        if( !nt 
        && p_tree.type == 'top' ){
           return true 
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border {
        let { p_tree: top } = In

        let { right } = 
                document.getElementById( top.full_name )
                        .getBoundingClientRect()
        
        // let { eq_sign_border, distance_to_dc_top } =
                //  In.getProps(['eq_sign_border', 'distance_to_dc_top'])

        //let bottom = ( eq_sign_border.top + eq_sign_border.bottom )/2 
        //            - distance_to_dc_top

        let updateUI = function( In: interaction): Tree[]{
            let { dt_list, p_tree } = In

            u.cut(dt_list)
            
            let fr = p_tree.parentNode
            let bx = fr.parentNode

            let index = bx.list.indexOf( fr.name )
            index++

            u.paste()
            .into( bx)
            .at( index )

            bx.updateProps()
            fr.checkDot()

            return dt_list as Tree[]
        }

        return { 
            name: this.name,
            updateUI, 
            right,
            //bottom
        }
    }
}