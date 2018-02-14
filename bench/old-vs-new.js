'use strict';

var benchmark = require('sanctuary-benchmark');

var oldZ = require('sanctuary-type-classes');
var newZ = require('..');


var Identity = require('../test/Identity');

//  inc :: Number -> Number
function inc(x) {
  return x + 1;
}

//  prep :: StrMap Function -> StrMap (Pair (StrMap a) Function)
function prep(specs) {
  return newZ.map(function(f) { return [{}, f]; }, specs);
}

module.exports = benchmark(oldZ, newZ, {leftHeader: 'old', rightHeader: 'new'}, prep({
  'functions.of.Array':          function(Z) { Z.of(Array, 42); },
  'functions.of.Identity':       function(Z) { Z.of(Identity, 42); },
  'methods.equals.Identity':     function(Z) { Z.equals(Identity(0), Identity(0)); },
  'methods.equals.Object':       function(Z) { Z.equals({x: 0, y: 0}, {y: 0, x: 0}); },
  'methods.map.Array':           function(Z) { Z.map(inc, [1, 2, 3]); },
  'methods.map.Identity':        function(Z) { Z.map(inc, Identity(1)); },
  'methods.toString.Identity':   function(Z) { Z.toString(Identity(0)); },
  'methods.toString.Object':     function(Z) { Z.toString({x: 0, y: 0}); },
  'methods.toString.String':     function(Z) { Z.toString('hello'); },
  'test.Comonad.Identity':       function(Z) { Z.Comonad.test(Identity(0)); },
  'test.Contravariant.Function': function(Z) { Z.Contravariant.test(Math.abs); }
}));
