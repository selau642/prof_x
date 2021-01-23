export let d = {
    print:function( title_text=false, obj )
    {
        let msg_str = ""

        if( title_text )
        {
            msg_str = msg_str + title_text
        }        

        for( let key of obj )
        {
            msg_str = msg_str + `${key}:` + key + ','
        }
        console.log( msg_str )
    }

}