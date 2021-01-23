<script>
 	import Item from './Item.svelte';
	let tree = {
		text:"tree",
		onMount:function()
		{
			this.text = "action"
		}
	}
</script>

<Item tree={tree} />


<script>
import { onMount } from 'svelte';

export let tree = { }
let test_this = "no onMount"
onMount( () =>
{
	test_this = 'in onMount'
	if( tree.onMount ) tree.onMount().call(tree)
	
})
</script>
{ tree.text }
{ test_this }