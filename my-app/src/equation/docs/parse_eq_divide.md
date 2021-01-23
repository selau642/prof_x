Notes on how parse_eq divide works
a/b  => frac-top-box-item-a
        frac-bottom-box-item-b

1. use arr_bracket to count brackets after meeting a "/"
arr_bracket.push(0)
in isDivide.test pass
2. meaning of arr_bracket = [3,1,0]
arr_bracket.length = 3 => means there are 3 NESTED occurance of / 
if 1/2 + 2/3 the divide is not considered nested
because it will be resolved
but 1/(1 + 2/[a] + 3/2) has 2 nested at position []

3. meaning of items [3, 1, 0]
for first /: 3 open brackets that has not been closed
for second /: 1 open bracket not yet closed
for thirds /: 0 open brackets. all closed

Case Tree:
1. (a+1/[2])+1 => at 2
1.1 token:      isCloseBracket
    2:          [0]
    pointer:    eq-[box]-bracket-box-frac-bot-{box}-item-text:2

    isCloseBracket Operation:
    [0] => [-1]
    shift[-1] => []
    getParentOf('br')



2. a/(b+c/[d]+1)
2.1 token:      isPlusMinus
    d:          [1,0]
    pointer:    box-frac-bot-bracket-[box]-frac-bot-{box}-item-text:d

    isPlusMinus Operation:
    [1,0] => [1]
    getParentOf('fr')



3. a/(b+c/(d+[e])+1)
3.1 token:      isCloseBracket
    e:          [2, 1] 
    pointer:    box-frac-bot-bracket-box-frac-[bot]-BRACKET-{box}-item-text:e

    isCloseBracket Operation:
    [2, 1] => [1, 0]
    getParentOf('br')

3.2 nextToken:  isPlusMinus
    e:          [1,0]
    pointer:     box-frac-bot-bracket-[box]-frac-{bot}

    isPlusMinus Operation:
    shift [1, 0] => [1]
    getParentOf('fr') 



4. a/(b + c/(d+[e])) + g
4.1 token:      isCloseBracket )
    e:          [2, 1] 
    pointer:    box-frac-bot-bracket-box-frac-[bot]-BRACKET-{box}-item-text:e

    isCloseBracket Operation:
    [2, 1] => [1, 0]
    getParentOf('br')

4.2 nextToken:  isCloseBracket )
    e:          [1,0]
    pointer:     box-frac-[bot]-bracket-box-frac-{bot}

    isCloseBracket Operation:
    [1, 0] => [0, -1]
    shift[ 0, -1] => [0]
    getParentOf('br')

4.3 nextToken:  isPlusMinus +
    e:          [0]
    pointer:    [box]-frac-{bot}

    isPlusMinus Operation:
    shift [0] => []
    getParentOf('fr') !! can be replace with getParentOf('bx')


General Form:

isOpenBracket:
    [a, b, ...] => [a+1, b+1, ...]

isFraction:
    [...].push(0) => [..., 0]

isCloseBracket:
    [a, b, ...] => [a-1, b-1, ...]
    if [].length > 0 && [].last_element == -1:
        remove last_item
    getParentOf('br')

isPlusMinus:
    if [].length != 0 && [].last_element == 0:
        remove last_element
        getParentOf('fr') 

    [standard]

Final Conclusion:
1. arr_bracket.length is to solve
a/e + b
a + b
for isPlusMinus Operation

2. counting brackets for case
a/([c] + )

if not due to one divide, 
token + will cause the bracket to close
when doing getParentOf('fr')