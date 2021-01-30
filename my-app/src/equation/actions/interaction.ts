// @ts-nocheck
import { u } from "./utils/ui.js"
import { swap } from "./swap/main"
import { cross_eq } from './cross_eq/main'
import { insert, extract } from './insert_extract/main'
import { flip } from './flip/main'

import { tick } from 'svelte'
// import type { border } from './types/type'
import { makeProps } from './utils/makeProps'
//interaction operator

// One Time Setup
//1. set drag_elem borders    | drag_elem |
//2. set cloneOffset arrow top or bottom => for drag_y to be accurate
//3. set eq_right || eq_left and get eq_borders

// 1. get de type 
// 2. find context based on type // no need next type item-in_box
// 3. set borders based on context
// 4. loop border_list to check cross border
// 5. take action when cross border
// 6. repeat 1

function set_interaction()
{    
    In.addSound( { name: "ping", file: 'ping.wav' })

    In.addAction( swap.i.left )
    In.addAction( swap.i.right )

    In.addAction( swap.bx.left )
    In.addAction( swap.bx.right )

    In.addAction( cross_eq.bx.above_left_to_right )
    In.addAction( cross_eq.bx.above_right_to_left )

    In.addAction( cross_eq.bx.below_left_to_right )
    In.addAction( cross_eq.bx.below_right_to_left )

    In.addAction( cross_eq.i.sink_left_to_right )
    In.addAction( cross_eq.i.sink_right_to_left )

    In.addAction( cross_eq.i.float_left_to_right )
    In.addAction( cross_eq.i.float_right_to_left )

    In.addAction( cross_eq.bot.float_left_to_right )
    In.addAction( cross_eq.bot.float_right_to_left )

    In.addAction( cross_eq.zero.float_left_to_right )
    In.addAction( cross_eq.zero.float_right_to_left )
    In.addAction( cross_eq.zero.sink_left_to_right )
    In.addAction( cross_eq.zero.sink_right_to_left )

    In.addAction( insert.i.into.fr.from_left )
    In.addAction( insert.i.into.fr.from_right )

    In.addAction( extract.i.from.fr.from_left )
    In.addAction( extract.i.from.fr.from_right )

    In.addAction( insert.i.into.br.from_left )
    In.addAction( insert.i.into.br.from_right )

    In.addAction( extract.i.from.br.from_left )
    In.addAction( extract.i.from.br.from_right )

    In.addAction( extract.top.from.top.from_left )
    In.addAction( extract.top.from.top.from_right )

    In.addAction( extract.bot.from.bot.from_left )
    In.addAction( extract.bot.from.bot.from_right )

    In.addAction( extract.i.from.bot.from_left )
    In.addAction( extract.i.from.bot.from_right )

    In.addAction( insert.bot.into.bot.from_left )
    In.addAction( insert.bot.into.bot.from_right )

    In.addAction( flip.top.down )
    In.addAction( flip.top_i.down )
    In.addAction( flip.bot.up )
    In.addAction( flip.bot_i.up )

    In.addAction( flip.bot.down )
    In.addAction( flip.bot_i.down )
    In.addAction( flip.top.up )
    In.addAction( flip.top_i.up )
    
    In.addAction( insert.bot.into.i.from_left )
    In.addAction( insert.bot.into.i.from_right )

}

type Tree_List = Tree[] // for in-br
export class interaction {
    first_drag: boolean = false
    dt: Tree // drag_tree
    dt_list: Tree[] | Tree_List[] //drag_tree_list
    p_tree: Tree
    mp_args: {[key:string]: any } = {}

    sound: {[key:string]:any} = {}
    sound_list: { [key:string]: any } = {}

    makeProps = new makeProps() 
    ref_drag_x: number
    ref_drag_y: number
    
    /** Properties of drag_clone */
    drag_clone: drag_clone 

    // for carrying border variables accross depth 
    clone: { split_clone_list: any[] | false }={} 
    // for Clone.svelte to split into multiple Clone.svelte
    // used by insert_extract/in_br.ts 
    original_tree: Tree
    isUpdatingTree: boolean=false
    /**tree_type to action[] dict */
    dt_action: { [key:string]: action[]} = {}
    action_list: action[] = []

