function check_clone_sign( drag_elem_position )
{
   
    let start_tree = $clone_obj[0].tree
    op.tree = start_tree
    if( drag_elem_position == 0 )
    {   
        let left_1st_props = op.getChild(0).tree.props
        let child_name = op.splitName(op.tree.name).item_name 
        if( left_1st_props.text == "+" )
        {
            left_1st_props.text = ""
            $clone_obj[0].tree[child_name] = $clone_obj[0].tree[child_name]
        }        
    }
    else if( drag_elem_position == 1 )
    {
        //position in tree:
        //{0}, {drag_elem:1}
        // console.log("In drag elem pos = 1")
        op.tree = $clone_obj[0].tree
        let left_1st_props = op.getChild(0).tree.props
        let text_2 = left_1st_props.text
        let child_name = op.splitName(op.tree.name).item_name 

        if(  text_2 === '' )
        {
            left_1st_props.text = '+'
            $clone_obj[0].tree[child_name] = $clone_obj[0].tree[child_name]
        }
        else if( text_2 != "-" && text_2 != '+' )
        {
            let plus_elem = {
                    type:'bin',
                    text:'+',
                    selected: true,
                    show_arrow:false
                }
            op.tree = start_tree
            op.addChild('i', 'bin', plus_elem, 0)
        }
    }
    $clone_obj[0].tree = start_tree

    tick().then( () => {
        $clone_obj[0].tree.updateArrowPosition()
    })

} 