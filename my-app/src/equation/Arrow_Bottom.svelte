<script>
import Arrow from './Arrow.svelte'
export let tree

let show_arrow, arrow_type, isClone // tree.props
let arrow_direction, arrow_color

$:if( tree.props )
{

    show_arrow = tree.props.show_arrow
    arrow_type = tree.props.arrow_type
    isClone = tree.props.isClone

    if( arrow_type )
    {
        let temp_arr = arrow_type.split('_')
        arrow_direction = temp_arr[0]
        arrow_color = temp_arr[1]
    }

    // let test = (arrow_type
    //             && show_arrow 
    //             && arrow_direction == 'bottom'
    //             && !isClone)

}

</script>
{#if arrow_type
&& show_arrow 
&& arrow_direction == 'bottom'
&& !isClone }
<Arrow 
arrow_direction={arrow_direction}
arrow_color={arrow_color}
tree={tree}
/>
{/if}