<script>
import Equation from '../equation/Equation.svelte'
import Debug from '../equation/Debug.svelte'
import { tick, onMount } from 'svelte'
import { x_drag } from './actions/x_drag.js'
import { error_msg } from './actions/equation_stores.js'
import { mouse_x, mouse_y } from './actions/clone_stores.js'
import Tooltip from './Tooltip.svelte'
import Selection from './Selection.svelte'
import Edit_symbol from './Edit_symbol.svelte'

export let cy_test = false
let item = [
	'd/gf=ab/c',
	'(a+b)c=d/e',
	'ab(c+d)+e = (ab+ac)+ad',
	'0=(a+b)c/d(e+f)',
	'(a+b)c/d(e+f)=0',
	'ab/c=0',
	'1+acdb/cd=ef/gh',
	'-a+b=ijk',
	'(a+b)=1d/e',
	'a(b+c)3/d=abc/f',
	'-(a+b)/c = (d+2)f',
	'a(b+c)+d(b+c)=f',

	'1/c=3/d',
	'd*-(a+b)*-(c+d)=c',

	//  //render bracket
	'(a(b+c/d)-f/2)=c',
	// '(a+b)/(c+d) = e',
	'(a+b/c)/(d+e) = ij',
	'-(a+b/c)/(d+e/(f-g/h))=k',
	
 ]

let formula_list = [ ...item ]
let formula = formula_list[0]

async function change_formula()
{
	let input_text = document.getElementById('formula').innerHTML
	formula = false
	await tick()
	formula = input_text
}

let selected_elem = false
async function select_formula(e)
{
	let elem = e.currentTarget
	
	if( selected_elem )
	{
		selected_elem.classList.remove('selected')
	}
	elem.classList.add('selected')
	selected_elem = elem 
	formula = false

	await tick()
	formula = elem.innerHTML
}

let cal_top = 10
let cal_left = 1000
let tx = 0
let ty = 0

function f_drag_start(event)
{
    // console.log("tool drag_start")
}

function f_drag_move(event)
{
	let {
		x, y, 
		dx, dy} = event.detail
	tx += dx
	ty += dy
    // console.log("tool drag_move, tx:", tx, ", ty:", ty)
}

function f_drag_end(event)
{
    // console.log("tool drag_end")
}
</script>
{#if cy_test}

<div 
id='formula_controls'
class='cy_test'
use:x_drag = {true}
on:x_drag_start = {f_drag_start}
on:x_drag_move = {f_drag_move}
on:x_drag_end = {f_drag_end}	
style='transform:translate({tx}px, {ty}px);'
>
	<div style='float:left;font-style:italic;margin-top: 4px;margin-right:6px;'>fx: </div><div id='formula' data-cy="input_formula" contenteditable="true" >a + b + c = d</div>
	<div id='btn_change_formula' data-cy='btn_change_formula' on:click={change_formula}>Change Formula</div>
<div style='clear:both'></div>
</div>
<div>x:{$mouse_x}</div>
<div>y:{$mouse_y}</div>
<Selection />
{:else}
<Debug />

<Tooltip />
<Selection />
<!-- <Edit_symbol /> -->

<!-- <div id='status_msg'>
	{$error_msg}
</div> -->
<div 
id='formula_controls'
class='formula_list'
use:x_drag = {true}
on:x_drag_start = {f_drag_start}
on:x_drag_move = {f_drag_move}
on:x_drag_end = {f_drag_end}	
style='transform:translate({tx}px, {ty}px);'
>
	<div class='title'>Formulas:</div>
	{#each formula_list as f}
		<div class='btn formula_item'
			class:selected={false}
			on:click={select_formula} >
			{f}
		</div>
	{/each}
<div style='clear:both'></div>
</div>
{/if}




{#if formula}
	<Equation formula={formula} cy_test={cy_test}/>
{/if}

<style>
#status_msg{
	margin: 0px auto;
	border: 1px solid rgb( 0, 0, 0);
	border-radius: 4px;
	width:fit-content;
	padding:5px;
	font:20px Arial, Helvetica, sans-serif;
	margin-top:20px;
	background-color: rgb(38, 212, 38);
	z-index:20;
	user-select:none;
}

#formula_controls
{
	width:fit-content;
	display:block;
	font:20px Arial;
	padding: 4px;
	border:1px solid rgb(0,0,0);
	border-radius:4px;
	user-select: none;
}

.title
{
	margin:4px;
}

#formula{
	position:relative;
	border:1px solid rgb(0,20,200);
	margin:2px;
	padding:2px 8px;
	width:800px;
	float:left;
}

.formula_item
{
	font-size: 24px;
}

#btn_change_formula
{
	position:relative;
	width:fit-content;
	float:left;	
	border:1px solid rgb(0,20,200);
	margin-left:2px;
	margin-top:6px;
	border-radius:4px;
	padding:2px 8px;
	font:18px Arial;
}

#btn_change_formula:hover
{
	cursor:pointer;
}



.btn{
	border: 2px solid rgb( 0, 0, 0);
	border-radius: 4px;
	padding: 4px;
	margin: 4px;
	background-color:rgb(255,255, 255);
}

.selected{
	background-color:rgb(0, 255, 0);
}
.btn:hover{
	cursor:pointer;
}

.formula_list{
	position:absolute;
	left:1000px;
	top:30px;
}

.cy_test{
	position:relative;
}
</style>