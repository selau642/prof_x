import { op } from '../actions/xTree.js'
import { dt } from './dt/decision_tree.js'

dt.make({
    name:'select',
    fn: (slot) => function( tree )
    {
        this.var['tree'] = tree

        if( tree.props.type =='bracket' )
        {
            this.goto( slot.is_bracket )
        }

        this.goto( slot.next )
    },
    slot: {
        is_bracket:['build_subformula_downward'],
        next:['select_up']
    }
})

dt.make({
    name: 'build_subformula_downward',
    fn: (slot) => function()
    {
        let input_tree = this.var['tree']
        if(input_tree.list)
        {	
            let sub_formula = ''
            let prev_child_text = ''
            let isCoeff = /[0-9]|\./

            for(let child of input_tree.list)
            {
                let child_tree = input_tree[ child ]
                let child_props = child_tree.props
                // if(!child_props.selected)
                // {
                    //tried to be efficient in not looping selected child
                    //but will missed the opportunity to update sub_formula
                    //updating sub_formula in deselect does not solve the problme
                    //if keep user keep selecting without deselect action.
                    //error comes from +/- sign changes and no update to sub_formula
                // }
                child_props.selected = true
                
                
                let tree_list = input_tree[child].list
                if( tree_list && tree_list.length > 0 )
                {
                    this.goto( slot.recursive )
                }
            

                child_props.show_arrow = false
                if( child_props.text || child_props.text === "" )
                {   
                    if( isCoeff.test(prev_child_text) )
                    {
                        sub_formula = sub_formula +  "*" + child_props.text
                    }
                    else
                    {
                        sub_formula += child_props.text
                    }
                    prev_child_text = child_props.text
                }
                else
                {
                    if( child_props.type == 'bottom' )
                    {
                        sub_formula = sub_formula + "/" + child_props.sub_formula
                    }
                    else
                    {
                        sub_formula += child_props.sub_formula
                    }
                }
            }

            if( input_tree.props.type == 'bracket')
            {
                sub_formula = "(" + sub_formula + ")"
            }

            input_tree.props.sub_formula = sub_formula
        }
    },
    slot:{
        recursive: 'build_subformula_downward'
    }
})


dt.make({
    name: 'select_up',
    fn: ( slot ) => function()
    {
        //climbTree
        let tree = this.var['tree']
        this.var['event_tree'] = tree 
        tree =  tree.parentNode
        this.var['tree'] = tree

        let isRoot = (tree.name.search('eq_') > -1)
        this.var['isRoot'] = isRoot
        this.goto(slot.next)
    },
    slot:{ next:[{set:'event_tree, tree'}, 'if_all_child_selected']}
})

dt.make({
    name:'if_all_child_selected',
    fn: (slot) => function(){
        
        let tree = this.var['tree']
        let selected_child_count = 0
        let selectable_child_count = 0
        

        for( let child of tree.list )
        {
            let child_props = tree[child].props
            if( child_props.selected ) selected_child_count ++
            if( child_props.type !='bin') selectable_child_count ++
        }

        let is_all_child_selected = (selected_child_count == selectable_child_count)

        if( is_all_child_selected )
        {
            this.goto( slot.all_child_selected)
        }
        else
        {
            this.goto( slot.not_all_child_selected )
        }
    },
    slot: { 
        all_child_selected:['build_subformula_upward', 
            { note: 'hide_child_arrow in build_subfomula_upward'},
            'if_not_root_then_recursive'],
        not_all_child_selected:['select_end']
     }
})

dt.make({
    name: 'build_subformula_upward',
    fn: (slot) => function()
    {
        let tree = this.var['tree']
        let sub_formula = ''
        let prev_child_text = ''
        let isCoeff = /[0-9]|\./
        let tree_list = tree.list
		for( var child of tree_list )
		{
            let child_props = tree[ child ].props 
            let not_root = !this.var['isRoot']
            if( not_root ) 
            {
                //hide arrow to enlarge selection
                child_props.show_arrow = false
            } //else: isRoot, don't hiding child arrow

            if( child_props.type == 'bin')
            {
                child_props.selected = true //to handle 'bin' case
            }

            if( child_props.text || child_props.text === "" )
            {   
                if( isCoeff.test(prev_child_text) )
                {
                    sub_formula = sub_formula +  "*" + child_props.text
                }
                else
                {
                    sub_formula += child_props.text
                }
                prev_child_text = child_props.text
            }
            else
            {
                if( child_props.type == 'bottom' )
                {
                    sub_formula = sub_formula + "/" + child_props.sub_formula
                }
                else
                {
                    sub_formula += child_props.sub_formula
                }
            }
        }

        if( tree.props.type == 'bracket')
        {
            sub_formula = '(' + sub_formula + ')'
        }
        
        tree.props.sub_formula = sub_formula
    },
    slot:{
        next:[]
    }
})

