Interaction model

Start
===

1. on:click Arrow 
2. Initiate boundaries
3. Detect cross boundaries
6. Update tree
7. Update UI
8. tick() ==> re Initiate boundary

===

Drag States => Interaction => Re-initialise State

1. Box 
    - swap left/right => Box

    Fraction Line Combine/Split:
    - enter fraction => combine into fraction => Box in Fraction_top ( Undo )
    - exit fraction => split into fraction => Fraction_top ( Undo )

    Equal Sign:
    - cross above equal sign => Box
    - cross below equal sign => Fraction_bottom


2. Item / Bracket
    - swap left/right => Item

    Bracket:
    - enter bracket => Yellow in_bracket
    
    Fraction:
    - cross below equal sign => Fraction_bottom

3. Yellow in_bracket
    - exit bracket => Item

4. Fraction_top
    - go below one frac line => if same sub_formula, cancel Fraction ( Undo )
    - go below two frac line => Fraction_bottom
    - exit fraction => Item
    
    Bracket:
    - exit bracket => Yellow in_bracket (child_selected update)

    Equal Sign:
    - cross below equal sign => Fraction_bottom 
    
     
   
5. Fraction_bottom
    - go above two frac line => Frac_top
    - go above one frac line => if same sub_formula, cancel Fraction ( Undo)
    - exit fraction => Fraction_Bottom

    Equal Sign:
    - cross above equal sign => Frac_top or box or item
    
    Combine/Split Fraction Line:
        handle by Box


=====
