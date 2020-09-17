// ts-pegjs plugin supports returnTypes in the config json file
// but it didn't affect the generated output at all. See these issues:
// https://github.com/metadevpro/ts-pegjs/issues/46
// https://github.com/metadevpro/ts-pegjs/issues/27
// https://github.com/pegjs/pegjs/issues/562

// As a workaround, we expose the types here
export interface GrammarPath {
  type: 'Path';
  value: string;
}

export interface GrammarCursor {
  type: 'Cursor';
  value: {
    line: number;
    col: number;
  };
}

export interface GrammarTsError {
  type: 'TsError';
  value: {
    type: 'error' | 'warning';
    errorString: string;
  };
}

export interface GrammarMessage {
  type: 'Message';
  value: string;
}

export interface GrammarItem {
  type: 'Item';
  value: {
    path: GrammarPath;
    cursor: GrammarCursor;
    tsError: GrammarTsError;
    message: GrammarMessage;
  };
}
