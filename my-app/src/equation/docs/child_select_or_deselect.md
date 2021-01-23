child_select
1. Normal Box or Item selected 
    1. on:select propagate up into Container.svelte
        item => container for parent box 
        box => container for parent bracket or equation
    2. bracket select_in
    3. if all child selected => propagate up next container
        [a][b][c] => [abc]
        
        3.1 at the same time construct sub_formula structure

    4. if not all child selected
        normal case just show_arrow for e_tree that propagated up
        new case deal with yellow arrow problem

        {
            4 conditions for yellow arrow
            1. show_arrow = true
            2. same depth
            3. same parent 
            4. special case [-y] and [y]
        }

        1. isolate sub_e_tree
            [-y] get y Item tree from Box tree
            [y] get y Item tree from Box tree

        2. 

