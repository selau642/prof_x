export let dt = {
    var:{},
    root: false,
    branch_list:[], // [{name:, tree:, state:}], tree refers too root_tree
    var_map:{},  // var_name:{ read: {fn_name: [line ]} }
    make: function ( fn_obj ) 
    {
      let { name, slot, fn } = fn_obj
      this[name] = fn_obj.fn( slot )
      this.makeBranch( fn_obj )
    },
    runRoot:function()
    {
      let root_name = this.root.name
      this.goto([root_name])

    },
    goto: function( slot_array )
    {
      slot_array.forEach( fn => {
        if( typeof(fn) == 'string')
        {
          let this_fn = this[fn]
          if( this_fn )
          {
            this_fn()
          }
        }
        else if( typeof(fn) == 'object' )
        {
          let name = fn.name
          let this_fn = this[name]
          if( this_fn )
          {
            this_fn()
          }
        }
      })
    },
    makeBranch: function( fn_obj )
    {
      //  root = {
      //   deselect_up:{
      //      is_select:{
      //        list: ['loop'],
      //        loop: { }
      //      },
      //      not_select: {
      //        list: ['top'],
      //        top: { }
      //      }
      //   }
      // }

      let { name, description, slot, fn } = fn_obj

      let var_obj = this.getVar({
                  fn_string: fn.toString()
                })
      
      let write_obj = var_obj.write
      for(let var_name in write_obj )
      {
        let line_list = write_obj[ var_name ]
        if( !this.var_map[ var_name ] )
        {
          this.var_map[var_name] = { write:{}, read:{} }
        }

        this.var_map[var_name]['write'][ name ] = line_list 
      }

      let read_obj = var_obj.read
      for( let var_name in read_obj )
      {
        // {var_name: [line]} => var_name: { fn_name: , line: []}
        let line_list = read_obj[ var_name ]
        if( !this.var_map[ var_name ] )
        {
          this.var_map[var_name] = { write:{}, read:{} }
        }

        this.var_map[var_name]['read'][ name ] = line_list 
      }

      // name = deselect_up
      // slot = { next: [ 'climbTree' ]}

      let branch_list = this.branch_list
      if( !this.root )
      {

        let branch = {}
        branch[ name ] = {}
        branch[ name ]['var'] = var_obj
        for( let slot_name in slot )
        {
          
          //slot_name = next
          branch[ name ][ slot_name ] = {}
          if( slot_name != 'stop')
          {
            let next_branch_list = slot[ slot_name ]
            branch[ name ][ slot_name ]['list'] = next_branch_list
           
            // branch = { 
            //   deselect: { 
            //       next: { 
            //         list:['hola']
            //       }
            //     }
            //   }

            for( let branch_name of next_branch_list )
            {
              // branch[name][ slot_name ][ branch_name ] = {}
              
              // branch = { 
              //   deselect: { 
              //      next: { 
              //       list:['hola'],
              //       hola: false,            
              //      }
              //   }
              // }

              if( typeof(branch_name) == 'string')
              {
                branch_list.push({
                    name: branch_name,
                    tree: branch[name][ slot_name ],
                    isFilled: false
                })
              }
              else if( typeof(branch_name) == 'object')
              {
                if( branch_name.name )
                {
                  let name = branch_name
                  branch_list.push({
                    name: name,
                    tree: branch[name][ slot_name ],
                    isFilled: false
                  })
                }
              }
            }
          }
        }
        this.root = branch
      }
      else // this.root is set
      {
        //append branch to root
        let elem = branch_list.find( elem => elem.name == name )
        // elem = { name:, tree:, isFilled: }
        if( elem )
        {
          elem.isFilled = true
          

              // branch = { 
              //   deselect: { 
              //      next: { 
              //       list:['hola'],
        // ==>//       hola: elem_tree,            
              //      }
              //   }
              // }

          let branch = {}    
          branch[ name ] = {}
          if( slot )
          {
            for( let slot_name in slot )
            {
              //slot_name = next

              branch[ name ][ slot_name ] = {}
              
              let next_branch_list = slot[ slot_name ]
              branch[ name ][ slot_name ]['list'] = next_branch_list
              // branch = { 
              //   hola: { 
              //       next: { 
              //         list:['hola']
              //       }
              //     }
              //   }


              
              let count = 0
              for( let branch_name of next_branch_list )
              {
                // branch[ name ][ slot_name ][ branch_name ] = {}
                if( typeof( branch_name) == 'string')
                {
                  branch_list.push({
                        name: branch_name,
                        tree: branch[ name ][ slot_name ],
                        isFilled: false
                    })
                }
                else if( typeof( branch_name ) == 'object')
                {
                  let new_branch_name = branch_name.name
                  
                  if( new_branch_name )
                  {
                    branch_list.push({
                      name: new_branch_name,
                      tree: branch[ name ][ slot_name ],
                      isFilled: false
                    })
                  }
                }
                // if( description 
                //   && description[ slot_name ] )
                // {
                //   branch[ name ][ slot_name ] ['description'] = description[ slot_name ][count]
                // }
                count ++
              }
            }
          }

          elem.tree[ name ] = branch[ name ]
        }
        else
        {
          console.log( 'block not found: ', name )
        }
      }
     
    },
    printTree: function()
    {
      
      let branch = this.root 
      
      // root = {
      //   "deselect_up": {
      //     "next": {
      //       "list": [
      //         "climbTree"
      //       ],
      //       "climbTree": {
      //         "next": {

      console.log( 'Root:' )
      //first item 

      
      for( let branch_name in branch )
      {       
        let slot_obj = branch[ branch_name ]
        console.log( " " + branch_name + ":")
        for( let slot_name in slot_obj )
        {
          if( slot_name != 'stop' )
          {
            this.printSlot( slot_obj )
          }
        }
      }
    },
    printSlot: function( slot_obj, space=" ", layer=1 )
    {
      //     "next": {
      //       "list": [
      //         "climbTree"
      //       ],
      //       "climbTree": {
      //         "next": {
      for( let slot_name in slot_obj )
      {
        if( slot_name != 'stop')
        {
          let slot_list = slot_obj[ slot_name ].list

          if( slot_name != 'loop' && slot_name != 'next')
          {
            console.log( space + slot_name + ":" )
          }
          
          for( let method of slot_list )
          {
            if( typeof(method) == 'string')
            {
              let next_space = space + "   "
              let next_slot_obj = slot_obj[ slot_name ][ method ]
              console.log( next_space + layer + ". " + method )
              this.printSlot( next_slot_obj, next_space, layer+1 )
            }
            else if( typeof(method) == 'object')
            {
              let next_space = space + "   "

              for( let key in method )
              {
                if( key != 'name')
                {
                  console.log( `${next_space}key: ${method[key]}`)
                }
              }
              
              let obj_method = method.name
              if( obj_method )
              {
                let next_slot_obj = slot_obj[ slot_name ][ obj_method ]
                console.log( next_space + layer + ". " + obj_method )
                this.printSlot( next_slot_obj, next_space, layer + 1 )
              }
            }
          }
        }
        else
        {
          let slot_list = slot_obj[ slot_name ].list
          let next_space = space + "   "
          let last_action = slot_list[0].action
          console.log( next_space + "stop: " + last_action)
        }
      }
    },
    getVar: function( input )
    {
      let { fn_name, fn_string } = input 
      if( !fn_string && fn_name )
      {
        let fn = this[fn_name]
        if( !fn )
        {
          console.log(`Function ${fn_name} is not found. Please make using dt.make({input})`)
          return
        }
      
        fn_string = fn.toString()     
      }
      else if( !fn_string && !fn_name )
      {
        console.log( `printVar: Error: Insufficient inputs. 
        Please provide fn_string or fn_name as inputs.`)

        return
      }

      let arr_line = fn_string.split(/\r\n/g)
      let write_obj = {}
      let read_obj = {}
      for( let [index, line] of arr_line.entries() )
      {
        line = line.trim().split('//')[0]
        
        let write_regex = /this.var\[['|"](.*)['|"]\]\s*=/gm
        let write_var = write_regex.exec( line )
            
        if( write_var )
        {
          //[ 'this.var ...', (group_match)]
          if( !write_obj[write_var[1]] )
          {
            write_obj[write_var[1] ]= [ index ]
          }
          else
          {
            write_obj[write_var[1]].push( index )
          }
        }
        
        let read_bracket_regex = /(.*)\}\s*=\s*this.var/gm
        let read_bracket_var = read_bracket_regex.exec( line )

        if( read_bracket_var )
        {
          let front_bracket_regex = /\{(.*)\}/g
          let front_bracket_var = front_bracket_regex.exec( read_bracket_var[0] )
          if( front_bracket_var )
          {
             let arr_var = front_bracket_var[1].split(',')
             for( let item of arr_var )
             {
                item = item.trim()
                 if( !read_obj[item] )
                 {
                    read_obj[item] = [index]
                 }
                 else
                 {
                   read_obj[item].push( index )
                 }
             }
          }
          else
          {
            //parse half line
            let arr_var = read_bracket_var[1].split(",")
            for( let item of arr_var )
             {
                item = item.trim()
                

                if( !read_obj[item] )
                {
                    read_obj[item] = [index]
                 }
                 else
                 {
                   read_obj[item].push( index )
                 }
             }
            
             //go up one line
            this.findOpenBracket( arr_line, index-1, read_obj )
          }
        }
        else //!read_bracket_var
        {
          let read_regex = /=\s*this.var\[['|"](.*)['|"]\]/gm
          let read_var = read_regex.exec( line )
  
          if( read_var ){
            //[ 'this.var ...', (group_match)]
            if( !read_obj[read_var[1]] )
            {
              read_obj[read_var[1]] = [ index ]
            }
            else
            {
              read_obj[read_var[1]].push(index)
            }
          }
        }

      }
      
      // console.log(JSON.stringify({
      //   write_var: write_obj,
      //   read_var: read_obj
      // }))
      return { write: write_obj, read: read_obj }
    },
    findOpenBracket: function( arr_line, index, read_obj )
    {
      let found_first_bracket = false
      for( let i = index; i > 0; i--)
      { 

        let first_bracket_regex = /\{(.*)/g
        let first_bracket_var = first_bracket_regex.exec(arr_line[i])
        if( first_bracket_var )
        {
          found_first_bracket = true
           //parse and break loop
          let arr_item = first_bracket_var[1].split(",")
          for( let item of arr_item)
          {  

            item = item.trim()
            if( item === "") continue
            if( !read_obj[item] )
            {
                read_obj[item] = [i]
            }
            else
            {
              read_obj[item].push( i )
            }
          }

           break
        }
        else
        {
          let arr_item = arr_line[i].split(',')
          for( let item of arr_item)
          {  
            item = item.trim()
            if( item === "") continue
            if( !read_obj[item] )
            {
                read_obj[item] = [i]
            }
            else
            {
              read_obj[item].push( i )
            }
          }
        }
      }

      if( !found_first_bracket ) console.log("Open bracket { for this.var, not found.")
    }
  }