    border:border ={}
    border_vars: { bracketRemoved?: boolean } = {}
    props: { [key:string]: any }={}
    context_list=[]
    /**Add actions to tree_action_list
    * @param {Object} inter_tree interaction_tree containing all interactions(e.g. swap) of a tree type(e.g. item).
     */
    addAction( action_tree: any )
    {
        for( let tree_type of action_tree.tree_type_list )
        {
            if( !this.dt_action[ tree_type ] ){
                this.dt_action[ tree_type ] = []
            }

            this.dt_action[ tree_type ].push( action_tree )
        }
        return this
    }

    addSound( input ){
        let{ name, file } = input
        this.sound_list[ name ] = file 
    }

    loadSound( input ){
        let { sound_list } = this
        for( let sound_name in sound_list ){
            let file = this.sound_list[ sound_name ]
            this.sound[ sound_name ] = new Audio( file )
        }
    }

    playSound( name: string ){
        if( !this.sound[name] ){
            let file = this.sound_list[name] 
            this.sound[name] = new Audio( file )
        }
        this.sound[ name ].play()
    }

    initialise(){
        this.first_drag = true
        this.props = {}
        // Clone.svelte split into clones
        this.clone = {}
        this.mp_args = {}
        this.original_tree = false
        return this
    }
    /**
     * Set the interaction tree: item, fr_top, etc...
     * @param {Tree | Tree[] } de_list drag_elem
     */

    setContext( dt_list: Tree | Tree[] ):this
    {
        if( !Array.isArray(dt_list) ) dt_list = [ dt_list ]

        let dt = dt_list[0]
        if( Array.isArray(dt) ){
            dt = dt[0]
        }
        
        let dt_type
        if( dt.props.arrow_type?.search('in-br') > -1)
        {
            //special case in-bracket
            dt_type = 'in-br'
            dt_list = [ dt.props.pasted_tree_list ]
            this.original_tree = dt 
        } else {
            dt_type = dt.type
        }

        this.dt_list = dt_list
        let p_tree = dt.parentNode
        this.p_tree = p_tree  
        let action_list = this.dt_action[ dt_type ]
        if( !action_list || action_list.length == 0 ){
            throw new Error(`action for tree type: ${dt.type} not set.`) 
        }
        // filter relevant action to setBorder later
        let context_list=[]
        // this.props = {}
        for( let action of action_list )
        {
            //detect context
            // uses this.props
            if( action.isInContext(this) )
            {
                context_list.push( action )
            }
        }

        // don't reset this.border here
        // as sometimes we want to skip set border

        // Fork: set x, y point for drag_direction
        this.setRefXY()
        this.context_list = context_list

        return this
    }

    /**Set ref_drag_x, ref_drag_y for getDragDirection later */
    setRefXY(){
        
        if( this.first_drag ){
            let { 
                elem_start_x,
                elem_start_y,
                mouse_start_x,
                mouse_start_y
              } = this.drag_clone

            // use drag_x - start_x 
            
            this.drag_distance = {
                x: mouse_start_x - elem_start_x,
                y: mouse_start_y - elem_start_y
            }

            this.ref_drag_x = elem_start_x 
            this.ref_drag_y = elem_start_y 

        } else {
            let { dt_list } = this
            let { length } = dt_list
            if( length == 0 ){ 
                throw new Error("Cannot set ref_drag_x, ref_drag_y because dt_list.length == 0")
            } else {
                let dt = dt_list[0]
                if( Array.isArray( dt ) ){
                    dt = dt[0]
                }

                let de
                if ( dt.type == 'zero'){
                    let { eq: dt_eq } = dt.props
                    de = document.getElementById( dt_eq.full_name )
                                .getElementsByClassName("box")[0]
                } else {
                    de = document.getElementById( dt.full_name )
                }
                let { top, left } = de.getBoundingClientRect()
                
                this.ref_drag_x = left 
                this.ref_drag_y = top 

            } 
            // else {
            //     let odd = ( length % 2 === 1 )  
            //     if( odd ){
            //         let mid_index = Math.floor( length / 2 ) + 1
            //         let dt = dt_list[mid_index]
            //         let de_arrow = document.getElementById( dt.full_name + '-arrow')
            //         let { top, bottom, left, right } = de_arrow.getBoundingClientRect()
                    
            //         let mid_x = ( left + right )/2
            //         let mid_y = ( top + bottom )/2

            //         this.ref_drag_x = mid_x
            //         this.ref_drag_y = mid_y
            //     } else {
            //         // even 
            //         let mid_index = length / 2 
            //         let dt_left = dt_list[mid_index]

            //         let de_left_arrow = document.getElementById( dt_left.full_name + '-arrow')
            //         let { top, bottom, left } = de_left_arrow.getBoundingClientRect()
                    
            //         let dt_right = dt_list[mid_index + 1]
            //         let de_right_arrow = document.getElementById( dt_right.full_name + '-arrow')
            //         let { right } = de_right_arrow.getBoundingClientRect()

            //         let mid_x = ( left + right )/2
            //         let mid_y = ( top + bottom )/2

            //         this.ref_drag_x = mid_x
            //         this.ref_drag_y = mid_y
            //     }
            // }
        }

        return this
    }

