'use strict';

const L = require ('list/fantasy-land');
const benchmark = require ('sanctuary-benchmark');
const Identity = require ('sanctuary-identity');

const oldZ = require ('sanctuary-type-classes');
const newZ = require ('..');

const shuffle = require ('../test/shuffle');


//  chainRecArrayNumber :: (Number -> c, Number -> c, Number) -> Array c
const chainRecArrayNumber = (next, done, x) => (
  [done (x), (x <= 1 ? done : next) (x - 1)]
);

//  double :: a -> Array2 a a
const double = x => [x, x];

//  inc :: Number -> Number
const inc = x => x + 1;

//  prep :: StrMap f -> StrMap (Array2 (StrMap a) f)
const prep = specs => newZ.map (f => [{}, f], specs);

const shuffledArray = [];
for (let x = 0; x < 5000; x += 1) shuffledArray.push (x);
shuffle (shuffledArray);
const shuffledList = L.fromArray (shuffledArray);

const nestedIdentity = (function recur(n, x) {
  return n === 0 ? Identity (x) : recur (n - 1, Identity (x));
} (100, Identity (0)));

module.exports = benchmark (oldZ, newZ, {leftHeader: 'old', rightHeader: 'new'}, prep ({
  'functions.chainRec.Array':       Z => { Z.chainRec (Array, chainRecArrayNumber, 100); },
  'functions.empty.Array':          Z => { Z.empty (Array); },
  'functions.of.Array':             Z => { Z.of (Array, 42); },
  'functions.of.Identity':          Z => { Z.of (Identity, 42); },
  'methods.chain.Array':            Z => { Z.chain (double, shuffledArray); },
  'methods.equals.Identity.flat':   Z => { Z.equals (Identity (0), Identity (0)); },
  'methods.equals.Identity.nested': Z => { Z.equals (nestedIdentity, nestedIdentity); },
  'methods.equals.Object':          Z => { Z.equals ({x: 0, y: 0}, {y: 0, x: 0}); },
  'methods.lte.Identity.flat':      Z => { Z.lte (Identity (0), Identity (0)); },
  'methods.lte.Identity.nested':    Z => { Z.lte (nestedIdentity, nestedIdentity); },
  'methods.lte.Object':             Z => { Z.lte ({x: 0, y: 0}, {y: 0, x: 0}); },
  'methods.map.Array':              Z => { Z.map (inc, [1, 2, 3]); },
  'methods.map.Identity':           Z => { Z.map (inc, Identity (1)); },
  'methods.sort.Array':             Z => { Z.sort (shuffledArray); },
  'methods.sort.List':              Z => { Z.sort (shuffledList); },
  'test.Comonad.Identity.flat':     Z => { Z.Comonad.test (Identity (0)); },
  'test.Comonad.Identity.nested':   Z => { Z.Comonad.test (nestedIdentity); },
  'test.Contravariant.Function':    Z => { Z.Contravariant.test (Math.abs); },
}));
