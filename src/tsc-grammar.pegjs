// Parses error messages from TypeScript compiler output (not the --pretty one)
// There's a VSCode Peg.js extension to support syntax highlighting

// Example output:
// node_modules/connected-react-router/index.d.ts(4,42): error TS7016: Could not find a declaration file for module 'react-redux'. '/home/user/code/ui/node_modules/react-redux/lib/index.js' implicitly has an 'any' type.
//   Try `npm install @types/react-redux` if it exists or add a new declaration (.d.ts) file containing `declare module 'react-redux';`
// node_modules/connected-react-router/index.d.ts(92,7): error TS2314: Generic type 'Reducer' requires 1 type argument(s).
// node_modules/immutable/dist/immutable-nonambient.d.ts(187,20): error TS2430: Interface 'List<T>' incorrectly extends interface 'Indexed<T>'.
//   Types of property 'concat' are incompatible.
//     Type '<C>(...valuesOrCollections: (C | Iterable<C>)[]) => List<T | C>' is not assignable to type '<C>(...valuesOrCollections: (C | Iterable<C>)[]) => Indexed<T | C>'.
//       Type 'List<T | C>' is not assignable to type 'Indexed<T | C>'.
//         Types of property 'first' are incompatible.
//           Type '() => T | C | undefined' is not assignable to type '<NSV>(notSetValue?: NSV | undefined) => T | C | NSV'.
//             Type 'T | C | undefined' is not assignable to type 'T | C | NSV'.
//               Type 'undefined' is not assignable to type 'T | C | NSV'.
// src/actions.ts(691,20): error TS7006: Parameter 'error' implicitly has an 'any' type.
// src/actions.ts(711,17): error TS7006: Parameter 'dispatch' implicitly has an 'any' type.


Main = _ items:(Item)* _ { return items }

Item = path:Path cursor:Cursor ":" _ tsError:TsError _ ":" message:Message {
  return {
    type: 'Item',
    value: {
      path,
      cursor,
      tsError,
      message,
    }
  }
}

Message = line:TextLine extraLines:(MessageExtraLine)* { return `${line}${extraLines.join('')}` }

MessageExtraLine = indent:MessageExtraLineStart tail:TextLine { return `${indent}${tail}` }

// Two spaces (at least) to start the extra line
MessageExtraLineStart = indent:"  " { return indent }

TsError = type:TsErrorType " TS" num:Integer {
  return {
    type: 'TsError',
    value: {
      type,
      errorString: `TS${num}`,
    }
  }
}

// I realized later that tsc doesn't output warnings. Doesn't cause
// any harm here so left it as an example.
TsErrorType = type:("error" / "warning") { return type }

Cursor = "(" _ line:Integer _ "," _ col:Integer _ ")" {
  return {
    type: 'Cursor',
    value: {
      line,
      col,
    }
  }
}

// File path, for example "node_modules/connected-react-router/index.d.ts"
// A '(' character in file path breaks this parser. Not very common though.
Path = path:[^\n\r(]+ {
  return {
    type: 'Path',
    value: path.join('')
  }
}

TextLine = text:(AnyCharExceptNewLine)+ newlines:"\n"* { return `${text.join('')}${newlines.join('')}` }

AnyCharExceptNewLine = [^\n\r]

Integer = digits:[0-9]+ { return parseInt(digits.join(''), 10) }

// Whitespace
_  = [ \t\r\n]* { return null }
