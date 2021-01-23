function child_selected(event)
{
    //Action:
    //1. Inner Select: Recursive select in from top to bottom
    //2. Enlarge Selection: Recursive select out from bottom to top
    //3. Build sub_formula
    //4. When terminate recursion, at highest level:
    //  4.1 set show_arrow 
    //  4.2 set arrow_type = yellow
    
    // symbols:
    // {a} = click a
    // [a] = show_arrow a

    let e_tree = event.detail.child_tree
    // console.log( 'e_tree_full_name:' + e_tree.full_name )
    //Action 1: Inner Select
    if( e_tree.props.type =='bracket')
    {
        select_in( e_tree )
        e_tree.updateProps()
    }


    //Action 2: Check if need Enlarge Selection
	let selected_child_count = 0
    let selectable_child_count = 0
    
    let tree = e_tree.parentNode
    op.tree = tree
    let all_child_props = op.getAllChildProps()
    // console.log(all_child_props)
	for( let child_props of all_child_props)
	{
		if( child_props.selected ) selected_child_count ++
   
		if( child_props.type != 'bin')
		{
			selectable_child_count ++
		}
	}      
    
	if( selectable_child_count == selected_child_count )
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

        let sub_formula = ''
        let prev_child_text = ''
        let isCoeff = /[0-9]|\./
		for( var child_props of all_child_props)
		{
            if( !isRoot ) 
            {
                child_props.show_arrow = false
                // case: enlarge selection => hide child show_arrow
                // [a]{b} => [ab]
                // ([a]{+b}) => [(a+b)]

            } // Special Case 1: isRoot=true, no hiding child arrow

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

        // tree_props.selected = true
        // tree = tree
        if( !isRoot )
        {
            tree.props.selected = true
            // if( e_tree.name == 'bot_1' || e_tree.name == 'top_1' )
            // {
            //     tree.props.show_arrow = true
            //     tree.updateProps() 
            // }
            // else
            // {
                tree.updateProps() 
                dispatch('select', {
                    child_tree:tree,
                    second_bubble:true  //bubble up if all selected
                })
            // }           
            

        }
        else //isRoot 
        {          
            //Special Case 2: isRoot=true,  no upward propagation( no dispatch)
            //special Case 3: isRoot=true,  show click tree's arrow

            if( e_tree.props.type == 'box')
            {
                e_tree.props.show_arrow = true
                e_tree.updateArrowPosition("child_selected isRoot bx")                
            }
            // else if( e_tree.props.type == 'bracket')
            // {
            //     console.log( "isRoot select bracket")
            //     e_tree.props.show_arrow = true
            // }
            // else if(e_tree.props.type == 'fraction' )
            // {
            //     console.log( "isRoot select fraction")
            //     e_tree.props.show_arrow = true  
            // }
        
        }
	}
	else
	{
        //Action 4: Terminate Recursion
        //1. sets e_tree.show_arrow = true 
        //2. sets arrow_type to yellow or multi_top

        //2 Cases:
        //1. normal case [a]bc or [abc]
        //2. special case -[a]

        //Action:
        //1. Extract sub_tree
        //2. Special case equation with single box
        //3. special case box selected => deselect other show_arrow
        //4. Check 4 conditions:
            // 4.1 show_arrow
            // 4.2 depth = e_tree_depth or depth = e_tree_depth - 1
            // 4.3 sub_formula = e_sub_formula
            // 4.4 p2_tree_length = match_list_length 
            //    (meaning all child has one elem matched can drag out)
        //5. if( length_match ) 
            // set show_arrow and arrow_type = yellow for those fulfill conditions
        //6. else: set arrow_type = 'multi_top'

        let sub_e_tree = e_tree
        let sub_cond = 'original'//cond = condition, original is item
        let p2_tree_length //p2 = parent that is 2 levels above e_tree 
        let p2_full_name

        if( isRoot )
        {
            //case box
            p2_tree_length = tree.list.length
            p2_full_name = tree.full_name 
        }
        else
        {
            //case item
            p2_tree_length = tree.parentNode.list.length
            p2_full_name = tree.parentNode.full_name
        }

        //Overwrite values for 2 special case:
        //1. [a] + b => [[a]] + b
        //2. [+a] => +[a]

        if( e_tree.list )
        {
            let e_tree_length = e_tree.list.length
            if( e_tree_length == 1)
            {
                sub_e_tree = e_tree[e_tree.list[0]]
                sub_cond = 'child 0'
                p2_tree_length = tree.list.length
                p2_full_name = tree.full_name
            }
            else if( e_tree_length == 2)
            {
                let first_elem = e_tree[ e_tree.list[0] ]
                if( first_elem.props.type == 'bin')
                {
                    sub_e_tree = e_tree[ e_tree.list[1] ]
                    sub_cond = 'child 1'
                    p2_tree_length = tree.list.length
                    p2_full_name = tree.full_name
                }
            }
        }

        //check if need yellow arrow for drag out of bracket
        //p relative to e_tree
        let prefix = sub_e_tree.name.split("_")[0]

        if( p2_tree_length == 1 ) 
        {
            // special case:
            // select one item when only one box in equation
            // since is not root, will not auto select
            // {a}b = d  => [a]b = d
            e_tree.props.show_arrow = true
            e_tree.updateArrowPosition("child_selected p2_tree_length")
        }
        else if( prefix == 'bx' )
        {
            //TODO: debug tomorrow

            //case : all Item selected
            // enlarge selection to parent Box
            e_tree.props.show_arrow = true
            e_tree.updateArrowPosition("child_selected bx")
            // normalise all yellow arrow that is child of box
            let child_list = e_tree.list 
            let parent_name = e_tree.parentNode.full_name
            
            let show_arrow_list = op.getShowArrowList( parent_name, 'yellow' )

            for( let child of child_list)
            {
                let child_tree = e_tree[ child ]
                let child_props = child_tree.props
                let child_sub_formula = child_props.sub_formula
                if( !child_sub_formula )
                {
                    child_sub_formula = child_props.text
                }

                for( let item of show_arrow_list)
                {
                    let item_tree = op.getTreeByName(item).tree
                    let item_props = item_tree.props
                    let item_sub_formula = item_props.sub_formula
                    if( !item_sub_formula )
                    {
                        item_sub_formula = item_props.text
                    }

                    if( child_sub_formula == item_sub_formula)
                    {

                        let child_tree_depth = child_tree.full_name.split("-").length
                        let item_tree_depth = item_tree.full_name.split("-").length

                        if( item_tree_depth == child_tree_depth)
                        {
                            //normalise item here

                            item_tree.props.arrow_type = 'multi_top'
                            let item_parent_tree = item_tree.parentNode
                            let parent_tree_length = item_parent_tree.list.length
                            
                            if( parent_tree_length == 1 )
                            {
                                item_tree.props.show_arrow = false
                                item_parent_tree.props.show_arrow = true
                                item_parent_tree.props.selected = true
                                item_parent_tree.props.sub_formula = item_tree.props.sub_formula
                                item_parent_tree.updateProps()
                            }
                            else if ( parent_tree_length == 2)
                            {
                                let first_item = item_parent_tree[item_parent_tree.list[0]]
                                if( first_item.props.type == 'bin')
                                {
                                    first_item.props.selected = true
                                    item_tree.props.show_arrow = false
                                    item_parent_tree.props.show_arrow = true
                                    item_parent_tree.props.sub_formula = first_item.props.sub_formula + item_tree.props.subformula
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
        else
        {
            //setup e_tree sub_formula
                       
            let e_tree_depth = sub_e_tree.full_name.split("-").length
            let e_tree_sub_formula

            if( prefix == 'br')
            {
                e_tree_sub_formula = sub_e_tree.props.sub_formula
            }
            else if( prefix == 'i')
            {
                //type
                e_tree_sub_formula = sub_e_tree.props.text
            }


            let show_arrow_list = op.getShowArrowList()
            // show_arrow_list.length = p2_tree_length - 1
            // because current selected item not yet rendered
            let match_tree_list = [ sub_e_tree ]
            let match_tree_name_list = [ sub_e_tree.full_name ]
            let condition_list = [ sub_cond ]
            
            for( let item_name of show_arrow_list)
            {
                //1. check subformula first
                //2. then check check depth

                let depth = item_name.split("-").length
                if( item_name.search( p2_full_name ) > -1 )
                {
                    let item_tree = null
                    let item_cond = null
                    if( depth == e_tree_depth )
                    {
                        item_tree = op.getTreeByName( item_name ).tree
                        item_cond = 'original'
                    }
                    else if (depth == e_tree_depth - 1)
                    {
                        //inside box that has one symbol
                        // ...[-y], need to highlight y
                        let item_tree_length = op.getTreeByName( item_name ).tree.list.length
                        if( item_tree_length == 2)
                        {
                            let first_type = op.getChild(0).tree.props.type
                            op.getParent(1)
                            if( first_type == 'bin')
                            {
                                item_tree = op.getChild(1).tree
                                item_cond = 'child 1'
                            }
                            else
                            {
                                item_tree = op.getParent(1).tree
                                item_cond = 'original'
                            }

                        }
                        else if( item_tree_length == 1)
                        {                               
                            item_tree = op.getChild(0).tree
                            item_cond = 'child 0'
                        }                       
                    }

                    if( item_tree )
                    {
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
                            condition_list.push( item_cond )
                        }
                    }
                }
            }
            // console.log( match_tree_list )
            if( p2_tree_length == match_tree_list.length )
            {

                //loop includes original e_tree
                for( let item_tree of match_tree_list )
                {
                    item_tree.props.arrow_type = 'yellow'
                    // console.log("change to yellow")
                    // console.log( item_tree.full_name)
                    // console.log( condition_list )
                    item_tree.props.show_arrow = true
                    item_tree.props.pasted_tree_names = match_tree_name_list
                    
                    let item_cond = condition_list.shift()
                    if( item_cond =='original')
                    {
                        item_tree.updateProps()
                    }
                    else if( item_cond == 'child 0')
                    {
                        //case [y]
                        let parent_tree = item_tree.parentNode
                        parent_tree.props.show_arrow = false
                        parent_tree.props.selected = false
                        parent_tree.updateProps()
                    }
                    else if( item_cond == 'child 1')
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
            else
            {
                //no match
                //have to handle original e_tree
                if( e_tree.name.search('br') > -1 || e_tree.name.search('i') > -1)
                {
                    // if( e_tree.props.arrow_type == 'yellow')
                    // {
                    //     console.log("Error arrow yellow")
                    //     console.log( e_tree.full_name )
                    // }
                    e_tree.props.arrow_type = "multi_top"
                }

                e_tree.props.show_arrow = true
                // console.log("isEnd")
                // console.log( tree.full_name + " set " + e_tree.full_name)  
            }

        }
	}
}

function select_in(input_tree)
{
	//TO DO: trampoline the recursion of select_In
	if(input_tree.list)
	{	
        let sub_formula = ''
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
                select_in( input_tree[child] )
            }
           

            child_props.show_arrow = false
            if( child_props.text || child_props.text === "")
            {
                sub_formula += child_props.text
            }
            else
            {
                sub_formula += child_props.sub_formula
            }
        }

        if( input_tree.props.type == 'bracket')
        {
            sub_formula = "(" + sub_formula + ")"
        }

        input_tree.props.sub_formula = sub_formula
	}
}

function child_deselected(event)
{
    let e_tree = event.detail.child_tree
    let second_bubble = event.detail.second_bubble
    if( e_tree.props.type =='bracket' 
    && !second_bubble)
    {
        //first click to deselect is on bracket
        //not after bubble up (second_bubble)
        deselect_in( e_tree )
        e_tree.updateProps()
    }

    op.tree = tree
	if( tree.props.selected )
	{
        // { 1. deselect bin type child_tree }
        // { 2. for child_tree which is not e_tree}
        // {    2.1 show_arrow }
        // {    2.2 check if yellow arrow }
		let all_child_tree = op.getAllChildTree()
        let p2_full_name = op.getParent(1).tree.full_name
        let p2_tree_length = op.tree.list.length
		for( var child_tree of all_child_tree )
		{
			if( child_tree.props.type == 'bin' && child_tree.props.selected)
			{
				child_tree.props.selected = false
				child_tree.props.show_arrow = false
            }
            else if( child_tree.name !== e_tree.name ) 
			{
                child_tree.props.show_arrow = true
                child_tree.props.arrow_type = false //back to default color

                //for each child_tree check 
                //if any fulfill conditions for
                //yellow arrow

                let e_tree = child_tree
                let prefix = e_tree.name.split("_")[0]
            
                if( prefix != 'bx'  && p2_tree_length != 1) 
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
                

                    let show_arrow_list = op.getShowArrowList()

                    //IMPORTANT: 
                    // at this moment show_arrow=true not rendered
                    // show_arrow_list.length = p2_tree_length - 1
                    // match_tree_list = [ e_tree ] will fail
                    let match_tree_list = [e_tree]
                    let match_tree_name_list = [ e_tree.full_name ]
                    for( let item_name of show_arrow_list)
                    {
                        let depth = item_name.split("-").length
                        if( item_name.search( p2_full_name ) > -1 
                            && depth == e_tree_depth )
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

                    if( p2_tree_length == match_tree_list.length )
                    {
                        for( let item_tree of match_tree_list )
                        {
                            item_tree.props.arrow_type = 'yellow'
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
            dispatch('deselect', {
                child_tree:tree,
                second_bubble: true
            })
         
        }
        else
        {
            if( e_tree.props.type == 'box')
            {
                e_tree.props.show_arrow = false
                console.log("box deselect hide arrow")
                // tree.updateProps()
                // e_tree.updateProps()
            }
            else if( e_tree.props.type == 'bracket')
            {
                e_tree.props.show_arrow = false
                // tree.updateProps()
                // e_tree.updateProps()
            }
        }

        //check here
	}
	else //!tree.props.selected
	{
        e_tree.props.show_arrow = false

        //Deselecting a yellow arrow group

        let prefix = e_tree.name.split("_")[0]
        if( prefix != 'bx' 
        && e_tree.props.arrow_type == 'yellow' ) 
        {
            //by arrow_type == yellow it means p2_tree_length > 1
            let p2_tree = op.getParent(1).tree
            let p2_tree_length = p2_tree.list.length
            let p2_full_name = p2_tree.full_name
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
           

            let show_arrow_list = op.getShowArrowList()

            //IMPORTANT: 
            // at this moment show_arrow=false not rendered
            // show_arrow_list.length = p2_tree_length 
            // match_tree_list = [ e_tree ] will fail
            let match_tree_list = []

            for( let item_name of show_arrow_list)
            {
                let depth = item_name.split("-").length
                if( item_name.search( p2_full_name ) > -1 
                    && depth == e_tree_depth )
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
                    }
                }
            }

            if( p2_tree_length == match_tree_list.length )
            {
                for( let item_tree of match_tree_list )
                {
                    item_tree.props.arrow_type = 'multi_top'
                    item_tree.props.pasted_tree_names = ''
                    item_tree.updateProps()
                }
            }
        }
	}
}

function deselect_in(input_tree)
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
				deselect_in( input_tree[child] )
			}
		}
	}
	
}