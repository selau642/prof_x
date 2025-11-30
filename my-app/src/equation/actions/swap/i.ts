import type { interaction } from '../interaction'
import type { Tree, Border } from '../types/main'

import { u } from "../utils/ui.js"

export let i = {
    left: {
        name: "swap.i.left",
        tree_type_list: ['sym', 'num','br','fr'],
        isInContext:function( In: interaction ){
           let { pt } = In.getProps(['pt'])
           if( pt ){
            let { type } = pt
            if( type == 'sym' 
            || type == 'num' )
            {
                return true  
            }
            else
            {
                // exclude br, fr
                return false
            } 
          } else {
              return false
          }
        },
        makeBorder: function( In: interaction ): Border{
            let { pt, eq_origin, dt_border } = 
                In.getProps(['pt', 'eq_origin', 'dt_border'])
            
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
                // ref point on right - after_swap - own mid length
                left = de_right - ( pe_width + de_width / 2 )  
            } else if( eq_origin == 'right_eq') {
                // ref point on left + own mid length
                left = pe_left + de_width / 2
            }
            
            let updateUI = function( In: interaction):Tree[]{                            
                // console.log("swap.i.left")
                let { p_tree } = In
                let dt_list = In.dt_list as Tree[]
                u.move( dt_list )
                .left()

                checkItemDots( dt_list, p_tree )

                p_tree.updateProps()
                return dt_list
            }

            return { 
                name: this.name,
                left, 
                updateUI     
            }
        },
    },
    right: {
        name: "swap.i.right",
        tree_type_list: ['sym', 'num','br','fr'],
        isInContext:function( In: interaction ):boolean{
           let { nt } = In.getProps(['nt'])
           if( nt ){
            let { type } = nt
            if( type == 'sym' 
            || type == 'num' ) 
            {
                return true  
            } else {
                // exclude br, fr
                return false
            } 
           } else {
               return false
           }
        },
        makeBorder: function( In: interaction ): Border {
            let { nt, eq_origin, dt_border } = 
                In.getProps(['nt', 'eq_origin', 'dt_border'])
            
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
                // ref point on right - own mid length
                right = ne_right - de_width / 2   
            } else if( eq_origin == 'right_eq') {
                // ref point on left + after swap elem + own mid length
                right = de_left + ne_width + de_width / 2  
            }

            let updateUI = function( In: interaction): Tree[]{                            
                // console.log('swap.i.right')
                let { p_tree  } = In
                let dt_list = In.dt_list as Tree[]
                u.move( dt_list )
                .right()

                checkItemDots( dt_list, p_tree )

                p_tree.updateProps()
                return dt_list
            }

            return {
                name: this.name, 
                right, 
                updateUI     
            }
        },
    }
}

function checkItemDots( tree_list: Tree[], p_tree: Tree ){
    // check first item 
    let first_item = tree_list[0]
    first_item.checkDot() 

    // check left outer item
    let first_index = p_tree.list.indexOf( first_item.name )
    let left_outer_index = first_index - 1  
    if( left_outer_index >= 0 ){
        let left_outer_item_name = p_tree.list[ left_outer_index ] 
        let left_outer_item = p_tree[ left_outer_item_name ] as Tree
        left_outer_item.checkDot()
    }
    
    //check right outer item
    let last_item = tree_list[ tree_list.length - 1]
    let last_index = p_tree.list.indexOf( last_item.name )
    let right_outer_index = last_index + 1
    if( right_outer_index <= p_tree.list.length - 1 ){
        let right_outer_item_name = p_tree.list[ right_outer_index ]
        let right_outer_item = p_tree[ right_outer_item_name ] as Tree
        right_outer_item.checkDot()
    }
}