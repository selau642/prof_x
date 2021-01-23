getPastedTreeNoDelete:function()
   {
        let pasted_tree_list = this.pasted_tree_list
        if( pasted_tree_list && pasted_tree_list.length > 0 )
        {
            return pasted_tree_list
        }
        else
        {
            return false
        }
   },
   getPastedTreeName:function()
   {
        let name_list = []
        let original_list = this.pasted_tree_list

        for( let sub_tree_list of original_list )
        {
            let sub_name_list = []
            for( let tree of sub_tree_list )
            {
                sub_name_list.push( tree.full_name )
            }
            name_list.push( sub_name_list )
        }

        return name_list
    },
   getPastedTree: function()
   {        
        let pasted_tree_list = this.pasted_tree_list
        if( pasted_tree_list && pasted_tree_list.length > 0 )
        {
            this.pasted_tree_list = []
            return pasted_tree_list
        }
        else
        {
            return false
        }
   },
pasteBesideBracket:function( input )
    {
        //not in use
        let { item_tree, bracket_tree, position } = input
        let bracket_p_tree = bracket_tree.parentNode
        let paste_index = 0
        if( position == 'left')
        {
            paste_index = 0
        }
        else if( position == 'right')
        {
            paste_index = bracket_p_tree.list.length
        }

        op.pasteChildTree({
            cut_tree:item_tree,
            paste_tree: bracket_p_tree,
            new_props:{show_arrow:true},
            paste_index: paste_index
        })

        this.e_tree_list = [item_tree]    
    },
activateTree: function( tree )
    {
        // if( !tree ) console.log("enter tree lost:", this.var )

        // let { tree, enter_fn } = input
        if( !tree.container_fn_list ) tree.container_fn_list = []
        
        let enter_fn  = () => {
                tree.receiveClone()     
            }
  
        tree.container_fn_list.push( enter_fn )
        tree.cleanContainer = () => {
            tree.container_fn_list = []
        }

        tree.runContainer()
    },