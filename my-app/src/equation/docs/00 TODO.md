Project Fractions

1. Start Fraction !

1. Container context transfer & clone_obj transfer = DONE!
2. Subformula refactor = DONE!

1. Debug drag in_bracket = DONE!

1. transfer to container tommorow to test
    1.1 cross_over_equal_sign bug
        pull into box.js before tree = tree 
        Test this on Chrome
1. box.js 
=> transfer the check_clone_sign over real one to test = DONE!

1. Refactor more of drag_state into object? = DONE!


Debug Render:
1. fraction_line not red     = DONE!
2. cannot drag box..got error = DONE!

TO DO:
1. separate the Interactions according to interact.md = DONE
    1.1 debug the multi bracket dragging
    = DONE
2. Refactor into drag_state = DONE!
    2.1 debug Equation.svelte drag cross over 
        using tick()
    = DONE!


1.  Split Fraction.svelte into Top.svelte and Bottom.svelte 
== DONE!
2. Debug / parse_eq
== DONE!

1. Top Show Arrow and Bottom Show Arrow
== DONE!


Standard process:
1. xTree Parsing
2. Svelte UI rendering
3. Selecting, Subformula Building
4. Interacting


Refactoring for speed:
1. pasted_tree_names into set
2. pointer -> cut cut cut -> change pointer -> paste paste paste
3. equation left right
4. fraction top bottom
5. equation rotator
6. addChild type and props.type overlap

1. parse_eq

Render 2/3 as box with frac_tree: as denominator
    

2. bottom click select

3. nested frac

4. eq drag over

super n sub script in Item
square root
log and exponent
