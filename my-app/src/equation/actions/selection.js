import { op } from './xTree.js'
import { u } from './utils/ui.js'


export let s =  {
    select: function( event )
    {
        let e_tree = event.detail.child_tree
        if( e_tree.type == 'br')
        {
            //isBracket
            this.select_in( e_tree )
            e_tree.updateProps()	
        }	

        this.select_out( e_tree )
    },
    check:function( tree )
    {
        this.check_tree = tree
        return this
    },
    select_in: function( e_tree )
    {

        e_tree.props.selected = true
        if( e_tree.props.show_arrow )
        {
            e_tree.props.show_arrow = false
        }

        if( e_tree.list 
        && e_tree.list.length == 0
        )
        {   
            // no tree list
            // e_tree.type = sym || num

            let { sign, text } = e_tree.props
            if( sign )
            {
                e_tree.props.sub_formula = sign + text
            }
            else
            {
                e_tree.props.sub_formula = text 
            }            
        }
        else
        {
            // e_tree.list && e_tree.list.length > 0

            // let e_sub_formula = ''
            // let prev_child_text = ''
            // let isCoeff_regex = /[0-9]|\./
            let loop_store = { prev_child_text: false }
            let e_sub_formula = ''
            let tree_list = e_tree.list 
            for( var child_name of tree_list )
            {
                let child_tree = e_tree[ child_name ]
                
                this.select_in( child_tree )
                
                // if( !(e_tree.name.split('_')[0] == 'eq') ) //isRoot 
                // {
                //     child_props.show_arrow = false
                // }
                e_sub_formula = this.makeChildSubFormula({
                                        e_sub_formula,
                                        child_tree,                    
                                        loop_store //pass on prev_child_text
                                    })

                
            }

            // for br add ()
            e_sub_formula = this.makeTreeSubFormula({
                                e_sub_formula,
                                e_tree
                            })

            e_tree.props.sub_formula = e_sub_formula
        }
    },
    makeChildSubFormula:function( input )
    {
        let {
            loop_store, 
            e_sub_formula,
            child_tree
        } = input

        let child_tree_type = child_tree.type
                
        let { 
            text: child_text, 
            sub_formula: child_sub_formula 
            } = child_tree.props

        let { 
            first_item = true,
            isBoxSign,
            } = loop_store

        if( child_tree_type == 'num'
        || child_tree_type == 'sym'
        || child_tree_type == 'fr' 
        || child_tree_type == 'br' )
        {   
            // if( !isBoxSign )            
            // {                
                if( !first_item )
                {
                    // [sub_formula]*-a
                    e_sub_formula = 
                    e_sub_formula +  "*" + child_sub_formula
                }
                else
                {
                    // a
                    loop_store.first_item = false
                    e_sub_formula = 
                    e_sub_formula + child_sub_formula
                }
            // }
            // else
            // {
            //     loop_store.isBoxSign = false
            //     loop_store.first_item = false
            //     // +|-
            //     e_sub_formula += child_sub_formula
            // }
       }
        // else if( child_tree_type == 'bx_sign' )
        // {
        //     e_sub_formula += child_sub_formula
        //     loop_store.isBoxSign = true
        // }
        else if( child_tree_type == 'bot')
        {
            // a/[b] 
            // a/[(b+c)]
            e_sub_formula = e_sub_formula + "/" + child_sub_formula
        }
        else
        {
            // e_tree_type = bx || top
            // a[-b], a[+b], a+b[+c]
            e_sub_formula += child_sub_formula
        }

        return e_sub_formula    
    },
    makeTreeSubFormula:function( input )
    {
        let {
            e_sub_formula,
            e_tree
        } = input
        
        let e_tree_type = e_tree.type 
        if( e_tree_type == 'br')
        {
            // [(] b+c [)]
            let { sign } = e_tree.props
            if( sign )
            {
                e_sub_formula = sign + '(' + e_sub_formula + ')'
            }
            else
            {
                e_sub_formula = '(' + e_sub_formula + ')'
            }
        }
        else if( e_tree_type == 'bx' 
        || e_tree_type == 'fr')
        {
            let { sign } = e_tree.props
            if( sign )
            {
                e_sub_formula = sign + e_sub_formula 
            }
            // else
            // {
            //     e_sub_formula =  e_sub_formula 
            // }
        }

        return e_sub_formula
    },    
    select_out: function( e_tree, target_tree=false )
    {
        target_tree = target_tree ? target_tree: e_tree

        let p_tree = e_tree.parentNode
        let p_tree_type = p_tree.type
        let isParentAllChildSelected = this.check(p_tree)
                                        .isAllChildSelected()
        if( 
          isParentAllChildSelected
          //&& p_tree_type != 'br' 
        )        
        {
            // let first_elem = p_tree[ p_tree.list[0] ]
            // let first_type = first_elem.type
            // if( first_type == 'bx_sign'
            // || first_type == 'i_sign' )
            // {
            //     //select sign                
            //     first_elem.props.selected = true
            // }
            //select sign handle in buildSubFormulaOutward
            this.buildSubFormulaOutward({ e_tree:p_tree }) 

            let isRoot = (p_tree.type == 'eq')
            
            if( !isRoot )
            {

                // Case 1: Enlarge Selection
            // 1. hide child show_arrow
            // 2. build sub_formula
            // 3. dispatch upward

                p_tree.props.selected = true
                p_tree.updateProps()
                this.select_out( p_tree )
            }
            else if( isRoot )
            {
                // Case 2: Terminate at Root Level
                // 1. child show_arrow = true
                // 2. no upward dispatch
                if( e_tree.type == 'bx')
                {
                    this.setArrowDirection({ e_tree })
                    e_tree.props.show_arrow = true              
                }
            }
        }
        else
        {
            // not all child selected
            
            this.showArrow({
                tree: e_tree
            })
        }
    },
    buildSubFormulaOutward:function( input )
    {
        let { e_tree } = input

        let tree_list = e_tree.list
        // if( !tree_list ) console.log( tree )
        let isRoot = (e_tree.type == "eq" )

        let loop_store = {}
        let e_sub_formula = ''

        for( var child of tree_list )
        {
            let child_tree = e_tree[ child ]
            let child_props = e_tree[ child ].props 

            if( !isRoot ) 
            {
                child_props.show_arrow = false
            } 

            e_sub_formula = this.makeChildSubFormula({
                                e_sub_formula,
                                child_tree,
                                loop_store
                            })
        }

        e_sub_formula = this.makeTreeSubFormula({
                        e_sub_formula,
                        e_tree
                    })

        e_tree.props.sub_formula = e_sub_formula
    },
    isAllChildSelected:function()
    {
        let { check_tree: tree } = this
        let selected_child_count = 0
        let selectable_child_count = 0    
        let tree_list = tree.list
        for( let child of tree_list )
        {
            let child_tree = tree[child]
            let child_props = child_tree.props
            if( child_props.selected ) selected_child_count ++
            // if( child_tree.type !='bx_sign' 
            // && child_tree.type !='i_sign' ) 
            selectable_child_count ++
        }

        return ( selected_child_count == selectable_child_count )
    },
    showArrow:function( input )
    {
        // e_tree show_arrow 
        // and outer sibling show_arrow, yellow 

        let { 
            tree:e_tree, 
            tree_type:e_tree_type, 
            loop_obj = {}
        } = input
        
        let target_tree // actual algebric variable being selected

        if( !e_tree_type ) //to check if already getInnerItemTreFrom
        {
            let results = this.getInnerItemTreeFrom({ tree:e_tree })
            target_tree = results.match_tree
            e_tree_type = results.match_type
        }
        else
        {
            target_tree = e_tree
        }

        // let br_tree = this.getValue( loop_obj, 'br_tree' )
        //                 .orSet( () => target_tree.parentNode.parentNode.parentNode )
        // let br_tree_length = this.getValue( loop_obj, 'br_tree_length')
        //                         .orSet( () => br_tree.list.length )

        if( e_tree_type == 'box' )
        {
            this.setArrowDirection({ e_tree })
            e_tree.props.show_arrow = true

            let e_tree_list = [ ...e_tree.list ] 
            let e_tree_loop_obj = {}
            for( let child_name of e_tree_list)
            {
                let child_tree = e_tree[ child_name ]
                this.hideArrow({
                    tree: child_tree,
                    loop_obj: e_tree_loop_obj
                })
            }
        }
        else if( e_tree_type == 'item_without_outer_sibling' )
        {

            // ([a]b + c)
            // b is inner sibling
            // c is outer sibling
            // item_without_outer_sibling :
            // ([a]b) 
            
            // let item_tree = target_tree.parentNode
            // this.setArrowDirection({ e_tree:item_tree })
            // item_tree.props.show_arrow = true
            
            this.setArrowDirection({ e_tree })
            e_tree.props.show_arrow = true
        }    
        else // if( e_tree_type == 'item_with_outer_sibling'
            //  || e_tree_type == 'box_second_item' ) 
        {
            // item_with_outer_sibling
            // check match yellow arrow

           
            // setup show_arrow_list = [{tree}, {...}]
            // excludes e_tree
            let show_arrow_list = this.getValue( loop_obj, 'show_arrow_list')
                                .orSet( this.makeFn_ShowArrowList(target_tree) )
            
            // extract trees in show_tree_list
            // that match depth and sub_formula of
            // e_tree
            
            let { match_tree_list } 
                    = this.getMatchTree({
                            show_arrow_list,
                            item_tree:target_tree
                            })

            //check if match

            // let br_tree_length = target_tree.parentNode.parentNode.list.length
            // console.log( "match_tree #:", match_tree_list.length
            //                "bracket_tree_child #:", br_tree_length )

            if( match_tree_list.length > 0
            // && br_tree_length - 1 == match_tree_list.length 
            // Disable this to allow a[b][+b] => a[b]+[b]
            )
            {
                // all tree match
                // set yellow_arrow

                // insert e_tree into match_list
                match_tree_list.push({ 
                    match_type: e_tree_type, 
                    match_tree: target_tree
                }) 

                // pasted_tree_list.push( e_tree )
                //set all matched trees to yellow_arrow

                this.setYellowArrow({
                    match_tree_list
                    // pasted_tree_list
                })                
            }
            else 
            {                
                // ab [+c]
                // target_tree = [c]
                // e_tree = [+c]
                // this.setArrowDirection({ e_tree })
                // e_tree.props.show_arrow = true
                // let item_tree = target_tree
                // this.setArrowDirection({ e_tree:item_tree })
                // item_tree.props.show_arrow = true

                this.setArrowDirection({ e_tree })
                e_tree.props.show_arrow = true
            }
        }
    },
    setArrowDirection: function(input)
    {
        let { e_tree, arrow_type } = input
        // arrow_type = '*_in-br', '*_i' or none
        if( !arrow_type ) arrow_type = e_tree.props.arrow_type
        let arrow_color = arrow_type.split('_')[1]

        let type = e_tree.type
        let parent_type
        
        if( type == 'br'
        || type == 'sym'
        || type == 'num' 
        || type == 'fr' )
        {
            parent_type = e_tree
            //.parentNode //bx
            .parentNode // top|bot
            .type
        }
        else if( type == 'bx')
        {
            parent_type = e_tree.parentNode //eq|br
            .parentNode // bx
            .parentNode // top | bot
            .type
        }
        else
        {
            return
        }
        
        if( parent_type == 'bot')
        {
            e_tree.props.arrow_type = 'bottom_' + arrow_color
            e_tree.props.arrow_direction = 'bottom'
        }
        else
        {
            e_tree.props.arrow_type = 'top_' + arrow_color
            e_tree.props.arrow_direction = 'top'
        }
    },
    getValue:( loop_obj, key ) =>
    {
        return {
            orSet:( fn ) =>
            {
                if( loop_obj[key] === undefined )
                {
                    loop_obj[key] = fn()
                }
                
                return loop_obj[key]                
            }
        }
    },
    makeFn_ShowArrowList: (e_tree) => () =>
    {
        // e_tree must always be sub_item tree
        let bx = e_tree.parentNode
        let br = bx.parentNode         //@ eq

        let bx_full_name = bx.full_name
                        
        let show_arrow_list 
            = u.getArrowFrom( br.full_name )
                .whereArrowTypeIs('all')

        show_arrow_list = show_arrow_list.filter( (i) => {
                    return i.full_name != e_tree.full_name 
                    && i.parentNode.full_name != bx_full_name
                })
        // let tree_index = show_arrow_list.findIndex( 
        //             (tree) => 
        //             tree.full_name == e_tree.full_name 
        //         )
        
        // if( tree_index > -1)
        // {
        //     show_arrow_list.splice( tree_index, 1)
        // }
        return show_arrow_list
    },
    getMatchTree: function( input )
    {
        let { 
            show_arrow_list,
            item_tree // or bracket_tree
        } = input

        let tree_depth = item_tree.full_name.split("-").length
        let tree_sub_formula = item_tree.props.sub_formula
        let match_tree_list = []
        //let pasted_tree_list = []
        for( let arrow_tree of show_arrow_list )
        {
            //1. check prefix type first 
            //      then check depth
            //2. then check sub_formula match

            let { match_type, match_tree } = 
                    this.getInnerItemTreeFrom({
                        tree: arrow_tree 
                    })
            // if( !match_tree ) console.log( 'arrow_item_name', arrow_tree.full_name ) 
            let m_depth = match_tree.full_name.split('-').length

            if( m_depth == tree_depth )
            {
                let m_sub_formula = match_tree.props.sub_formula

                if( m_sub_formula == tree_sub_formula )
                {
                    match_tree_list.push( {
                        match_type,
                        match_tree                        
                    } )

                    //pasted_tree_list.push( match_tree )
                }
            }
        }

        return { match_tree_list
            //, pasted_tree_list 
        }
    },
    setYellowArrow:function( input )
    {
        let { 
            match_tree_list, 
            // pasted_tree_list 
        } = input 
        
        let pasted_tree_list = match_tree_list.map( obj => obj.match_tree )

        for( let obj of match_tree_list )
        {   
            let { match_tree, match_type } = obj

            let item_tree = match_tree

            item_tree.props.arrow_type = '*_in-br'
            this.setArrowDirection({ e_tree: item_tree })
            
            // console.log( item_tree.full_name )
            // console.log( item_tree.props.arrow_type )

            item_tree.props.show_arrow = true

            item_tree.props.pasted_tree_list = pasted_tree_list
            item_tree.props.yellow_type = match_type

            item_tree.updateProps()

            if( match_type == 'box_first_item' )
            {
                //case [y]

                let parent_tree = item_tree.parentNode
                parent_tree.props.show_arrow = false
                parent_tree.props.selected = false
                parent_tree.updateProps()
            }
            else if( match_type == 'box_second_item')
            {
                // case -[y]
                
                let parent_tree = item_tree.parentNode
                parent_tree.props.show_arrow = false
                parent_tree.props.selected = false
                let first_child = parent_tree[parent_tree.list[0]]
                first_child.props.selected = false
                parent_tree.updateProps()
            }
        }
    },
    getInnerItemTreeFrom: function( input )
    {
        // return sub_item_tree sym | num
        let { 
            tree, 
            full_name 
        } = input
        
        if( !tree ) tree = op.getTreeByName( full_name ).tree
        if( !full_name ) full_name = tree.full_name 

        let { type } = tree
        let match_type = false 
        let match_tree = false

        if( type == 'sym' 
        || type == 'num' 
        || type == 'fr'
        || type == 'br')
        {
            let br_tree = tree
                         .parentNode     // @ bx
                         .parentNode     // @ br

            if( br_tree.list.length > 1 )
            {
                 match_type ='item_with_outer_sibling'            
            }           
            else 
            {
                match_type = 'item_without_outer_sibling'
            }
            // type = 'item'
            match_tree = tree
        // else if( prefix == 'i')
        // {
        //     let br_tree = tree.parentNode     // @ bx
        //                     .parentNode     // @ br

        //     if( br_tree.list.length > 1 )
        //     {
        //          type ='item_with_outer_sibling'            
        //     }           
        //     else 
        //     {
        //         type = 'item_without_outer_sibling'
        //     }
        //     // type = 'item'
        //     match_tree = tree
        //     // type = 'sub_item'
        //     // match_tree = tree[ tree.list[ tree.list.length - 1 ] ]

        }
        else if( type == 'bx')
        {
            let box_tree_length = tree.list.length
            if( box_tree_length == 1 )
            {
                // bx => bx-i_1
                // box[ item[y] ]  --> item[y]
                let item_tree = tree[ tree.list[0] ]
                match_type = 'box_first_item'
                match_tree = item_tree // sym || num || br || fr

                // if( item_tree.list.length == 1 )
                // {
                //     type = 'box_first_item'
                //     // let sub_item_tree = item_tree[ item_tree.list[0] ]
                //     match_tree = item_tree
                // }
                // else
                // {
                //     type = 'box_second_item'
                //     // let sub_item_tree = item_tree[ item_tree.list[1] ]
                //     match_tree = item_tree
                // }
            }
            // else if( box_tree_length == 2)
            // {
            //     // detect bx_sign, item case

            //     let first_item_type = tree[ tree.list[0] ].type
            //     if( first_item_type == 'bx_sign')
            //     {
            //         //[-y]  --> -[y]
            //         type = 'box_second_item'
            //         match_tree = tree[ tree.list[1] ]
            //     }
            //     else
            //     {
            //         // just a normal box
            //         // like [{a}b] or [{3}a]                    
            //         type = 'box'
            //         match_tree = tree
            //     }
            // }    
            else
            {
                //box_tree_length > 1
                match_type = 'box'
                match_tree = tree
            }            
        }      
        else
        {
            // not box, not item
            // console.log("other prefix:", prefix )
            match_type = 'other'
            match_tree = tree
        }

        return { match_type, match_tree }
    },
    deselect: function( event )
    {
        let e_tree = event.detail.child_tree

        if( e_tree.type == 'br')
        {
            this.deselect_in( e_tree )	
            e_tree.updateProps()	
        }	
        this.deselect_out( e_tree )
    },
    deselect_in: function( e_tree )
    {
        if( e_tree.list )
	    {
    		for(let child_name of e_tree.list)
	    	{
                let child_tree = e_tree[ child_name ]
                let child_props = child_tree.props
                child_props.selected= false
                child_props.show_arrow = false

                let child_tree_list = child_tree.list
                if( child_tree_list 
                    && child_tree_list.length > 0 )
                {
                    this.deselect_in( child_tree )
                }
    		}
	    }
    },
    deselect_out: function ( e_tree )
    {   
        let p_tree = e_tree.parentNode
        if( p_tree.props.selected )
        {
            let p_tree_list = [...p_tree.list]
            let e_tree_index = p_tree_list.indexOf( e_tree.name )
            p_tree_list.splice( e_tree_index, 1)
            let sib_tree_list = p_tree_list
            let sib_tree_obj = {}
            for( let key of sib_tree_list)
            {
                let sib_tree = p_tree[key]
                // if( 
                // ( sib_tree.type == 'bx_sign' 
                // || sib_tree.type == 'i_sign' )

                // && sib_tree.props.selected )
                // {
                //     // [+a{X}] => [+[a]X]
                //     // bin operator not selected
                //     sib_tree.props.selected = false
                //     sib_tree.props.show_arrow = false
                // }
                // else
                // {
                    // [ab{X}(c+d)] => [[a][b]X[(c+d)]]
                    // [(a+{X}+b)] => [([a]+X[+b])]
                    this.showArrow({ 
                            tree:sib_tree,
                            loop_obj: sib_tree_obj
                        })
                // }
            }
    
            let isRoot = ( p_tree.type == 'eq' )
            if( isRoot )
            {
                let e_tree_type = e_tree.type
                if( e_tree_type == 'bx')
                {
                    // ... [+a[b]] ... => ... +a[b] ...
                    e_tree.props.show_arrow = false
                    console.log("isRoot box deselect")
                }
                else if( e_tree_type == 'br')
                {
                    // ...[()]... => ... () ...
                    e_tree.props.show_arrow = false
                    console.log("isRoot bracket deselect")
                }
            }
            else
            {
                // [+a[X]] => +a[X]
                p_tree.props.selected = false
                p_tree.updateProps()
                // Continue deselect_out
                this.deselect_out(p_tree)
            }    
        }
        else
        {
            // Terminate deselect_out
            this.hideArrow({
                    tree:e_tree,
                    loop_obj:{},
                })    
        }
    },
    hideArrow:function( input )
    {    
        let { 
            tree:e_tree, 
            loop_obj 
        } = input
        // 1. action == 'add' vs 'remove'
        // add : 1. check if not single item box
        //      2. match_tree_name_list
        //      3. set arrow_type = 'yellow'
        // remove: 1. check if tree.props.arrow_type = yellow
        //      2. no need match_tree_name_list
        //      3. set arrow_type = 'multi_top' 
        
        // if( e_tree.type == 'i_sign' || e_tree.type == 'bx_sign') return

        if( e_tree.props.arrow_type.search('in-br') == -1 )
        {
            //not yellow arrow
            // not_yellow[X] => X
            e_tree.props.show_arrow = false
            // console.log('yellow[X] => X')
        }
        else //if( is_tree_yellow_arrow )
        {
            // let br_tree = this.getValue( loop_obj, "br_tree")
            //             .orSet(()=> e_tree.parentNode.parentNode )
             
            // let b_tree_length = br_tree.list.length

            let show_arrow_list = this.getValue( loop_obj, 'show_arrow_list')
                                .orSet( this.makeFn_ShowArrowList(e_tree) )

            let { match_tree_list } = this.getMatchTree({
                                            show_arrow_list,
                                            item_tree:e_tree
                                        })
    
            if( 
                // b_tree_length - 1 == match_tree_list.length // plus 1 count of tree
                match_tree_list.length > 0 
            ) 
            {
                // yellow[X] => X
                e_tree.props.show_arrow = false
                e_tree.props.arrow_type = 'top_i'
                e_tree.props.pasted_tree_list = false
                // console.log('...yellow<X> => X')
                this.unsetYellowArrow({ match_tree_list })
            }
        }
    },
    unsetYellowArrow: function( input )
    {
        let { match_tree_list } = input
        for( let obj of match_tree_list )
        {   
            let { 
                match_tree,
                // type 
            } = obj
            match_tree.props.arrow_type = '*_i'
            this.setArrowDirection({ e_tree:match_tree })
            match_tree.props.pasted_tree_list = false

            // reverse previous actions
            let { yellow_type: type } = match_tree.props

            if( type == 'box_first_item' )
            {
                //case [y]
                let parent_tree = match_tree.parentNode
                this.setArrowDirection({ e_tree:parent_tree })
                parent_tree.props.show_arrow = true
                parent_tree.props.selected = true
                parent_tree.updateProps()
                match_tree.props.show_arrow = false
            }
            // else if( type == 'box_second_item')
            // {
            //     // case -[y]
                
            //     let parent_tree = match_tree.parentNode
            //     this.setArrowDirection({ e_tree:parent_tree })
            //     parent_tree.props.show_arrow = true
            //     parent_tree.props.selected = true
            //     let first_child = parent_tree[parent_tree.list[0]]
            //     first_child.props.selected = true
            //     parent_tree.updateProps()
            //     match_tree.props.show_arrow = false
            // }
            match_tree.updateProps()
        }
    }
}