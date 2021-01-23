<script>
import { stores } from '@sapper/app';
const { preloading, page, session } = stores();
const { host, path, params, query } = $page
// console.log('host:', host)
// console.log('path:', path)
// console.log('params:', params)
// console.log('query:', query)
let { cy_test } = query

import { onMount } from 'svelte'
import Formula from '../equation/Formula.svelte'

// Important!
// Inject Clone via Client Side Rendering
// into document.body so that the clone element
// appears directly overlapping the clicked element

import Clone from '../equation/Clone.svelte'

let client_side_doc = false
onMount(()=>{
	client_side_doc = document
})

$:if( client_side_doc )
{
	let insert_clone = new Clone({
		target: client_side_doc.body
	})
}
</script>
<svelte:head>
	<title>Σ Editor | Professor 𝛘</title>
</svelte:head>
<Formula cy_test={cy_test}/>
