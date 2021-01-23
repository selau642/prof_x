
export let match_sign = function( clone: any, dt: Tree ){
    clone.update( obj => {
            obj.clone_tree.props.sign = dt.props.sign  
            // set 'edit' to updateProps of clone_tree
            obj.action = "edit"
            return obj
        })
}

export let check_equation_sign = function( eq: Tree )
{
    //check 1st and 2nd left item of tree
    let eq_length = eq.list.length

    if( eq_length > 0)
    {
        //tree has 1 elem
        let first_elem = eq[ eq.list[0] ] as Tree
        let first_cs = change_sign_of_( first_elem )
        
        first_cs
        .if_is("+")
        .changeTo("")
    }

    if( eq_length >= 2)
    {
        let second_elem = eq[ eq.list[1] ] as Tree
        let second_cs = change_sign_of_( second_elem )

        second_cs
        .if_is("")
        .changeTo("+")
        .if_is_not("+")
        .and_is_not("-")
        .add("+")
    }
}

export let check_clone_sign = function(
    clone: any,  drag_elem_position: number )
{
    let edit_clone = false
    let clone_tree 
    let disable_clone = clone.subscribe( obj => {
        clone_tree = obj.clone_tree
    })

    if( drag_elem_position == 0 )
    {   
        edit_clone = true
        change_sign_of_( clone_tree )
        //.getFirstItemOfBox(0)
        .if_is("+")
        .changeTo("")             
    }
    else if( drag_elem_position == 1 )
    {
        //position in tree:
        //{0}, {drag_elem:1}
        edit_clone = true

        change_sign_of_( clone_tree)
        //.getFirstItemOfBox(0)
        .if_is("")
        .changeTo("+")
        .if_is_not("+").and_is_not("-")
        .add("+")
        
    }

    if( edit_clone )
    {
        clone.update( obj => {
            obj.clone_tree = clone_tree
            obj.action = "edit"
            return obj
        })
    }

    disable_clone()
}

function change_sign_of_( tree: Tree )
{

    return {
        tree,
        end:false,
        end_value: false,
        update_list:[],  
        if_is:function( input: string | boolean ){
            if( this.end ) return this 

            if( typeof(input) == 'string')
            {
                let { tree } = this
                let test = ( tree.props.sign === input )
                this.if_chain = test
            }
            else if( typeof(input) == 'boolean')
            {
                this.if_chain = input
            }

            return this
        },
        if_is_not: function( text: string )
        {
            if( this.end ) return this 

            let { tree } = this
            let test = ( tree.props.sign !== text )
            this.if_chain = test

            return this
        },
        or_is: function( input: string | boolean )
        {
            if( this.end ) return this 

            if( typeof(input) == 'string')
            {
                let { tree } = this
                let test = ( tree.props.sign === input )
                this.if_chain = ( this.if_chain || test )
            }
            else if( typeof(input) == 'boolean')
            {
                this.if_chain = ( this.if_chain || input )
            }
            return this
        },
        or_is_not: function( text: string ){
            if( this.end ) return this 

            let { tree } = this
            let test = ( tree.props.sign !== text )
            this.if_chain = ( this.if_chain || test )
            return this
        },
        and_is: function( input: string | boolean )
        {
            if( this.end ) return this 

            if( typeof(input) == 'string')
            {
                let { tree } = this
                let test = ( tree.props.sign === input )
                this.if_chain = ( this.if_chain && test )
            }
            else if( typeof(input) == 'boolean')
            {
                this.if_chain = (this.if_chain && input )
            }
            return this
        },
        and_is_not: function( text: string ){
            if( this.end ) return this 

            let { tree } = this
            let test = ( tree.props.sign !== text )
            this.if_chain = ( this.if_chain && test )
            return this
        },
        changeTo:function( text: string )
        {
            let { if_chain, tree, end } = this
            if( end ) return this

            if( !if_chain )
            {
                this.if_chain = true
                return this
            } 

            
            tree.props.sign = text
            if( tree.props.show_arrow )
            {
                tree.props.sub_formula = 
                text + tree.props.sub_formula.substring(1)
            }

            if( tree.props.contain_fraction )
            {
                if( text == '-')
                {
                   tree.props.fraction_sibling_minus = true
                   tree.props.fraction_sibling_plus = false
                }
                else if( text == '+')
                {
                    tree.props.fraction_sibling_minus = false
                    tree.props.fraction_sibling_plus = true
                }
            }

            this.update_list.push( tree )
            this.end_value = text
            this.end = true
            return this
        },
        add: function( text: string )
        {
            let { if_chain, tree, end } = this
            
            
            if( end ) return this
            
            if( !if_chain )
            {
                this.if_chain = true 
                return this
            } 
 
            tree.props.sign = text 
             
            if( text == "+" || text == "-")
            {
                if( tree.props.contain_fraction )
                {
                    if( text == '+')
                    {
                        tree.fraction_sibling_plus = true
                    }
                    else if( text == '-' )
                    {
                        tree.fraction_sibling_minus = true
                    }
                }
            }
            // else if( isSymbol.test(text) )
            // {
            //     new_elem.type = 'sym'
            //     op.setTree(box_tree)
            //     .addChild('i', 'symbol', new_elem, 0)
            // }
            // else if( isCoeff.test( text ) )
            // {
            //     new_elem.type = 'num'
            //     op.setTree(box_tree)
            //     .addChild('i', 'coeff', new_elem, 0)
            // }

            
            
            if( tree.props.show_arrow )
            {
                tree.props.sub_formula = 
                "+" + tree.props.sub_formula.substring(1)
            }

            this.update_list.push( tree )
            this.end_value = text
            this.end = true 

            return this 
        },
        getUpdateArrowList:function()
        {
            return this.update_list
        }
    }
}

