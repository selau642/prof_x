Clone event flow

1. Click <Arrow />, creates a Clone copy( clone_obj store )
2. trigger x_drag.js on_drag_move 
3. forward to Box.svelte and handle as event function
    fn handle_drag_start
4. fn handle_drag_move updates clone_store.js
5. clone_store.js sends to subscribing Container.svelte
which unsubscribes when done


New Flow
1. Click Arrow -> Box.svelte set $clone_tree
2. $clone_tree triggers Formula.svelte
3. goto clone.js to make clone and set $clone_obj
4. $clone_obj trigger Clone2.svelte
5. Clone2.svelte set $clone_drag_move 
6. $clone_drag_move trigger clone.js, In.check_n_update(drag_x, drag_y)


