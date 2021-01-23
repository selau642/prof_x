let { f } = require('./parse_formula')

let a = f.parseFormula('-(a+b)/c=h')

recursive_print(a)

function recursive_print(a, p_name='')
{
    for( let elem_name of a.list)
    {
        let elem = a[ elem_name ]
        let branch
        if( elem_name.search('f_') > -1)
        {
            branch = elem_name
        }
        else
        {
           branch = p_name + '-' + elem_name
        }

        if( elem.props.text )
        {
            branch += '-text: ' + elem.props.text
        }

        
        
        if( elem.list.length > 0 )
        {
            recursive_print( elem , branch)
        }
        else
        {
            console.log( branch )
        }
    }
}