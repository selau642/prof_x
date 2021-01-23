export let checkDot = function() {

    // 2*3
    // 2a , exception: 1*a
    // a*2
    let tree = this
    // console.log( tree.full_name, ":", tree.props.text )
    let parent_tree = tree.parentNode
    let tree_type = tree.type
    let index = parent_tree.list.indexOf( tree.name )
    if( index === -1)
    {
        console.log("checkDot Error:", tree)
    }
    else if( index === 0)
    {
        tree.props.cdot = false 
    }
    else if( tree.props.sign == '-' )
    {
        // -a*-b
        //let prev_sib_tree = parent_tree[ parent_tree.list[index - 1]]
        tree.props.cdot = true
    }
    else if( tree_type == 'num' )
    {
        if( !parent_tree )
        {
            // Clone.svelte
            // deep cloning of item tree results in no parent tree
            tree.props.cdot = false
        }
        else
        {
            tree.props.cdot = true            
        }
    }
    else if( tree_type == 'fr')
    {
        tree.props.cdot = true 
    }
    else //if (tree_type == 'sym' || 'fr' || 'br')
    {
        // 3a
        // ba
        let prev_sib_tree = parent_tree[ parent_tree.list[index - 1]]
        let prev_sib_tree_type = prev_sib_tree.type
        
        if( prev_sib_tree_type == 'fr' )
        {
            // 1/2*a
            tree.props.cdot = true
        }
        else if( prev_sib_tree.props.text == '1')
        {
            // 1*a
            tree.props.cdot = true
        }
        else
        {	
            // -2a
            tree.props.cdot = false
        }
    }    
}	