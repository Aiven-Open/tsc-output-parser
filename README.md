# tsc-output-parser

Parses errors from tsc output to a structured JSON format.

Converts tsc output:

```
src/actions.ts(691,20): error TS7006: Parameter 'error' implicitly has an 'any' type.
```

to JSON:

```json
[
  {
    "type": "Item",
    "value": {
      "path": {
        "type": "Path",
        "value": "src/actions.ts"
      },
      "cursor": {
        "type": "Cursor",
        "value": {
          "line": 691,
          "col": 20
        }
      },
      "tsError": {
        "type": "TsError",
        "value": {
          "type": "error",
          "errorString": "TS7006"
        }
      },
      "message": {
        "type": "Message",
        "value": " Parameter 'error' implicitly has an 'any' type.\n"
      }
    }
  }
]
```

## Install

Install with `npm i -g @aivenio/tsc-output-parser`.


## Usage


### CLI

**Via temporary file:**

```bash
tsc --strict --noEmit > ts.out
tsc-output-parser ts.out > errors.json
```

**By piping:**

```bash
tsc --strict --noEmit | tsc-output-parser
```

### API

```typescript
import { parse } from '@aivenio/tsc-output-parser';

const input = `
src/actions.ts(691,20): error TS7006: Parameter 'error' implicitly has an 'any' type.
`;

const errors = parse(input);
```


## Test examples

To convert the real.txt test example, clone the repo and run:

```
npm install
npm run peg
./node_modules/.bin/ts-node src/cli.ts test/inputs/real.txt
```


## Motivation

To migrate our code base to TypeScript using strict types, we built
tooling to track our progress. The parsing could've been done in many *(probably
easier)* ways, but it serves as a good example of using [PEG.js](https://pegjs.org/)
to parse text.
