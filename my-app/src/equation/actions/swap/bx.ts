import type { interaction } from '../interaction'
import type { Tree, Border } from '../types/main'

import { u } from "../utils/ui.js"
import { clone } from '../clone_stores.js'
import { check_equation_sign, 
    // check_clone_sign, 
    match_sign} from '../utils/sign'

export let bx = { 
    left:{
        name: "swap.bx.left",
        tree_type_list: ["bx"],
        isInContext:function( In: interaction ):boolean{
            let { pt } = In.getProps(['pt'])
            if( pt ){
                return true
            } else {
                return false
            }
        },
        makeBorder:function( In: interaction ): Border {
            let { pt, eq_origin,
                 dt_border, plus_width } = 
                 In.getProps(['pt', 'eq_origin', 
                 'dt_border', 'plus_width'])
            
            let left: number
            let { 
                    left: pe_left,
                    width: pe_width 
                } = document.getElementById(pt.full_name)
                        .getBoundingClientRect()

            let {
                width: de_width,
                right: de_right } = dt_border

            if( eq_origin == 'left_eq'){
                if( pt ){
                    // not first bx
                    // ref point on right - after swap elem - own mid length
                    left = de_right - ( pe_width + de_width / 2 )  
                } else {
                    let { dt_list } = In
                    let dt = dt_list[0] as Tree
                    let { sign: pt_sign } = pt.props
                    let { sign: dt_sign } = dt.props

                    if( !pt_sign ){
                        if( dt_sign == '+'){

                            // [bcd][+a] => [a][+bcd][ref_point]    
                            left = de_right - ( pe_width + plus_width + (de_width - plus_width) / 2 )  

                        } else if (dt_sign == '-'){

                            // [bcd][-a] => [-a][+bcd][ref_point]
                            left = de_right - ( pe_width + plus_width + de_width / 2 )  

                        }
                    } else if( pt_sign == '-'){
                        if( dt_sign == '+'){

                            // [-bcd][+a] => [a][-bcd][ref_point]
                            left = de_right - ( pe_width + (de_width - plus_width) / 2 )  
                            
                        } else if( dt_sign == '-'){

                            // [-bcd][-a] => [-a][-bcd][ref_point]
                            left = de_right - ( pe_width + de_width / 2 )  

                        }
                    }
                }

            } else if( eq_origin == 'right_eq') {
                // ref point on left + own mid length

                let { p_tree } = In
                let pt_index = p_tree.list.indexOf( p_tree.name )
                if( pt_index !== 0 ){
                    left = pe_left + de_width / 2
                } else {
                    // pt_index === 0
                    let dt_list = In.dt_list as Tree[]
                    let dt = dt_list[0]
                    if( dt.props.sign == '+'){
                        // [-bcd][+a] => [ref_point][a][-bcd]
                        // [bcd][+a] => [ref_point][a][+bcd]    
                        left = pe_left + ( de_width + plus_width )/ 2
                    } else if( dt.props.sign == '-'){
                        // [-bcd][-a] => [ref_point][-a][-bcd]
                        // [bcd][-a] => [ref_point][-a][+bcd]
                        left = pe_left + de_width / 2 
                    }
                }
            }

            let updateUI = function( In: interaction ): Tree[]{
                // console.log('swap.bx.left')
                let { p_tree } = In
                let dt_list = In.dt_list as Tree[]
                let dt = dt_list[0]
                u.move( dt_list ) 
                .left()

                let dt_index = p_tree.list.indexOf( dt_list[0].name )
                if( dt_index == 0 ){
                    check_equation_sign( p_tree )
                    match_sign( clone, dt )
                    // check_clone_sign( clone, dt_index ) 
                }
                
                p_tree.updateProps()
                return dt_list
            }

            return {
                name: this.name,
                updateUI,
                left 
            }
        } 
    },
    right:{
        name: "swap.bx.right",
        tree_type_list: ["bx"],
        isInContext:function( In: interaction ):boolean{
            let { nt } = In.getProps(['nt', 'pt'])
            if( nt ){
                return true
            } else {
                return false
            }
        },
        makeBorder:function( In: interaction ): Border {
            let { nt, pt, plus_width,
             eq_origin, dt_border } = In.getProps(['nt', 'pt', 
             'eq_origin', 'plus_width','dt_border'])

            let dt_list = In.dt_list[0] as Tree[]
            let dt = dt_list[0]

            let right: number 
            let { 
                    right: ne_right,
                    width: ne_width 
                } = document.getElementById(nt.full_name)
                        .getBoundingClientRect()

            let {
                width: de_width,
                left: de_left 
            } = dt_border

            if( eq_origin == 'left_eq'){
                // check if is first bx
                if( pt ){
                    // ref point on right - own mid length
                    right = ne_right - de_width / 2  
                } else {
                    // first bx of eq
                    if( !dt.props.sign ) 
                    { 
                        // [a][+bcd] => [bcd][+a] [ref_point]
                        // [a][-bcd] => [-bcd][+a] [ref_point]

                        // ref point on right - own mid length - plus mid length
                        right = ne_right -( de_width + plus_width ) / 2 
                    } else {
                        // [-a][+bcd] => [bcd][-a] [ref_point]
                        // [-a][-bcd] => [-bcd][-a] [ref_point]
                        // ref point on right - own mid length
                        right = ne_right - de_width / 2 
                    } 
                }

            } else if( eq_origin == 'right_eq') {
                // ref point on left + after swap elem + own mid width (+plus mid width)

                if( pt ){
                    // not first box
                    // [-a][-bcd] => [ref_point][-bcd][-a]
                    right = de_left + ne_width + de_width / 2
                } else {
                    let dt_list = In.dt_list as Tree[]
                    let dt = dt_list[0]
                    let { sign: dt_sign } = dt.props
                    let { sign: nt_sign } = nt.props

                    if( !dt_sign ){
                        if( nt_sign == '+'){
                            // [a][+bcd] => [ref_point][bcd][+a] 
                            right = de_left + ne_width - plus_width + ( de_width + plus_width ) / 2
                        } else if( nt_sign == '-'){
                            // [a][-bcd] => [ref_point][-bcd][+a]
                            right = de_left + ne_width + ( de_width + plus_width ) / 2
                        }                        
                    } else if( dt_sign == '-'){
                        if( nt_sign == '+'){
                            // [-a][+bcd] => [ref_point][bcd][-a]
                            right = de_left + ne_width - plus_width + de_width / 2
                        } else if ( nt_sign == '-'){
                            // [-a][-bcd] => [ref_point][-bcd][-a]
                            right = de_left + ne_width + de_width / 2
                        }
                    }
                }
            }

            let updateUI = function( In: interaction ): Tree[]{
                // console.log('swap.bx.right')
                let { p_tree  } = In
                let dt_list = In.dt_list as Tree[]

                u.move( dt_list )
                .right()

                let dt_index = p_tree.list.indexOf( dt_list[0].name )
                if( dt_index == 1 ){
                    check_equation_sign( p_tree )
                    match_sign( clone, dt )
                    // check_clone_sign( clone, dt_index ) 
                }

                p_tree.updateProps()
                return dt_list
            }

            return {
                name: this.name,
                updateUI,
                right
            }
        }
    }
}