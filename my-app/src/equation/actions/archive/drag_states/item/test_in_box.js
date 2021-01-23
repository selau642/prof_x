const { op } = require("../../../xTreeree")
const { u } = require("../../../utils/ui")
const { in_box } = require("./in_box")

// Start Interaction || New Interaction
//1. set drag_elem center | drag_elem |
//2. set cloneOffset arrow top or bottom => for drag_y to be accurate
//3. set eq_right || eq_left and get eq_borders

// 1. get de type 
//      let {type:sym | num | bx} = de
// 2. get list of action available based on type // no need next type item-in_box
//    action_list = de_type[type]
// 3. set borders based on context
//        isInContext -> makeBorders
//    border[top] = border_list
// 4. loop border_list to check cross border
//      check(drag_x, drag_y)
// 5. take action when cross border
//      border.action()
// 6. repeat 1

tree_type => obj[tree_type] => action_list
In.addContext(item)
item.addAction( flip.up )

let flip ={

    up:{
        detect: function( In ){
            let { de_list:[de] } = In

            let { tree: fr } = op.set(de)
                    .getParentPath("(fr)-bot-fr-bot-[i]" )

            if( fr )
            {
                // has fr_parent
                // a/(b/[c])

                // then set border
                let { 
                    bottom: top_bot, 
                    left: top_left,
                    right: top_right
                } = b.set(fr).get('[fr]-(top)').getBorders()

                In.makeBorder({
                        // type: 'top',
                        top: top_bot,
                        left: top_left,
                        right: top_right,

                        elem: b.tree,
                        action: this.action,
                    })
            }
            else
            {
                return false
            }
        },
        /**
         * @param {Object} In Main interaction class
         */
        action: function( In )
        {
            let { de } = In
            let { elem:fr_top } = In.border
            
            u.cut( de )
            .paste()
            .into( fr_top )
            .at('end')

            fr_top.updateProps()     
            
            return [ de ]
        }
    },
    down: {
        detect: function()
        {
            let { de } = this.prevUpdate()
            
            let fr_bot = bd.set( de ).get('(fr)-top-[i],[fr]-bot')
            if( fr_bot )
            {
                
                for( let item_name of fr_bot )
                {
                    let i = fr_bot[ item_name ]
                    let { 
                        bottom: i_bot,
                        left: i_left,
                        right: i_right
                    } = b.from( i ).getBorders()

                    this.border.push({
                        border_elem: i,
                        bottom: i_bot,
                        left: i_left,
                        right: i_right
                    })
                }
            }
            else
            {
                return false
            }

        }
    }
}

let swap = {
    left: {
        detect: function(In){
            let { de, pe } = In
            if( pe )
            {
                let { type } = pe
                if( type == 'sym' || type == 'num')
                {
                    op.getDim(pe)
                    
                }
            }
        },
        action: function(In){}
    },
    right:{
        detect: function(In){},
        action: function(In){}
    }
}

match: {
    top: {
        de.bottom < b.top,
        de.left < b.left < de.right,
        de.left < b.right < de.right 
        },
    left: {
        de.right < b.left,
        b.top < de.top < b.bot,
        b.bottom < de.bottom < b.bottom
        },
    top_left: {
        de.right < b.left
        de.bottom < b.top
    },
    bot_right: {
        de.top > b.bottom
        de.right < b.left
    }
    
}

let { type } = prev_elem
if( type == 'sym' || type == 'num')
{
    let pe = op.getDim( prev_elem.full_name )

    in_box.add({
        action: swap(de).left,
        border:{ 
            left: pe.left,
            top: pe.bottom 
        },  //auto deduce that top and left will be trigger
    })

let br=op.getDim( ne_br.full_name)
in_box.add({
    action: enter.from.left,
    border: {
        right: br.left,
        top: br.bot 
    },
})



let { prev_sib, next_sib } = b.set( de ).getSiblings()
b.set( de ).get('(bx)-fr-bot-[i]')