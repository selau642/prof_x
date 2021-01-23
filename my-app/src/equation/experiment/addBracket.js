let {
	tree_list, 
	tree_list:[ first_tree]
						}= u.getArrowFrom('document')
							.whereArrowTypeIs('all')


if( u.check(tree_list )
	.isSideBySide() )
{
	let first_index = u.getPositionOf( first_tree )
	let bracket_tree = u.insertBracketInto(p_tree)
						.at( first_index )
						.getBracketTree()
	
	u.cut( tree_list )
	 .paste()
	 .into( bracket_tree)
	 .at('start')
}


addBracket: function( show_arrow_list )
	{

		// check if:
		// 1. same parent
		// 2. side by side

		let tree = show_arrow_list[0]
		let p_tree = tree.parentNode
		let p_tree_full_name = p_tree.full_name
		let tree_list = p_tree.list

		let isSameParent = true
		let index_list = []

        for( let tree of show_arrow_list )
		{
            let { full_name } = tree.parentNode

			if(  p_tree_full_name  != full_name )
			{
				isSameParent = false
			}
			else
			{
				//same parent

			}
		}

		if( isSameParent )
		{
			//check if side by side
			index_list.sort() //[2,3,4]
			let first_item = index_list[0]
			let isSideBySide = true
			for( let [index, item] of index_list.entries())
			{
				if( item == first_item)
				{
					first_item ++
				}
				else
				{
					isSideBySide = false
				}
			}

			if( isSideBySide )
			{
				//IMPORTANT:
				//1. insert new bx_1-br_1 or br_1-bx_1 first
				//2. then cut
				// this is because svelte only rerender new names
				// and we need svelte to render updateProps
				// 3. cutting first and insert will keep old names and no svelte rerender

				let start_tree = this.tree

				let first_index = index_list[0]


				let insert_position = first_index
				let false_position = false
				let tree_to_paste

				if( type == 'bx')
				{
					// Case:
					// a+b+c => a+(b+c)
					let box_props = {
						type: 'box',
						selected: true,
						arrow_type: 'top_red'
						// show_arrow: true
					}
					
					this.addChild('bx', 'box', 
					box_props, insert_position).getChild( insert_position ) //get the inserted box
			
					//this.show_arrow[ this.tree.name ] = true
					//add positive sign, if not at front position
					if( insert_position != 0 )
					{
						let plus_elem_props = {
							type:'bin',
							text:'+',
							selected: true,
							arrow_type: 'top_blue',
							show_arrow:false
						}
						
						this.addChild('i', 'bin', 
						plus_elem_props, false_position)
					}

					let bracket_props = {
						type: 'bracket',
						check_equation_sign:true, 
						arrow_type:'top_blue',
						selected: true,
						show_arrow: true
					}
					
					this.addChild('br', 'bracket', 
					bracket_props, false_position )
					
					tree_to_paste = this.getLastChild().tree //get the inserted bracket

				}
				else
				{
					//item and bracket
					// Case:
					// abc => a(b)c
					let bracket_props = {
						type: 'bracket',
						check_equation_sign:true,
						selected: true,
						show_arrow: true,
						arrow_type: 'top_blue'
					}
					
					this.addChild('br', 'bracket', 
					bracket_props, insert_position ).getChild( insert_position ) //get the inserted bracket
					
					//this.show_arrow[ this.tree.name ] = true
					
					let box_props = {
						type: 'box',
						selected: true,
						arrow_type: 'top_red',
						show_arrow: true
					}

					this.addChild('bx', 'box', 
					box_props, false_position)

					tree_to_paste = this.getLastChild().tree //get the inserted box
				
					//this.show_arrow[ this.tree.name ] = true
				}

				this.tree = start_tree
				first_index += 1
				for( let [index, order] of index_list.entries() )
				{
					this.cutChildTree( first_index ) 
					//after cut the index moves
					//so its dynamic
				}

				this.tree = tree_to_paste
				let store_pasted_names = false
				for( let [index, order] of index_list.entries() )
				{
					this.pasteIntoParent(store_pasted_names,
						{show_arrow:false})
				}

				//this.show_arrow[ this.tree.name ] = false
				this.pasted_tree_names = []				
				this.tree.props.show_arrow = false //hide bracket arrow

				return true
			}
			else
			{
				//not isSideBySide
				return "not_side_by_side"
			}
		}
		else
		{
			//not isSameParent
			return "not_same_parent"
		}
	},