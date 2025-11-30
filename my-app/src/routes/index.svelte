<script>
import { stores } from '@sapper/app';
const { preloading, page, session } = stores();
const { host, path, params, query } = $page
let { cy_test } = query

import { onMount } from 'svelte'
import Formula from '../equation/Formula.svelte'

import { In } from "../equation/actions/interaction"

// Important!
// Inject Clone via Client Side Rendering
// into document.body so that the clone element
// appears directly overlapping the clicked element

import Clone from '../equation/Clone.svelte'

let client_side_doc = false
onMount(()=>{
	client_side_doc = document
	In.loadSound()
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
