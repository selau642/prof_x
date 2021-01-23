import { op } from "../actions/xTree.js"

// () start
// [] end position
// elements between start(not included) 
// and end will be added to tree

// e.g: (bx)-[i]-sign-text
// bx (start) -> add i, add sign, add text token
// travel back to i [end]
export let p = {
    path_dict: {},
    run: function ( path, token=false ) 
    {
        // find path from dictionary
        // if not found make it
        if( !this.path_dict[ path ]) 
        {
            this.make( path )            
        }
        let loop_obj = { token }
        this.path_dict[ path ].apply( this, [ loop_obj ] )        
    },
    parse: function ( path )
    {
        this.make( path )
        return this.path_dict[ path ]
    },
    make: function( path ) 
    {
        let arr_path = path.split('-')
    
        let count = 0
        let arr_elem = []
    
        let start 
        let end
        for( let elem of arr_path )
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
    
        this.path_dict[ path ] =  ( loop_obj ) => { 
          //start, end, arr_elem
          let { token } = loop_obj
          let max_length = arr_elem.length
          let op_elem = 0 //operator_element
          for( let i = start + 1; i < max_length ; i++)
          {
            let elem_name = arr_elem[i]
            if( elem_name == 'text')
            {
              op.addText( token, { sub_formula: token } )
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
    }
}