const fs = require('fs')
let js_file = fs.readFileSync( __dirname + '/child_selected_c.js', 'utf8').toString()
let arr_line = js_file.split(/\r\n/g)

arr_line = arr_line.map( (line) =>{
    if( line.trim().search("//") !=0 )
    {
        //change to comment
        line = "//#" + line
    }
    else
    {
        //uncomment 
        line = line.replace("//", "")
    }
    return line
})

let text = arr_line.join("\r\n")

fs.writeFileSync(__dirname + '/child_selected_code.js', text )