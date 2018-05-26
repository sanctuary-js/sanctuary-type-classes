'use strict';

var L = require ('list/fantasy-land');
var benchmark = require ('sanctuary-benchmark');
var Identity = require ('sanctuary-identity');

var oldZ = require ('sanctuary-type-classes');
var newZ = require ('..');

var shuffle = require ('../test/shuffle');


//  chainRecArrayNumber :: (Number -> c, Number -> c, Number) -> Array c
function chainRecArrayNumber(next, done, x) {
  return [done (x), (x <= 1 ? done : next) (x - 1)];
}

//  double :: a -> Array2 a a
function double(x) {
  return [x, x];
}

//  inc :: Number -> Number
function inc(x) {
  return x + 1;
}

//  prep :: StrMap Function -> StrMap (Array2 (StrMap a) Function)
function prep(specs) {
  return newZ.map (function(f) { return [{}, f]; }, specs);
}

var shuffledArray = (function() {
  var xs = [];
  for (var x = 0; x < 5000; x += 1) xs.push (x);
  shuffle (xs);
  return xs;
} ());
var shuffledList = L.fromArray (shuffledArray);

module.exports = benchmark (oldZ, newZ, {leftHeader: 'old', rightHeader: 'new'}, prep ({
  'functions.chainRec.Array':    function(Z) { Z.chainRec (Array, chainRecArrayNumber, 100); },
  'functions.of.Array':          function(Z) { Z.of (Array, 42); },
  'functions.of.Identity':       function(Z) { Z.of (Identity, 42); },
  'methods.chain.Array':         function(Z) { Z.chain (double, shuffledArray); },
  'methods.equals.Identity':     function(Z) { Z.equals (Identity (0), Identity (0)); },
  'methods.equals.Object':       function(Z) { Z.equals ({x: 0, y: 0}, {y: 0, x: 0}); },
  'methods.map.Array':           function(Z) { Z.map (inc, [1, 2, 3]); },
  'methods.map.Identity':        function(Z) { Z.map (inc, Identity (1)); },
  'methods.sort.Array':          function(Z) { Z.sort (shuffledArray); },
  'methods.sort.List':           function(Z) { Z.sort (shuffledList); },
  'test.Comonad.Identity':       function(Z) { Z.Comonad.test (Identity (0)); },
  'test.Contravariant.Function': function(Z) { Z.Contravariant.test (Math.abs); }
}));
