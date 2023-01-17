#!/usr/bin/env node

import fs from 'fs';
import util from 'util';

import { parse } from 'src/parser';

const readFileAsync = util.promisify(fs.readFile);

function streamToString(stream: NodeJS.ReadStream): Promise<string> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

async function main() {
  let text;

  if (process.argv.length < 3) {
    process.stdin.resume();
    // Here we don't need to worry memory, the input stream shouldn't be huge
    text = await streamToString(process.stdin);
  } else {
    text = await readFileAsync(process.argv[2], { encoding: 'utf8' });
  }

  const result = parse(text);
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(2);
  });
}

module.exports = main;
