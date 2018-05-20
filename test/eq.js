'use strict';

var assert = require ('assert');

var show = require ('sanctuary-show');

var Z = require ('..');


//  eq :: (Any, Any) -> Undefined !
module.exports = function eq(actual, expected) {
  assert.strictEqual (arguments.length, eq.length);
  assert.strictEqual (show (actual), show (expected));
  assert.strictEqual (Z.equals (actual, expected), true);
};