dt.make({
    name: 'if_not_root_then_recursive',
    fn: (slot) => function()
    {
        let isRoot = this.var['isRoot']
        let tree = this.var['tree']

        if( !isRoot )
        {
            tree.props.selected = true
            tree.updateProps() 
            this.goto( slot.recursive )
        }
        else
        {
            //stop recursion
            //show_arrow
            let child_tree = this.child_tree
            if( child_tree.props.type == 'box')
            {
                child_tree.props.show_arrow = true
                child_tree.updateArrowPosition()                
            }
        }
    },
    slot:{
        recursive:['select_up']
    }
})

dt.make({
    name:'select_end',
    fn: (slot) => function(tree){
        this.tree = tree
        this.goto( slot.next )
    },
    slot: {
        next: ['setup_if_is_item', 'if_is_item' ]
    }
})

dt.make({
    name:'setup_if_is_item',
    fn: (slot) => function(){
        let { tree, child_tree } = this

        let child_tree_type = child_tree.props.type

        let is_box = ( child_tree_type == 'box' 
                    || child_tree_type == 'top' )
        let is_item = ( child_tree_type == 'symbol' 
                    || child_tree_type == 'coeff' 
                    || child_tree_type == 'bracket' )
        
        if( is_box )
        {
    
            let child_tree_length = child_tree.list.length 
            
            if( child_tree_length == 1)
            {
                // box[ item[a]]  -->>   item[a]
                this.var['item_tree'] = child_tree[ child_tree.list[0] ]
                this.var['item_type'] = 'child 0' //child position 0 of [ {a} ], {a} item, [] is box
                this.var['bracket_tree'] = tree
            }
            else if( child_tree_length == 2)
            {
                let first_item_is_plus_minus = (child_tree[ child_tree.list[0] ] == 'bin')
                if( first_item_is_plus_minus )
                {
                    // [+a]  -->>   +[a]
                    this.var['item_tree'] = child_tree[ child_tree.list[1] ]
                    this.var['item_type'] = 'child 1'
                    this.var['bracket_tree'] = tree
                }
                else
                {
                    // [ab]
                    this.var['is_not_item'] = true
                }
            }
            else
            {
                // [abc]
                this.var['is_not_item'] = true
            }
        }
        else if( is_item )
        {
            let parent_tree = tree.parentNode
            let no_outer_item_parent = (parent_tree.list.length == 1)
            if( no_outer_item_parent )
            {
                // case [a]b = c  -->> single box in eq
                this.var['is_item_but_no_grand_parent_sibling'] = true
            }
            else
            {
                this.var['item_tree'] = child_tree
                this.var['item_type'] = 'original'
                this.var['bracket_tree'] = tree.parentNode
            }
        }
        else
        {
            this.var['is_not_item'] = true
        }
    },
    slot: { next: []}
})

dt.make({
    name: 'if_is_item',
    fn:(slot) => function()
    {
        let { is_not_item, 
            is_item_but_no_grand_parent_sibling } =  this.var

        if( is_not_item || is_item_but_no_grand_parent_sibling )
        {
            let event_tree = this.var['event_tree']
            (function event_tree_show_arrow( selected_tree ){
                selected_tree.props.show_arrow = true
                selected_tree.updateArrowPosition()
                selected_tree.updateProps()
            })( event_tree)

            this.goto( slot.is_not_item )
        }
        else
        {
            this.goto( slot.is_item )
        }
    },
    slot:{
        is_not_item:[ { action: 'event_tree_show_arrow' }, 
            { main:'main_branch:loop_deselect_yellow_outer_item' },
            { note:'no need hide sibling arrow because its done in build_subformula_upward'},
            'loop_event_tree_child'],
        is_item:[ 'check_bracket_tree_for_match' ]
    }
})

