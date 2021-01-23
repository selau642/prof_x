export default function transformer(file, api) {
    const j = api.jscodeshift;
  
    return j(file.source)
      .find(j.ObjectExpression)
      .forEach(path => {
          let parentNode = path.parentPath.value
          let branch_name
          if( parentNode.id )
          {
            //is VariableDeclaration
            branch_name = parent.id.name
          }
          else if( parent.key )
          {
            //is Property
            branch_name = parent.key.name
          }           
          
          let start = path.node.loc.start.line
          let end = path.node.loc.end.line
          console.log( branch_name )
          console.log('start:', start, 'end:', end)
      })
      .toSource();
  }