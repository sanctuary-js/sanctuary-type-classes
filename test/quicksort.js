'use strict';

//  https://en.wikipedia.org/wiki/Quicksort#Hoare_partition_scheme

//  quicksort :: (Array a, (a, a) -> Number, Integer, Integer) -> Undefined
const quicksort = (xs, cmp, lo, hi) => {
  if (lo < hi) {
    const idx = partition (xs, cmp, lo, hi);
    quicksort (xs, cmp, lo, idx);
    quicksort (xs, cmp, idx + 1, hi);
  }
};

//  partition :: (Array a, (a, a) -> Number, Integer, Integer) -> Integer
const partition = (xs, cmp, lo, hi) => {
  const pivot = xs[lo];
  let i = lo - 1;
  let j = hi + 1;
  while (true) {
    do i += 1; while (cmp (xs[i], pivot) < 0);
    do j -= 1; while (cmp (xs[j], pivot) > 0);

    if (i >= j) return j;

    [xs[i], xs[j]] = [xs[j], xs[i]];
  }
};

//  defaultComparator :: (a, a) -> Number
const defaultComparator = (x, y) => x < y ? -1 : x > y ? 1 : 0;

//  withUnstableArraySort :: (() -> Undefined) -> Undefined
exports.withUnstableArraySort = thunk => {
  const Array$prototype$sort = Array.prototype.sort;
  Array.prototype.sort = function(_cmp) {
    const cmp = arguments.length < 1 ? defaultComparator : _cmp;
    quicksort (this, cmp, 0, this.length - 1);
    return this;
  };
  try {
    thunk ();
  } finally {
    Array.prototype.sort = Array$prototype$sort;
  }
};
