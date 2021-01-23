Project
Editable Items and Boxes

TODO:
1. Remove Item DONE!
2. Add Item [?] DONE!

DEBUG:
1. Add 3 dot 2 case
DONE!
1.1 construction of sub_formula to account for 3 dot 2 case
DONE!
1.2 bug when dragging cdot 2 =>
DONE!

2. parse_eq error for formula: (x+9)=3 
DONE!
3. drag_in_bracket error after edit_formula
DONE!
4. edit item of (x+y) => (x+y) +6 becomes item
DONE!

[a] => [ editable by typing] => parse by parser => a + b + c new equation

1. Item editable
=> add bracket
 a[b] => a[>_b+c] => a [(b+c)]
=> Coeff with *
 [3] => [>_3*2] => [3.2]

2. Box Editable
=> [a] => [>_ a + b +c] => [(a+b+c)]

3. Equation Editable
...+b[?] => +b[>_a] => +b[+a]

