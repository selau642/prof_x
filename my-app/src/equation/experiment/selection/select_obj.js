import { op } from '../xTree.js'
//selection operator

function set_end_fn()
{
    s_op.addDecisionTree('check_event_tree_type', check_event_tree_type_dt )
    s_op.addDecisionTree('check_bracket_tree_for_match', check_bracket_tree_for_match_dt )
}

export let s_op = {
    tree: undefined,
    child_tree: undefined,
    isRoot: undefined,
    dt_obj: {}, //decision tree obj
    var:{},
    setTree:function(tree)
    {
        this.tree = tree
        return this
    },
    addDecisionTree:function( name, dt )
    {
        this.dt_obj[name] = dt
        return this
    },
    select: function()
    {
        let tree = this.tree 
        if( tree.props.type =='bracket' )
        {
            this.buildSubFormula_downward( tree )
            tree.updateProps()
        }

        this.select_up()
    },
    select_up: function()
    { 
        this.climbTree()
        let tree = this.tree
        let isRoot = (tree.name.search('eq_') > -1)
        this.isRoot = isRoot

        if( this.isAllChildTreeSelected( tree ) )
        {
            this.buildSubFormula_upward()
            
            if( isRoot )
            {
                //stop recursion
                //show_arrow
                let child_tree = this.child_tree
                if( child_tree.props.type == 'box')
                {
                    child_tree.props.show_arrow = true
                }
            }
            else //!isRoot continue select_up
            {
                tree.props.selected = true
                tree.updateProps() 
   
                this.select_up() //recursive call self
            }
        }
        else
        {
            //stop recursion & run select end decision tree
            this.runSelectEndDT({
                dt_name: "check_event_tree_type",
                dt_obj: this.dt_obj
            })
        }
    },
    runSelectEndDT:function( input )
    {
        let { dt_name, dt_obj } = input
        // {
        //     "start": {
        //         "name":"start"
        //         "description":"first_start_state",
        //         "check": setup_start,
        //         "results": [ {fn:, next_state:} (...)]
        //     }
        // }

        //setup_variables
        // state_name = state_name ? state_name : "start" 
        
        let dt_item = dt_obj[ dt_name ]
        dt_item.check.call( this )

        let result_list = dt_item.result_list
        //check conditions
        let next_tree
        let stop_fn 
        for( let cond_obj of result_list )
        {            
            if( cond_obj.result.call(this) )
            {
                next_tree = cond_obj.next_tree
                stop_fn = cond_obj.stop
                break
            } 
        }

        //go next state
        if( next_tree != "stop") 
        {
            // this.var = {} //clear var
            this.runSelectEndDT( next_state, dt_obj )
        }
        else
        {
            if( typeof(stop_fn) == 'function')
            {
                stop_fn.call(this)
            }
            else
            {
                //list
                for( let fn of stop_fn)
                {
                    fn.call(this)
                }
            }
        }
    },
    climbTree:function()
    {
        this.child_tree = this.tree
        this.tree = this.tree.parentNode
        return this
    },    
    isAllChildTreeSelected: function( parent_tree )
    {
        let selected_child_count = 0
        let selectable_child_count = 0
        
        for( let child of parent_tree.list )
        {
            let child_props = parent_tree[child].props
            if( child_props.selected ) selected_child_count ++
            if( child_props.type !='bin') selectable_child_count ++
        }

        return ( selected_child_count == selectable_child_count )
    },

    buildSubFormula_upward:function()
    {
        let tree = this.tree
        let sub_formula = ''
        let prev_child_text = ''
        let isCoeff = /[0-9]|\./
        let tree_list = tree.list
		for( var child of tree_list )
		{
            let child_props = tree[ child ].props 
            if( !this.isRoot ) 
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
        return this
    },
    buildSubFormula_downward: function( input_tree )
    {
        // Build Subformula and
        // Set Child to selected
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
                    this.buildSubFormula_downward( input_tree[child] )
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
    deselect: function()
    {

        let tree = this.tree
        if( tree.props.type =='bracket' )
        {
            this.deselect_down( tree )
            tree.updateProps()
        }

        // deselect self: if yellow, deselect yellow sibs

        // upward deselect
        // 1. when parent deselect, check if sibiling make yellow
        this.deselect_up()
        
        
    },
    deselect_up: function()
    {
        this.climbTree()
        let tree = this.tree
        if( tree.props.selected )
        {
            op.setTree(tree)
            let tree_list = tree.list 
            let bracket_tree = tree.parentNode
            let bracket_tree_length = bracket_tree.list.length
            for( let child_name of tree_list )
            {
                let child_tree = tree[child_name]
                if( child_tree.props.type == 'bin' && child_tree.props.selected)
                {
                    child_tree.props.selected = false
                    child_tree.props.show_arrow = false
                }
                else if( child_tree.name !== tree.name ) //if = event_tree
                {
                    child_tree.props.show_arrow = true
                    child_tree.props.arrow_type = false //back to default color

                    //for each child_tree check 
                    //if any fulfill conditions for
                    //yellow arrow

                    let e_tree = child_tree
                    let prefix = e_tree.name.split("_")[0]
                
                    if( prefix != 'bx'  && bracket_tree_length != 1) 
                    {
                        // let p2_full_name = op.getParent(1).tree.full_name
                        // let p2_tree_length = op.tree.list.length

                        let e_tree_depth = e_tree.full_name.split("-").length
                        let e_tree_sub_formula

                        if( prefix == 'br')
                        {
                            e_tree_sub_formula = e_tree.props.sub_formula
                        }
                        else if( prefix == 'i')
                        {
                            //type
                            e_tree_sub_formula = e_tree.props.text
                        }
                    

                        let show_arrow_list = op.getShowArrowList( bracket_tree.full_name )

                        //IMPORTANT: 
                        // at this moment show_arrow=true not rendered
                        // show_arrow_list.length = p2_tree_length - 1
                        // match_tree_list = [ e_tree ] will fail
                        let match_tree_list = [e_tree]
                        let match_tree_name_list = [ e_tree.full_name ]
                        for( let item_name of show_arrow_list)
                        {
                            let depth = item_name.split("-").length
                            if( depth == e_tree_depth )
                            {
                                let item_tree = op.getTreeByName( item_name ).tree
                                let item_sub_formula
                                if( item_tree.name.search('br') > -1 )
                                {   
                                    item_sub_formula = item_tree.props.sub_formula
                                }
                                else if( item_tree.name.search('i') > -1)
                                {
                                    item_sub_formula = item_tree.props.text
                                }

                                if( item_sub_formula == e_tree_sub_formula )
                                {
                                    match_tree_list.push( item_tree )
                                    match_tree_name_list.push( item_tree.full_name )
                                }
                            }
                        }

                        if( bracket_tree_length == match_tree_list.length )
                        {
                            for( let item_tree of match_tree_list )
                            {
                                item_tree.props.arrow_type = 'top_yellow'
                                item_tree.props.pasted_tree_names = match_tree_name_list
                                item_tree.updateProps()
                            }
                        }
                    }
                
                }
            }

            // tree_props.selected = false
            // tree = tree
            if( !isRoot )
            {
                tree.props.selected = false
                tree.updateProps()
                this.deselect_up()
            }
            else
            {
                if( tree.props.type == 'box')
                {
                    tree.props.show_arrow = false
                    console.log("box deselect hide arrow")
                    // tree.updateProps()
                    // e_tree.updateProps()
                }
                else if( tree.props.type == 'bracket')
                {
                    tree.props.show_arrow = false
                    // tree.updateProps()
                    // e_tree.updateProps()
                }
            }

            //check here
        }
        else //!tree.props.selected
        {
            tree.props.show_arrow = false

            //Deselecting a yellow arrow item or bracket

            //1. find all selected
            //2. check same depth & same sub_formula
            //3. push in to match_tree_list_array
            //4. deselect all into blue item arrow
            let prefix = tree.name.split("_")[0]
            if( prefix != 'bx' 
            && tree.props.arrow_type.search('yellow') > -1 ) 
            {
                //by arrow_type == yellow it means p2_tree_length > 1
                let bracket_tree = tree.parentNode
                let bracket_tree_length = bracket_tree.list.length
                let bracket_tree_full_name = bracket_tree.full_name
                let tree_depth = tree.full_name.split("-").length
                
                let tree_sub_formula
                if( prefix == 'br')
                {
                    tree_sub_formula = tree.props.sub_formula
                }
                else if( prefix == 'i')
                {
                    //type
                    tree_sub_formula = tree.props.text
                }
            

                let show_arrow_list = op.getShowArrowList( bracket_tree_full_name, "yellow" )

                //IMPORTANT: 
                // at this moment show_arrow=false not rendered
                // so show_arrow_list.length is equal to bracket_tree_length 
                // match_tree_list = [ e_tree ] will fail
                let match_tree_list = []

                for( let item_name of show_arrow_list)
                {
                    let depth = item_name.split("-").length
                    if( depth == tree_depth )
                    {
                        let item_tree = op.getTreeByName( item_name ).tree
                        let item_sub_formula
                        if( item_tree.name.search('br') > -1 )
                        {   
                            item_sub_formula = item_tree.props.sub_formula
                        }
                        else if( item_tree.name.search('i') > -1)
                        {
                            item_sub_formula = item_tree.props.text
                        }

                        if( item_sub_formula == tree_sub_formula )
                        {
                            match_tree_list.push( item_tree )
                        }
                    }
                }

                if( bracket_tree_length == match_tree_list.length )
                {
                    for( let item_tree of match_tree_list )
                    {
                        item_tree.props.arrow_type = 'top_blue'
                        item_tree.props.pasted_tree_names = ''
                        item_tree.updateProps()
                    }
                }
            }
        }
    },
    deselect_down: function( input_tree )
    {
        //TO DO: trampoline the recursion of select_In
        if(input_tree.list)
        {
            for(let child of input_tree.list)
            {
                let child_tree = input_tree[ child ]
                let child_props = child_tree.props
                child_props.selected= false
                child_props.show_arrow = false
                let tree_list = input_tree[child].list
                if( tree_list && tree_list.length > 0 )
                {
                    this.deselect_down( input_tree[child] )
                }
            }
        }
        
    }
}

let check_event_tree_type_dt = { 
    'name': 'check_event_tree_type_decision_tree',
    'description':`Check if event tree is item type. 
            Box with one item need to convert into item.`,
    'check': check_event_tree_type,
    'result_list':[{
                result: is_not_item,
                next_tree: 'stop',
                stop: [ set_event_tree_arrow, deselect_yellow_child ]
            }, 
            {
                result: is_item,
                next_tree: 'check_bracket_tree_for_match'
            }]
}

let check_bracket_tree_for_match_dt = {
    'name': 'check_bracket_tree_for_match_decision_tree',
    'description': `Check if bracket_tree has other selected 
                    grand child with same sub_formula.`,
    'check': check_bracket_tree_for_match,
    'result_list':[{
            result: all_child_selected,
            next_tree: 'stop',
            stop: all_child_show_yellow_arrow
        },
        {
            result: not_all_child_selected,
            next_tree: 'stop',
            stop: event_tree_show_multi_arrow
        }]
}

function check_event_tree_type()
{
    //set the var bracket tree and item tree context
    let tree = this.tree
    let child_tree = this.child_tree

    let child_tree_type = child_tree.props.type 
    if( child_tree_type == 'box' 
    || child_tree_type == 'top')
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
            let first_item = child_tree[ child_tree.list[0] ]
            if( first_item.props.type == 'bin' )
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
    else if( child_tree_type == 'symbol' 
    || child_tree_type == 'coeff' 
    || child_tree_type == 'bracket')
    {
        let parent_tree = tree.parentNode
        if( parent_tree.list.length == 1)
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
}

function is_not_item()
{
    return ( this.var['is_not_item'] 
    || this.var['is_item_but_no_grand_parent_sibling'] )
}

function set_event_tree_arrow()
{
    let selected_tree = this.child_tree
    selected_tree.props.show_arrow = true
    selected_tree.updateProps()
}

function deselect_yellow_child()
{
    // other child may contain yellow items
    // deselect previously selected yellow item

    // only deselect if is_not_item
    // for case is_item_but_no_grand_parent_sibling no need to deselect
    if( !this.var['is_not_item'] ) return

    let selected_tree = this.child_tree
    let child_list = selected_tree.list 
    let parent_name = selected_tree.parentNode.full_name
    
    let show_arrow_list = op.getShowArrowList( parent_name, 'yellow' )

    for( let child of child_list)
    {
        let child_tree = selected_tree[ child ]
        let child_props = child_tree.props

        let child_sub_formula = child_props.sub_formula
        if( !child_sub_formula )
        {
            child_sub_formula = child_props.text
        }

        for( let item of show_arrow_list )
        {
            let item_tree = op.getTreeByName(item).tree
            let item_props = item_tree.props
            let item_sub_formula = item_props.sub_formula
            if( !item_sub_formula )
            {
                item_sub_formula = item_props.text
            }

            if( child_sub_formula == item_sub_formula )
            {
                let child_tree_depth = child_tree.full_name.split("-").length
                let item_tree_depth = item_tree.full_name.split("-").length

                if( item_tree_depth == child_tree_depth)
                {
                    //normalise item here

                    item_tree.props.arrow_type = 'top_blue'
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
                }
            }
        }
    }
}


function is_item()
{
    return this.var['bracket_tree']
}

function check_bracket_tree_for_match()
{

    let { item_tree, item_type, bracket_tree } = this.var
    let bracket_tree_full_name = bracket_tree.full_name 

    // item_tree_type 
    // 1. original item 
    // 2. destilled from box with one item child only
    //    [[a]]  -->> [a]
    // 3. destilled from box with two item child
    //    [+a]   -->> +[a]

    let item_tree_depth = item_tree.full_name.split("-").length
    let item_tree_sub_formula

    let prefix = item_tree.name.split('_')[0]

    if( prefix == 'br')
    {
        item_tree_sub_formula = item_tree.props.sub_formula
    }
    else if( prefix == 'i')
    {
        //type
        item_tree_sub_formula = item_tree.props.text
    }


    let show_arrow_list = op.getShowArrowList( bracket_tree_full_name )
    // show_arrow_list.length = p2_tree_length - 1
    // because current selected item not yet rendered
    let match_tree_list = [ item_tree ]
    let match_tree_name_list = [ item_tree.full_name ]
    let item_type_list = [ item_type ]
    
    for( let outer_item_name of show_arrow_list)
    {
        //1. check subformula first
        //2. then check check depth

        let outer_item_depth = outer_item_name.split("-").length

        let outer_item_tree = null
        let outer_item_type = null
        if( outer_item_depth == item_tree_depth )
        {
            outer_item_tree = op.getTreeByName( outer_item_name ).tree
            outer_item_type = 'original'
        }
        else if ( outer_item_depth == item_tree_depth - 1)
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
                let outer_item_sub_formula
                if( outer_item_tree.name.search('br') > -1 )
                {   
                    outer_item_sub_formula = outer_item_tree.props.sub_formula
                }
                else if( outer_item_tree.name.search('i') > -1)
                {
                    outer_item_sub_formula = outer_item_tree.props.text
                }
                
                if( outer_item_sub_formula == item_tree_sub_formula )
                {
                    match_tree_list.push( outer_item_tree )
                    match_tree_name_list.push( outer_item_tree.full_name )
                    item_type_list.push( outer_item_type )
                }
            }
        }
    }

    this.var['match_tree_list'] = match_tree_list
    this.var['match_tree_name_list'] = match_tree_name_list
    this.var['item_type_list'] = item_type_list 
}

function all_child_selected()
{
    return ( this.var['match_tree_list'].length == this.var['bracket_tree'].list.length )
}

function not_all_child_selected()
{
    return ( this.var['match_tree_list'].length != this.var['bracket_tree'].list.length )
}

function all_child_show_yellow_arrow()
{
    let { match_tree_list, match_tree_name_list, item_type_list } = this.var

    for( let item_tree of match_tree_list )
    {
        item_tree.props.arrow_type = 'top_yellow'
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
}

function event_tree_show_multi_arrow()
{
    let { item_tree } = this.var 
    if( item_tree.name.search('br') > -1 || item_tree.name.search('i') > -1)
    {
        // if( e_tree.props.arrow_type == 'yellow')
        // {
        //     console.log("Error arrow yellow")
        //     console.log( e_tree.full_name )
        // }
        item_tree.props.arrow_type = "top_blue"
    }

    item_tree.props.show_arrow = true
}

set_end_fn()