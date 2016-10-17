'use strict';

var eq = require('./eq');


//  curry2 :: ((a, b) -> c) -> (a -> b -> c)
module.exports = function curry2(f) {
  eq(arguments.length, 1);
  return function(x) {
    eq(arguments.length, 1);
    return function(y) {
      eq(arguments.length, 1);
      return f(x, y);
    };
  };
};
