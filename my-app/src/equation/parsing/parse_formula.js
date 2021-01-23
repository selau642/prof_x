
// structure 
// 1. eq-bx-( sign | i )-( sign | sym | num | br | fr )
// 2. fr-( top | bot )-bx-i-br
// 3. ( top | bot | br )==eq

// structure 2
// 1. eq-bx-(i|fr)
// 2. fr-( top | bot )-(i|br)
// 3. br == eq
// 4. (top | bot) == bx

// parent tree modes
// 1. (eq|br):-bx +|-
//      Terminate by )
// 2. bx:-i for *
//      Terminate by ), +|-
// 3. fr-bot:-bx-i for /
//      Terminate by arr_br & +|-

import { op } from "../actions/xTree.js"
import { p } from './path.js'
//pattern match rendering
// (start) - make elements in middle - 
// [end]
// sign : (bx)-(i)-sign-[text]
// start at bx make i and sign and append text
// if start at i only make sign and append text

// (bx)-(i) for (i):-a or (bx):a case
// <optional>

import { sign } from './sign.js'
import { sym, num } from './sym_n_num.js'
import { divide, multiply } from './divide.js'
import { open_br, close_br } from './br.js'
function setup_parser()
{
  f.addElem( [ sign, sym, num,
    divide, multiply, 
    open_br, close_br ] )

}

export let f = { //formula
  root: undefined,
  token_dict: {},
  /** @param {Array} arr_elem_obj elem_obj = sign.js, ...,divide.js */
  addElem: function( arr_elem_obj )
  {
    for( let elem_obj of arr_elem_obj )
    {
      let { from ,
      name, //regex 
      } = elem_obj

      for( let elem_name in from )
      {
        let untyped = from[ elem_name ]
        if( typeof( untyped ) == 'string' )
        {        
          from[ elem_name ] = p.parse( untyped )
        }
      //   else if( Array.isArray( untyped ) )
      //   {
      //     let new_arr = [ ...untyped ]
      //     for( let i = 0; i < new_arr.length; i++ )
      //     {
      //       let untyped_elem = new_arr[i]
      //       if( typeof( untyped_elem ) == 'string' )
      //       {
      //         let fn_path = this.makeFnFromPath( untyped_elem )
      //         untyped.splice(i, 1, fn_path)
      //       }
      //     }

      //     from[ elem_name ] = untyped
      //   }
      }

      this.token_dict[ name ] = elem_obj
    }
  },
  parseFormula:function ( formula )
  {
    // when adding new formula,
    // addChild(f) increments f_1, f_2, f_3
    // to allow svelte auto rerendering of new formula
    
    // if( !this.root )
		// {

			this.root = {
				name: "root",
				list: []
			}
		// }
		
    op.setTree( this.root )
      .addChild( 'f' )
    
    let f_tree = op.getLastChild().tree
		//at f_ position

		let arr_eq = formula.split("=")
		// let katex_eq = '' //katex equation
	
		for( let eq of arr_eq )
		{	
			//reference f_ position
			let eq_tree = op.addChild('eq').getLastChild().tree

			this.parseEquation( eq_tree, eq ) //auto return to eq_ point
	
			op.setTree( f_tree )
			//return to 'f' position, to continue adding child
		}

		// op.getTreeByName('root')
	
		return this.root  // return Root tree
  },
  /** @param {Object} eq_tree eq_tree obj  */
  /** @param {String} eq_str the string 'a+b/d' to parse */
  parseEquation: function( eq_tree, eq_str ) 
  {
    let { token_dict } = this
    // { 
    //   name'f_1-eq_1',
    //   list:['bx_1'],
    //   bx_1: {
    // 	  name: 'f_1-eq_1-bx_1'
    // 	  list:['i_1', 'i_2'],
    // 	  i_1: false,
    // 	  i_2: false
    //  }
    // }

    op.setTree( eq_tree ) 

    let test_eq = eq_str.replace(/\s/g, '')
    if( test_eq[0] === '0' && test_eq.length == 1)
    {			
      return this
    }

    let loop_obj = {
      prev_elem: 'eq',
      arr_bracket: []
      // for multi bottom bracket case
      // 1/(a+b/(c+d))
      // if hit isDivide will add one element to arr_bracket
      // [2, 1, 0] 
      // 3 dividers ( arr_bracket.length )
      // first = 2 bracket open
      // second = 1 bracket open
      // third = 0 bracket open, means they have been closed
    }

    for(let i = 0; i < eq_str.length ; i ++ )
    {
      let token = eq_str[i]
      loop_obj.token = token 
      for( let key in token_dict )
      {
        let elem = token_dict[key] // key='sign'
        
        // elem = '{ 
        //  regex: /+|-/,  
        //  eq: (...), 
        //  num: (...) 
        // }'
        // if( token == ')')
        // {
        //   console.log( token )
        // }

        if( elem.regex.test( token ) )
        {
          if( elem.fn_before ) elem.fn_before.apply( this, [ loop_obj ])
          
          let fn_list = elem.from[ loop_obj.prev_elem ]
          // prev_elem = 'num'
          // fn_list = '[bx]-i-num-text' or [check_etc..]
          if( fn_list )
          {
            if( Array.isArray(fn_list) )
            {
              for( let fn of fn_list )
              {
                let result = fn.apply( this, [ loop_obj ] )
                if( result && result.end_loop ) break
              }
            }
            else if( typeof(fn_list) == 'function')
            {
               let fn = fn_list
               // '(eq)-bx-[i]-sign-text' 
               // converted to function
               fn.apply( this, [ loop_obj ] )              
               
            }
            // else if( typeof(fn_list) == 'string')
            // {
            //   // '(eq)-bx-[i]-sign-text'
            //   this.makeElem( fn_list )
            // }
          }
          else if( elem.from['any'] )
          {
            let fn = elem.from['any'] // close_br
            fn.apply( this, [ loop_obj ] )
          }
        
          if( loop_obj.change_type )
          {
            loop_obj.prev_elem = loop_obj.change_type
            loop_obj.change_type = false
          }
          else
          {
            loop_obj.prev_elem = key
          }
          loop_obj.prev_token = token
        }
      }
    }
  },  
  makeFnFromPath_deprecate: function( branch_path )
  {
    let arr_branch = branch_path.split('-')
    
    let count = 0
    let arr_elem = []

    let start 
    let end
    for( let elem of arr_branch )
    {
      elem = elem.replace(' ','')
      
      if( elem[0] == '(')
      {
        elem = elem.substring( 1, elem.length-1 )
        start = count
      }
      else if( elem[0] == '[' )
      {
        elem = elem.substring( 1, elem.length-1 )
        end = count
      }

      // repeat to handle cases where ([bx]) or [(bx)] 
      // start and end same element
      if( elem[0] == '(')
      {
        elem = elem.substring( 1, elem.length-1 )
        start = count
      }
      else if( elem[0] == '[' )
      {
        elem = elem.substring( 1, elem.length-1 )
        end = count
      }
      
      arr_elem.push( elem )
      count ++
    }

    return ( loop_obj ) => { 
      //start, end, arr_elem
      let { token } = loop_obj
      let max_length = arr_elem.length
      let op_elem = 0 //operator_element
      for( let i = start + 1; i < max_length ; i++)
      {
        let elem_name = arr_elem[i]
        if( elem_name == 'text')
        {
          op.addText( token )
          op_elem += 1
        }
        else
        {
          op.addChild( elem_name ).getLastChild()    
        }
      }

      // reposition pointer
      op.getParent( max_length -1 - end - op_elem )      
    }
  },  
  
}

setup_parser()