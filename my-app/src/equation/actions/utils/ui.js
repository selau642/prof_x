import { op } from '../xTree.js'
import { tick } from 'svelte'
//reset everytime drag start
export let u = {
    // activated_tree: false,
    transfer_top: false,
    cut_tree_list:[],
    temp_pasted_tree_list:[],
    pasted_tree_list:[],
    reset:function()
    {
        this.e_tree_list = false
        this.transfer_fraction_top = false
        this.cut_tree_list = []
        this.temp_pasted_tree_list = []
        this.pasted_tree_list = []
        this.eq_tree = false
        this.bracket_removed = false
        this.last_cut_index = false
    },
   /** move  
    * @param {Array} tree_list trees from same parent*/ 
   move:function(tree_list)
   {
        return {
            left:() =>{
                // move <<==
                // [0,{1,2},3] --> [ {1,2}, 0, 3]
                // transfer 0 to new position
                let first_tree = tree_list[0]
                
                let tree_length = tree_list.length
                let p_tree = tree_list[0].parentNode
                let first_tree_index = 
                    p_tree.list.indexOf( first_tree.name )
                
                if( first_tree_index - 1 > -1 ){
                    let [ tree_name ] = p_tree.list
                            .splice( first_tree_index - 1, 1)
                    let end_index = first_tree_index + tree_length - 1 
                    p_tree.list.splice( end_index, 0, tree_name )
                }
            },
            right:() =>{
                // move <<==
                // [0,{1,2},3] --> [ 0, 3, {1,2}]
                // transfer 3 to new position
                let last_tree = tree_list[ tree_list.length - 1]

                let tree_length = tree_list.length
                let p_tree = tree_list[0].parentNode

                let last_tree_index = 
                    p_tree.list.indexOf( last_tree.name )
                
                if( last_tree_index + 1 < p_tree.list.length ){
                    let [ tree_name ] = p_tree.list
                        .splice( last_tree_index + 1, 1)
                    let start_index = last_tree_index - tree_length + 1 
                    p_tree.list.splice( start_index, 0, tree_name )
                }
            }            
        }
   }, 

   cutBox: function( tree ){
        op.cutThisTree( tree )
       return {
           paste: function (){
               return {
                   into: function( new_p_tree ){
                       return {
                           at: function( position ){
                               let paste_index
                               if( position == 'start'){
                                  paste_index = 0 
                               } else if( position == 'end'){
                                   paste_index = new_p_tree.list.length 
                               } else {
                                   paste_index = position 
                               }

                                op.pasteChildTree({
                                    paste_tree: new_p_tree, 
                                    paste_index
                                })
                           }
                       }
                   }
               }
           }
       } 
   },
   /** For item type cutting 
    *  i=["sym", "num", "br", "fr"] 
    * */ 
   cut: function( tree_list )
    {
        this.transfer_fraction_top = false
        let cut_tree_list = []
        let last_cut_index = false

        let check_sib_list = [ ...tree_list] // for checkDot

        for( let cut_tree of tree_list )
        {
            let cut_tree_type = cut_tree.type
            if( cut_tree_type == 'top' || cut_tree_type == 'bot')
            {
                // top-i
                let bx = cut_tree // bx = top || bot
                op.setTree( bx ).cutAllChildTree()

                this.removeMargin( cut_tree )

                let arr_cut = op.returnCutTree()
                for( let tree of arr_cut )
                {
                    if( tree.props.text !== undefined
                        && tree.props.text === '' )
                    {
                        continue
                    }

                    cut_tree_list.push( tree )
                }

                if( cut_tree_type == 'top' )
                {
                    this.addOne( bx )
                    cut_tree.props.selected = false
                    cut_tree.props.show_arrow = false 
                }
                else if( cut_tree_type == 'bot' )
                {
                    let fr = cut_tree.parentNode
                    this.transferFractionTop( fr )    
                    this.transfer_fraction_top = true
                }
            }
            else 
            {   
                // update fraction             
                let { current_fr: cut_fr_tree } = cut_tree.props
                let p_tree = cut_tree.parentNode
                if( cut_tree_type == 'fr' || cut_fr_tree )
                {
                    this.bubbleUp( p_tree )
                        .andForEachRun([
                            this.remove( cut_fr_tree )
                            .fromEachItem // each bubble p_tree                            
                        ])
                }

                op.cutThisTree( cut_tree )
                this.checkCutDots( cut_tree, check_sib_list )
                check_sib_list.shift()

                this.addOne( p_tree )
                let arr_cut = op.returnCutTree()
                last_cut_index = op.cut_index
                for( let tree of arr_cut )
                {
                    if( tree.props.text !== undefined
                    && tree.props.text === '' )
                    {
                        continue
                    }

                    cut_tree_list.push( tree )
                }
            }
        }
        this.cut_tree_list = cut_tree_list
        this.last_cut_index = last_cut_index
        return this
    },
    cutAllChildOf: function( dt_list )
    // TO DO: Account for Sign of Box
    {
        //Recut Box
        let { 0: dt } = dt_list 
        let { sign: dt_sign } = dt.props

        dt.props.sign = false

        op.setTree( dt ).cutAllChildTree()
        this.addOne( dt )
        let arr_cut = op.returnCutTree()
        let cut_tree_list = arr_cut
        // let cut_tree_list = []
        // for( let tree of arr_cut )
        // {
        //     if( tree.props.text !== undefined
        //     && tree.props.text === '' )
        //     {
        //         continue
        //     }

        //     cut_tree_list.push( tree )
        // }

        this.cut_tree_list = cut_tree_list 
        this.cut_tree_list_sign = dt_sign  
        if( dt.type != 'zero'){
            dt.props.show_arrow = false
            dt.updateProps()
        }
        
        return this
    },
   getCutTree: function ()
   {
       let cut_tree_list = this.cut_tree_list
       this.cut_tree_list = []
       return cut_tree_list
   },
   checkCutDots: function( cut_tree, check_sib_list )
   {
        let p_tree = cut_tree.parentNode
        let cut_tree_index = p_tree.list.indexOf( cut_tree.name )
        let next_sib_index = p_tree.list[ cut_tree_index + 1]    
        if( next_sib_index )
        {
            
            let next_sib = p_tree[ next_sib_index ]
            
            let sib_being_cut = check_sib_list.find( (item) => {
                return item.full_name == next_sib.full_name
            })

            if( !sib_being_cut )
            {
                let { type } = next_sib
                if( type == 'sym'
                || type == 'num'
                || type == 'br'
                || type == 'fr')
                {
                    next_sib.checkDot()
                }
            }
        }
   },
    /** use after cut to check parent tree and remove brackets */
    checkAndRemoveBracket( p_tree ){
        let first_i = p_tree[ p_tree.list[0] ]
        if( p_tree.list.length == 1 
        && first_i.type == 'br')
        {
            let br = first_i
            this.removeBracket( br )
        }
    },
    bubbleUp:function( p_tree )
    {
      return {
        andForEachRun:( fn_list=[] ) =>{
            // add fr_obj to props.arr_fr, props.current_fr
            // set DOM div_p.marginTop, div_border.paddingTop
                // let { 
                //   full_name: frac_tree_full_name, 
                //   offset: frac_tree_offset
                // } = new_fr_obj 

                let loop = true
                while( loop )
                {
                    //Loop Upward ParentNode
                    // console.log( p_tree.full_name )
                    let [ p_name ] = p_tree.name.split("_")
                    if( p_name == 'eq' )
                    {
                        //Terminate without further action
                        loop = false
                    }
                    else
                    {
                        for(let fn of fn_list )
                        {
                            fn(p_tree)
                        }
                                            
                        if( p_name == 'bot' 
                        || p_name == 'root'
                        || p_tree.props.isClone 
                        || !p_tree.parentNode )
                        {
                            // Terminate after action: 
                            // pull border_wrap up 
                            // or push content down
        
                            loop = false
                        }
                        else
                        {
                            // Continue looping
                            p_tree = p_tree.parentNode
                        }
                    }
                }
        //     }
        //   }
        }
      }
    },
    remove:function(frac_tree)
    {
      return {
        fromEachItem:( p_tree ) => this.remove( frac_tree )
                                .from( p_tree )
                                .andUpdateDiv(),

        from: ( p_tree ) => {
      return {
          andUpdateDiv: () =>{
            let { arr_fr=[], current_fr } = p_tree.props
            // console.log( p_tree.full_name, current_fr)
            let { full_name: fr_full_name } = frac_tree

            let { full_name: p_fr_full_name } = current_fr
            
            // console.log(  fr_full_name , '==', p_fr_full_name )
            if( fr_full_name == p_fr_full_name )
            {
                // p_tree contains fraction from cut_tree
                // need to remove and replace with
                // next highest fraction alignment

                let new_fr_tree
                let max_offset = 0

                let remove_index 
                arr_fr.forEach( ( other_fr_tree, index ) => {
                    
                    let { full_name, props } = other_fr_tree
                    let { offset_y } = props 
                    if( full_name == fr_full_name )
                    {
                        remove_index = index
                    } 
                    else if ( offset_y > max_offset )
                    {
                        max_offset = offset_y
                        new_fr_tree = other_fr_tree
                    }
                })

                // update p_tree props and div_id here:
                arr_fr.splice( remove_index, 1)
                p_tree.props.arr_fr = arr_fr
                p_tree.props.current_fr = new_fr_tree

                this.alignDivOf(p_tree)
                    .by( max_offset )
            }   
        }} //andUpdateDiv
      }}   //from
    },     //remove
    alignDivOf:function( p_tree )
    {
      return { 
          by:(new_offset)=>{
           
            let div_p = op.setTree(p_tree).getDOMNode()
            let div_border = div_p.getElementsByClassName("border_wrap")[0]
                            
            // shift(div_p_border).padding().down().by(diff)
            // push content down
            div_border.style.paddingTop = new_offset + 'px'

            let p_name = p_tree.name.split('_')[0]

            if( 
            p_name != 'bot' 
            && p_name != 'root'
            && !p_tree.props.isClone 
            )
            {
                //Pull border_wrap up
                div_p.style.marginTop =  -new_offset + 'px'						
            }
          }
      }
    },
    add:function(frac_tree)
    {
      return { 
        to: ( p_tree ) => { 
      return {
        andUpdateDiv: () => {

            let { arr_fr=[], current_fr } = p_tree.props
            // console.log( p_tree.full_name, current_fr)
            let { full_name:fr_full_name, 
                props } = frac_tree
            let { offset_y: new_offset } = props

            let no_offset = arr_fr.length == 0? true: false
            let found_fr = arr_fr
                .find( other_fr_tree => other_fr_tree.full_name == fr_full_name )

            if( found_fr === undefined )
            {
                arr_fr.push( frac_tree )
            } 

            p_tree.props.arr_fr = arr_fr

            if( no_offset 
            || (current_fr && new_offset > current_fr.props.offset_y )                
            )
            {
                p_tree.props.current_fr = frac_tree

                this.alignDivOf(p_tree)
                .by( new_offset )
            }
            else if ( current_fr 
            && new_offset == current_fr.props.offset_y ) 
            {
                // have to check if already set margin_top
                // duplicate move so better revert to pure dom methods.

                let div_p = op.setTree( p_tree ).getDOMNode()
                // console.log("add")
                // console.log( p_tree.full_name )
                // console.log( div_p )
                let div_border = div_p.getElementsByClassName("border_wrap")[0]
                let padding_top = div_border.style.paddingTop

                if( !padding_top || padding_top == '0px')
                {
                    // tree.props paddingTop is set 
                    // but DOM paddingTop is not set
                    // likely because tree was cut and pasted.     

                    // shift(div_p_border).padding().down().by(diff)
                    // push content down
                    this.alignDivOf(p_tree)
                    .by( new_offset )
                }
            }
        }} // andUpdateDiv:
      }}   // to:
    },     // add:
    checkPasteDots: function( input )
    {
        let { bx, start_index, end_index } = input

        let own_i = bx[ bx.list[ start_index ] ]
        own_i.checkDot() 
        // when cloning, the checkDot context is also cloned.
        // calling checkDot() in the old context result in error
        // checkDot is created only upon rendering

        // if( start_index != end_index )
        // {
            let next_index = end_index + 1
            let next_i_name = bx.list[ next_index ]

            if( next_i_name )
            {
                let next_i = bx[ next_i_name ]
                next_i.checkDot()
            }
        // }
    },
    /**
     * paste decision tree
     * @param {Array<Object>} cut_tree_list 
     */
    paste: function(cut_tree_list = false)
    {
        cut_tree_list = cut_tree_list || this.getCutTree() 
        // for cut all child case
        let cut_tree_list_sign = this.cut_tree_list_sign
        this.cut_tree_list_sign = false

        this.pasted_tree_list = []
        return {
          into: ( paste_tree ) => {
            return { 
              at: (index) => {
                // console.log( 'paste_into' )
                // console.log( 'cut_tree:', cut_tree )
                // console.log( 'paste_tree:', paste_tree )
                // console.log( 'index:', index )

                // let paste_index = this.parseIndex(index, paste_tree)
                let paste_name = paste_tree.type
                this.temp_pasted_tree_list = cut_tree_list

                if( paste_name == 'top' )
                {
                    let top_tree = paste_tree
                    let { 
                        no_tree,
                        one_value, 
                        one_tree 
                    } = this.checkOne( top_tree )
                    let cut_show_arrow 

                    if( no_tree ){
                        top_tree.props.show_arrow = true 
                        top_tree.props.selected = true
                        cut_show_arrow = false
                    } else if( !no_tree 
                    && !one_value ){
                        this.e_tree_list = cut_tree_list
                        cut_show_arrow = true
                    }
                    else 
                    {
                        //1, +1, -1
                        op.removeThisTree( one_tree )
                        top_tree.props.show_arrow = true 
                        top_tree.props.selected = true
                        this.e_tree_list = [top_tree]
                        cut_show_arrow = false
                    }

                    let paste_index = this.parseIndex(index, top_tree )
                    let start_index = paste_index 
                    // let top_show_arrow = !top_tree.props.show_arrow
                    for( let cut_tree of cut_tree_list )
                    {
                        op.pasteChildTree({
                            cut_tree: cut_tree,
                            paste_tree: top_tree,
                            paste_index: paste_index,
                            new_props: {
                                arrow_type: 'top_i',
                                show_arrow: cut_show_arrow
                                // show_arrow: top_show_arrow 
                            }
                        })
        
                        paste_index ++
                    }

                    this.checkPasteDots({
                        bx: top_tree,
                        start_index, 
                        end_index: paste_index 
                    })
      
                }
                else if( paste_name == 'bot' )
                {
                    let bot = paste_tree
                    let { no_tree } = this.checkOne( bot )
                    this.tree_type = 'item'
                    this.e_tree_list = cut_tree_list

                    let cut_show_arrow
                    if( no_tree ){
                        bot.props.selected = true
                        bot.props.show_arrow = true
                        cut_show_arrow = false
                    } else {
                        cut_show_arrow = true
                    }
                    let paste_index = this.parseIndex( index, bot )
                    let start_index = paste_index
                    for( let cut_tree of cut_tree_list )
                    {
                        op.pasteChildTree({
                            cut_tree: cut_tree,
                            paste_tree: bot,
                            paste_index: paste_index,
                            new_props: {
                                arrow_type: "bottom_i",
                                show_arrow: cut_show_arrow  
                            }
                        })
        
                        paste_index ++
                    }

                    this.checkPasteDots({
                        bx: bot,
                        start_index, 
                        end_index: paste_index 
                    })

                }
                else if( paste_name == 'bx'  )
                {
                    let box_tree = paste_tree
                    let { 
                        no_tree, 
                        one_value, 
                        one_tree 
                    } = this.checkOne( box_tree )

                    let arrow_type
                    let cut_show_arrow

                    if( no_tree ){
                        box_tree.props.show_arrow = true
                        box_tree.props.selected = true
                        cut_show_arrow = true
                    } else if( !no_tree && !one_value ){
                        this.e_tree_list = cut_tree_list
                        arrow_type = 'top_i'
                        cut_show_arrow = true
                    }
                    else 
                    {
                        //1, +1, -1
                        op.removeThisTree( one_tree )
                        box_tree.props.show_arrow = true
                        box_tree.props.selected = true
                        this.e_tree_list = [box_tree]
                        arrow_type = 'top_red'
                        cut_show_arrow = false
                    }

                    // let box_show_arrow = !box_tree.props.show_arrow
                    let paste_index = this.parseIndex(index, box_tree )
                    let start_index = paste_index
                    for( let cut_tree of cut_tree_list )
                    {
                        op.pasteChildTree({
                            cut_tree: cut_tree,
                            paste_tree: box_tree,
                            paste_index: paste_index,
                            new_props: {
                                arrow_type,
                                // show_arrow: box_show_arrow 
                                show_arrow: cut_show_arrow
                            }
                        })
        
                        paste_index ++
                    }

                    this.checkPasteDots({
                        bx: box_tree,
                        start_index, 
                        end_index: paste_index 
                    })
                }
                else if( paste_name == 'eq' )
                {
                    // a+b+c =>
                    // [X](a+b+c)
                    let eq_tree = paste_tree
                    let bracket_tree = this.insertBracket( eq_tree )
                    let box_tree = bracket_tree.parentNode
                    this.e_tree_list = cut_tree_list
                    let paste_index = this.parseIndex(index, box_tree )
                    let start_index = paste_index
                    for( let cut_tree of cut_tree_list )
                    {
                        op.pasteChildTree({
                            cut_tree: cut_tree,
                            paste_tree: box_tree,
                            paste_index: paste_index,
                            new_props: {
                                arrow_type: 'top_i',
                                show_arrow: true 
                            }
                        })
        
                        paste_index ++
                    }

                    this.checkPasteDots({
                        bx: box_tree,
                        start_index,
                        end_index: paste_index
                    })

                }
                else if( paste_name == 'br' )
                {
                    // (a+b) =>
                    // ([X]+a+b)

                    // for adding brackets
                    let br_tree = paste_tree
                    let paste_index = this.parseIndex(index, br_tree )
                    
                    if( paste_index == 0 )
                    {
                        // +b => b
                        let [ first_tree ] = cut_tree_list
                        let first_child = first_tree[ first_tree.list[0] ]
                        
                        if( first_child.props.text == '+')
                        {
                            first_child.props.text = ''
                        }
                    }

                    let show_arrow = true
                    if( br_tree.list.length == 0)
                    {
                        show_arrow = false
                    }

                    for( let cut_tree of cut_tree_list )
                    {
                        op.pasteChildTree({
                            cut_tree: cut_tree,
                            paste_tree: br_tree,
                            paste_index: paste_index,
                            new_props: {
                                show_arrow 
                            }
                        })
                        paste_index ++
                    }

                    // not sure if need
                    // this.checkPasteDots({
                    //     bx: ?,
                    //     start_index: ?,
                    //     end_index: paste_index
                    // })

                }

                return this
              }
            }
          }
          ,
          under: ( paste_tree ) => {

            this.temp_pasted_tree_list = cut_tree_list

            let bot= makeFractionUnder( paste_tree ) //paste tree is eq
            

            this.e_tree_list = [ bot ]

            let paste_index = 0
            let start_index = paste_index
            bot.props.show_arrow = true
            bot.props.selected = true
            bot.props.sign = cut_tree_list_sign
            for( let cut_tree of cut_tree_list )
            {
                op.pasteChildTree({
                    cut_tree: cut_tree,
                    paste_tree: bot,
                    paste_index: paste_index,
                    new_props: { 
                        //arrow_type handled by fraction bottom
                        show_arrow: false
                     }
                })

                paste_index ++
            }


            this.checkPasteDots({
                bx: bot,
                start_index,
                end_index: paste_index
            })

            return this 
          }
          ,
          intoBracket: ( bracket_tree ) =>{
              // a(b+c+d) =>
              // [a]b + [a]c + [a]d
              return {
                  at: ( index ) => {
                    
                    // let paste_name = paste_tree.name.split('_')[0]                   
  
                    let bracket_tree_list = bracket_tree.list
                    let temp_pasted_tree_list = []

                    let first = true
                    let bracket_tree_length = bracket_tree.list.length
                    for( let cut_tree of cut_tree_list )
                    {
                        let clone_tree_list = [] //[clone_1, clone_2, ...]
                        let clone_name_list = []
                        let count_bracket_tree = 0
                        
                        for( let name of bracket_tree_list )
                        {
                            let clone_tree = op.copyObj( cut_tree )
                            // clone_tree.checkDot = make_checkDot( clone_tree )
                            let child_tree = bracket_tree[ name ]
                            //case
                            //1. [a] ( 1 + ... )
                            // 		 ( [a] + ... )
                            
                            //2. [a] ( ... + 1 )
                            //       ( ... + [a] )
                            
                            if(first) this.removeOne( child_tree )
                            
                            let clone_paste_index = this.parseIndex(index, child_tree)
                            let start_index = clone_paste_index
                            // let item_show_arrow = !child_tree.props.show_arrow
                            op.pasteChildTree({
                                cut_tree: clone_tree,
                                paste_tree: child_tree,
                                paste_index: clone_paste_index,
                                new_props:{ 
                                    // show_arrow: item_show_arrow,
                                    show_arrow: true,
                                    arrow_type: "top_in-br" 
                                }
                            })
                            
                            this.checkPasteDots({
                                bx: child_tree,
                                start_index,
                                end_index: clone_paste_index
                            })

                            clone_tree_list.push( clone_tree )
                            clone_name_list.push( clone_tree.full_name )
                            count_bracket_tree ++ 

                            if( count_bracket_tree == bracket_tree_length )
                            {
                                // all child of bracket tree has been 
                                // pasted with cut_tree
                                for( let tree of clone_tree_list )
                                {
                                    // tree.props.pasted_tree_names = clone_name_list
                                    tree.props.pasted_tree_list = clone_tree_list
                                }                                
                            }
                        }
                        first = false
                        temp_pasted_tree_list.push( clone_tree_list )
                    }

                    // ([a]+[a]b)+c remove bracket
                    // => [a]+[a]b + c
                    // this.removeBracket( bracket_tree )

                    //temp_pasted_tree_list 
                    // = [ [ tree_1, tree_1, tree_1], [tree_2, tree_2, tree_2]]
                    // this.temp_pasted_tree_list = temp_pasted_tree_list
                    this.e_tree_list = temp_pasted_tree_list 
                    return this
                  }
              }
          }
          ,
          intoZero: () => {
              return { 
              setZeroProps:( new_props ) => {
                let zero_tree = {
                    name: "zero",
                    type: "zero",
                    full_name: "zero",
                    props: new_props,
                    list:[]
                }
            
                let paste_index = 0 
                for( let cut_tree of cut_tree_list )
                {
                    op.pasteChildTree({
                        cut_tree: cut_tree,
                        paste_tree: zero_tree,
                        paste_index: paste_index,
                    })
                    paste_index ++
                }

                this.e_tree_list = [ zero_tree ]
              }
            }
          }
        }
    },
    savePastedTree:function()
    {
        this.pasted_tree_list = this.temp_pasted_tree_list
        return this
    },
    /** parse "start", "end", "all-0" and get index after minus sign */
    parseIndex:function( index, paste_tree )
    {
        let paste_index = false

        if( index == 'start')
        {
            //index after +- sign
            if( paste_tree.list.length > 0 )
            {
                let first_child_text = 
                    paste_tree[ paste_tree.list[0]].props.text
                if( first_child_text == '-' 
                || first_child_text == '+' )
                {
                    paste_index = 1
                }
                else
                {
                    paste_index = 0
                }                
            }
            else
            {
                //no child
                paste_index = 0
            }    
        }
        else if( index == 'end' )
        {
            paste_index = paste_tree.list.length
        }
        else if( typeof( index ) == 'number' )
        {
            paste_index = index
        } 
        
        if( !paste_index ) index = 'start'

        return paste_index
    },
    /** 
     * @type {function} takes eq_tree and adds bracket
     * */
    insertBracket: function( tree, position=false )
    {
        console.log("Using u.insertBracket")
        let tree_name = tree.name.split('_')[0]

        // if( tree_name != 'eq' )
        // {
        //     console.log( 'insertBracket only accept equation tree.')
        //     return false
        // }

        if( !position ) position = tree.list.length 
        let box_tree = op.setTree( tree )
                        .addChild('bx', {}, position )
                        .getChild(position).tree

        // let last_index = tree.list.length - 1 
        op.setTree(tree).cutAllChildTree({
            exclude_index:[ position ]
        })
        
        
        let bracket_tree = op.setTree(box_tree)
                .addChild('br')
                .getLastChild().tree

        op.pasteAllChildTree({
            paste_tree: bracket_tree        
        })
        
        return bracket_tree
    },
    insertBracketInto: function(tree)
    {
        let first_child = tree[ tree.list[0] ]
        let tree_type  = first_child.type
        return {
            at: ( position ) =>{
                if( position === undefined || position == 'end')
                {
                    position = tree.list.length 
                }
                else if( position == 'start')
                {
                    position = 0
                }

                let bracket_tree
                if( tree_type == 'bx' )
                {
                    let bx_sign
                    if( position != 0)
                    {
                        bx_sign = '+'
                    }

                    let new_bx = op.setTree( tree )
                    .addChild('bx',  
                    {
                        arrow_type: 'top_red',
                        sign: bx_sign,
                        // show_arrow: true,
                        // selected: true
                    }, position )
                    .getChild(position).tree                    

                    bracket_tree = op.addChild('br', {
                                    // selected:true,
                                    arrow_type:'top_i'
                                })
                                .getLastChild().tree
                }
                else if( tree_type == 'i')
                {
                    bracket_tree = op.setTree( tree )
                        .addChild('br', {
                            arrow_type: 'top_i',
                            // selected: true,
                            // show_arrow: true
                        }, position )
                        .getChild(position).tree
                }

                
                return {
                    getBracketTree:()=>{
                        return bracket_tree
                    }
                }
            }
        }
    },
    removeBracket:function( br )
    {
        let tree_name = br.type

        if( tree_name != 'br' )
        {
            console.log( 'removeBracket only accept bracket tree.')
            console.log( `tree_name: ${tree_name} received.`)
            throw new Error(`removeBracket only accept bracket tree.`)
        }

        //tree = eq_1-bx_1-br_1

        let bx = br.parentNode
        let eq = bx.parentNode
        let start_index = eq.list.indexOf( bx.name )

        op.storeTree()
        op.setTree(br).cutAllChildTree()
        op.pasteAllChildTree({
            paste_tree: eq,
            start_index,
        })
        op.removeThisTree( bx )
        this.eq_tree = eq //store eq tree for reference
        this.bracket_removed = true

        // sometimes eq = br
        // br is not yet rendered cause just insert
        // no updateProps function for br
        if( eq.updateProps ){
            eq.updateProps()
        }
        op.reloadTree()
        
        return this
    },
    getBrSidePositions: function( br_tree_list )
    {
        // br_tree_list =
        // (a[d][e] +b[d][e] +c[d][c])
        // [
        //  [sym_d, sym_d, sym_d],
        //  [sym_e, sym_e, sym_e]
        // ]

        let arr_i = br_tree_list[0]
        
        let max_left_index
        let max_left_tree

        let max_right_index
        let max_right_tree
        
        let first_i = arr_i[0]
        let first_bx = first_i.parentNode
        let br_list = first_bx.parentNode.list

        for( let i of arr_i )
        {
            let bx = i.parentNode
            let index = br_list.indexOf(bx.name)

            if( max_left_index === undefined
            || index <= max_left_index)
            {
                max_left_index = index
                max_left_tree = i
            }

            if( max_right_index === undefined
            || index >= max_right_index )
            {
                max_right_index = index
                max_right_tree = i
            }
        }

        if( max_left_index === undefined )
        {
            new Error("max_left_index not found.")
        }
        else if( max_right_index === undefined )
        {
            new Error("max_right_index not found.")
        }
        else
        {
            return { max_left_index, max_left_tree, 
                max_right_index, max_right_tree } 
        }
    },
    
    getEqTree:function()
    {
        let eq_tree = this.eq_tree
        this.eq_tree = false
        return eq_tree
    },
    getCutIndex:function()
    {
        let cut_index = this.last_cut_index
        this.last_cut_index = false
        return cut_index
    },
    
    checkOne: function(bx)
	{
        // tree = bx
        // only return case when i = value is '1'

		let tree_length = bx.list.length
        let one_value = false
        let one_tree = false
        let no_tree = false
        let { sign } = bx.props
        //Handle paste into 1
        if( tree_length == 1 )
		{
            // bx.list = [i]
			// case (1 + ...)[a] => ([a] + ...)
            let i = op.setTree(bx).getChild(0).tree
            
            if( i.props.text == '1' )
            {
                if( !sign || sign === '' )
                {
                    one_value = '1'
                    one_tree = i   
                }
                else if( sign == '+')
                {
                    one_value = '+1'
                    one_tree = i
                }
                else if( sign == '-')
                {
                    one_value = '-1'
                    one_tree = i
                }
            }
        } else if( tree_length == 0){
            no_tree = true
        }

		return { no_tree, one_tree, one_value, no_tree }
    },
    removeOne:function( bx )
	{
		let bx_length = bx.list.length
		//let one_is_removed = false
		//Handle paste into 1
		if( bx_length == 1)
		{
			// case (1 + ...)[a] => ([a] + ...)
            let i = bx[ bx.list[0] ]
            let { text, sign } = i.props

            if( text == '1' 
            && !sign )
			{
                op.removeThisTree( i )
            } 
		}				
	},
	addOne: function( bx )
	{
		let bx_length = bx.list.length
		let one_is_added = false
		//Handle paste into 1
		if( bx_length == 0)
		{
            op.setTree(bx)
            op.addChild('num', { text: '1'})
            one_is_added = '+1'
            bx.props.show_arrow = false
            bx.props.selected = false
        }
		// }
		// else if( bx_length == 1)
		// {
			
		// 	// case ( ... -1)[a] => (... -[a]) 
        //     let bx_sign_text = op.setTree(bx)
        //                         .getChild(0) // bx_sign
        //                         .tree.props.text 

        //     if( bx_sign_text == '-'
        //     || bx_sign_text == '+'
        //     || bx_sign_text == '')
		// 	{
        //         op.setTree(bx)//.addChild('i').getLastChild()
        //         op.addChild('num', { text: '1' } )
		// 		one_is_added = '-1'
        //     }
             
		// }
		return one_is_added
	},
    /** extract plus & minus sign from fraction 
     * @param {Object} eq_tree equation tree*/    
    getNonSignItem: function( eq )
    {
        // can be deprecated
        let bx = eq[ eq.list[0] ]
        let index = 0
        let i = bx[ bx.list[index] ]

        if( bx.list.length >= 2 
        && i.type == 'bx_sign')
        {
            index = 1
            i = bx[ bx.list[index] ]
        }

        // check fr
        // eq-bx-i-fr
        // eq-bx-i-br
        let last_name = i.list[ i.list.length - 1]
        let sub_i = i[ last_name ]

        return { 
            box_tree: bx, 
            index, 
            item_tree: sub_i , 
            item_name: sub_i.type 
        }
    },
    /** set tree marginTop and paddingTop = 0 */
    removeMargin: function( tree )
    {

        tree.props.current_fr = false
        tree.props.arr_fr = []
        
        let full_name = tree.full_name
        let div_tree = document.getElementById(full_name)
        let div_border = document.getElementById(full_name + "-border")

        div_tree.style.marginTop = '0px'
        div_border.style.paddingTop = '0px'
    },
    transferFractionTop: function( fr )
    {
        //1. remove fraction when Fraction Bottom = 1
        // let box_tree = frac_tree.parentNode
        // let parent_tree = box_tree.parentNode
        // eq-bx-i-fr-top-bx-(i|br)
        let bx = fr.parentNode
        let eq = bx.parentNode

        let top = op.setTree( fr ).getChild('top_1').tree         

        if( top.list.length == 1  
        && top.list[0].search('br_') > -1 )
        {
            // ...-bx-fr-top-br
            // goto br            
            let { sign } = bx.props
            if( sign )
            {
                // -(a+b)/{X} =c
                // -(a+b) = {X}c
                op.setTree( top )
                .cutAllChildTree()  // cut br 

                op.setTree(bx)
                .pasteAllChildTree({ start_index: 1 })

                op.removeThisTree( fr ) // remove i-fr
                u.removeMargin( bx )
            }
            else
            {
                // (a+b)/{X} = c
                // a + b = {X}c
                op.setTree( top )
                .getChild(0)        // @br
                .cutAllChildTree()  // cut br child

                op.setTree( eq ).pasteAllChildTree()        
                op.removeThisTree( bx )   
            }  
        }
        else 
        {
            // console.log( '[!(b+c)]/{D} = a' )
            // multi item
            // ab/{c} or a(b+d)/{c}

            //& single item
            // a/{c}

            //-bx-fr-top-i
            //goto top
            
            // - -a/{c}
            let { sign: bx_sign }= bx.props 
            if( bx_sign == '-' )
            {
                // bx_sign.props.fraction_sibling_minus = false

                let { sign: top_sign } = top.props
                if( top_sign == '-')
                {
                    // -"-a"/c => -[-1]*a
                    
                    op.setTree( top )
                   
                    op.addChild('num', 
                    { text: '1',
                    sign: '-', 
                    sub_formula: '-1' })
                }
            }    

            let cutTopChild
            if( top.list.length == 1 )
            {
                let first_i = top[ top.list[0] ]
                if( first_i.props.text == '1' 
                && bx.list.length > 1 )
                {
                    // a * 1/[X] = c
                    // =>
                    // a = [X]c

                    //don't need to cutChild
                    cutTopChild = false
                }
                else
                {
                    // a * b/[X] = c
                    // a*b = [X]c
                    cutTopChild = true
                }
            }
            else
            {
                cutTopChild = true
            }
            
            if( cutTopChild )
            {
                op.setTree( top )
                .cutAllChildTree()   // cuts bx_sign 

                let fr_index = bx.list.indexOf( fr.name )
                op.setTree( bx )
                .pasteAllChildTree({
                    start_index: fr_index
                })
            }  

            this.removeMargin( bx )
            // op.removeThisTree(frac_tree)
            op.removeThisTree( fr )
        }
    },
    getArrowFrom:function( parent_id )
    {
        let start_doc
        if( parent_id == 'document' )
        {
            start_doc = document
        }
        else
        {                    
            start_doc = document.getElementById( parent_id )
        }

        return {            
            whereArrowTypeIs: ( arrow_type ) =>{
                let arrow_list
                if( arrow_type != 'all' )
                {
                   arrow_list = Array.from(
                        start_doc.getElementsByClassName(`show_arrow ${arrow_type}`)
                        )
                }
                else
                {
                   arrow_list = Array.from(
                        start_doc.getElementsByClassName(`show_arrow`)
                        )
                }
                // console.log(arrow_list)
                let tree_list = arrow_list.map( (dom_node) =>{
                    let id = dom_node.getAttribute('id')
                    return op.getTreeByName( id ).tree
                })

                return  tree_list 
            }
        }
    },
    getPositionOf:function( tree )
    {
        if( tree.parentNode)
        {
            return tree.parentNode.list.indexOf( tree.name ) 
        }
        else
        {
            return false
        }
               
    },
    check:function( tree_list )
    {
        return {
            isSideBySide: () => {
                let p_tree_name = tree_list[0].parentNode.full_name
                
                let isSideBySide = tree_list.every( (tree, index, arr) => {
                        let p_tree = tree.parentNode

                        if( p_tree && p_tree.full_name == p_tree_name )
                        {
                            //isSameParent
                            let p_tree_list = p_tree.list 
                            if( index == arr.length - 1 )
                            {
                                // last element
                                return true
                            }
                            else
                            {
                                //first and subsequent elements
                                let next_index = index + 1
                                let next_tree = arr[ next_index ]
                                let next_tree_index = p_tree.list.indexOf( next_tree.name )
                                let tree_index = p_tree.list.indexOf( tree.name )

                                if( tree_index + 1 == next_tree_index )
                                {
                                    //isSideBySide
                                    return true
                                }
                                else
                                {
                                    //Not isSideBySide
                                    return false
                                }
                            }
                        }
                        else
                        {
                            //1. no parent tree 
                            //2. OR not same parent
                            // isSameParent
                            return false
                        }
                    })

                return isSideBySide
            },
            isSameParent:() =>{
                let p_tree_name = tree_list[0].parentNode.full_name
                
                let isSameParent = tree_list.every( (tree)=> {
                        let p_tree = tree.parentNode

                        if( p_tree && p_tree.full_name == p_tree_name )
                        {
                            //is same parent
                            return true
                        }
                        else
                        {
                            return false
                        }
                    })

                return isSameParent
            }
        }
    },
    sort:function(tree_list)
    {
        return {
            by:( tree_name_list ) => {
                let [ first_tree ] = tree_list
               
                tree_list.sort( (t1, t2) => {
                    let i_1 = tree_name_list.indexOf(t1.name)
                    let i_2 = tree_name_list.indexOf(t2.name)
                    return i_1 - i_2
                })
        
                return tree_list 
            }
        }        
    },
    makeFr: function( bx, index=false ){
        op.setTree(bx)
        // by default add fr to end of box tree
        if( index === false ){
            index = bx.list.length - 1 
        }

        let fr = op.addChild('fr',{}, index ).getChild(index).tree
        let top = op.addChild('top').getLastChild().tree

        let bot = op.setTree( fr )
                    .addChild('bot').getLastChild()
                    .tree

        if( bx.props.selected ){
            top.props.selected = true
            bot.props.selected = true
            fr.props.selected = true
        }

        return { top, bot, fr }
    },
    removeThisTree: function( tree ){
        
        let { type } = tree
        let i = ["sym", "num", "fr", "br"]
        if( i.find( i_type => i_type == type ) ){
            let p_tree = tree.parentNode
            let i_index = p_tree.list.indexOf( tree.name ) 
            
            if( type == "fr"){
                this.removeFr( tree )
            } else {
                op.removeThisTree( tree )
            }
            
            if( i_index < p_tree.list.length ){
                let nt_name = p_tree.list[ i_index ]
                let nt = p_tree[ nt_name ]
                if( nt.checkDot ){
                    nt.checkDot()
                }
            }
            
        } else {
            op.removeThisTree( tree )
        }

       return this
    },
    tick: async function(){
        await tick()
    },
    removeFr: async function( fr ){
        let p_tree = fr.parentNode
        this.bubbleUp( p_tree )
            .andForEachRun([
                this.remove( fr )
                .fromEachItem // each bubble p_tree                            
                ])

        op.removeThisTree( fr )
        return this
    }
}

