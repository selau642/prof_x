import type { interaction } from '../../interaction'
import type { Tree, Tree_List, Border } from '../../types/main'
import { u } from "../../utils/ui.js"
import { clone } from '../../clone_stores.js'

export let insert_i_into_br_from_left={
    name: "insert.i.into.br.from_left",
    tree_type_list: ["sym","num","fr", "br"],
    isInContext: function(In: interaction): boolean {
        let { dt_list } = In
        let { nt } = In.getProps(['nt'])

        if( nt.type == 'br')
        {
            return true
        } else {
            return false
        } 
    },
    makeBorder: function( In: interaction): Border | Border[] {
        // Set double depth trigger
        let { eq_origin, dt_border, 
            nt, eq_sign_border,
             
        } = In.getProps(['eq_origin', 'dt_border', 
                      'nt', 'eq_sign_border'])
        
        let top = ( eq_sign_border.top + eq_sign_border.bottom ) /2

        let { right: ne_right,  
        width: ne_width } = document.getElementById( nt.full_name )
                                .getBoundingClientRect()

        let { right:de_right, left: de_left } = dt_border
        let de_width = de_right - de_left 

        // double right is required because
        //  ( ab+ac+ad ) has width longer than a(b+c+d)
        // resulting in W(a)
        let right: number
        // let right_2: number
        if( eq_origin == 'left_eq')
        {
            right = ne_right - de_width /2 - ne_width / 2
            // right_2 = ne_right - de_width/2
        }
        else if ( eq_origin == 'right_eq')
        {
            right = de_left + de_width /2 + ne_width / 2
            // right_2 = de_left + de_width /2 + ne_width
        }

        let updateUI = function( In: interaction): Tree[]{
            let { dt_list, p_tree } = In

            clone.update( obj => {
                obj.action = 'clear_ref_elem'
                obj.ref_elem = []
                return obj
            })
        
            // ==>> enter
            // console.log( e_tree_list )
            u.cut( dt_list )
            let br = p_tree[ p_tree.list[ u.getCutIndex() ] ] as Tree
            
            u.paste()
            .intoBracket( br )
            .at('start')
            
            let bx = br.parentNode 
            if( bx.list.length == 1 
            && bx.type == 'bx'
            && !br.props.sign )
            {
                if ( bx.props.sign == '+' )
                { 
                    // a + [c](b + d) 
                    // a {+}[c]b +[c]d  
                    // create the {+}
                    let bx = br[ br.list[0] ] as Tree
                    bx.props.sign = '+'
                    u.removeBracket( br )
                    In.border_vars.bracketRemoved = true
                } 
                else if( !bx.props.sign )
                {
                    u.removeBracket( br )
                    In.border_vars.bracketRemoved = true
                }
            }
            else
            {
                br.checkDot()
                In.border_vars.bracketRemoved = false
            }

            In.clone.split_clone_list = u.e_tree_list  
        
            p_tree.updateProps()
            //Path 1: cut, paste and render
            //Goto:  
            //1. Item.svelte, 
            //2. onMount() => !isDraggable => tree_props.store_in_ref_elem
            //3. $clone_obj[0].ref_elem.push( this_item )
                
            //Path 2: on drag end clone element
            //Goto: 
            //1. Item.svelte, 
            //2. handleDragEnd, 
            //3. is array $clone_obj[clone_id].ref_elem
            //4. create new_clone item
            //5. isSplit => onMount => return_to_position
            return u.e_tree_list 
        }

        return { 
            name: this.name,
            updateUI,
            // top,
            right 
            }
    }
}

