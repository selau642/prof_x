Project drag out of bracket:
Example: 
ac + bc => (a+b)c

2 part plan to rewrite:
1. Selection
2. Drag & Drop

Selection Plan
1. Dificult: Refactor select/deselect into container from Item, Box, Bracket
previously not possible without tree.parentNode access to change show_arrow and selected status of parent
    1.1 start with Item first
DONE!

2. Easy: Write the makeEquation on selection to store in container
DONE!

2.1 DEBUG:
given ab(c+d)
drag a over (c+d)
drag b over (c+d) a bug occurs
DONE HOT FIX! 
REASON: op.pasted_tree_names not empty after undo_pasteAction and pasteIntoParent

3. HARD: if selection same subformula =. trigger yellow arrow
    3.1 SELECT DONE!
    3.2 DESELECT DONE!
    3.3 DESELECT Neighbour DO

Drag
1. Easy: clone the write item DONE!
2. Medium: setup right parameter for undo_pasteAction
like pasted_tree_name = DONE!
    2.1 debug 
3. Case for (b+e) item
(a[(b+e)] + d[(b+e)] + c[(b+e)]) => (a + d + c)(b+e)
Debug with (a+b)(c+d) case:
    3.1 BUG: selection become yellow 
    = DONE!
    3.2 BUG: 
    (ac-bc) - (ad-bd) = f
    = DONE !
    when click both brackets something wrong with selected child
    3.3 BUG:
    unable to drag out c from (ac-bc) 
    = DONE!
4. Case for number 1
([a]+b[a]) => (1 + b)[a]
= DONE!
5. [a]( b + c ) => (b[a] + c[a]) =>
bracket length inside_bracket must recalculate
=DONE!

    5.1 Debug select xy and -y 
    check conditions first
    before setting up for rerendering\
    = DONE!

    5.2 BUG:
    (x-1)y -(x-1)2 
    click y, first(x-1), (x-1) to reproduce

    doesn't happen if rerender equation
    only happens when drag and bracket manulaly

    weird bug:
    (x-1)y [-(2x-2)] 
    happens when click deselect 
    it triggers child select
    async behaviour of deselect

    reason:
    deselect happens by clicking every element which have selected
    but for brackets it clicks 2 times
    deselect then select
    sometimes the rendering of Svelte not done then
    it already select so the getShowArrrow will grab the bracket
    to compare with the bracket

    debug:
    debug by not clicking on ( or ) when deselecting
    = DONE!

    5.3 Bug
    yx - y => (x-1)y
    the -1 cannot be clicked
    = DONE!

    5.4 Bug
    after yellow arrow render
    [x]a + [x] => [x(a)] +[x]

    the +[x] portion doesn't become [+x]
    solution:
    when select a, check sibling x if got yellow arrow, use the tree.pasted_tree_names
    get the other x and change it.

    Debug: Container.svelte Line 249
    == DONE!

    5.5 Constant 6 => split into 3x2
    Edit_symbol.svelte

    == Expand into larger project

    5.6
     = zero as item problem
     34 item arrow not aligned 
     = DONE!

    5.6 side by side cause bracket appear
    {a} + b[a] + c => ( {a} + b[a] ) + c

    => DISCARD. Must always manually add bracket

6. factoring (x + 3)(y-4) => xy -4x + 3y -12 = 0
problem comes when factoring -12 into -4 x 3 or -2 x 6 , different combinations
DONE!



1. With Bracket: Aim for solving xy-2x-y+2=0  => (x-1)(y-2) = 0 => x=1 or y=2
2. With Fraction: Aim for solving 2y + 2 = -y => y = -2 / 3 
3. With Substitution/Equation dropping: Aim for solving y + x = 1, y - x = 2 => y = 3/2, x = -1/2
4. With x^2 aim for solving x^2 -2x -3 = (x+1)(x-3) = 0


Misc:
1. $tree_position is it used?
