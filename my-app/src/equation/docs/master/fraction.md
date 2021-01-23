Fraction Structure

1. bx_1-fr_1-top_1-i_1
fr_1 = item type
top_1 = box_type

=======

Dynamics:
1. cross_below_equal_sign, cross_above_equal_sign  

state: box -->> frac_bottom
{a} = b  -->>  1 = b / {a}

state: frac_bottom -->> box 
b / {a} = 1  -->>  b = {a}


state: item -->> frac_bottom
{a}b = c -->>  b = c / {a}

state: frac_bottom -->> item  
1 / {a}  = b --> 1 = {a}b


=====


2. merge_siblings, unmerge_siblings

state: frac_bottom -->> frac_bottom
a + b / {c}  -->>  (a{c} + b) / {c}

state: box -->> frac_top
({a} + b) / c  -->> {a} / c + b / c


======

3. Drag up cancel item
ac / {c} -->> a 


=====


4. Drag Up Invert, Drag Down Invert
1 /{(1 / c)} --> {c}

{c} --> 1/ {( 1/c )}

5. Drag Up exit, Drag Down enter

(a+b) / {c}  -->>  1/{c} (a+b)

1/{c} (a+b)  -->> (a+b) /{c}
