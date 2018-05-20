'use strict';

//  https://en.wikipedia.org/wiki/Fisher–Yates_shuffle

//  shuffle :: Array a -> Undefined
module.exports = function(xs) {
  for (var i = xs.length - 1; i > 0; i -= 1) {
    var j = Math.floor (Math.random () * (i + 1));
    var x = xs[i];
    xs[i] = xs[j];
    xs[j] = x;
  }
};
