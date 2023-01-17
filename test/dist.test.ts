import assert from 'assert';

// eslint-disable-next-line no-restricted-imports
import * as tscOutputParser from '../dist';

// `tscOutputParser` is now the exactly as what is exposed by the built distributable
// tscOutputParser

describe('tsc-output-parser module', () => {
  test('exports expected properties', () => {
    assert.strictEqual('parse' in tscOutputParser, true);
    assert.strictEqual('SyntaxError' in tscOutputParser, true);
  });

  test('exports parser function', () => {
    assert.deepStrictEqual(tscOutputParser.parse(''), []);
  });
});
