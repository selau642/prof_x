/**
 * A person object with a name and age.
 * @typedef {Object} Tree
 * @property {string} name prefix of tree like i_1, bx_1...
 * @property {string} full_name full path name of tree.
 * @property {array} list list of child tree
 * @property {Object} props property of tree like selected, show_arrow
 */

import clonedeep from 'lodash.clonedeep' 
import { checkDot } from '../tree/checkDot.js'

export let op =  {   // on error stay put in the node
	// root: null,
	tree: null, //current tree position
	protected_name_list: [],
	debug_parse_eq: false, 
	arrow:{
		i: 'top_i',
		sign: 'top_i',
		num: 'top_i',
		sym: 'top_i',
		br: 'top_i',
		bx: 'top_bx',
		fr:'top_i',
		top: 'top_bx',
		bot: 'bottom_bx'
		},
	item_dict:{
		sign: 'sign',
		sym: 'symbol',
		num: 'number',
		i: 'item',
		br: 'bracket',
		fr: 'fraction',
		top: 'top',
		bot: 'bottom',
		bx: 'box',
		eq: 'equation',
		f: 'formula'
	},
	temp_tree: null,	//cut trees
	pasted_tree_names: [], 	//cut trees props
	show_arrow: {},// {'f_1-eq_2': false} item_name and show arrow status
	//subproperties of props
	// 1. cut_tree:null,
	// 2. pasted_trees: null, // [] list
	// 3. show_arrow: null, // [] list
	setTree:function(tree)
	{
		this.tree = tree
		return this
	},
	setProps:function(arr_obj)
	{
		//arr_obj= [{tree:, props:}]
		for( let item of arr_obj )
		{
			let actual_props = item.tree.props
			let new_props = item.props
			for( let key in new_props )
			{
				actual_props[key] = new_props[key]
			} 
		}
		return this
	},
	getType: function(tree)
	{
		if(!tree) tree = this.tree
		
		let { type } = tree
		let odd_type = [ 'f','bx', 'top', 'bot', 'sign', 'sym']
		let even_type = [ 'sym', 'num', 'br', 'fr' ]
		
		if( type == 'eq')
		{
			return 'eq'
		}
		else if( odd_type.includes( type ))
		{
			return 'odd'
		}
		else if( even_type.includes( type ) )
		{
			return 'even'
		}
		
	},
	parse_xTree: function(formula, root)
	{
		// formula_tree:
		// main_tree = {
		//  name:'root',
		//	list: ['f_1'],
		// 	f_1:{ 
		// 		list:['eq_1', 'eq_2'],
		//		name:'f_1',
		//		eq_1: {
		//			uid: 3,
		//			list:['bx_1', 'bx_2'],
		//			bx_1:{ uid: 4},
		//			bx_2: {...}
		//		},
		//		eq_2: {
		//			uid:5,
		//		}
		// 	}
		//}
		//return { main_tree, eq_obj }
	
		if( !root )
		{
			this.growNewTree()
			this.root = this.tree
		}
		else
		{
			this.tree = root
		}
		//at root position
		this.addChild( 'f')
		this.getLastChild()
		//at f_ position
		
		let arr_eq = formula.split("=")
		// let katex_eq = '' //katex equation
	
		for( let eq of arr_eq )
		{	
			//reference f_ position
			this.addChild('eq').getLastChild()

			this.parse_eq( eq ) //auto return to eq_ point
	
			this.getParent( 1 )
			//return to 'f' position, to continue adding child
		}

		this.getTreeByName('root')
	
		return this.tree
	},
	parse_eq:function ( eq )
	{
		//this function parse equation expression 
		//into this.tree

		//bx_1 = box
		//br_1 = bracket
		//i_1 = container for sign, sym
		// sign_1 = sign
		// sym_1 = symbol or coef

		// { 
		//   name'f_1-eq_1',
		//   list:['bx_1'],
		//   bx_1: {
			// 	name: 'f_1-eq_1-bx_1'
			// 	list:['i_1', 'i_2'],
			// 	i_1: false,
			// 	i_2: false
			// }
		// }
		
		let eq_return_tree = this.tree 
		//set return position
		let { arrow } = this


		let test_eq = eq.replace(/\s/g, '')
		let prev_elem
		if( test_eq[0] === '0' && test_eq.length == 1)
		{			
			this.tree = eq_return_tree
			return this
		}
		else
		{
			this.addChild('bx' ).getLastChild()
			this.addChild('i').getLastChild()
			prev_elem = 'eq'
		}
		//enter box position 
		
		
		//transform to pure regex recognition system
		//x_n, subscript
		//x^n, power
		//x_u^o, x subscript u power o
		//\\frac functions
		let isSymbol = /[a-zA-Z]/
		let isNumber = /[0-9]|\./ //add decimal
		let isZero = /0/
		let isSign = /\+|-/
		let isMultiply = /\*/
		let isDivide = /\//
		let isFunction = /\\/ //terminate with space or bracket
		let isSpace = /\s/
		let isOpenBracket = /\(/
		let isCloseBracket = /\)/
		let isNewSymbol = /\?/



		let arr_bracket = []
		//if hit isDivide will add one element to arr_bracket
		//[2, 1, 0] 
		//3 dividers ( arr_bracket.length )
		//first = 2 bracket open
		//second = 1 bracket open
		//third = 0 bracket open, means they have been closed

		for(let i = 0; i < eq.length ; i ++ )
		{
			let token = eq[i]
			if( isSpace.test(token))
			{
				if( prev_elem == 'function')
				{
					//parse full function form here
					//\\frac{a}{b}
				}
				else
				{
					//skip
					continue
				}
			}
			else if( isOpenBracket.test(token) )
			{

				if( arr_bracket.length > 0)
				{
					arr_bracket = arr_bracket.map( elem => elem + 1)
				}

				if( prev_elem == 'symbol'
				|| prev_elem == 'coeff')
				{
					this.getParentOf('i') //@box
					// [bx]-i-(sym|coeff)
					this.addChild('i').getLastChild()
					this.addChild('br').getLastChild()
					this.addChild('bx').getLastChild()
					this.addChild('i').getLastChild()
				}
				else if( prev_elem == 'eq'
				|| prev_elem == 'open_bracket')
				{
					// @item
					this.addChild('br').getLastChild()
					this.addChild('bx').getLastChild()
					this.addChild('i').getLastChild()
				}

				prev_elem = 'open_bracket' //@item
				
			}		
			else if( isCloseBracket.test(token) )
			{
				let count_divide = arr_bracket.length
				if( count_divide > 0)
				{
					arr_bracket = arr_bracket.map( elem => elem -1 )
					if( arr_bracket[ count_divide - 1] == -1 )
					{
						arr_bracket.pop()
					}	
				}

				this.getParentOf('i') 
				// bx-i-br-[bx]-i-sym
				
				this.getParentOf('i')
				// [bx]-i-br-bx-i-sym

				prev_elem = 'close_bracket' //@box
			}
			else if( isSymbol.test(token) || isNewSymbol.test(token))
			{
				
				if( prev_elem == 'item' 
				|| prev_elem == 'open_bracket'
				|| prev_elem == 'eq' 
				)
				{
					// to Symbol
					// first @item					
					// [+]
					this.addChild('sym', {
						text: token
					})
				}
				else if( prev_elem == 'sign')
				{
					// to Symbol
					// +[a]
					// @item
					this.addChild('sym', {
						text: token
					})
				}
				else if( prev_elem == 'symbol' 
				|| prev_elem == 'number'
				|| prev_elem == 'multiply'
				)
				{
					// to Symbol
					// +a[b]
					
					this.getParentOf('i')
					//[bx]-i-(sym | number)

					this.addChild('i').getLastChild()
					this.addChild('sym', {
						text: token
					})	
				}
				else if( prev_elem == 'divide')
				{
					// to Symbol
					// a/b
					// @bot
					this.addChild('sym', {
						text: token
					})	
				}
				else if( prev_elem == 'close_bracket')
				{
					// @box
					// to Symbol
					// [bx]-i-br
					this.addChild('i').getLastChild()
					this.addChild('sym', {
						text: token
					})	
				}
				// else isSign
				prev_elem = 'symbol'
			}
			else if( isNumber.test(token) )
			{
				//make box name
				if( prev_elem == 'number')
				{
					// '12' parse as '12' not '1' & '2'
					let prev_text = this.getLastChild().tree.props.text
					prev_text =  prev_text + token
					this.tree.props.text = prev_text
					this.getParent(1)  
				}
				else
				{
					if( !isZero.test(token) )
					{						
						if( prev_elem == 'item' 
						|| prev_elem == 'open_bracket'
						|| prev_elem == 'eq'
						|| prev_elem == 'multiply' )
						{
							// this.addChild('i', 'item').getLastChild()
							this.addChild('num',
							{
								text: token
							})
						}

						prev_elem = 'number' //@item 
					}
				}
			}
			else if ( isSign.test( token ))
			{
				// read forward here for multiple ++-- cases
				
				if( prev_elem  == 'eq'
				|| prev_elem == 'open_bracket' )
				{
					// [+]a+b = c --> a+b=c
					// ([+]a+b) --> (a+b)
				
					if( token == '-' )
					{
						this.addChild('sign', {
							text:token
						})
					}

					prev_elem = 'sign'
					continue
				}
				// else if(prev_elem == 'sign')
				// {
				// 	//token typo  +++ or -+ or etc
				// 	//auto correct
				// 	let prev_text = this.getLastChild().tree.props.text
				// 	if( (prev_text == '-' && token == '+')
				// 	 || (prev_text == '+' && token == '-'))
				// 	{
				// 		prev_text = '-'
				// 	}
				// 	else if( (prev_text == '+' && token == '+')
				// 	 || (prev_text == '-' && token == '-') )
				// 	{
				// 		prev_text = '+'
				// 	}
				// 	this.tree.props.text = prev_text
				// 	this.getParent(1) 
				// }
				else if( arr_bracket.length > 0 
				&& arr_bracket[arr_bracket.length - 1] == 0)
				{
					// end of fraction
					// (...)/(...) [+] a
					// a/b [+] c
					arr_bracket.pop()
					this.getParentOf('fr')
					// eq-bx-[i]-fr

					this.getParentOf('bx')
					// [eq]-bx-i-fr
					//@box

					this.addChild('bx').getLastChild()
					this.addChild('i').getLastChild()
					this.addChild('sign', {
						text:token
					})

					prev_elem = 'sign'
				}
				else if( prev_elem == 'multiply' )
				{
					// -1 * [-]2
					// bx-i
					// @ item
					this.addChild('sign', { text: token })
					prev_elem = 'sign'
				}
				else if( prev_elem == 'coeff' 
				|| prev_elem =='symbol')
				{
					// -a[+]b
					// -1[+]1
					this.getParentOf('bx')
					// [eq]-bx-i-(sym|coeff)
					
					this.addChild('bx').getLastChild()
					this.addChild('i').getLastChild()
					this.addChild('sign', { 
						text: token
					})
					prev_elem = 'sign'
				}
			}
			else if( isMultiply.test(token))
			{
				// -1 [*] 2abc
				// render by checkDot in item
				this.getParentOf('i')
				this.addChild('i').getLastChild()
				prev_elem = 'multiply'
			}
			else if( isDivide.test(token))
			{					
				console.log('token:', token, "prev_elem:", prev_elem)
				//reverse handle tree
				let box_tree 
				if( prev_elem == 'close_bracket' )
				{
					//this.tree @ bx-br, the box of close_bracket
					box_tree = this.tree
				}
				else if( prev_elem == 'symbol')
				{
					//this.tree = parent of symbol = item
					box_tree = this.tree.parentNode	
				}

				let tree_list = [ ...box_tree.list]
				console.log(tree_list )
				this.addChild( 'fr').getLastChild()
				let frac_tree = this.tree 
				
				this.addChild('top')		
				this.addChild('bot')
	
				let paste_tree = this.getChild('top_1').tree
				
				//@ box-frac-top
				this.getParent(2)
				//@ box
				let count_index = 0

				for(let item_name of tree_list)
				{
					//cut and paste into frac
					if( box_tree[item_name].props.type != 'sign' )
					{	
						//dynamic list
						let item_index = box_tree.list.indexOf(item_name) 
						//@box
						this.cutChildTree(item_index)

						this.pasteChildTree({
							cut_tree:this.getFirstTempTree(), 
							paste_tree, 
							paste_index:count_index, 
							new_props: { show_arrow:false }
						})
						//paste into fraction
						count_index ++
					}
				}
				//@box
				this.tree = frac_tree

				this.getChild('bot_1')
				this.addChild('bx').getLastChild()
				this.addChild('i').getLastChild()
				// count_divide ++
				arr_bracket.push(0)
				prev_elem = 'divide'
			}
		}
	
		this.tree = eq_return_tree
		return this
	},
	growNewTree: function()
		{
			let tree = {
				name: "root",
				type: "root",
				list: []
			}

			this.tree = tree

			// this.root = tree

			return this
		},
	growTempTree: function()
		{
			//for cutting trees
			let tree = {
				name: 'temp',
				type: 'temp',
				list:[]
			}

			let temp_props = { "temp": { "tree_node": tree}}
			this.temp_tree = tree
			this.temp_props = temp_props
			return this 
		},
	setup: function( tree )
		{
			this.tree = tree
			return this        
		},
	
	makeFullName: function( item_name )
		{
			if( this.tree.name != "root")
			{
				return this.tree.full_name + "-" + item_name
			}
			else
			{
				return item_name
			}
		},
	splitName: function( full_name )
		{
			if( !full_name )
			{
				full_name = this.tree.full_name
			}
			let arr_name = full_name.split("-")
			let item_name = arr_name.pop()
			let parent_name = arr_name.join("-")
			return { parent_name, item_name }
		},
	getTreeByName: function( name )
		{
			if( name == 'root')
			{
				this.tree = this.root
				return this
			}

			if( this.tree.full_name == name )
			{
				return this
			}

			let arr_name = name.split("-")
			
			let new_tree = this.root
			// console.log( new_tree )
			for( let p of arr_name )
			{
				// console.log(p)
				if( new_tree[p] )
				{
					new_tree = new_tree[p]
				}
				else
				{
					let error_msg =  `op getTreeByName: child_tree name not found.
					 full_name: ${name},
					 child tree not found: ${p}.`
					
					// throw error_msg
					console.log( error_msg )
					 return false
				}
			}

			this.tree = new_tree
			return this
		},
	/**
	 * get final parent while ensuring intermediate tree path is matched  
	 * path "fr-bot-i" means parent must be bot and fr to return true
	 * @param {string} path 
	 */
	getParentPath: function( path )
		{
			let { tree } = this
			let arr_path = path.split('-').reverse()
			//first item is source tree
			arr_path.pop()
			let test_tree = tree 
			let mismatch = false
			
			for( let type of arr_path )
			{
				test_tree = test_tree.parentNode
				if( test_tree.type != type )
				{
					mismatch = true
				}
			}

			if( mismatch )
			{
				return false
			}
			else
			{
				return test_tree 
			}
		},
	getParent: function(index)
		{
			let new_tree = this.tree
			let original_name = new_tree.full_name
			for( let i = 0; i < index; i ++)
			{
				if( new_tree.parentNode )
				{
					 new_tree = new_tree.parentNode
				}
				else
				{
					// throw new Error( `No more parent` )
					new_tree = false
				}
			}

			
			this.tree = new_tree
			return this
			
		},
	getParentOf:function(prefix)
		{
			let new_tree = this.tree
			
			while( new_tree.name.search(prefix) == -1 
			&& new_tree.name != 'root')
			{
			 	new_tree = new_tree.parentNode
			}

			if( new_tree.name != 'root') new_tree = new_tree.parentNode

			this.tree = new_tree
			return new_tree
		},
	/**@param {string|Array} prefix array of prefix, return first match*/
	getPrevPrefix: function(prefix)
		{
			let new_tree = this.tree
			let arr_prefix = []
			if( typeof( prefix ) == 'string')
			{
				arr_prefix = [ prefix ]
			}
			else
			{
				arr_prefix = prefix 
			}

			let arr_length = arr_prefix.length
			let is_found = false
			while( !is_found
				&& new_tree.parentNode )		//check if parentNode not null
			{	
				new_tree = new_tree.parentNode
				for( let i = 0; i < arr_length; i++ )
				{
					let check_name = arr_prefix[i]
					if( new_tree.name.search( check_name ) > -1 )
					{	
						is_found = true
						break
					}
				}				
			}

			if( !new_tree || !is_found )
			{
				//fail to find tree
				// console.log('fail to find tree')
				return false
			}
			else
			{
				// console.log('found tree:', new_tree.full_name )
				this.tree = new_tree
				return this
			}
		},
	getLastChild:function()
		{
			let index = this.tree.list.length - 1
			return this.getChild(index)
		},
	getDenom:function()
		{
			if( this.tree.denom ) this.tree = this.tree.denom
			return this
		},
	getDOMNode:function()
		{
			let name = this.tree.full_name
			if( typeof document != undefined )
			{	
				return document.getElementById(name)
			}
			else
			{
				return false				
			}
			
		},
	getChild: function(index_or_name)
		{	//changes tree position to child
			let name 
			if( typeof(index_or_name) == 'string')
			{
				name = index_or_name
				if( this.tree[name])
				{
					this.tree = this.tree[name]
					return this
				}
				else
				{
					console.log("op error: getChild no such item name: " 
					+ name + ", tree:" + this.tree.full_name )

					return false
				}
			}
			else if( typeof(index_or_name) == 'number')
			{
				let index = index_or_name
				if( index < this.tree.list.length  )
				{
					name = this.tree.list[index]
					this.tree = this.tree[name]
					return this
				}			
				else
				{
					let error_msg = `op error: no such index:${index} 
					 tree_length: ${this.tree.list.length}
					tree_list: ${this.tree.list} 
					tree full_name: ${this.tree.full_name}`
					// throw error_msg
					console.log( error_msg )
					return false
				}
			}			
		},
	getChildProps:function( index_or_name )
		{
			let name 
			if( typeof(index_or_name) == 'string')
			{
				name = index_or_name
			}
			else if( typeof(index_or_name) == 'number')
			{
				// let index = index_or_name
				name = this.tree.list[ index_or_name ]
			}	

			return this.tree[name].props	
		},
	getNextFormula: function()
		{
			let { nextFormulaIndex = 0 } = this

			let plus_one = nextFormulaIndex + 1
			this.nextFormulaIndex = plus_one
			return plus_one
		},
	addSign: function( token )
		{
			this.tree.props.sign = token 
		},
	addText: function( token )
		{
		  this.tree.props.text = token
		  
		//   if( !this.tree.props.text )
		//   {
		// 	this.tree.props.text = token
		//   }
		//   else
		//   {
		// 	this.tree.props.text += token
		//   }  
		},
	addChild: function( prefix, item_props={}, position=false)
		{
			//default position is the end of tree
			//because more common in parsing equations
			//to keep adding at the end of tree than
			//adding at the first position=0

			let { item_dict } = this
			if( position === false )
			{	
				position = this.tree.list.length                    
			}

			let item_n
			let item_name
			if( prefix == 'f')
			{
				//formula
				item_n = this.getNextFormula()
				item_name = prefix + "_" + item_n
			}
			else if( prefix != 'f' )
			{
				item_n = 1
				item_name = prefix + "_" + item_n


				while( this.tree.list.includes( item_name) )
				{
					item_n ++
					item_name = prefix + "_" + item_n
				}
			}

			this.tree.list.splice(position, 0, item_name)
			
			let full_name = this.makeFullName( item_name )
			let tree_item = { 
				name: item_name,
				type: prefix, 
				full_name: full_name,
				parentNode: this.tree
			}

			//add functions
			if( prefix == 'num'
			|| prefix == 'sym'
			|| prefix == 'br' 
			|| prefix  == 'fr')
			{
			  tree_item.checkDot = checkDot
			}
			// if( prefix != "i")
			// {
				tree_item.list = []
			// }
			
			// if( item_props.type === undefined )
			// {
			// 	item_props.type = item_dict[ prefix ]
			// }

			// if( item_props.selected === undefined )
			// {
			// 	item_props.selected = false
			// }

			if( item_props.show_arrow === undefined )
			{
				item_props.show_arrow = false
			}
			
			if( item_props.arrow_type === undefined )
			{ 
				let { arrow } = this
				item_props.arrow_type = arrow[ prefix ]
			}
			
			
			tree_item.props = item_props
			this.tree[item_name] = tree_item
			if( this.debug_parse_eq ) 
			{
				if( item_props.text )
				{
					console.log("make:", full_name, ", text:", item_props.text)
				}
				else
				{
					console.log("make:", full_name )
				}
			}
			return this				
		},
	addChild_deprecate:function( prefix, item_type, 
		item_props={}, position=false)
		{
			//default position is the end of tree
			//because more common in parsing equations
			//to keep adding at the end of tree than
			//adding at the first position=0
			if( position === false )
			{	
				position = this.tree.list.length                    
			}

			let item_n
			let item_name
			if( prefix == 'f')
			{
				//formula
				item_n = this.getNextFormula()
				item_name = prefix + "_" + item_n
			}
			else if( prefix != 'f' )
			{
				item_n = 1
				item_name = prefix + "_" + item_n


				while( this.tree.list.includes( item_name) )
				{
					item_n ++
					item_name = prefix + "_" + item_n
				}
			}

			this.tree.list.splice(position, 0, item_name)
			
			let full_name = this.makeFullName( item_name )
			let tree_item = { 
				name: item_name,
				full_name: full_name,
				parentNode: this.tree
			}

			// if( prefix != "i")
			// {
				tree_item.list = []
			// }
			
			if( item_props.type === undefined )
			{
				item_props.type = item_type
			}

			if( item_props.selected === undefined )
			{
				item_props.selected = false
			}

			if( item_props.show_arrow === undefined )
			{
				item_props.show_arrow = false
			}
			
			if( item_props.arrow_type === undefined )
			{ 
				let { arrow } = this
				item_props.arrow_type = arrow[ prefix ]
			}
			
			
			tree_item.props = item_props
			this.tree[item_name] = tree_item
			if( this.debug_parse_eq ) 
			{
				if( item_props.text )
				{
					console.log("make:", full_name, ", text:", item_props.text)
				}
				else
				{
					console.log("make:", full_name )
				}
			}
			return this				
		},
	
	cloneFrom: function(tree)
		{
			let parent_node = tree.parentNode
			let tree_name = tree.full_name
			tree.parentNode = null
			tree.full_name = tree.name
			// console.log(tree)
			let new_tree = clonedeep( tree )

			tree.parentNode = parent_node
			tree.full_name = tree_name
			return new_tree
		},
	makePath: function( path, props ){
		// Emulate Path object
		// work in progress
		let obj_branch = {}

		let arr_p = path.split('-')
		
		return {
			getBranch:() =>{
				return obj_branch
			}
		}
	}, 
	getSign: function( tree )
	{
		let first = tree.list[0]
		if( first.type == 'bx_sign' 
		|| first.type == 'i_sign' )
		{
			return first
		}
		else 
		{
			return false
		}
	},
	removeThisTree:function( tree )
		{
			let item_name  = tree.name
			this.storeTree()
			this.setTree(tree.parentNode).removeChildShallow( item_name )
			this.reloadTree()
			return this
		},
	
	removeChildDeep:function( index_or_name, recursive_tree )
		{
			// this also deletes child from dict
			let item_name
			let index

			if( !recursive_tree )
			{
				//initialise
				recursive_tree = this.tree 
			}

			if( typeof(index_or_name) == 'string')
			{
				item_name = index_or_name
				index = recursive_tree.list.indexOf( item_name )
			}
			else if( typeof(index_or_name) == 'number')
			{
				index = index_or_name
				item_name = recursive_tree.list[ index ]
			}

			recursive_tree.list.splice( index, 1)
			let child_tree = recursive_tree[ item_name ] 
			let child_tree_list = child_tree.list

			if( child_tree_list )
			{
				let max_i = child_tree_list.length
				for( let i = 0; i < max_i; i ++ )
				{
					this.removeChildDeep(0, child_tree)
				}
			}			
			
			delete recursive_tree[ item_name ]

			let full_name = child_tree.full_name

			return this
		},
	
	removeThisChild:function(tree)
	{
		let p_tree = tree.parentNode
		let tree_name = tree.name
		let index = p_tree.list.indexOf( tree_name )
		p_tree.list.splice( index, 1)
		delete p_tree[ tree_name ]
		return this
	},
	removeChildShallow: function( index_or_name )
		{
			// this also deletes child from dict
			let item_name
			let index

			if( typeof(index_or_name) == 'string')
			{
				item_name = index_or_name
				index = this.tree.list.indexOf( item_name )
			}
			else if( typeof(index_or_name) == 'number')
			{
				index = index_or_name
				item_name = this.tree.list[ index ]
			}

			this.tree.list.splice( index, 1)
			delete this.tree[ item_name ]

			return this
		},
	copyObj: function (tree)
		{
			return clonedeep(tree)
		},
	addFn: function( fn_name, fn )
	{
		this.tree[fn_name] = fn
		return this
	},
	/**@param {string} full_name tree full_name */
	cutByFullName: function( full_name )
		{

			this.storeTree()
			let tree = this.getTreeByName( full_name ).tree
			let parent_tree = tree.parentNode
			let index = parent_tree.list.indexOf( tree.name )
			this.setTree( parent_tree ).cutChildTree( index )
	
			this.reloadTree()
			return this
		}, 

	/** 
	 * @param {Object} tree
	 */
	cutThisTree:function( tree )
		{
			let parent_tree = tree.parentNode
			let index = parent_tree.list.indexOf( tree.name )

			this.storeTree()
			this.setTree( parent_tree ).cutChildTree( index )
			
			this.reloadTree()
			return this

		},
	/** 
	 * @param {String} full_name
	 */
	cutThisTreeByName:function( full_name )
		{
			this.storeTree()
			let tree = this.getTreeByName( full_name ).tree
			let parent_tree = tree.parentNode
			let index = parent_tree.list.indexOf( tree.name )

			this.setTree( parent_tree ).cutChildTree( index )
			this.reloadTree()
			return this


		},
	storeTree:function()
		{
			this.original_tree = this.tree
			return this
		},
	reloadTree:function()
		{
			this.tree = this.original_tree
			this.original_tree = false
			return this
		},
	addTempTree:function( input_tree, position=false, to = 'tree')
		{
			//add to the end of temp_tree.list
			//default position is the end of tree
			//because more common in parsing equations
			//to keep adding at the end of tree than
			//adding at the first position=0

			// cut_1 f_1-eq_1-bx_2
			// 	i_1
			//  i_2

			if( position === false )
			{	
				position = this.temp_tree.list.length                    
			}
			
			//cut and paste into temp
			let prefix = 'cut'
			let item_n = 1
			let item_name = prefix + "_" + item_n

			try
			{
				while( this.temp_tree.list.includes( item_name) )
				{
					item_n ++
					item_name = prefix + "_" + item_n
				}

				this.temp_tree.list.splice(position, 0, item_name) //equals to push if position false
				this.temp_tree[item_name] = input_tree
				// console.log("added_to_temp_tree:", input_tree.full_name )
				return this
			}
			catch(e)
			{
				console.log("op error:" + this.tree.full_name + " addTempTree" )
				console.log(e)
				return false
			}
			
		},
	removeFirstTempTree: function()
		{
			let temp_list = this.temp_tree.list 
			let first_item = temp_list[0]
			
			delete this.temp_tree[ first_item ]
			this.temp_tree.list.shift()
		
			return this
		},
	removeTempTree: function()
		{
			//remove the first temp tree
			for( let item of this.temp_tree.list )
			{
				delete this.temp_tree[ item ]
			}

			this.temp_tree.list = []
			return this
		},
	getFirstTempTree:function()
		{
			let first_tree_name = this.temp_tree.list[0]
			let first_tree = this.temp_tree[first_tree_name]
			return first_tree
		},	
	cutAllChildTree:function(input={})
		{
			//cut from 0 to n position
			let {exclude_index} = input
			exclude_index = exclude_index? exclude_index: []

			let tree = this.tree
			let static_length = tree.list.length
			// console.log("cutting tree:", tree.full_name, ", length:", static_length )
			let cut_index = 0
			for( let i = 0; i < static_length; i++ )
			{
				if( exclude_index.indexOf(i) == -1)
				{
					//cut from left to right and skip by cut_index ++
					this.cutChildTree(cut_index)
				}
				else
				{
					cut_index ++
				}
			}
			
			return this
		},
	cutChildTree: function ( index )
		{
			//TO DO: handle case, cut but no paste
			if( !this.temp_tree )
			{
				this.growTempTree()
			}
			
			let original_tree = this.tree 
			let debug_tree = this.tree.full_name
			let child_tree =  this.getChild(index).tree

			let full_name 
			if( !child_tree )
			{
				console.log( "cutChildTree:" )
				console.log( index )
				console.log( debug_tree )
			}

			if( child_tree.temp_name )
			{
				full_name = child_tree.temp_name
			}
			else
			{
				full_name = child_tree.full_name
			}

			this.addTempTree( child_tree )
			
			this.tree = original_tree
			this.removeChildShallow( index )
			this.cut_index = index
			return this
		},
	/** @returns {Array<Object>} Array of Tree object */
	returnCutTree:function()
		{
			let temp_tree = this.temp_tree
			let temp_list = temp_tree.list

			let arr_cut = []
			for( let temp_name of temp_list )
			{
				arr_cut.push( temp_tree[temp_name] )
				delete temp_tree[ temp_name ]
			}

			this.temp_tree.list = []
			return arr_cut
		},
	pasteIntoParent: function( index = false, new_props=false )
		{
			let main_tree = this.tree 
			if( index === false )
			{
				index = this.tree.list.length
			}
			let original_cut_tree = this.getFirstTempTree()

			this.pasteChildTree({
				cut_tree: original_cut_tree,
				paste_tree: main_tree,
				paste_index: index,
				new_props: new_props
			})
			
			return this
		},
	/**
	 * 1. Paste cut_tree into paste_tree
	 * 2. if_paste_tree_show_arrow: cut_tree_hide_arrow
	 * 		else: cut_tree_show_arrow 
	 * @param {Object} input
	 * @param {Tree} input.cut_tree source tree that was cut or copied
	 * @param {Tree} input.paste_tree target tree to paste into
	 * @param {string} input.paste_tree_full_name Optional - use name to search paste_tree
	 * @param {number} input.paste_index location to paste into the paste_tree.list
	 * @param {boolean} input.save_pasted_tree save cut tree full name into pasted_tree_list
	 * @param {Object} input.new_props set props of cut tree
	 */
	pasteChildTree: function(input = {})
		{
			let { cut_tree = false,
				paste_tree, 
				paste_tree_full_name ,
				paste_index,				
				save_pasted_name = false,
				new_props = false } = input

			// let original_tree = this.tree

			if( !cut_tree )
			{	
				cut_tree = this.getFirstTempTree()
			}

			let cut_item_name = cut_tree.name
			let arr_item = cut_item_name.split("_")
			let prefix = arr_item[0]
			let item_n = Number(arr_item[1])
			
			//parent_tree trumps full_name
			if( paste_tree )
			{
				// this.tree = paste_tree
				paste_tree_full_name = paste_tree.full_name
			}
			else
			{
				if( paste_tree_full_name )
				{
					paste_tree = this.getTreeByName( paste_tree_full_name ).tree
				}
				else
				{
					console.log("pasteChildTree error: please set parent_full_name or parent_tree")
					return
				}
			}

			// let parent_props = this.tree.props
			// let parent_selected = parent_props.selected

			while( paste_tree.list.includes( cut_item_name) )
			{
				item_n ++
				cut_item_name = prefix + "_" + item_n
			}
			
			cut_tree.name = cut_item_name
			// cut_tree.parentNode = paste_tree

			let new_full_name = paste_tree_full_name + "-" + cut_item_name
			cut_tree.full_name = new_full_name 
			if( save_pasted_name ) 
			{
				this.pasted_tree_names.push( new_full_name )				
			}
			
			//other props to update
			if( new_props )
			{
				for( let prop_name in new_props)
				{
					cut_tree.props[ prop_name ] = new_props[ prop_name ]
				}
			}

			// this.tree = paste_tree
			// this.tree.list.splice( paste_index, 0,  cut_item_name )

			// this.tree[cut_item_name] = cut_tree 

			paste_tree.list.splice( paste_index, 0, cut_item_name )
			paste_tree[ cut_item_name ] = cut_tree
			cut_tree.parentNode = paste_tree

			//not clear if need deepcopy to copy dom_node, tree_node
			//potential bug if auto remove from temp_tree
			if( this.temp_tree && this.temp_tree.list.length > 0 )
			{
				this.removeFirstTempTree()
			}

			// this.tree = original_tree

			return this
		},
	setShowArrow:function( p_tree)
	{
		//default is not to save name
		let parent_selected = p_tree.props.selected	

		if( parent_selected )
		{
			//this.show_arrow[ new_full_name ] = false
			return false
		}
		else
		{
			//default don't change cut_tree show_arrow status
			//cut_tree.props.show_arrow = true
			return true
		}
	},
	/**
	 * paste temp_tree.list into this.tree or specified tree
	 * @param {Object} input 
	 * @param {Tree} input.paste_tree Target tree to paste. Default: this.tree
	 * @param {Object|boolean} input.new_props Set props for temp_tree
	 * @param {boolean} input.save_pasted_name Save temp_tree.full_name into pasted_tree_names
	 * @param {number} input.start_index pasted_tree.list index position to start pasting temp_tree
	 */
	pasteAllChildTree:function(input = {})
		{
			let {
				paste_tree ,
				new_props = false,
				save_pasted_name = false,
				start_index = 0
			} = input 
			
			if(!paste_tree) paste_tree = this.tree

			let static_length = this.temp_tree.list.length
			for(let i = 0; i < static_length; i++)
			{
				this.pasteChildTree({
					paste_tree: paste_tree,
					paste_index: start_index + i,
					save_pasted_name: save_pasted_name,
					new_props: new_props
				})
			}

			return this
		},

	pasteIntoBracketChild: function( new_props = null)
	    {
			// [a]( b + c) => ( [a]b + [a]c )
			// used to paste into bracket
			// paste into all childs of current tree 
			// 1. position will be after plus or minus sign item
			let main_tree = this.tree
			let pasted_trees = []
			let all_child_tree = this.getAllChildTree()
			let original_cut_tree = this.getFirstTempTree()
			// - main tree
			//	- child_1
			// 	- all_child_tree
			// 		- child_2
			// 		- all_child_props
			// 		- child_2_props.type != sign, then insert new_item
			
			let main_cut_tree = this.copyObj( original_cut_tree )
			
			// if( new_props )
			// {
			// 	Object.keys( new_props ).forEach( prop_name => {
			// 		main_cut_tree.props[prop_name] = new_props[prop_name]
			// 	})
			// }

			for( let [child_tree_index, child_tree] of all_child_tree.entries() )
			{
												//tree that was cut
				this.tree = child_tree
				
				// let child_full_name = child_tree.full_name
				let cloned_cut_tree = this.copyObj( main_cut_tree )
				
				
				// let delete_props = (child_tree_index == all_child_tree.length - 1 )? true:false
				// props.type='coeff' && props.text = '1'
				
				//case
				//1. [a] ( 1 + ... )
				// 		 ( [a] + ... )

				//2. [a] ( ... + 1 )
				//       ( ... + [a] )
				this.removeOne( child_tree )

				let last_index = child_tree.list.length
				this.pasteChildTree({
					paste_tree: child_tree, 
					paste_index:last_index,
					cut_tree: cloned_cut_tree,
					save_pasted_name:true,
					new_props: new_props 
				})
			}

			//inefficient but no choice now
			let pasted_tree_name_list =  this.pasted_tree_names

			let e_tree = false

			for(let tree_name of pasted_tree_name_list)
			{
				
				this.getTreeByName(tree_name).tree.props.pasted_tree_names = pasted_tree_name_list
				if( !e_tree ) e_tree = this.tree
			}
			this.e_tree = e_tree
			this.tree = main_tree
			return this
		
		},
	removeOne:function(tree)
	{
		let original_tree = this.tree
		let tree_length = tree.list.length
		let one_is_removed = false
		//Handle paste into 1
		if( tree_length == 1)
		{
			// case (1 + ...)[a] => ([a] + ...)
			let first_elem_text = this.setTree(tree).getChild(0).tree.props.text
			if( first_elem_text == '1')
			{
				this.getParent(1).removeChildShallow(0)
				one_is_removed = '+1'
			}
		}
		else if( tree_length == 2)
		{
			
			// case ( ... -1)[a] => (... -[a]) 
			let second_elem_text = this.setTree(tree).getChild(1).tree.props.text
			if( second_elem_text == '1')
			{
				this.getParent(1).removeChildShallow(1)
				one_is_removed = '-1'
			} 
		}

		this.setTree(original_tree)
		return one_is_removed
		
	},
	// addOne:function( tree )
	// {
	// 	let original_tree = this.tree
	// 	let tree_length = tree.list.length
	// 	let one_is_added = false
	// 	//Handle paste into 1
	// 	if( tree_length == 0)
	// 	{
	// 		this.setTree(tree).addChild('i').getLastChild()
	// 		this.addChild( 'num', { text:'1'})
	// 		one_is_added = '+1'
	// 	}
	// 	else if( tree_length == 1)
	// 	{
			
	// 		// case ( ... -1)[a] => (... -[a]) 
	// 		let first_elem_text = this.setTree(tree).getChild(0).tree.props.text
	// 		if( first_elem_text == '-')
	// 		{
	// 			this.getParent(1)
	// 			.addChild('i').getLastChild()
	// 			.addChild( 'num',{ text:'1' })
	// 			one_is_added = '-1'
	// 		} 
	// 	}

	// 	this.setTree(original_tree)
	// 	return one_is_added
	// },
	indexAfterMinusSign:function( tree )
	{
		let paste_index = 0
		if( tree.list.length > 0 )
		{
			let paste_tree_first_child_text = tree[tree.list[0]].props.text
			if( paste_tree_first_child_text == '-')
			{
				paste_index = 1
			}
		}
		return paste_index
	},
	undo_pasteAction:function( )
		{
			this.storeTree() 
			let arr_pasted = this.pasted_tree_names //get the childNodes of item node_index

			let add_to_temp_tree = true

			for( let temp_name of arr_pasted)
			{
				//add first item into temp tree only
				//assume all names are temp_names so cannot use
				//standard access methods getTreeByName
				let { parent_name, item_name } = this.splitName( temp_name )
				
				this.getTreeByName(parent_name)
				let tree_list = this.tree.list
				let tree_length = tree_list.length
				
				if( tree_length == 1)
				{
					//case 1
					//([a]  + ...) =>([a](1)  + ...) => (1 + ...)[a]
					let one =  {
							text:'1',
							selected: false,
							show_arrow:false
						}
					this.addChild('i', 
							{ selected: false, 
							show_arrow: false} , 
							tree_length).getLastChild()
					this.addChild('num', one)
					
				}
				else if( tree_length == 2)
				{
					//case 2
					//( ... -[a]) => ( ... -[a](1)) => ( ... -1)[a]
					let first_type = this.getChild(0).tree.props.type
					this.getParent(1) 
					if( first_type == 'sign')
					{
						let one =  {
								text:'1',
								selected: false,
								show_arrow:false
							}
						this.addChild( 'i', {
							selected: false,
							show_arrow:false
						}  , tree_length).getLastChild()

						this.addChild( 'num', one )
					}
					
				}
				
				let index = tree_list.indexOf( item_name )
				if(add_to_temp_tree)
				{
					//cut first occurance
					// console.log( "add_to_temp_tree:", index )
					this.cutChildTree( index )
					add_to_temp_tree = false 
				}
				else
				{
					//remove remaining occurance
					this.removeChildShallow( index )
				}
			
			}

			this.pasted_tree_names = []
			this.reloadTree()
			return this
		},
	addPlusSign:function(child_tree)
		{
			let item_name = child_tree.list[0]
			let item_props = child_tree[item_name].props
			if( item_props.type == 'sign')
			{
				if(  item_props.text == '')
				{
					item_props.text = '+'
				}				
			}
			else
			{
				//insert negative sibling
				let original_tree = this.tree
				this.tree = child_tree
				let plus_item = {
					text:'+',
					selected: true,
					show_arrow:false
				}

				this.addChild('i', {
					selected: true,
					show_arrow:false
				}, 0).getLastChild()
				this.addChild( 'sign', plus_item )
				this.tree = original_tree
			}

			return this
		},

	changeSign: function(child_tree)
		{
			if(!child_tree)
			{
				let child_tree_name = this.temp_tree.list[0]
				child_tree = this.temp_tree[ child_tree_name ]
			}

			let item_name = child_tree.list[0]
			let item_props = child_tree[item_name].props
			if( item_props.type == 'sign')
			{
				if( item_props.text == '-')
				{
					item_props.text = '+'
				}
				else if( item_props.text == '+' || item_props.text == '')
				{
					item_props.text = '-'
				}				
			}
			else
			{

				//insert negative sibling
				let original_tree = this.tree
				this.tree = child_tree

				let minus_item = {
					text:'-',
					selected: true,
					show_arrow:false
				}

				this.addChild('i',  {
					selected: true,
					show_arrow:false
				}, 0).getLastChild()

				this.addChild('sign', minus_item )
				this.tree = original_tree
			}

			return this
		},
	changeAllChildSign: function()
		{
			let all_child_tree = this.getAllChildTree()
			for( let child_tree of all_child_tree)
			{
				this.changeSign( child_tree )
			}
		},
	getAllChildProps:function()
		{
			let arr_child = []

			for( let name of this.tree.list )
			{
				arr_child.push( this.getChildProps(name) )
			}

			return arr_child
		},
	getAllChildTree:function()
		{
			let arr_child = []
			for( let name of this.tree.list)
			{
				arr_child.push( this.tree[name] )
			}

			return arr_child
		},

	makeEquation: function ( tree, isBracket=false )
		{
			if( !tree )
			{
				tree = this.root
			}

			//for comparing equation strings:
			// 1. used by selection out of bracket
			let eq_arr = [] // for each formula f_n 
			// example eq_arr = [1, +, 2, (,4, +, 5,)]
			
			for( let [ index, value ] of tree.list.entries() )
			{
				let match = value.match(/f_|eq_|bx_|br_|i_/g)
				let isBracket = false
				let isEq = false

				switch( match[0] )
				{
					//start from f
					case 'f_':
						//restart name
						// child_name = value
						break
					case 'eq_':
						if( index < tree.list.length - 1 )
						{
							isEq = true
						}

						break
					case 'bx_':
						break
					case 'i_':
						let item_text = tree[value].props.text
						eq_arr.push( item_text )
						break
					case 'br_':
						// child_name = parent_name + "-" + value
						isBracket = true						
				}

				//recursive search
				if( tree[value].list )
				{
					if( tree[value].list.length > 0 )
					{
						eq_arr.push( this.makeEquation( tree[value] , isBracket ) )

					}
				}

				if( isEq )
				{
					eq_arr.push("=")
				}
			}

			if( isBracket )
			{
				eq_arr.splice(0, 0, "(")
				eq_arr.push(")")
			}

			return eq_arr.join("") //return the string a(1+2) etc...
		},

	makeDebugTree:function( tree, parent_name, js_obj)
		{
			//debugging -> print tree structure with text
			//out:
			//f_1-eq_1
				// - bx_1-i_1: a
				// - bx_1-i_2: b
				// - bx_2-i_1: +
				// - bx_2-i_2: c
				// - bx_2-br_1: (
				// 	-br_1-bx_1-i_1: d
				// 	-br_2-bx_1-i_1: +
				// 	-br_2-bx_1-i_2: c
			//f_1-eq_2 (...etc)
			
			if( !parent_name )
			{
				if(parent_name !== "")
				{
					parent_name = ""
				}
			}

			if( !tree )
			{
				tree = this.root
			}

			if( !js_obj )
			{
				js_obj = {}
			}
			
			for( let [ index, value ] of tree.list.entries() )
			{
				let match = value.match(/f_|eq_|bx_|br_|i_/g)
				let isObjSet = false
				let isEnd = false 
				let child_name = ''

				if( parent_name )
				{
					child_name = parent_name + "-" + value
				}
				else
				{
					child_name = value
				}

				switch( match[0] )
				{
					//start from f
					case 'f_':
						//restart name
						// child_name = value
						break
					case 'eq_':

						// child_name = parent_name + "-" + value
						js_obj[child_name] = {}
						isObjSet = true
						break
					case 'bx_':
						//restart name
						// child_name = value
						break
					case 'i_':
						let text = tree[value].props.text
						js_obj[child_name] = text
						isEnd = true
						break
					case 'br_':
						// child_name = parent_name + "-" + value
						js_obj[child_name] = {}
						isObjSet = true
						
				}

				//recursive search
				if( tree[value].list )
				{
					if( tree[value].list.length > 0 )
					{
						if(!isEnd)
						{
							if(isObjSet)
							{
								this.makeDebugTree( tree[value], "", js_obj[child_name])
							}
							else
							{	
								this.makeDebugTree( tree[value], child_name, js_obj)
							}
						}
					}
				}
			}

			return js_obj
		},
	printEquation: function( tree = null )
		{
			let eq_str = this.makeEquation(tree)
			console.log( eq_str )
			return this
		},
	printShowArrowTree:function( tree )
		{
			let js_obj = this.makeShowArrowTree( tree )
			console.log( JSON.stringify(js_obj, null, 2) )
		},	
	makeShowArrowTree: function( tree, js_obj=false )
		{
			if( !js_obj )
			{
				js_obj = {}
				js_obj[ tree.full_name ] = tree.props.show_arrow
			}
			
			for( let [ index, value ] of tree.list.entries() )
			{
				let full_name = tree[value].full_name
				js_obj[ full_name ] = tree[value].props.show_arrow
				if( tree[value].list && tree[value].list.length > 0)
				{
					js_obj = this.makeShowArrowTree( tree[value], js_obj)
				}

			}

			return js_obj
		},
	printTree: function( tree )
		{
			let json = this.makeDebugTree( tree )
			console.log( JSON.stringify(json, null, 2))
			// if( this.pasted_trees )
			// {
			// 	console.log( "Paste In Bracket:")
			// 	console.log( this.pasted_trees )
			// }

		},

	addUniqueArray: function ( arr, item )
		{
			if( !arr.includes( item ) )
			{
				arr.push( item )
			}

			return arr
		},
	removeUniqueArray: function ( arr, item )
		{
			let index = arr.indexOf( item )
			if( index > -1 )
			{
				arr.splice( index, 1)
			}
			return arr
		},
	getShowArrowList:function(start_elem_id = false, arrow_type=false)
		{
			let start_doc
			if( start_elem_id )
			{
				start_doc = document.getElementById( start_elem_id )
			}
			else
			{
				start_doc = document
			}

			let child_nodes = start_doc.getElementsByClassName('show_arrow')
			let show_arrow_list = []
			for( let node of child_nodes )
			{	
				let check_arrow = true
				if( arrow_type )
				{
					check_arrow = node.getElementsByClassName( arrow_type )
				}
				
				if( check_arrow )
				{
					let tree_name = node.getAttribute('id')
					if( tree_name )
					{
						show_arrow_list.push( tree_name )
					}
				}
			}

			return show_arrow_list
		},
	addBracket: function( show_arrow_list )
	{

		// check if:
		// 1. same parent
		// 2. side by side

		let first_item = show_arrow_list[0]
		let {parent_name, item_name}  = this.splitName(first_item) 
		let type = item_name.split("_")[0] 
		
		let tree_list = this.getTreeByName( parent_name ).tree.list
		// console.log('tree_list:')
		// console.log( tree_list )
		let isSameParent = true
		let index_list = []
		// console.log( 'show_arrow_list:' )
		// console.log( show_arrow_list )
		for( let [ index, child_full_name ] of show_arrow_list.entries())
		{
			let name_pairs = this.splitName( child_full_name )
			let child_parent_name = name_pairs.parent_name
			let item_name = name_pairs.item_name

			if( child_parent_name != parent_name )
			{
				isSameParent = false
			}
			else
			{
				if( tree_list.indexOf(item_name) == -1)
				{
					console.log('addBracket Error, negative index:')
					console.log( 'parent_name:'  + parent_name + 
					', item_name: ' + item_name )
				}
				index_list.push( tree_list.indexOf(item_name) )
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
						arrow_type: 'top_bx'
						// show_arrow: true
					}
					
					this.addChild('bx',  
					box_props, insert_position).getChild( insert_position ) //get the inserted box
			
					//this.show_arrow[ this.tree.name ] = true
					//add positive sign, if not at front position
					if( insert_position != 0 )
					{
						let plus_elem_props = {
							text:'+',
							selected: true,
							arrow_type: 'top_i',
							show_arrow:false
						}
						
						this.addChild('i', 
						plus_elem_props, false_position)
					}

					let bracket_props = {
						type: 'bracket',
						check_equation_sign:true, 
						arrow_type:'top_i',
						selected: true,
						show_arrow: true
					}
					
					this.addChild('br', 
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
						arrow_type: 'top_i'
					}
					
					this.addChild('br', 
					bracket_props, insert_position ).getChild( insert_position ) //get the inserted bracket
					
					//this.show_arrow[ this.tree.name ] = true
					
					let box_props = {
						type: 'box',
						selected: true,
						arrow_type: 'top_bx',
						show_arrow: true
					}

					this.addChild('bx', 
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
	showArrow:function()
	{	
		this.tree.props.show_arrow = true
		return this
	},
	hideArrow:function()
	{
		this.tree.props.show_arrow = false
		return this
	},

	removeBracket:function( show_arrow_list )
	{
		//must all have bracket type
		let full_name = show_arrow_list[0]
		// Three cases:
		
		// 1. a[(b)]c --> bracket selected
		//	@ (...)-[br_1]-bx_1- { i_1, i_2, ... }

		// 2. a [+ (-b + c)] --> box selected
		//	@ (...)-[bx_1]-i_1{ text: + }
		//	@ (...)-[bx_1]-br_1-{ bx_1, bx_2, ... }

		// 3. [(a+b)]+c
		//	@ (...)-[bx_1]-i_1{ text: "" } or is undefined
		//	@ (...)-[bx_1]-br_1-{ bx_1, bx_2, ... }
		let { parent_name, item_name } = this.splitName( full_name )

		let type = item_name.split("_")[0]
		  
		if( type == 'br' )
		{
			// Case 1:

			// (...)-[br_1]-bx_1-i_1
			// bracket selected
			// if single Item, a[(bc)]c, can cut
			// if multi Box, a[(b+c)]d, cannot cut
			
			if(this.getTreeByName( full_name ).tree.list.length == 1)
			{
				//(...bx_1)-[br_1]-bx_1-{i_1, i_2 ...}
				
				let item_length = this.getChild(0).tree.list.length
				for( let i = 0; i < item_length; i ++ )
				{	
					let child_name = this.tree.list[0]
					let child_tree = this.tree[child_name]
					child_tree.props.show_arrow = true
					this.cutChildTree(0)
					//each cut changes tree.list
					//Dynamic cutting
				}

				//parent
				this.getTreeByName( parent_name ) // pointer @ (...bx_1)

				let position = this.tree.list.indexOf( item_name )
				this.removeChildDeep( position, this.tree )

				for( let i = 0; i < item_length; i ++ )
				{
					this.pasteIntoParent( position + i)
				}

				return true				
			}
			else
			{
				return "bracket_has_sibling"
			}
		}
		else if( type == 'bx')
		{
			//start:
			//@ (...)-[bx_1]-{i_1, br_1}  note 2 end branch
			//check if contains bracket in tree list
			
			let tree_list = this.getTreeByName( full_name ).tree.list
			let hasBracket = false
			if( tree_list.length <= 2 )
			{
				for( let item of tree_list )
				{
					if(item.search('br') > -1)
					{
						hasBracket = true
						break
					}
				}
			}

			if( !hasBracket ) return "no_bracket_found"
			// Case 1:
			//@ (...)-[bx_1]-i_1 {..text?..}
			let item_text = this.getChild(0).tree.props.text
			//@ (...)-bx_1-[i_1{...text...}]]
			
			let item_length
			if( item_text == '+' || item_text == '-' )
			{

				// Case 2:

				// a [-/+(b+c)]
				// or
				// [-/+(a + b)] + c

				// @ (...)-bx_1-br_1-[i_1{...text...}]]
				// 0: (...)-[bx_1]-i_1 => sign
				// 1: (...)-[bx_1]-br_1
				// if sign -, must change sign
				
				this.getParent(1).getChild(1) 
				//@ (...)-bx_1(getParent(1))-[br_1(getChild(1))]

				item_length = this.tree.list.length

				if( item_text == '-')
				{
					//@ (...)-bx_1-[br_1]
					for( let i = 0; i < item_length; i ++ )
					{	
						let child_name = this.tree.list[0]
						let child_tree = this.tree[child_name]
						child_tree.props.show_arrow = true
						this.changeSign( child_tree )				
						this.cutChildTree(0)
						//each cut changes tree.list
						//Dynamic cutting
					}
				}
				else if( item_text == '+')
				{

					//add + sign for first elem
					let first_child_tree = this.tree[this.tree.list[0]]
					this.addPlusSign( first_child_tree )

					//@ (...)-bx_1-[br_1]
					for( let i = 0; i < item_length; i ++ )
					{	
						let child_name = this.tree.list[0]
						let child_tree = this.tree[child_name]
						child_tree.props.show_arrow = true				
						this.cutChildTree(0)
						//each cut changes tree.list
						//Dynamic cutting
					}
				}
			}
			else 
			{
				// Case 3:
				// item_text = "" or undefined
				// [(a+b)] - c 
				
				//Two possible subbranches:
				//Sub 1 @ (...)-bx_1-[i_1{...text...}]]
				//Sub 2 @ (...)-bx_1-[br_1{...undefined..}]

				let item_type = this.tree.props.type 
				if( item_type != 'bracket')
				{
					// Sub 1 @ (...)-bx_1-[i_1{...text...}]]
					// move to sibling bracket
					this.getParent(1).getChild(1) 
					// @ (...)-bx_1-[br_1{...undefined..}]
				}	
				
				item_length = this.tree.list.length
				// let first_child_tree = this.tree[this.tree.list[0]]
				// this.addPlusSign( first_child_tree )

				for( let i = 0; i < item_length; i ++ )
				{	
					let child_name = this.tree.list[0]
					let child_tree = this.tree[child_name]
					child_tree.props.show_arrow = true
					this.cutChildTree(0)
					//each cut changes tree.list
					//Dynamic cutting
				}
			}
			
			//@ (...)-bx_1-[br_1]
			
			this.getTreeByName( parent_name ) // pointer @ (...)

			let position = this.tree.list.indexOf( item_name )

			//WARNING: Paste first then remove to avoid
			//bug of not rerendering (...)-bx_1 by parent component
			//causing the dict[(...)-bx_1] to not have tree_node and dom_node
			for( let i = 0; i < item_length; i ++ )
			{
				this.pasteIntoParent( position + i)
			}
			
			this.removeChildDeep( position + item_length, this.tree )
			// console.log( this.tree)
			this.pasted_tree_names = []
			return true
		}	
	},
	changeBracketSign:function( show_arrow_list )
	{
		let full_name = show_arrow_list[0]
		let { parent_name, item_name } = this.splitName( full_name )

		let type = item_name.split("_")[0]

		if( type == 'br')
		{
			//item bracket selected
			//skip
			return false
		}
		else if( type == 'bx')
		{
			//check first elem sign
			
			let tree_list = this.getTreeByName( full_name ).tree.list
			
			let hasBracket = false
			for( let item of tree_list )
			{
				if(item.search('br') > -1)
				{
					hasBracket = true
					break
				}
			}
			
			if( !hasBracket )
			{
				return "no_bracket_found"
			}

			let index = this.getParent(1).tree.list.indexOf( item_name )
			this.getChild(item_name)

			let item_text = this.getChild(0).tree.props.text

			if( item_text == '+' || item_text == '-' )
			{	
				let new_sign 
				if(item_text == "-")
				{
					if( index == 0)
					{
						new_sign = ""
					}
					else
					{
						new_sign = "+"
					}					
				}
				else 
				{
					new_sign = "-"
				}
				
				this.tree.props.text = new_sign
				this.getParent(1).getChild(1)
				//pointer @ bracket
			}
			else
			{
				if( item_text === "")
				{
					this.tree.props.text = "-"
					this.getParent(1).getChild(1)
				}
				else
				{
					this.getParent(1)
					let minus_item = {
						type:'sign',
						text:'-',
						// katex:null,
						selected: true,
						show_arrow:false
					}
					this.addChild('i', minus_item, 0)
					this.getChild(1)
				}
			}
			//pointer @ bracket
			let all_child_tree = this.getAllChildTree()
			for( let child_tree of all_child_tree)
			{
				this.changeSign( child_tree )
			}

			let first_item_text = this.getChild(0).getChild(0).tree.props.text 
			if( first_item_text == "+")
			{
				this.tree.props.text = ""
			}
			this.getTreeByName( full_name )

			return true
		}
	},
	insert_subFormula:function( new_sub_formula, e_tree )
	{
		//to keep it simple
		//3 cases:
		//1. Box:
		//   [ab] => [>_a+b] => [a][+b]
		//	 [ab] => [>_c*d] => [cd]
 		//2. Item:
		//   a[b] => a[>_b*c] => a[b][c]
		//3. Item:
		//   a[b] => a[>_b+c] => a[(b+c)]
		//4. Box Bracket: => auto propagate to box
		//   [(a+b)] Treat like Box case
		//5. Item Bracket:
		//   a[(c+d)] Treat like Item case

		let tree_name = e_tree.name

		if( tree_name.search("i") > -1 || tree_name.search("br") > -1)
		{
			//item bracketing interchangable bug
			this.parse_xTree( new_sub_formula, this.root )
			//@root
			//go to -f_?-eq_1
			
			let sf_tree = this.getLastChild().getChild(0).tree

			if( sf_tree.list.length == 1)
			{

				//only items inside
				//2. Item:
				//   a[b] => a[>_b*c] => a[b][c]
				
				//reset sf_Tree
				sf_tree = sf_tree[ sf_tree.list[0]]	
				let parent_tree = e_tree.parentNode
				this.tree = parent_tree 
				let parent_full_name = parent_tree.full_name
				let index = this.tree.list.indexOf( e_tree.name )
				for(let i = 0; i < sf_tree.list.length; i++)
				{
					let sf_child_tree = sf_tree[ sf_tree.list[i] ]
					this.pasteChildTree({
						cut_tree: sf_child_tree, 
						paste_tree: parent_tree,
						paste_index: index + i + 1, 
						new_props: {show_arrow:false} 
					}) 
					// default is if parent no show arrow, show arrow true
					// TODO: need refactor to make it easier to rmb
				}

				this.removeChildShallow( index )

				this.tree = this.root
				this.removeChildShallow( this.root.list.length - 1 )

				parent_tree.updateProps()
			}
			else
			{
				//add bracket
				//3. Item:
				//   a[b] => a[>_b+c] => a[(b+c)]
				let parent_tree = e_tree.parentNode
				this.tree = parent_tree
				let index = this.tree.list.indexOf( e_tree.name )

				let bracket_props = {
						type: 'bracket',
						check_equation_sign:true,
						selected: false,
						show_arrow: false
					}

				this.addChild('br', bracket_props, index + 1)
				let paste_tree = this.getLastChild().tree
				let parent_full_name = paste_tree.full_name 
				for(let i = 0; i < sf_tree.list.length; i++)
				{
					let sf_child_tree = sf_tree[ sf_tree.list[i] ]
					this.pasteChildTree({
						cut_tree: sf_child_tree,
						paste_tree: paste_tree,
						paste_index: i, 
						new_props: {show_arrow:false} 
					}) 
					// default is if parent no show arrow, show arrow true
					// TODO: need refactor to make it easier to rmb
				}

				this.tree = parent_tree
				this.removeChildShallow( index )

				//remove f_n 
				this.tree = this.root
				this.removeChildShallow( this.root.list.length - 1 )
				
				parent_tree.updateProps()
			}
			
		}
		else if( tree_name.search("bx") > -1 )
		{
			//easier due to no need to check the need to add bracket
			
			let first_item = e_tree[e_tree.list[0]]
			let first_type = first_item.props.type 
			if( first_type == 'sign')
			{
				if( new_sub_formula[0] != '-' && new_sub_formula[0] != '+')
				{
					new_sub_formula = '+' + new_sub_formula
				}
			}
			
			let parent_tree = e_tree.parentNode
			
			this.tree = parent_tree

			let old_list = [...parent_tree.list]
			this.parse_eq( new_sub_formula )
			
			//rearrange item names
			let new_list = parent_tree.list

			let new_list_length = new_list.length
			let old_list_length = old_list.length
			let num_new_item = new_list_length - old_list_length

			let index = parent_tree.list.indexOf( e_tree.name )
			for( let i = 0; i < num_new_item; i++ )
			{
				let new_item = new_list[ old_list_length + i ]
				old_list.splice(index + i + 1, 0, new_item)
			}
			
			parent_tree.list = old_list
			
			this.removeChildShallow( index )
			parent_tree.updateProps()
		}

	},
	addSymbolToEquation:function()
	{
		let main_tree = op.getTreeByName('f_1-eq_1').tree
		let box_props = { 
			isEditable:true,
			sub_formula:'?',
			selected:true,
			show_arrow: true,
			arrow_type:'top_grey'
		}
		
		op.addChild('bx',  box_props , 0 )
		op.getChild(0)
		op.addChild('i', { text:'?', selected:true, show_arrow: false}, 0)
		main_tree.props.check_equation_sign = true
		main_tree.updateProps()

		return this
	},
	debugPrint:function(input)
	{
		let debug_txt = ''
		for( let key in input )
		{
			debug_txt = debug_txt + `${key}: ${input[key]}, `
		}
		console.log( debug_txt )
	}

}