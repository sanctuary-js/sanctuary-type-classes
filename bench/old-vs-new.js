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

//  prep :: StrMap Function -> StrMap (Array2 (StrMap a) Function)
const prep = specs => newZ.map (f => [{}, f], specs);

const shuffledArray = [];
for (let x = 0; x < 5000; x += 1) shuffledArray.push (x);
shuffle (shuffledArray);
const shuffledList = L.fromArray (shuffledArray);

module.exports = benchmark (oldZ, newZ, {leftHeader: 'old', rightHeader: 'new'}, prep ({
  'functions.chainRec.Array':    Z => { Z.chainRec (Array, chainRecArrayNumber, 100); },
  'functions.empty.Array':       Z => { Z.empty (Array); },
  'functions.of.Array':          Z => { Z.of (Array, 42); },
  'functions.of.Identity':       Z => { Z.of (Identity, 42); },
  'methods.chain.Array':         Z => { Z.chain (double, shuffledArray); },
  'methods.equals.Identity':     Z => { Z.equals (Identity (0), Identity (0)); },
  'methods.equals.Object':       Z => { Z.equals ({x: 0, y: 0}, {y: 0, x: 0}); },
  'methods.lte.Identity':        Z => { Z.lte (Identity (0), Identity (0)); },
  'methods.lte.Object':          Z => { Z.lte ({x: 0, y: 0}, {y: 0, x: 0}); },
  'methods.map.Array':           Z => { Z.map (inc, [1, 2, 3]); },
  'methods.map.Identity':        Z => { Z.map (inc, Identity (1)); },
  'methods.sort.Array':          Z => { Z.sort (shuffledArray); },
  'methods.sort.List':           Z => { Z.sort (shuffledList); },
  'test.Comonad.Identity':       Z => { Z.Comonad.test (Identity (0)); },
  'test.Contravariant.Function': Z => { Z.Contravariant.test (Math.abs); },
}));