    setDragClone( drag_clone: drag_clone ){
        // record drag_clone props
        // used for setting offsets to right, left of border
        // top bottom offsets of top, bot
        this.drag_clone = drag_clone
        return this
    }

    getProps( prop_name_list: string[] ){

        let prop_obj: any = {}
        for( let prop_name of prop_name_list ){

            let prop = this.props[ prop_name ]
            if( prop )
            {
                prop_obj[ prop_name ] = prop
            }else{
                let fn_make_prop = this.makeProps[ prop_name ]
                if( fn_make_prop )
                {
                    prop = fn_make_prop( this )
                    this.props[ prop_name ] = prop
                    prop_obj[ prop_name ] = prop  
                }
                else
                {
                    throw new Error("no fn to make prop:", prop_name)
                }
            }
        }
        return prop_obj
    }

    resetParams(){
        this.clone = {} // clone split into many clones
        u.reset()
        return this
    }

    setBorders(){
        let { context_list } = this
        this.border = {} 
        for( let action of context_list )
        {
            // make borders
            // this.border['top']
            // uses this.props
            let border_obj = action.makeBorder( this )
            this.addBorder( border_obj )
        } 
        return this
    }
    
    async detect_cross_border( drag_x: number, drag_y: number )
    {
        if( this.isUpdatingTree ){
            return 
            //blocks code once error occurs
        }
        // console.log("detect_cross_border")
        let { x_dir, y_dir } = this.getDragDirection( drag_x, drag_y )
        let xy_dir = y_dir + '_' + x_dir

        let border_list = []
        let { border } = this
        if( x_dir && border[x_dir] ){
            border_list = border_list.concat( this.border[ x_dir ] )
        }

        if( y_dir && border[y_dir] ){
            border_list = border_list.concat( this.border[y_dir])       
        }

        if( x_dir 
        && y_dir 
        && border[xy_dir] ){
            border_list = border_list.concat( this.border[xy_dir])
        }

        let border_crossed: border
        if( border_list.length > 0 ){
            for( let border of border_list )
            {
                if( this.detect( border, drag_x, drag_y ) )
                {
                    console.log( border.name )
                    border_crossed = border
                    break
                }
            }
            if( !border_crossed ) return 
        }
        else
        {
            return 
        }

        this.isUpdatingTree = true

        let new_de_list = await border_crossed.updateUI( this )

        let that = this

        let tick_result = await tick().then( async () => {
            //after onMount cross_over_equal_sign, cross_over_destroy
            
            if( border_crossed.svelte_tick ) 
            {
                border_crossed.svelte_tick(that) 
            }
            
            that.playSound("ping")
            // reset props here so 
            // can call props in selection.js
            if( that.first_drag ) that.first_drag = false 
            that.props = {}
            that.setContext( new_de_list ) 

            // reset variables

            that.setBorders()

            return true
        })
        .catch(e => {
            console.log(e)
            return false
        })

        if( tick_result )
        {
            this.isUpdatingTree = false
        }
    }