dt.make({
    name: 'loop_event_tree_child',
    fn: (slot) => function(){
        let is_not_item = this.var['is_not_item']
        if( is_not_item ) return

        let event_tree = this.child_tree
        let event_tree_child_list = event_tree.list 
        let event_tree_parent_name = event_tree.parentNode.full_name
    
        this.var['yellow_arrow_list'] = op.getShowArrowList( event_tree_parent_name, 'yellow' )

        for( let child of event_tree_child_list )
        {
            let event_child_tree = event_tree[ child ]
            let event_child_props = event_child_tree.props
    
            let event_child_sub_formula = event_child_props.sub_formula

            this.var['event_child_sub_formula'] = event_child_sub_formula 
            this.var['event_child_tree'] = event_child_tree

            this.goto( slot.loop )
        }
    },
    slot: { loop: [{ action: 'set_var: yellow_arrow_list'}, 
        { action: 'in_loop: set_var: event_child_tree, event_child_sub_formula'}, 
        'loop_yellow_arrow_list'] }
})

dt.make({
    name: 'loop_yellow_arrow_list',
    fn: (slot) => function(){
        let { yellow_arrow_list } = this.var
        for( let arrow_item_full_name of yellow_arrow_list )
        {
            this.var['arrow_item_full_name'] = arrow_item_full_name
            this.goto( slot.loop )
        }
    },
    slot: { loop: [
        { action: 'set_item_sub_formula'},  
         'if_same_yellow_item'
            ] }
})

dt.make({
    name: 'if_same_yellow_item',
    fn: (slot) => function(){
        let { event_child_tree, event_child_sub_formula, 
            arrow_item_full_name } = this.var 

        let arrow_item_tree = op.getTreeByName( arrow_item_full_name ).tree
        let arrow_item_props = arrow_item_tree.props
        let arrow_item_sub_formula = arrow_item_props.sub_formula

        let is_same_sub_formula = ( arrow_item_sub_formula == event_child_sub_formula ) 
        if( is_same_sub_formula )
        {
            let child_tree_depth = event_child_tree.full_name.split("-").length
            let item_tree_depth = arrow_item_tree.full_name.split("-").length
            let is_same_depth = ( child_tree_depth == item_tree_depth )
            if( is_same_depth )
            {
                this.goto( slot.outer_yellow_item_match)
            }

        }
    },
    slot: { outer_yellow_item_match: ['change_yellow_arrow_to_default_arrow'] }
})

dt.make({
    name: 'change_yellow_arrow_to_default_arrow',
    fn: (slot) => function( )
    {
        let item_tree = this.var['event_child_tree']

        item_tree.props.arrow_type = 'multi_top'
        let item_parent_tree = item_tree.parentNode
        let parent_tree_length = item_parent_tree.list.length
        
        if( parent_tree_length == 1 )
        {
            // [[a]] --> a
            op.setProps([
                { 
                    tree: item_tree, 
                    props: { show_arrow:false }
                },
                { 
                    tree: item_parent_tree, 
                    props: { 
                        show_arrow: true,
                        selected: true,
                        sub_formula: item_tree.props.sub_formula
                    }
                }
            ])

            item_parent_tree.updateProps()
        }
        else if ( parent_tree_length == 2)
        {
            // -[a] --> -a

            let first_item = item_parent_tree[item_parent_tree.list[0]]
            if( first_item.props.type == 'bin')
            {
                op.setProps([
                    { 
                        tree: first_item_tree, 
                        props: { selected: true }
                    },
                    {
                        tree: item_tree,
                        props: { show_arrow: false }
                    },
                    { 
                        tree: item_parent_tree, 
                        props: { 
                            show_arrow: true,
                            selected: true,
                            sub_formula: item_tree.props.sub_formula
                        }
                    }
                ])
                
                item_parent_tree.updateProps()
            }
            else
            {
                //just show item tree with multi_top arrow
                item_tree.updateProps()
            }
        }
        else
        {
            item_tree.updateProps()
        }
    },
    slot: { stop: [{action: 'change_arrow_by_parent_length'}]}
})

dt.make({
    name: 'check_bracket_tree_for_match',
    fn: (slot) => function(){
        let { item_tree, item_type, bracket_tree } = this.var

        // this.var['bracket_tree_full_name'] = bracket_tree.full_name 
        this.var['item_depth'] = item_tree.full_name.split("-").length
        this.var['item_sub_formula'] = item_tree.props.sub_formula
        this.var['match_tree_list'] = [ item_tree ]
        this.var['match_tree_name_list'] = [ item_tree.full_name ]
        this.var['item_type_list'] = [ item_type ]

        let show_arrow_list = op.getShowArrowList( bracket_tree.full_name )
        // show_arrow_list.length = p2_tree_length - 1
        // because current selected item not yet rendered
        
        for( let outer_item_name of show_arrow_list)
        {
            this.var['outer_item_name'] = outer_item_name 
            this.goto( slot.loop )
        }    
    },
    slot: { 
        loop: [{action: 'set_var: bracket_tree, item_depth, item_subformula, match_tree_list' }, 
        'if_match_depth_n_subformula', 'if_all_match_selected']
    }
})


