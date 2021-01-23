import { op } from '../actions/xTree.js'
import { dt } from '../dt/decision_tree.js'

  
dt.make({
    name:"deselect_up",
    recursive:`if_tree_is_root`,
    fn:(slot) => function(tree){
        this.tree = tree
        this.goto(slot.next)
    },
    slot: {next: ['climbTree', 'if_tree_selected'] }
  })
  
dt.make({
  name:'climbTree',
  fn:(slot) => function( tree ){
    this.var['event_tree'] = this.tree
    this.var['tree'] = this.tree.parentNode
    
    goto(slot.next)
  },
  slot: { next :[]}
})

dt.make({
  name:"if_tree_selected",
  fn: ( slot ) => function(){
    let tree = this.var['tree']
    let tree_is_selected = tree.props.is_selected
    if( tree_is_selected )
    {
      this.goto( slot.is_selected )
    }
    else
    {
      
      tree.props.show_arrow = false

      this.goto( slot.not_selected )
    }
  },
  slot: { 
    is_selected:[{ 
        name: 'loop_all_child_tree',
        action: `main_branch: 
        1. select sibling of event tree
        2. for each sibling, check if yellow arrow with outer selected item`
      },
      {
        name: 'if_tree_is_root',
        action: `main_branch:
        1. if root, terminate. tree hide arrow.
        2. recursive: deselect tree, deselect up if tree not root.`
      }], 
    not_selected:[ {
      name: 'if_event_tree_is_yellow',
      action: `main_branch:
        1. event tree hide arrow.
        2. if event tree yellow, outer item remove yellow`
    }]
  }
})



dt.make({
  name:'loop_all_child_tree',
  fn: (slot) => function(){
    let tree_list = this.var['tree'].list

    for( let key in tree_list )
    {
        this.var['sib_tree'] = tree[key]
        this.goto( slot.loop )
    }
  },
  slot: { loop: ['if_child_type']}
})

dt.make({
  name: 'if_child_type',
  fn:(slot) => function(){
    let { sib_tree, event_tree } = this.var
    let not_event_tree = ( sib_tree.name !== event_tree.name )
    if( not_event_tree )
    {
        let is_plus_minus = ( sib_tree.props.type == 'bin' 
        && sib_tree.props.selected )
        if( is_plus_minus )
        {
            (function deselect_tree (tree){
                tree.props.selected = false
                tree.props.show_arrow = false
            })( sib_tree) 

            this.goto(slot.is_plus_minus)
        }
        else
        {
            (function show_default_arrow( tree ){
                tree.props.show_arrow = true
                tree.props.arrow_type = false
            })( sib_tree )

            this.goto( slot.not_event_tree )
        }
    }
  },
  slot: { 
    is_plus_minus:[{action:"deselect_tree"}],
    not_event_tree:[
      {action: "show_default_arrow"},
      'if_is_item_for_yellow' ]
  } 
})

dt.make({
  name: 'if_is_item_for_yellow',
  fn:(slot) => function()
  {
    let { sib_tree, bracket_tree_length }  = this.var['sib_tree']
    
    let sib_tree_prefix = sib_tree.name.split('_')[0]
    this.var['sib_tree_prefix'] = sib_tree_prefix 

    let not_box = ( sib_tree_prefix != 'bx' )
    
    if( !bracket_tree_length  ) 
    {
      let bracket_tree = this.var['tree'].parentNode
      bracket_tree_length = bracket_tree.list.length
      this.var['bracket_tree_length'] = bracket_tree_length
    }

    let not_bracket_single_child = (bracket_tree_length != 1)
    
    if( not_box && not_bracket_single_child )
    {
      //if bracket_single_child, there is no outer_item to check for match
      this.goto( slot.is_item_for_yellow )
    }
  },
  slot: { 
    is_item_for_yellow: [ 'setup_loop_match_vars', 'loop_match_outer_item', 'if_all_match' ], 
  }
})

