import { op } from "./xTree"
import { u } from "./utils/ui.js"
import { box } from "./archive/drag_states/box/main.js/main.js"
import { item } from "./archive/drag_states/item/main.js.js/main.js"
import { fraction_bottom, fraction_top } from "./archive/drag_states/fraction/main.js.js/main.js"
import { tick } from 'svelte'

//interaction operator


function set_interaction()
{    
    In.addState( "box", box )
    In.addState( "item", item )
    In.addState( "fraction_bottom", fraction_bottom )
    In.addState( "fraction_top", fraction_top)
}

class interaction{

    drag_clone={} // properties of drag_clone
    nextUpdate={}
    clone={} // for Clone.svelte to split into multiple Clone.svelte
    isUpdatingTree=false
    case_list=[] 
    drag_state='start' //on release
    state_obj={}
    addState ( name, obj )
    {
        this.state_obj[name] = obj
        return this
    }

    gotoState( full_state )
    {
        let arr_state = full_state.split("-")
        let state_obj = this.state_obj
        for( let state of arr_state)
        {
            if( !state_obj[ state ] )
            {
                console.log("State not exist: full_state:", full_state,
                ", state:", state )
            }
            else
            {
                state_obj = state_obj[ state ]
            }
        }

        this.case_list = state_obj
        return this
    }

    /**
     * set drag_state
     * @param {Object} input
     * @param {Object} input.e_tree 
     */
    setTreeState( input )
    {
        //set:
        //0. op.pasted_tree_name = []
        //1. this.drag_state
        //2. this.tree
        //3. this.e_tree
        //4. this.elem_index
        
        // this.next[] trumps all input

        if( input )
        {
            this.global = {}
            this.clone = {} // clone split into many clones
            this.drag_clone = input.drag_clone // props of cloned drag_elem
            u.reset()
            // interaction global variables
            // start when drag_start, end when drag_end
            let { e_tree, e_tree_list } = input
            if( e_tree && !e_tree_list ) input.e_tree_list = [ e_tree ]
            input.tree = input.e_tree_list[0].parentNode
           
            this.nextUpdate = input            
        }
        
        let { drag_state } = this.nextUpdate

        if( drag_state 
            && drag_state != 'stop'
            && drag_state != 'pause')
        {
            if( this.drag_state != drag_state )
            {
                this.drag_state = drag_state 
                this.gotoState( drag_state )
            }
        }
        
        return this
    }

    getPrevUpdate( input )
    {
        let prev = this.nextUpdate

        if( input && input.clear ) 
        {
            // console.log("clear Prev Update:",  (new Error()).stack )
            this.nextUpdate = {}
        }
        return prev
    }

    setNextUpdate( input )
    {
        let { e_tree_list:[e_tree] } = input
        input.tree = e_tree.parentNode 
        this.nextUpdate = input
    }

    setTreeBorders()
    {
        
        this.border = {}
        this.var = {}

        if( this.case_list 
            && this.case_list[0] 
            && this.case_list[0].set_state_borders )
        {
            this.case_list[0].set_state_borders.apply( this )
        }
        else
        {
            console.log( "Error set_borders: case_list[0].set_state_border function not found.")
            console.log( "drag_state:", this.drag_state )
            console.log( new Error().stack )           
        }
        
        return this
    }
    /** called in Container.svelte to pass drag_x, drag_y mouse positions */
    async check_n_update_tree( drag_x, drag_y)
    {
        if( this.isUpdatingTree ){
            return 
            //blocks code once error occurs
        }

        this.drag_x = drag_x
        this.drag_y = drag_y

        for( let border of this.case_list )
        {
            if( border.check && border.check.apply( this ) )
            {
                let that = this
                if( that.debug ) console.log( that.drag_state, border.name )

                this.isUpdatingTree = true
                border.update_tree.apply(this)
                //set next and var
                //nextUpdate
                let tick_result = await tick().then( async () => {
                    //after onMount cross_over_equal_sign, cross_over_destroy
                    
                    if( border.svelte_tick ) 
                    {
                        border.svelte_tick.apply(that) 
                    }

                    that.setTreeState() //using that.next.drag_state, next.e_tree
                    // reset next
                    // var.afterTick
                    // console.log( that.drag_state )
                    if( that.skip_set_borders )
                    {
                        that.skip_set_borders = false 
                        // var is not reset
                    }
                    else
                    {                            
                        that.setTreeBorders.apply( that )
                        // reset var
                        // var.afterTreeBorders
                    }

                    return true
                })
                .catch(e => {
                    console.log(e)
                    return false
                })

                if( tick_result && this.drag_state != 'pause' )
                {
                    this.isUpdatingTree = false
                }

                break
            }
        }

    }

    clearNext()
    {
        this.next = {}
        return this
    }

    runDragEnd( input )
    {
        // console.log( e_tree_list )
        //1. inside top, bottom => see parentNode
        //2. bracket tree
        //3. box tree
        let { e_tree_list, e_tree_list: { 0: e_tree } } = input

        let p_tree = e_tree.parentNode
        if( p_tree.props.selected )
        {
            for( let tree of e_tree_list )
            {
                tree.props.show_arrow = false
                tree.updateProps()
            }
        }
    }    
}
export let In = new interaction()
set_interaction()