export let flip_sign = function( dt: Tree ) 
    // input: { dt: Tree, et_child: number } )
{
    // let { dt, et_child } = input
 
    let { sign, sub_formula } = dt.props
    if( sign == '+' )
    {
        dt.props.sign = '-'
        dt.props.sub_formula = '-' + sub_formula.substr(1) 
    }
    else if( sign == '-' )
    {   
        // Handled by check_equation_sign:
        // deprecate below:
        // if( et_child == 0)
        // {
        //     // is first box
        //     dt.props.sign = false
        //     dt.props.sub_formula = sub_formula.substr(1) 
        // }
        // else
        // {
            dt.props.sign = "+"
            dt.props.sub_formula = "+" + sub_formula.substr(1) 
        // }
    }
    else
    {
        // TO DO: test
        // change fraction sign
        // when crossing over equation

        let fraction_sibling_minus = false
        if( dt.props.contain_fraction )
        {
            fraction_sibling_minus = true
        }
        dt.props.sign = "-"
        dt.props.sub_formula = "-" + sub_formula
    }
}

export let flip_clone_sign = function( 
    input: { clone: any, 
        direction: string, 
        dest_et_child: number } )
{
    let { clone,  direction = false, dest_et_child = false } = input

    clone.update( obj => {
        
        let { clone_tree } = obj
        
        let { sign } = clone_tree.props 

        if( sign == '+')
        {
            clone_tree.props.sign = '-'
        }
        else if( sign == '-' )
        {
            if( direction == 'right_to_left' )
            {
                if( dest_et_child == 0 )
                {
                    clone_tree.props.sign = ''
                }
                else
                {
                    clone_tree.props.sign = '+'
                }
            }
            else if( direction == 'left_to_right' )
            {
                clone_tree.props.sign = ''
            }
        }
        else
        {
            clone_tree.props.sign = '-'
        }

        // let cs = change_sign_of_( clone_tree )
        //           //.getFirstItemOfBox(0)
        
        // cs.if_is("+")
        // .changeTo("-")
        
        // .if_is("-")
        // .and_is( direction == 'right_to_left')
        // .and_is( dest_tree_length == 0 )
        // .changeTo("")
        
        // .if_is("-")
        // .and_is( direction == 'right_to_left')
        // .and_is( dest_tree_length > 0 )
        // .changeTo("+")
        
        // //left to right will always be first element 
        // .if_is("-")
        // .and_is( direction == 'left_to_right' )
        // .changeTo("")
        
        // .if_is_not("-").and_is_not("+")
        // .add("-")

        obj.clone_tree = clone_tree
        obj.action = "edit" 
        return obj
    })
}