    detect( border:any, drag_x:number , drag_y:number )
    {
        let { name, top, bottom, left, right, direction } = border 
        // console.log( name, ":", direction )
        
        if( direction == 'top' )
        {
            if( left && right )
            {
                if( drag_y < top 
                && left < drag_x
                && drag_x < right
                )
                {
                    return true
                }
            }
            else
            {
                if( drag_y < top )
                {
                    return true
                }
            }   
        }
        else if( direction == 'bottom' )
        {
            if( left && right )
            {
                if( drag_y > bottom 
                && left < drag_x
                && drag_x < right
                )
                {
                    return true
                }
            }
            else
            {
                if( drag_y > bottom )
                {
                    return true
                }
            }
        }
        else if( direction == 'left' )
        {
            if( top && bottom )
            {
                if( drag_x < left 
                && top < drag_y
                && drag_y < bottom )
                {
                    return true
                }
            }
            else
            {
                if( drag_x < left )
                {
                    return true
                }
            }
        }
        else if( direction == 'right' )
        {
            if( top && bottom )
            {
                if( drag_x > right 
                && top < drag_y
                && drag_y < bottom )
                {
                    return true 
                }
            }
            else
            {
                if( drag_x > right )
                {
                    return true 
                }
            }
        }
        else if( direction == 'top_left')
        {
            if( drag_x < left 
            && drag_y < top )
            {
                return true
            }
        }
        else if( direction == 'top_right')
        {
            if( drag_x > right 
            && drag_y < top )
            {
                return true
            }
        }
        else if( direction == 'bottom_left' )
        {
            if( drag_x < left 
            && drag_y > bottom )
            {
                return true
            }
        }
        else if( direction == 'bottom_right')
        {
            if( drag_x > right 
            && drag_y > bottom )
            {
                return true
            }
        }
    }

    getDragDirection( drag_x: number, drag_y:number)
    {
        let { ref_drag_x, ref_drag_y } = this
        let { x: dist_x, y: dist_y} = this.drag_distance

        let x_dir 
        if( drag_x - dist_x > ref_drag_x )
        {
            x_dir = 'right'
        }
        else if( drag_x - dist_x < ref_drag_x )
        {
            x_dir = 'left'
        }
        // drag_x == start_x 
        // x_dir = undefined

        let y_dir 
        if( drag_y - dist_y > ref_drag_y )
        {
            y_dir = 'bottom'
        }
        else if( drag_y - dist_y < ref_drag_y )
        {
            y_dir = 'top'
        }
        // drag_y == start_y
        // y_dir = undefined

        return { x_dir, y_dir }
    }
    
    runDragEnd( input )
    {
        /** Deselect e_tree_list if p_tree selected */
        let { e_tree_list, e_tree_list: { 0: e_tree } } = input

        let p_tree = e_tree.parentNode
        if( p_tree 
        && p_tree.props.selected )
        {
            for( let tree of e_tree_list )
            {
                tree.props.show_arrow = false
                tree.updateProps()
            }
        }
    }    
    
    addBorder( border: border ){
        let { top, bottom, left, right } = border
        
        let direction
        if( top && bottom ){
            if( left ){
                direction = 'left'
            } else if( right ){
                direction = 'right' 
            }
        } else if( left && right ){
            if( top ){
                direction = 'top'
            } else if( bottom ){
                direction = 'bottom'
            }
        } else if( left && top ){
            direction = 'top_left'
        } else if( right && top ){
            direction = 'top_right'
        } else if( left && bottom ){
            direction = 'bottom_left'
        } else if( right && bottom ){
            direction = 'bottom_right'
        } else if( top ){
            direction = 'top'
        } else if( bottom ){
            direction = 'bottom'
        } else if( right ){
            direction = 'right'
        } else if( left ){
            direction = 'left'
        }

        border.direction = direction
        if( !this.border[ direction ] )
        {
            this.border[ direction ] = []
        }
        this.border[ direction ] = border
    }
}

export let In = new interaction()
set_interaction()
