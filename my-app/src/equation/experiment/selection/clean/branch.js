select_in: function( e_tree )
    {
        e_tree.props.selected = true

        let tree_list = e_tree.list
        if( !tree_list )
        {   
            // item
            // terminate
            e_tree.props.sub_formula = e_tree.props.text 
        }
        else
        {
            // not_item
            let e_sub_formula = ''
            let prev_child_text = ''
            let isCoeff_regex = /[0-9]|\./

            for( var child_name of tree_list )
            {
                let child_tree = e_tree[ child_name ]
                this.select_in( child_tree )
                // if( !(e_tree.name.split('_')[0] == 'eq') ) //isRoot 
                // {
                //     child_props.show_arrow = false
                // }

                let prefix = child_name.split('_')[0]
                
                let { 
                    text: child_text, 
                    sub_formula:child_sub_formula 
                    } = child_tree.props

                if( prefix == 'i')
                {   
                    
                    if( isCoeff_regex.test(prev_child_text) )
                    {
                        // 3*[a]
                        e_sub_formula = e_sub_formula +  "*" + child_text
                    }
                    else
                    {
                        // a[b]
                        e_sub_formula += child_text
                    }
                    prev_child_text = child_text
                }
                else if( prefix == 'bot')
                {
                    // a/[b] 
                    // a/[(b+c)]
                    e_sub_formula = e_sub_formula + "/" + child_sub_formula
                }
                else
                {
                    // a[-b], a[+b], a+b[+c]
                    e_sub_formula += child_sub_formula
                }
            }

            if( e_tree.props.type == 'bracket')
            {
                // [(] b+c [)]
                e_sub_formula = '(' + e_sub_formula + ')'
            }

            e_tree.props.sub_formula = e_sub_formula
        }
    },    