function makeFractionUnder( eq )
{
    //1. cut all child_item_tree in box_tree
    //      except first_item_tree == '-'
    //2. put as fraction top 
    //3. return fraction bottom

    if( eq.list.length > 1)
    {
        // a + b + c => (a+b+b)/{X}
        
        // add new bx-fr-top-bx-[?]
        op.setTree( eq )
        .addChild('bx').getLastChild()
        //.addChild('i').getLastChild()

        let fr = op.addChild('fr').getLastChild().tree

        let top = op.addChild('top').getLastChild().tree
                    //.addChild('bx').getLastChild().tree

        let bot = op.setTree( fr )
                    .addChild('bot').getLastChild()
                    //.addChild('bx').getLastChild()
                    .tree        

        let last_index = eq.list.length - 1 // index of bx-fr

        op.setTree( eq ).cutAllChildTree({
            exclude_index: [ last_index ]
        })

        op.setTree( top )
        .addChild('br' ).getLastChild()

        op.pasteAllChildTree()

        return bot 
    }
    else if( eq.list.length == 1)
    {
        // abc => abc/{X}
        
        let bx = eq[ eq.list[0] ]
        
        // (bx)-i
        op.setTree( bx ) //.addChild('i').getLastChild()
        let fr = op.addChild( 'fr' ).getLastChild().tree
        let top = op.addChild('top').getLastChild().tree
                    // .addChild('bx').getLastChild().tree
        let bot = op.setTree( fr )
                    .addChild('bot').getLastChild().tree
                    // .addChild('bx').getLastChild().tree
        
        
        let exclude_index = []
        // let i = bx[ bx.list[0] ]
        // if( i.type = 'bx_sign' )
        // {
        //     exclude_index.push( 0 )
        // }

        let last_index = bx.list.length - 1 // index of fr
        exclude_index.push( last_index )

        op.setTree( bx )
        .cutAllChildTree({ exclude_index })

        op.setTree( top)
        op.pasteAllChildTree()

        if( bx.props.show_arrow )
        {
            bx.props.show_arrow = false
            top.props.show_arrow = true 
        }        

        return bot
    }
    
}