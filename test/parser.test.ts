import fs from 'fs';
import assert from 'assert';
import path from 'path';
import { parse, SyntaxError } from '../src/parser';

const inputsDir = path.join(__dirname, 'inputs/');
const files = fs.readdirSync(inputsDir);
const inputs = files.reduce((acc: any, fileName: string) => {
  return {
    ...acc,
    [fileName]: fs.readFileSync(path.join(inputsDir, fileName), { encoding: 'utf8' }),
  };
}, {})

describe("tsc-parser", () => {
  test("simplest", () => {
    const items = parse(inputs['simplest.txt']);
    assert.deepStrictEqual(items, [
      {
        type: 'Item',
        value: {
          path: {
            type: 'Path',
            value: 'path/to/file.ts'
          },
          cursor: {
            type: 'Cursor',
            value: {
              line: 1,
              col: 2
            }
          },
          tsError: {
            type: 'TsError',
            value: {
              type: 'error',
              errorString: 'TS0',
            }
          },
          message: 'abc\n'
        }
      }
    ])
  });

  test("brace-in-path", () => {
    // This issue could probably be solved with better grammar
    // However '(' character in file path is rare and an edge case.
    // This unit test documents the flaw in the grammar.
    assert.throws(() => {
      parse(inputs['brace-in-path.txt']);
    }, SyntaxError)
  });

  test("cursor-line-not-number", () => {
    assert.throws(() => {
      parse(inputs['cursor-line-not-number.txt']);
    }, SyntaxError)
  });

  test("empty input", () => {
    assert.deepStrictEqual(parse(''), []);
    assert.deepStrictEqual(parse('  \n  \n   '), []);
  });

  test("extra-newlines", () => {
    const items = parse(inputs['extra-newlines.txt']);
    assert.deepStrictEqual(items, [
      {
        type: 'Item',
        value: {
          path: {
            type: 'Path',
            value: 'path'
          },
          cursor: {
            type: 'Cursor',
            value: {
              line: 1,
              col: 1
            }
          },
          tsError: {
            type: 'TsError',
            value: {
              type: 'error',
              errorString: 'TS0',
            }
          },
          message: 'abc\n  defg\n  hijk\n'
        }
      },
      {
        type: 'Item',
        value: {
          path: {
            type: 'Path',
            value: 'path'
          },
          cursor: {
            type: 'Cursor',
            value: {
              line: 2,
              col: 1
            }
          },
          tsError: {
            type: 'TsError',
            value: {
              type: 'error',
              errorString: 'TS1',
            }
          },
          message: ' testing\n  second line\n\n  third line\n'
        }
      }
    ])
  });

  test("real", () => {
    const items = parse(inputs['real.txt']);
    assert.deepStrictEqual(items, [
      {
        type: 'Item',
        value: {
          path: {
            type: 'Path',
            value: 'src/actions.ts'
          },
          cursor: {
            type: 'Cursor',
            value: {
              line: 691,
              col: 20
            }
          },
          tsError: {
            type: 'TsError',
            value: {
              type: 'error',
              errorString: 'TS7006',
            }
          },
          message: ` Parameter 'error' implicitly has an 'any' type.\n\n\n\n`
        }
      },
      {
        type: 'Item',
        value: {
          path: {
            type: 'Path',
            value: 'src/actions.ts'
          },
          cursor: {
            type: 'Cursor',
            value: {
              line: 711,
              col: 17
            }
          },
          tsError: {
            type: 'TsError',
            value: {
              type: 'error',
              errorString: 'TS7006',
            }
          },
          message: ` Parameter 'dispatch' implicitly has an 'any' type.\n`
        }
      },
      {
        type: 'Item',
        value: {
          path: {
            type: 'Path',
            value: 'node_modules/connected-react-router/index.d.ts'
          },
          cursor: {
            type: 'Cursor',
            value: {
              line: 4,
              col: 42
            }
          },
          tsError: {
            type: 'TsError',
            value: {
              type: 'error',
              errorString: 'TS7016',
            }
          },
          message: [
            ` Could not find a declaration file for module 'react-redux'. '/home/user/code/ui/node_modules/react-redux/lib/index.js' implicitly has an 'any' type.`,
            `  Try \`npm install @types/react-redux\` if it exists or add a new declaration (.d.ts) file containing \`declare module 'react-redux';\`\n\n`,
          ].join('\n')
        }
      },
      {
        type: 'Item',
        value: {
          path: {
            type: 'Path',
            value: 'node_modules/immutable/dist/immutable-nonambient.d.ts'
          },
          cursor: {
            type: 'Cursor',
            value: {
              line: 187,
              col: 20
            }
          },
          tsError: {
            type: 'TsError',
            value: {
              type: 'error',
              errorString: 'TS2430',
            }
          },
          message: [
            ` Interface 'List<T>' incorrectly extends interface 'Indexed<T>'.`,
            `  Types of property 'concat' are incompatible.`,
            `    Type '<C>(...valuesOrCollections: (C | Iterable<C>)[]) => List<T | C>' is not assignable to type '<C>(...valuesOrCollections: (C | Iterable<C>)[]) => Indexed<T | C>'.`,
            `      Type 'List<T | C>' is not assignable to type 'Indexed<T | C>'.`,
            `        Types of property 'first' are incompatible.`,
            `          Type '() => T | C | undefined' is not assignable to type '<NSV>(notSetValue?: NSV | undefined) => T | C | NSV'.`,
            `            Type 'T | C | undefined' is not assignable to type 'T | C | NSV'.`,
            `              Type 'undefined' is not assignable to type 'T | C | NSV'.\n`,
          ].join('\n')
        }
      },
    ])
  });
});