export let insert_i_into_br_from_right={
    name: "insert.i.into.br.from_right",
    tree_type_list: ["sym","num", "fr", "br"],
    isInContext: function(In: interaction): boolean {
        let { pt } = In.getProps(['pt'])
        if( pt.type == 'br' ){
            return true
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border {
        let { eq_origin, dt_border, pt, eq_sign_border } 
                    = In.getProps(['eq_origin', 'dt_border',
                     'pt', 'eq_sign_border'])

        let top = ( eq_sign_border.top + eq_sign_border.bottom ) / 2
        
        let { right: de_right, left: de_left } = dt_border
        let de_width = de_right - de_left 

        let { width: pe_width, left: pe_left } 
                = document.getElementById( pt.full_name )
                        .getBoundingClientRect()

        let left: number
        if( eq_origin == 'left_eq')
        {
            left = de_right - de_width /2 - pe_width / 2
            // left = drag_elem_right - drag_elem_width/2 - prev_elem_width 
        }
        else if ( eq_origin == 'right_eq')
        {
            left = pe_left + de_width /2 + pe_width / 2
            // left = prev_elem_left + drag_elem_width /2 
        }

        let updateUI = function( In: interaction): Tree[]{
            let { dt_list, p_tree } = In

            clone.update( (obj) => {
                obj.action = 'clear_ref_elem'
                obj.ref_elem = []
                return obj
            })
            // <<== enter from right
    
            u.cut( dt_list )
            // special case of 
            // ={X}(a+b)
            // because after cut it becomes
            // = a+b 

            let br = p_tree[ p_tree.list[ u.getCutIndex() - 1 ] ] as Tree

            u.paste()
            .intoBracket( br )
            .at('start')

            let bx = br.parentNode
            if( bx.list.length == 1 
            &&  bx.type == 'bx'
            && !br.props.sign )
            {
                if ( bx.props.sign == '+' )
                { 
                    // a + [c](b + d) 
                    // a {+}[c]b +[c]d  
                    // create the {+}
                    let bx = br[ br.list[0] ] as Tree
                    bx.props.sign = '+'
                    u.removeBracket( br )
                    // In.border_vars.bracketRemoved = true
                } 
                else if( !bx.props.sign )
                {
                    u.removeBracket( br )
                    // In.border_vars.bracketRemoved = true
                }
            }
            else
            {
                br.checkDot()
                // In.border_vars.bracketRemoved = false
            }

            In.clone.split_clone_list = u.e_tree_list

            p_tree.updateProps()
            
            //Path 1: cut, paste and render
            //Goto:  
            //1. Item.svelte, 
            //2. onMount() => !isDraggable => tree_props.store_in_ref_elem
            //3. $clone_obj[0].ref_elem.push( this_item )
                
            //Path 2: on drag end clone element
            //Goto: 
            //1. Item.svelte, 
            //2. handleDragEnd, 
            //3. is array $clone_obj[clone_id].ref_elem
            //4. create new_clone item
            //5. isSplit => onMount => return_to_position
            return u.e_tree_list 
        }

        return { 
            name: this.name,
            updateUI,
            // top,
            left,
            // afterRenderUI
        }
    }
}

export let extract_i_from_br_from_left={
    name: "extract.i.from.br.from_right",
    tree_type_list: ["in-br"],
    isInContext: function(In: interaction): boolean {
        let { dt_list } = In

        // for equation
        // [a_1*b_1]c + [a_2*b_2]d + [a_3*b_3]e

        // dt_list =
        // [[a_1,         a_2,         a_3],
        //  [b_1,         b_2,         b_3]]

        // p_tree.type may not be br if no bracket case
        let dt_sub_list = dt_list[0] 
        if( Array.isArray( dt_sub_list ) ){
        
          let find_in_br = false
          for(let dt_split of dt_sub_list )
          {
            if( dt_split.props
                .arrow_type.search('in-br') > -1){
                find_in_br = true
                break
            }
          }
          
          if( find_in_br ){
            return true
          }
            // calculations done by 
            // u.paste()
            // .intoBracket()
            // or selection.js
            
            // Alternatively need to calculate
            // for all a, b
            // a_1, a_2, a_3 is side by side, and grand parent
        } else {
            return false
        } 
    },
    makeBorder: function( In: interaction): Border {

        let { dt_list , first_drag } = In
        let { eq_origin,
            dt_border,
            dt_br_border,
        eq_sign_border } = In.getProps([
            'eq_origin',
            'dt_border',
            'dt_br_border',
            'eq_sign_border'
            ])
       
        let top = ( eq_sign_border.top + eq_sign_border.bottom)/2

        let { left: br_left, right: br_right,
        width: br_width } = dt_br_border

        let { width: de_width } = dt_border

        let bx_count = (dt_list[0] as Tree[]).length
        let left 
        if( first_drag ){
            left = br_left
        } else if( eq_origin == 'left_eq'){
            left = br_right - ( br_width - ( de_width * bx_count ) )
                    - de_width / 2 
        } else if( eq_origin == 'right_eq'){
            left = br_left + de_width / 2
        }

        let updateUI = function( In: interaction): Tree[]{

            // Clone.svelte
            In.original_tree = false

            // exit bracket <<---
            let dt_list  = In.dt_list as Tree_List[]

            let dt = dt_list[0][0]

            let p_tree_list = dt_list[0].map((tree)=>{
                    return tree.parentNode
                })
                // isSubBracket,
                // br_side_obj
            // } = this.getPrevUpdate({ clear: true })

            let eq = dt
                .parentNode //bx
                .parentNode //eq | br | top | bot
            // let yellow_count = br_tree_list[0].length
            // let child_count = bracket_tree.list.length
            let br
            let has_insert_bracket = false
            if( eq.type == 'br')
            {
                br = eq
            } else { 
            // if( In.border_vars.bracketRemoved ) {
                // [b]a+[b]c+d => 
                // {()}[b]a+[b]c+d =>
                // {( [b]a + [b]c )} + d =>
                // [b](a+c) + d

                let { max_left_index } = In.getProps(['im_br_border']).im_br_border 

                br = u.insertBracketInto( eq )
                            .at( max_left_index )
                            .getBracketTree()

                has_insert_bracket = true


                
                p_tree_list = u.sort( p_tree_list ).by( eq.list )

                // +a[b]+c[b] => 
                // b({remove+}a+c)
                let first_bx = p_tree_list[0]
                if( first_bx.props.sign == '+')
                {
                    first_bx.props.sign = false
                }

                u.cut( p_tree_list )
                .paste()
                .into( br )
                .at('start')
            }
            // else 
            // {
            //     // a[b]+[b]+d[b] => [b](a+1+d)
            
            //     if( eq_tree.name.search('eq') > -1)
            //     {
            //         //insert bracket
            //         br = u.insertBracket( eq_tree )
            //         has_insert_bracket = true 
            //     }
            //     else
            //     {
            //         bracket_tree = eq_tree
            //     }
            // }

            let p_br_tree = br.parentNode
            // paste left side of bracket
            let b_index = p_br_tree.list.indexOf( br.name )

            let new_dt_list = []
            for( let sub_tree_list of dt_list )
            {
                u.cut( sub_tree_list )
                
                let cut_tree_list = u.getCutTree()
                let single_tree = cut_tree_list[0]
                new_dt_list.push( single_tree )
                let single_tree_list = [ single_tree ]

                u.paste( single_tree_list )
                .into( p_br_tree )
                .at( b_index )
                b_index ++
            }

            br.checkDot()
            
            for( let tree of p_tree_list )
            {
                u.checkAndRemoveBracket( tree )
            }

            clone.update( (obj) => {
                obj.action ='clear_ref_elem'
                obj.ref_elem = null
                return obj
            })
            
            In.clone.split_clone_list = false //handledragend
            
            if( has_insert_bracket )
            {
                // p_br_tree = bx which was inserted
                // and does not have updateProps set yet
                p_br_tree.parentNode.updateProps()
            }
            else
            {
                p_br_tree.updateProps()
            }
            //on release clone_element
            //Goto: 
            //1. Item.svelte, 
            //2. handleDragEnd, 
            //3. not array $clone_obj[clone_id].ref_elem
            //4. return to position 
            return new_dt_list 
        }

        return { 
            name: this.name,
            updateUI,
            // top,
            left,
        }
    }
}

export let extract_i_from_br_from_right={
    name: "extract.i.from.br.from_right",
    tree_type_list: ['in-br'],
    isInContext: function(In: interaction): boolean {
        let { dt_list } = In

        // for equation
        // [a_1*b_1]c + [a_2*b_2]d + [a_3*b_3]e

        // dt_list =
        // [[a_1,         a_2,         a_3],
        //  [b_1,         b_2,         b_3]]

        // p_tree.type may not be br if no bracket case
        let dt_sub_list = dt_list[0] 
        if( Array.isArray( dt_sub_list ) ){ 
            let find_in_br = false
            for(let dt_split of dt_sub_list )
            {
                if( dt_split.props
                    .arrow_type.search('in-br') > -1){
                    find_in_br = true
                    break
                }
            }
            
            if( find_in_br ){
                return true
            } else {
                return false
            }
            // calculations done by 
            // u.paste()
            // .intoBracket()
            // or selection.js
            
            // Alternatively need to calculate
            // for all a, b
            // a_1, a_2, a_3 is side by side, and grand parent
        } else {
            return false
        }
    },
    makeBorder: function( In: interaction): Border {
        let { first_drag } = In
        let dt_list = In.dt_list as Tree_List[]
        let { eq_origin,
            dt_border,
            dt_br_border,
        eq_sign_border } = In.getProps([
            'eq_origin',
            'dt_border',
            'dt_br_border',
            'eq_sign_border'
        ])
       
        let top = ( eq_sign_border.top + eq_sign_border.bottom)/2

        let { left: br_left, right: br_right,
        width: br_width } = dt_br_border

        let { width: de_width } = dt_border

        let bx_count = dt_list[0].length
        let right 
        if( first_drag ){
            right = br_right
        } else if( eq_origin == 'left_eq'){
            right = br_right - de_width / 2
        } else if( eq_origin == 'right_eq'){
            right = br_left + (br_width - (de_width * bx_count) )
                  + de_width / 2
        }

        let updateUI = function( In: interaction): Tree[]{
            // Clone.svelte
            In.original_tree = false

            // exit bracket --->>
            let dt_list = In.dt_list as Tree_List[]
            let dt = dt_list[0][0]
            let p_tree_list = dt_list[0].map((tree)=>{
                    return tree.parentNode
                })
                // isSubBracket,
                // br_side_obj
            // } = this.getPrevUpdate({ clear: true })

            let eq = dt
                .parentNode //bx
                .parentNode //eq | br | top | bot
            // let yellow_count = br_tree_list[0].length
            // let child_count = bracket_tree.list.length
            let br
            let has_insert_bracket = false
            if( eq.type == 'br' 
            && eq.list.length == dt_list[0].length )
            {
                // ([a]b+[a]c+[a]d)
                // exclude case
                // ([a]b+[a]c + ad)
                br = eq
                
            } else { 
            // if( In.border_vars.bracketRemoved ) {
                // [b]a+[b]c+d => 
                // {()}[b]a+[b]c+d =>
                // {( [b]a + [b]c )} + d =>
                // [b](a+c) + d

                let { max_left_index } = In.getProps(['im_br_border']).im_br_border 

                br = u.insertBracketInto( eq )
                            .at( max_left_index )
                            .getBracketTree()

                has_insert_bracket = true

                let p_tree_list = dt_list[0].map((tree)=>{
                    return tree.parentNode
                })
                
                p_tree_list = u.sort( p_tree_list ).by( eq.list )

                // +a[b]+c[b] => 
                // b({remove+}a+c)
                let first_bx = p_tree_list[0]
                if( first_bx.props.sign == '+')
                {
                    first_bx.props.sign = false
                }

                u.cut( p_tree_list )
                .paste()
                .into( br )
                .at('start')
            }
            // else 
            // {
            //     // a[b]+[b]+d[b] => [b](a+1+d)
            
            //     if( eq_tree.name.search('eq') > -1)
            //     {
            //         //insert bracket
            //         br = u.insertBracket( eq_tree )
            //         has_insert_bracket = true 
            //     }
            //     else
            //     {
            //         bracket_tree = eq_tree
            //     }
            // }

            let p_br_tree = br.parentNode
            let b_index = p_br_tree.list.indexOf( br.name )
            // (a+b)[X] paste right side of bracket
            b_index += 1
            let new_dt_list = []
            for( let sub_tree_list of dt_list )
            {
                u.cut( sub_tree_list )
                
                let cut_tree_list = u.getCutTree()
                let single_tree = cut_tree_list[0]
                new_dt_list.push( single_tree )
                let single_tree_list = [ single_tree ]

                u.paste( single_tree_list )
                .into( p_br_tree )
                .at( b_index )
                b_index ++
            }

            br.checkDot()

            for( let tree of p_tree_list )
            {
                u.checkAndRemoveBracket( tree )
            }
            clone.update( (obj) => {
                obj.action ='clear_ref_elem'
                obj.ref_elem = null
                return obj
            })
            
            In.clone.split_clone_list = false //handledragend
            
            if( has_insert_bracket )
            {
                // p_br_tree = bx which was inserted
                // and does not have updateProps set yet
                p_br_tree.parentNode.updateProps()
            }
            else
            {
                p_br_tree.updateProps()
            }
            //on release clone_element
            //Goto: 
            //1. Item.svelte, 
            //2. handleDragEnd, 
            //3. not array $clone_obj[clone_id].ref_elem
            //4. return to position 
            return new_dt_list
        }

        return { 
            name: this.name,
            updateUI,
            // top,
            right,
        }
    }
}