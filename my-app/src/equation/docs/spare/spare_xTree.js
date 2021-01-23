export let parse_xTree = function _parse_xTree(formula, root)
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
		op.growNewTree()
	}
	//at root position
	op.addChild( 'f', 'formula')
	op.getChild(0)
	//at f_ position

	let arr_eq = formula.split("=")
	let katex_eq = '' //katex equation

	for( let eq of arr_eq )
	{

		//reference f_ position
		op.addChild('eq', 'equation').getLastChild()

		katex_eq = katex.__parse( eq )		
		parse_eq(katex_eq, op) //auto return to eq_ point

		op.getParent( 1 )
		//return to 'f' position, to continue adding child
	}
	op.getTreeByName('root')

	
	return op.tree
}

//TODO:
//need example output from Katex and how it parses into xTree
//1. example for eq => box => item hierachy
const parse_eq = function _parse_eq( katex_eq, op )
{
	//bx_1 = box
	//br_1 = bracket
	//i_1 = symbol / bin / coeff
	
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

	let bracket_count = 0
	let bracket_eq = []
	
	let eq_return_tree = op.tree 
	//set return position

	op.addChild('bx', 'box').getLastChild()
	//enter box position 
	
	for(let katex_item of katex_eq)
	{
		if(bracket_count != 0 || katex_item.text == "(")
		{
			if(katex_item.text == "(")
			{
				bracket_count ++		
			}
			else if (katex_item.text == ")")
			{
				bracket_count --
			}

			if(bracket_count != 0)
			{	
				if( bracket_count == 1 && katex_item.text == "(")
				{
					//skip first bracket
				}
				else
				{
					bracket_eq.push(katex_item)
				}				
			}
			
			if( bracket_eq.length > 0 && bracket_count == 0)
			{
				
				let bracket_props = { 
					type: 'bracket', 
					selected: false,
					show_arrow:false
					}
				
				
				op.addChild("br", "bracket", bracket_props ).getLastChild()

				_parse_eq( bracket_eq, op)
				//parse inner bracket

				op.getParent(1)

				bracket_eq = []
			}
		}		
		else if( bracket_eq.length == 0 && bracket_count == 0)
		{
			//make box name

			if(katex_item.type == 'mathord' )
			{
				let item_props = {
					type:'symbol',
					text:katex_item.text,
					//katex:katex_item,
					selected: false,
					show_arrow:false
				}

				op.addChild('i', 'symbol', item_props)

			}
			else if(katex_item.type == 'textord')
			{
				let item_props = {
					type:'coeff',
					text:katex_item.text,
					//katex:katex_item,
					selected: false,
					show_arrow:false
				}

				op.addChild('i', 'coeff', item_props)
			}
			else if(katex_item.type == 'atom') //+ or - signs etc...use to separate boxes
			{

				if(op.tree.list.length != 0)
				{	
					//move up parent equation, and add new box
					op.tree = eq_return_tree
					let box_props = {
						type: 'box',
						selected: false,
						show_arrow:false
					}

					op.addChild('bx', 'box', box_props).getLastChild()
					//move into box
				}
				
				if(katex_item.family == 'bin')
				{

					let item_props = {
						type:'bin',
						text:katex_item.text,
						//katex:katex_item,
						selected: false,
						show_arrow:false
					}
					
					op.addChild('i', 'bin', item_props)
				}
			}
		}
	}

	op.tree = eq_return_tree
	return op
}


// parse_eq main loop component
let bracket_count = 0
let bracket_eq = []

for(let katex_item of katex_eq)
		{
			if(bracket_count != 0 || katex_item.text == "(")
			{
				if(katex_item.text == "(")
				{
					bracket_count ++		
				}
				else if (katex_item.text == ")")
				{
					bracket_count --
				}
	
				if(bracket_count != 0)
				{	
					if( bracket_count == 1 && katex_item.text == "(")
					{
						//skip first bracket
					}
					else
					{
						bracket_eq.push(katex_item)
					}				
				}
				
				if( bracket_eq.length > 0 && bracket_count == 0)
				{
					
					let bracket_props = { 
						type: 'bracket', 
						selected: false,
						show_arrow:false
						}
					
					
					this.addChild("br", "bracket", bracket_props ).getLastChild()
					prev_elem = 'bracket'
					this.parse_eq( bracket_eq, op)
					//parse inner bracket
	
					this.getParent(1)
	
					bracket_eq = []
				}
			}		
			else if( bracket_eq.length == 0 && bracket_count == 0)
			{
				//make box name
	
				if(katex_item.type == 'mathord' )
				{
					let item_props = {
						type:'symbol',
						text:katex_item.text,
						//katex:katex_item,
						selected: false,
						show_arrow:false
					}
					
					this.addChild('i', 'symbol', item_props)
					prev_elem = 'symbol'
				}
				else if(katex_item.type == 'textord')
				{
					if( prev_elem == 'coeff')
					{

						let prev_text = this.getLastChild().tree.props.text
						
						prev_text =  prev_text +  katex_item.text
						this.tree.props.text = prev_text
						this.getParent(1)  
					}
					else
					{
						let item_props = {
							type:'coeff',
							text:katex_item.text,
							//katex:katex_item,
							selected: false,
							show_arrow:false
						}
		
						this.addChild('i', 'coeff', item_props)
						prev_elem = 'coeff'
					}
				}
				else if(katex_item.type == 'atom') //+ or - signs etc...use to separate boxes
				{
	
					if(this.tree.list.length != 0)
					{	
						//move up parent equation, and add new box
						this.tree = eq_return_tree
						let box_props = {
							type: 'box',
							selected: false,
							show_arrow:false
						}
	
						this.addChild('bx', 'box', box_props).getLastChild()
						prev_elem = 'box'
						//move into box
					}
					
					if(katex_item.family == 'bin')
					{
	
						let item_props = {
							type:'bin',
							text:katex_item.text,
							//katex:katex_item,
							selected: false,
							show_arrow:false
						}
						
						this.addChild('i', 'bin', item_props)
						prev_elem = 'bin'
					}
				}
			}
		}
