'use strict';

//  https://en.wikipedia.org/wiki/Quicksort#Hoare_partition_scheme

//  quicksort :: (Array a, (a, a) -> Number, Integer, Integer) -> Undefined
function quicksort(xs, cmp, lo, hi) {
  if (lo < hi) {
    var idx = partition (xs, cmp, lo, hi);
    quicksort (xs, cmp, lo, idx);
    quicksort (xs, cmp, idx + 1, hi);
  }
}

//  partition :: (Array a, (a, a) -> Number, Integer, Integer) -> Integer
function partition(xs, cmp, lo, hi) {
  var pivot = xs[lo];
  var i = lo - 1;
  var j = hi + 1;
  while (true) {
    do i += 1; while (cmp (xs[i], pivot) < 0);
    do j -= 1; while (cmp (xs[j], pivot) > 0);

    if (i >= j) return j;

    var x = xs[i];
    xs[i] = xs[j];
    xs[j] = x;
  }
}

//  defaultComparator :: (a, a) -> Number
function defaultComparator(x, y) {
  return x < y ? -1 : x > y ? 1 : 0;
}

//  withUnstableArraySort :: (() -> Undefined) -> Undefined
exports.withUnstableArraySort = function(thunk) {
  var Array$prototype$sort = Array.prototype.sort;
  Array.prototype.sort = function(_cmp) {
    var cmp = arguments.length < 1 ? defaultComparator : _cmp;
    quicksort (this, cmp, 0, this.length - 1);
    return this;
  };
  try {
    thunk ();
  } finally {
    Array.prototype.sort = Array$prototype$sort;
  }
};
