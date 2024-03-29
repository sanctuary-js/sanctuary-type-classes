'use strict';

const benchmark = require ('sanctuary-benchmark');

const Z = require ('..');


const Vanilla = {
  map: (f, xs) => xs.map (f),
  chain: (f, xs) => xs.flatMap (f),
  of: (t, x) => t.of (x),
};

//  inc :: Number -> Number
const inc = x => x + 1;

//  prep :: StrMap f -> StrMap (Array2 (StrMap a) f)
const prep = specs => Z.map (f => [{}, f], specs);

module.exports = benchmark (Vanilla, Z, {leftHeader: 'vanilla', rightHeader: 'Z'}, prep ({
  'functions.of': Z => { Z.of (Array, 42); },
  'methods.map': Z => { Z.map (inc, [1, 2, 3]); },
  'methods.chain.of': Z => { Z.chain (x => Z.of (Array, x), [1, 2, 3]); },
}));
