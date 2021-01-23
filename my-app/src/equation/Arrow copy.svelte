<script>

//Dragging
import { x_drag } from './actions/x_drag.js'

export let type;
export let left = 0
export let isDraggable = false

</script>
{#if type == 'bottom'}
	{#if !isDraggable}
		<span class="arrow_wrapper">
			<span 
			class="bottom arrow" 
			style="left:{left}px" 
			on:click|stopPropagation 
			on:mousedown
			></span>
		</span>
	{:else}
		<span 
		class="bottom_drag arrow" 
		style="left:{left}px" 
		use:x_drag={isDraggable}
		on:x_drag_start
		on:x_drag_move
		on:x_drag_end
		on:mousedown
		></span>
	{/if}
{:else if type == 'multi_bottom'}
	{#if !isDraggable}
		<span class="arrow_wrapper">
			<span 
			class="multi_bottom arrow" 
			on:click|stopPropagation
			on:mousedown ></span>
		</span>
	{:else}
		<span 
		class="multi_bottom_drag arrow" 
		style="left:{left}px"
		on:click|stopPropagation 
		use:x_drag={isDraggable}
		on:x_drag_start
		on:x_drag_move
		on:x_drag_end
		></span>		
	{/if}
{:else if type == 'top'}
	{#if !isDraggable}
		<span class="arrow_wrapper">
			<span 
			class="top arrow" 
			on:click|stopPropagation 
			on:mousedown></span>
		</span>
	{:else}
	<span class="arrow_wrapper">
		<span 
		class="top arrow" 
		use:x_drag={isDraggable}
		on:x_drag_start
		on:x_drag_move
		on:x_drag_end
		on:mousedown
		></span>
    </span>
	{/if}
{:else if type=='grey'}
	{#if !isDraggable}
		<span class="arrow_wrapper">
			<span 
			class="grey arrow" 
			on:click|stopPropagation 
			on:mousedown></span>
		</span>
	{:else}
		<span 
		style="left:{left}px" 
		class="grey_drag arrow" 
		use:x_drag={isDraggable}
		on:x_drag_start
		on:x_drag_move
		on:x_drag_end
		on:mousedown
		></span>
	{/if}
{:else if type=='yellow'}
	{#if !isDraggable}
		<div class="arrow_wrapper">
			<span 
			class="yellow arrow" 
			on:click|stopPropagation 
			on:mousedown></span>
		</div>
	{:else}
		<span 
		class="yellow_drag arrow" 
		style="left:{left}px" 
		use:x_drag={isDraggable}
		on:x_drag_start
		on:x_drag_move
		on:x_drag_end
		on:mousedown
		></span>
	{/if}
{:else if type == 'multi_top'}
	{#if !isDraggable}
		<div class="arrow_wrapper">
			<span 
			class="multi_top arrow" 
			on:click|stopPropagation 
			on:mousedown></span>
		</div>
	{:else}
		<span 
		class="multi_top_drag arrow" 
		style="left:{left}px"
		on:click|stopPropagation 
		use:x_drag={isDraggable}
		on:x_drag_start
		on:x_drag_move
		on:x_drag_end
		></span>		
	{/if}
{/if}

<style>
.arrow
{
	cursor:pointer;
}

.arrow_wrapper{
	position:relative;
	left:-50%; /* For positioning <Arrow /> at the end*/
	margin: 0px auto;
}

.top 
{
  position: absolute;
  height:21px;
  width:20px;
  left:-10px; /* 1/2 of width */
  top:-34px;
  background:rgb(255,0,0);
}

.top:hover
{

  background:rgb(0, 255 , 0);
}

.top:hover:after
{
  border-top-color:rgb(0, 255 , 0);
}

.top:after
{
	top: 100%;
	left: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
  	border-top-color:rgb(255,0,0);
	border-width: 10px;
	margin-left: -10px;
}

.top_drag 
{
  position: absolute;
  height:21px;
  width:20px;
  top:-34px;
  background:rgb(0, 255,0);
	/* background: #88b7d5; */
	/* border: 4px solid #c2e1f5; */
}


.top_drag:after
{
	top: 100%;
	left: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
  	border-top-color:rgb(0, 255,0);
	border-width: 10px;
	margin-left: -10px;
}

.yellow 
{
  position: absolute;
  height:21px;
  width:20px;
  left:-10px;
  top:-34px;
  background:rgb(220,220,0); /* yellow */
	/* background: #88b7d5; */
	/* border: 4px solid #c2e1f5; */
}

.yellow:hover
{
  background:rgb(0, 255 , 0);
}

.yellow:hover:after
{
  border-top-color:rgb(0, 255 , 0);
}


.yellow:after
{
	top: 100%;
	left: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
  	border-top-color:rgb(220,220,0);
	border-width: 10px;
	margin-left: -10px;
}

.yellow_drag 
{
  position: absolute;
  height:21px;
  width:20px;
  top:-34px;
  background:rgb(0, 255,0);
	/* background: #88b7d5; */
	/* border: 4px solid #c2e1f5; */
}


.yellow_drag:after
{
	top: 100%;
	left: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
  	border-top-color:rgb(0, 255,0);
	border-width: 10px;
	margin-left: -10px;
}

.bottom 
{
  position: absolute;
  height:20px;
  width:20px;
  left: -10px;
  bottom:-34px;
  background:rgb(255,0,0);
/* background: #88b7d5; */
/* border: 4px solid #c2e1f5; */
}


.bottom:after
{
	bottom: 100%;
	left: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
  	border-bottom-color:rgb(255,0,0);
	border-width: 10px;
	margin-left: -10px;
}

.bottom:hover
{
  background:rgb(0, 255 , 0);
}

.bottom:hover:after
{
  border-bottom-color:rgb(0, 255 , 0);
}

.multi_top
{
  position: absolute;
  height:21px;
  width:20px;
  left:-10px;
  top:-34px;
  background:rgb(0,0,255);
	/* background: #88b7d5; */
	/* border: 4px solid #c2e1f5; */
}

.multi_top_drag
{
  position: absolute;
  height:21px;
  width:20px;
  top:-34px;
  background:rgb(0,255,0);
	/* background: #88b7d5; */
	/* border: 4px solid #c2e1f5; */
}

.multi_top:hover
{
  background:rgb(0, 255 , 0);
}

.multi_top:hover:after
{
  border-top-color:rgb(0, 255 , 0);
}

.multi_top:after
{
	top: 100%;
	left: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
  	border-top-color:rgb(0, 0, 255);
	border-width: 10px;
	margin-left: -10px;
}

.multi_top_drag
{
  position: absolute;
  height:21px;
  width:20px;
  top:-34px;
  background:rgb(0,255,0);
	/* background: #88b7d5; */
	/* border: 4px solid #c2e1f5; */
}


.multi_top_drag:after
{
	top: 100%;
	left: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
  	border-top-color:rgb(0, 255, 0);
	border-width: 10px;
	margin-left: -10px;
}

.multi_bottom 
{
  position: absolute;
  height:20px;
  width:20px;
  left: -10px;
  bottom:-34px;
  background:rgb(0,0,255);
/* background: #88b7d5; */
/* border: 4px solid #c2e1f5; */
}


.multi_bottom:after
{
	bottom: 100%;
	left: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
  	border-bottom-color:rgb(0, 0, 255);
	border-width: 10px;
	margin-left: -10px;
}

.multi_bottom:hover
{
  background:rgb(0, 255 , 0);
}

.multi_bottom:hover:after
{
  border-bottom-color:rgb(0, 255 , 0);
}

.multi_bottom_drag 
{
  position: absolute;
  height:20px;
  width:20px;
  bottom:-34px;
  background:rgb(0, 255, 0);

}

.multi_bottom_drag:after
{
	bottom: 100%;
	left: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
  	border-bottom-color:rgb(0, 255, 0);
	border-width: 10px;
	margin-left: -10px;
}

.grey 
{
  position: absolute;
  height:21px;
  width:20px;
  left: -10px;
  top:-34px;
  background:rgb(120,120,120); /* yellow */
	/* background: #88b7d5; */
	/* border: 4px solid #c2e1f5; */
}

.grey:hover
{
  background:rgb(0, 255 , 0);
}

.grey:hover:after
{
  border-top-color:rgb(0, 255 , 0);
}

.grey:after
{
	top: 100%;
	left: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
  	border-top-color:rgb(120,120,120);
	border-width: 10px;
	margin-left: -10px;
}

.grey_drag 
{
  position: absolute;
  height:21px;
  width:20px;
  top:-34px;
  background:rgb(0, 255,0);
	/* background: #88b7d5; */
	/* border: 4px solid #c2e1f5; */
}


.yellow_drag:after
{
	top: 100%;
	left: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
  	border-top-color:rgb(0, 255,0);
	border-width: 10px;
	margin-left: -10px;
}
</style>



