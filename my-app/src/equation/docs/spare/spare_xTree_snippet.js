updateProps: function()
		{
			let temp_name = this.tree.temp_name
			let full_name = this.tree.full_name
			if( temp_name )
			{
				full_name = temp_name
			}

			let update_f = this.dict[ full_name ].updateProps
			if( update_f )
			{
				update_f()
			}
			else
			{
				console.log( "Update props error:")
				console.log( full_name )
			}
        },
        
        storeTempName:function( obj )
		{
			let { temp_name, check_tree } = obj
			//store temp_name into pasted_tree_names without duplicate

			//names change when transfering tree between different context/levels

			let original_temp_name = check_tree.temp_name
			if( original_temp_name )
			{
				let index = this.pasted_tree_names.indexOf( original_temp_name )
				if( index > -1 )
				{
					console.log("remove index:", index, 
					", original_temp_name:", original_temp_name )
					console.log( this.pasted_tree_names )
					this.pasted_tree_names.splice( index, 1)
					// remove name at index
					// to save name at end of index 
				}
			}

			check_tree.temp_name = temp_name
			this.pasted_tree_names.push( temp_name )
			return this
        },
        
        pasteChildTree: function( parent_full_name_or_parent_tree, index,
			input_tree, new_props=false )
		   {
			   //will surely remove temp_tree
			   let original_tree = this.tree
   
			   if( !input_tree )
			   {	
				   input_tree = this.getFirstTempTree()
			   }
   
			   let cut_item_name = input_tree.name
			   let arr_item = cut_item_name.split("_")
			   let prefix = arr_item[0]
			   let item_n = Number(arr_item[1])
			   let parent_full_name
			   if( typeof(parent_full_name_or_parent_tree) == 'string')
			   {
				   parent_full_name = parent_full_name_or_parent_tree
				   this.getTreeByName(parent_full_name_or_parent_tree)
			   }
			   else
			   {
				   this.tree = parent_full_name_or_parent_tree
				   parent_full_name = this.tree.full_name
			   }
			   let parent_props = this.tree.props
			   // let parent_selected = parent_props.selected
   
			   while( this.tree.list.includes( cut_item_name) )
			   {
				   item_n ++
				   cut_item_name = prefix + "_" + item_n
			   }
			   
			   input_tree.name = cut_item_name
			   input_tree.parentNode = this.tree
   
			   let new_full_name = parent_full_name + "-" + cut_item_name
			   
			   this.storeTempName({
				   check_tree: input_tree, 
				   temp_name: new_full_name
				})
   
			   let parent_show_arrow = parent_props.selected	
			   // console.log( this.tree.name )		
			   if( parent_show_arrow )
			   {
				   //this.show_arrow[ new_full_name ] = false
				   input_tree.props.show_arrow = false 
			   }
			   else
			   {
				   input_tree.props.show_arrow = true
			   }
			   //other props to update
			   if( new_props )
			   {
				   for( let prop_name in new_props)
				   {
					   input_tree.props[ prop_name ] = new_props[ prop_name ]
				   }
			   }
   
			   this.tree = this.getTreeByName( parent_full_name ).tree
			   this.tree.list.splice( index, 0,  cut_item_name )
   
			   this.tree[cut_item_name] = input_tree 
			   
			   //not clear if need deepcopy to copy dom_node, tree_node
			   if( this.temp_tree && this.temp_tree.list.length > 0 )
			   {
				   this.removeFirstTempTree()
			   }
   
			   this.tree = original_tree
   
			   return this
		   },