dt.make({
  name:'setup_loop_match_vars', 
  fn:(slot) => function()
  {
    let { sib_tree, sib_tree_depth, 
      bracket_tree_full_name, show_arrow_list } = this.var

    //init variable one time
    if( !sib_tree_depth )
    {
      sib_tree_depth = sib_tree.full_name.split("-").length
      this.var['sib_tree_depth'] = sib_tree_depth
    }

    if( !bracket_tree_full_name )
    {
      let bracket_tree = this.var['tree'].parentNode
      braket_tree_full_name = bracket_tree.full_name    
      this.var['bracket_tree_full_name'] = bracket_tree_full_name
    }



    if( !sib_tree_sub_formula )
    {
      if( sib_tree_prefix == 'br')
      {
          this.var['sib_tree_sub_formula'] = sib_tree.props.sub_formula
      }
      else if( sib_tree_prefix == 'i')
      {
          this.var['sib_tree_sub_formula'] = sib_tree.props.text
      }
    }

    this.var['match_tree_list'] = [ sib_tree ]
    this.var['match_tree_name_list'] = [ sib_tree.full_name ]
  },
  slot:{ next:[
    {action:"set_var: sib_tree_depth, sib_tree_subformula, bracket_tree_full_name"}, 
    {action:"set_var: match_tree_list, match_tree_name_list"}
  ]}  
})

dt.make({
  name:'loop_match_outer_item',
  fn: (slot) => function()
  {
    let { show_arrow_list } = this.var
    
    if(!show_arrow_list )
    {
      show_arrow_list = op.getShowArrowList( bracket_tree_full_name )
      this.var['show_arrow_list'] = show_arrow_list
    }

    for( let outer_item_name of show_arrow_list )
    {
      this.var['outer_item_name']
      this.goto(slot.loop)
    }
  },
  slot: { loop:['if_same_depth'] }
})

dt.make({
  name:'if_same_depth',
  fn: (slot) => function()
  {
    let { outer_item_name, sib_tree_depth } = this.var
    
  },
  slot: { is_same_depth: ['if_same_subformula']}
})

dt.make({
  name:'if_same_subformula',
  fn: (slot) => function()
  {
    let { outer_item_name, sib_tree_sub_formula } = this.var

    let outer_item_tree = op.getTreeByName( outer_item_name ).tree

    let item_sub_formula
    if( outer_item_tree.name.search('br') > -1 )
    {   
        item_sub_formula = outer_item_tree.props.sub_formula
    }
    else if( outer_item_tree.name.search('i') > -1)
    {
        item_sub_formula = outer_item_tree.props.text
    }

    if( item_sub_formula == sib_tree_sub_formula )
    {
        this.var['match_tree_list'].push( outer_item_tree )
        this.var['match_tree_name_list'].push( outer_item_tree.full_name )
    }
  },
  slot:{ stop: [{action: 'push outer_item_tree into: match_tree_list, match_tree_name_list'}] }
})

dt.make({
  name:'if_all_match',
  fn:(slot) => function(){
    let { bracket_tree_length, match_tree_name_list } = this.var

    if( bracket_tree_length == match_tree_list.length )
    {
        (function make_yellow_arrow( match_tree_list){
          for( let item_tree of match_tree_list )
          {
              item_tree.props.arrow_type = 'yellow'
              item_tree.props.pasted_tree_names = match_tree_name_list
              item_tree.updateProps()
          }
        })( match_tree_list)
    }
  },
  slot:{stop:[{action:'match_item_show_yellow_arrow'}]}
})

dt.make({
  name:'if_tree_is_root',
  fn: (slot) => function()
  {
    let { tree } = this.var
    let isRoot = ( tree.name.search('eq_') > -1 )
    if( !isRoot )
    {
        ( function deselect_tree( tree ){
            tree.props.selected = false
            tree.updateProps()
        })(tree)

        this.goto(slot.not_root)
    }
    else
    {
      //TODO: test if in use
        if( tree.props.type == 'box')
        {
            tree.props.show_arrow = false
            console.log("box deselect hide arrow")
            // tree.updateProps()
            // e_tree.updateProps()
        }
        else if( tree.props.type == 'bracket')
        {
            tree.props.show_arrow = false
            // tree.updateProps()
            // e_tree.updateProps()
        }
    }
  },
  slot: { not_root:[{
          name: 'deselect_up',
          action: 'recursive deselect_up'
        }] 
      }
})

// dt.printTree()
dt.printVar('if_is_item_for_yellow')
// console.log( JSON.stringify( dt.root, null, 2 ) )
// let open_branch_list = dt.branch_list.filter( elem => !elem.isFilled)
// console.log( JSON.stringify( open_branch_list, null, 2) )