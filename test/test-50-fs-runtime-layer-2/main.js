#!/usr/bin/env node

'use strict';

const path = require('path');
const assert = require('assert');
const utils = require('../utils.js');

assert(!module.parent);
assert(__dirname === process.cwd());

const target = process.argv[2] || 'host';
const input = './test-x-index.js';
const output = './run-time/test-output.exe';

// see readFromSnapshot "NODE_VERSION_MAJOR"

function bitty (version) {
  return (2 * (/^(node|v)?4/.test(version))) |
         (2 * (/^(node|v)?5/.test(version))) |
         (4 * (/^(node|v)?6/.test(version))) |
         (4 * (/^(node|v)?7/.test(version)));
}

const version1 = process.version;
const version2 = target;
if (bitty(version1) !== bitty(version2)) return;

let left, right;
utils.mkdirp.sync(path.dirname(output));

left = utils.spawn.sync(
  'node', [ path.basename(input) ],
  { cwd: path.dirname(input) }
);

utils.pkg.sync([
  '--target', target,
  '--output', output, input
]);

right = utils.spawn.sync(
  './' + path.basename(output), [],
  { cwd: path.dirname(output) }
);

assert.equal(left, right);
utils.vacuum.sync(path.dirname(output));