dt.make({
    name: 'if_match_depth_n_subformula',
    fn: (slot) => function(  ){

        let { item_depth, outer_item_name, item_sub_formula,
            match_tree_list, match_tree_name_list, item_type_list } = this.var
        
        let outer_item_depth = outer_item_name.split("-").length

        let outer_item_tree = null
        let outer_item_type = null
        if( item_depth == outer_item_depth)
        {
            outer_item_tree = op.getTreeByName( outer_item_name ).tree
            outer_item_type = 'original'
        }
        else if ( item_depth == outer_item_depth + 1 )
        {
            //inside box that has one symbol
            // ...[-y], need to highlight y
            let outer_item_tree_length = op.getTreeByName( outer_item_name ).tree.list.length
            if( outer_item_tree_length == 2)
            {
                let first_type = op.getChild(0).tree.props.type
                op.getParent(1)
                if( first_type == 'bin')
                {
                    outer_item_tree = op.getChild(1).tree
                    outer_item_type = 'child 1'
                }
                else
                {
                    outer_item_tree = op.getParent(1).tree
                    outer_item_type = 'original'
                }

            }
            else if( outer_item_tree_length == 1)
            {                               
                outer_item_tree = op.getChild(0).tree
                outer_item_type = 'child 0'
            }                       


            if( outer_item_tree )
            {
                let outer_item_sub_formula = outer_item_tree.props.sub_formula
                let is_same_sub_formula = ( outer_item_sub_formula == item_sub_formula )
                if( is_same_sub_formula  )
                {
                    match_tree_list.push( outer_item_tree )
                    match_tree_name_list.push( outer_item_tree.full_name )
                    item_type_list.push( outer_item_type )
                }
            }
        }
    },
    slot: {
        stop:[{action:'set_var: match_tree_list, match_tree_name_list, item_type_list'}]
    }
})

dt.make({
    name: 'if_all_match_selected',
    fn: (slot) => function(){

        let is_all_match = ( this.var['match_tree_list'].length == this.var['bracket_tree'].list.length )
        
        if( is_all_match )
        {
            this.goto( slot.all_selected )
        }
        else
        {
            this.goto( slot.not_all_selected )
        }
    },
    slot: {
        all_selected: ['all_show_yellow_arrow'],
        not_all_selected: ['event_tree_show_multi_arrow']
    }
})

dt.make({
    name:'all_show_yellow_arrow',
    fn: ( slot ) => function(){
        let { match_tree_list, match_tree_name_list, item_type_list } = this.var

        for( let item_tree of match_tree_list )
        {
            item_tree.props.arrow_type = 'yellow'
            // console.log("change to yellow")
            // console.log( item_tree.full_name)
            // console.log( condition_list )
            item_tree.props.show_arrow = true
            item_tree.props.pasted_tree_names = match_tree_name_list
            
            let item_type = item_type_list.shift()
            if( item_type =='original')
            {
                item_tree.updateProps()
            }
            else if( item_type == 'child 0')
            {
                //case [y]
                let parent_tree = item_tree.parentNode
                parent_tree.props.show_arrow = false
                parent_tree.props.selected = false
                parent_tree.updateProps()
            }
            else if( item_type == 'child 1')
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
    slot: { stop: [{ action: 'show_arrow_by_type' }]}
})

dt.make({
    name:'event_tree_show_multi_arrow',
    fn: ( slot ) => function(){

        let { item_tree } = this.var 
        if( item_tree.name.search('br') > -1 || item_tree.name.search('i') > -1)
        {
            // if( e_tree.props.arrow_type == 'yellow')
            // {
            //     console.log("Error arrow yellow")
            //     console.log( e_tree.full_name )
            // }
            item_tree.props.arrow_type = "multi_top"
        }

        item_tree.props.show_arrow = true
    },
    slot: { stop: [{action:'show_multi_top_arrow'}]}
})

// dt.printTree()

let var_obj = dt.getVar({ fn_name: 'if_is_item' })
console.log( JSON.stringify(var_obj) )
// let fs = require('fs')
// fs.writeFileSync( __dirname + '/select_dt_var.js', JSON.stringify(dt.var_map, null, 2) )