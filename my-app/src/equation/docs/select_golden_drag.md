3 cases of selecting to drag out of bracket:
    1. selecting one by one, when all same items selected
    blue arrow changes to yellow arrow
    [a]b + [a]c + ad => [a]b + [a]c + [a]d

    2. deselecting after yellow arrow
    yellow arrow achanges to blue arrow
    [a]b + [a]c + [a]d => [a]b + [a]c + ad

    3. deselecting sibling (b)
    cause selections of [a] turn yellow
    [ab] + [a]c + [a]d => [a](b) + [a]c + [a]d

Drag begin by propagating upwards into bx level:
    1. it => [C1] => bx => [C2] => br => [C3] => bx
    up 3 levels of Container.svelte 
    fn: bubble_up(event) => fn: init_drag_out_bracket()

    2. Mock conditions to trigger undo_pasteAction
    condition:
        1. in_bracket = "left_to_right"
        2. left_next_bracket_x = 
        3. right_next_bracket_x =
        4. op.pasted_tree_names = []

    2.
    


