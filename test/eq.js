'use strict';

const assert = require ('assert');

const show = require ('sanctuary-show');

const Z = require ('..');


//  eq :: (Any, Any) -> Undefined !
module.exports = function eq(actual, expected) {
  assert.strictEqual (arguments.length, eq.length);
  assert.strictEqual (show (actual), show (expected));
  assert.strictEqual (Z.equals (actual, expected), true);
};
