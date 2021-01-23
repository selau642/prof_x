<script>
// import { blockSelect } from './actions/clone_stores.js'

// event Bubble up sequence
// when clicking on another div
// 1. div on:mousedown  (set stopDragSelect True) 
//    => window on:mousedown 
//    (if stopDragSelect true, stop create selection box)
// 2. div on:mouseup  
//    => window on:mouseup 
//   ( Selection.svelte will reset stopDragSelect to false )

// when just clicking window
// 1. window on:mousedown ( set on:mousemove & on:mouseup )
// 2. window on:mousemove draw box
// 3. window on:mouseup 
//  ( if contain item, bracket then select )
//  ( else deselect ) 

// IMPORTANT: 
// elem.dispatchEvent( new Event('mousedown')) will not trigger 
// window.onmousedown
// have to separately reset $stopDrag= false

let left = 0
let top = 0
let width = 0
let height = 0

let x1 = null
let x2 = null
let y1 = null
let y2 = null

let display = 'none'

let isMouseDown = false
let isMouseMove = false
function select_mouse_down(e)
{    

    let div = e.target
    let { tagName, classList } = div

    if( tagName == 'HTML'
    || tagName == 'MAIN' 
    || ( classList.contains('border_wrap') 
        && !classList.contains('not_empty') )
    || classList.contains('bracket')
    || classList.contains('right')
    || classList.contains('left')
    || classList.contains('bottom')
    || classList.contains('top') 
    )
    {
        isMouseDown = true
    }

    x1 = e.clientX
    x2 = e.clientX
    y1 = e.clientY
    y2 = e.clientY
    // if( !$stopDragSelect )
    // {
       
    //     x1 = e.clientX
    //     x2 = e.clientX
    //     y1 = e.clientY
    //     y2 = e.clientY
    //     display = 'block'
    //     window.addEventListener('mousemove', select_mouse_move)
    //     window.addEventListener('mouseup', select_mouse_up)    
    // }
    // else
    // {
    //     function resetStopDragSelect()
    //     {
    //         $stopDragSelect = false
    //         window.removeEventListener('mouseup', resetStopDragSelect)
    //     }

    //     window.addEventListener('mouseup', resetStopDragSelect ) 
    // }
}

function select_mouse_move(e)
{
    if( isMouseDown )
    // && !$blockSelect )
    {
        x2 = e.clientX
        y2 = e.clientY

        let x3 = Math.min(x1,x2)
        let x4 = Math.max(x1,x2)
        let y3 = Math.min(y1,y2)
        let y4 = Math.max(y1,y2)
        
        let dx = x4 - x3
        let dy = y4 - y3

        if( dx > 1 && dy > 1)
        {
            left = x3 
            top = y3 
            width = x4 - x3
            height = y4 - y3
            display = 'block'
            isMouseMove = true
        }
        else
        {
            display = 'none'
            isMouseMove = true
        }
    }
}

function select_mouse_up(e)
{

    if( isMouseDown )
    {
        if( isMouseMove )
        {
            click_selected_items()
            display = 'none'
            top = 0
            left = 0
            width = 0
            height = 0
        }
        else //if( !$blockSelect )
        {
            deselect_all(e)
        }
    }
    isMouseDown = false
    isMouseMove = false
    // window.removeEventListener('mousemove', select_mouse_move)
    // window.removeEventListener('mouseup', select_mouse_up)
}


// function toggle_select()
// {
//     // $isSelecting = true
//     display = 'none'
//     window.addEventListener('mousedown', select_mouse_down)
// }

function click_selected_items()
{
    let item_class = document.querySelectorAll(
        '.sym, .num, .open, .close')
    let s_top = top
    let s_bot = top + height
    let s_left = left
    let s_right = left + width    

    let count_item = 0
    Array.from(item_class).forEach( child => {
        let { 
            top: i_top, 
            bottom: i_bot,
            left: i_left,
            right: i_right    
        } = child.getBoundingClientRect()

        let top_in_b = (s_top < i_top && i_top < s_bot )
        let bot_in_b = (s_top < i_bot && i_bot < s_bot)
        let left_in_b = (s_left < i_left && i_left < s_right)
        let right_in_b = (s_left < i_right && i_right < s_right)
        
        let selected_in_box = false
        if( (top_in_b || bot_in_b) && (left_in_b || right_in_b))
        {
            // point of elem in selection box
            selected_in_box = true
        }
        else
        {
            if( 
                ( top_in_b || bot_in_b ) 
            &&  ( i_left < s_left && s_left < i_right )
            &&  ( i_left < s_right && s_right < i_right ) 
            )
            {
                //     ____
                // ___|____|___ 
                //    |____|
                
                selected_in_box = true
            }
            else if(
               ( right_in_b || left_in_b )
            && ( i_top < s_top && s_top < i_bot )
            && ( i_top < s_bot && s_bot < i_bot )
            )
            {
                //
                //  __|__
                // |  |  | 
                // |__|__|
                //    |

                selected_in_box = true
            }

        }
        
        if( selected_in_box )
        {
            count_item ++ 
        
            if( !child.classList.contains('selected') )
            {
                child.click()
            }
        }
    })

    if( count_item == 0 )
    {
        deselect_all()
    }

    // $stopDragSelect = false
    // console.log('fn:click_selected_items set stopDragSelect=false')
}


function deselect_all(e)
{    
    //Redo
    let selected_class = document
    .querySelectorAll('.selected.sym, .selected.num')

    Array.from(selected_class).forEach(elem => {
        
        if( elem.innerHTML != '(' && elem.innerHTML != ')')
        {
            // elem.dispatchEvent( new Event('mousedown') )
            // elem.dispatchEvent( new Event('mouseup') )
            // $stopDragSelect = false 
            elem.click()            
        }
    })

}
</script>
<svelte:window 
on:mousedown={select_mouse_down} 
on:mousemove={select_mouse_move}
on:mouseup={select_mouse_up}
/>
<div id='select_controls'>
    <!-- <div id='btn_select' class='btn' on:click={toggle_select}>Select</div>
    <div id='btn_deselect' class='btn' on:click={deselect_all}>Deselect All</div>
    <div style='clear:both'></div> -->
    <div 
    id='selection'
    style="display:{display};left:{left}px;top:{top}px;width:{width}px;height:{height}px;"
    ></div>
</div>

<style>
#select_controls
{
    width:fit-content;
}

#selection
{
    position:fixed;
    border:2px dotted rgb(255, 0, 0);
    display:none;
}

.btn
{
    font-family:Arial, Helvetica, sans-serif;
    text-align:center;
    float:left;
    margin: 0px 2px;
    width:fit-content;
    border:1px solid rgb(0,0,0);
    padding:4px;
    border-radius:4px;
    min-width: 26px;
    background-color: rgb(255, 255, 255);
}

.btn:hover
{
    background-color: rgb(84, 228, 84);
    cursor:pointer;
}
</style>