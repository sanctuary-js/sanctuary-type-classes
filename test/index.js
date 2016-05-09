'use strict';

/* eslint-env mocha */
/* eslint max-len: "off" */

var Z = require('..');

var Identity = require('./Identity');
var List = require('./List');
var Tuple = require('./Tuple');
var eq = require('./eq');


var Nil = List.Nil;
var Cons = List.Cons;


//  Array$of :: a -> Array a
var Array$of = function(x) {
  eq(arguments.length, 1);
  return Z.of(Array, x);
};

//  List$of :: a -> List a
var List$of = function(x) {
  eq(arguments.length, 1);
  return Z.of(List, x);
};

//  abs :: Number -> Number
var abs = function(x) {
  eq(arguments.length, 1);
  return Math.abs(x);
};

//  add :: (Number, Number) -> Number
var add = function(x, y) {
  eq(arguments.length, 2);
  return x + y;
};

//  args :: (Any...) -> Arguments
var args = function() {
  return arguments;
};

//  circular :: Pair String (Pair String (Pair String ...))
var circular = ['foo']; circular[1] = circular;

//  duplicate :: a -> Pair a a
var duplicate = function(x) {
  eq(arguments.length, 1);
  return [x, x];
};

//  identInc :: Number -> Identity Number
var identInc = function(x) {
  eq(arguments.length, 1);
  return Identity(x + 1);
};

//  identity :: a -> a
var identity = function(x) {
  eq(arguments.length, 1);
  return x;
};

//  inc :: Number -> Number
var inc = function(x) {
  eq(arguments.length, 1);
  return x + 1;
};

//  length :: List a -> Integer
var length = function(xs) {
  eq(arguments.length, 1);
  return xs.length;
};

var node1 = {id: 1, rels: []};
var node2 = {id: 2, rels: []};
node1.rels.push({type: 'child', value: node2});
node2.rels.push({type: 'parent', value: node1});

//  odd :: Integer -> Boolean
var odd = function(x) {
  eq(arguments.length, 1);
  return x % 2 === 1;
};

//  pow :: Number -> Number -> Number
var pow = function(base) {
  eq(arguments.length, 1);
  return function(exp) {
    eq(arguments.length, 1);
    return Math.pow(base, exp);
  };
};

//  range :: Integer -> Array Integer
var range = function(n) {
  eq(arguments.length, 1);
  var result = [];
  for (var m = 0; m < n; m += 1) result.push(m);
  return result;
};

//  repeat :: Integer -> a -> Array a
var repeat = function(n) {
  eq(arguments.length, 1);
  return function(x) {
    eq(arguments.length, 1);
    var result = [];
    for (var m = 0; m < n; m += 1) result.push(x);
    return result;
  };
};

//  square :: Number -> Number
var square = function(x) {
  eq(arguments.length, 1);
  return x * x;
};

//  toUpper :: String -> String
var toUpper = function(s) {
  eq(arguments.length, 1);
  return s.toUpperCase();
};


test('TypeClass', function() {
  eq(typeof Z.TypeClass, 'function');
  eq(Z.TypeClass.length, 3);

  //  hasMethod :: String -> a -> Boolean
  var hasMethod = function(name) {
    return function(x) {
      return x != null && typeof x[name] === 'function';
    };
  };

  //  Foo :: TypeClass
  var Foo = Z.TypeClass('my-package/Foo', [], hasMethod('foo'));

  //  Bar :: TypeClass
  var Bar = Z.TypeClass('my-package/Bar', [Foo], hasMethod('bar'));

  eq(Foo['@@type'], 'sanctuary-type-classes/TypeClass');
  eq(Foo.name, 'my-package/Foo');
  eq(Foo.test(null), false);
  eq(Foo.test({}), false);
  eq(Foo.test({foo: function() {}}), true);
  eq(Foo.test({bar: function() {}}), false);
  eq(Foo.test({foo: function() {}, bar: function() {}}), true);

  eq(Bar['@@type'], 'sanctuary-type-classes/TypeClass');
  eq(Bar.name, 'my-package/Bar');
  eq(Bar.test(null), false);
  eq(Bar.test({}), false);
  eq(Bar.test({foo: function() {}}), false);
  eq(Bar.test({bar: function() {}}), false);
  eq(Bar.test({foo: function() {}, bar: function() {}}), true);
});

test('Setoid', function() {
  eq(Z.Setoid['@@type'], 'sanctuary-type-classes/TypeClass');
  eq(Z.Setoid.name, 'sanctuary-type-classes/Setoid');
  eq(Z.Setoid.test(null), true);
  eq(Z.Setoid.test(''), true);
  eq(Z.Setoid.test([]), true);
  eq(Z.Setoid.test({}), true);
  eq(Z.Setoid.test({'@@type': 'my-package/Quux'}), false);
});

test('Semigroup', function() {
  eq(Z.Semigroup['@@type'], 'sanctuary-type-classes/TypeClass');
  eq(Z.Semigroup.name, 'sanctuary-type-classes/Semigroup');
  eq(Z.Semigroup.test(null), false);
  eq(Z.Semigroup.test(''), true);
  eq(Z.Semigroup.test([]), true);
  eq(Z.Semigroup.test({}), true);
});

test('Monoid', function() {
  eq(Z.Monoid['@@type'], 'sanctuary-type-classes/TypeClass');
  eq(Z.Monoid.name, 'sanctuary-type-classes/Monoid');
  eq(Z.Monoid.test(null), false);
  eq(Z.Monoid.test(''), true);
  eq(Z.Monoid.test([]), true);
  eq(Z.Monoid.test({}), true);
});

test('Functor', function() {
  eq(Z.Functor['@@type'], 'sanctuary-type-classes/TypeClass');
  eq(Z.Functor.name, 'sanctuary-type-classes/Functor');
  eq(Z.Functor.test(null), false);
  eq(Z.Functor.test(''), false);
  eq(Z.Functor.test([]), true);
  eq(Z.Functor.test({}), true);
});

test('Bifunctor', function() {
  eq(Z.Bifunctor['@@type'], 'sanctuary-type-classes/TypeClass');
  eq(Z.Bifunctor.name, 'sanctuary-type-classes/Bifunctor');
  eq(Z.Bifunctor.test(null), false);
  eq(Z.Bifunctor.test(''), false);
  eq(Z.Bifunctor.test([]), false);
  eq(Z.Bifunctor.test({}), false);
  eq(Z.Bifunctor.test(Tuple('abc', 123)), true);
});

test('Profunctor', function() {
  eq(Z.Profunctor['@@type'], 'sanctuary-type-classes/TypeClass');
  eq(Z.Profunctor.name, 'sanctuary-type-classes/Profunctor');
  eq(Z.Profunctor.test(null), false);
  eq(Z.Profunctor.test(''), false);
  eq(Z.Profunctor.test([]), false);
  eq(Z.Profunctor.test({}), false);
  eq(Z.Profunctor.test(Math.abs), true);
});

test('Apply', function() {
  eq(Z.Apply['@@type'], 'sanctuary-type-classes/TypeClass');
  eq(Z.Apply.name, 'sanctuary-type-classes/Apply');
  eq(Z.Apply.test(null), false);
  eq(Z.Apply.test(''), false);
  eq(Z.Apply.test([]), true);
  eq(Z.Apply.test({}), false);
});

test('Applicative', function() {
  eq(Z.Applicative['@@type'], 'sanctuary-type-classes/TypeClass');
  eq(Z.Applicative.name, 'sanctuary-type-classes/Applicative');
  eq(Z.Applicative.test(null), false);
  eq(Z.Applicative.test(''), false);
  eq(Z.Applicative.test([]), true);
  eq(Z.Applicative.test({}), false);
});

test('Chain', function() {
  eq(Z.Chain['@@type'], 'sanctuary-type-classes/TypeClass');
  eq(Z.Chain.name, 'sanctuary-type-classes/Chain');
  eq(Z.Chain.test(null), false);
  eq(Z.Chain.test(''), false);
  eq(Z.Chain.test([]), true);
  eq(Z.Chain.test({}), false);
});

test('ChainRec', function() {
  eq(Z.ChainRec['@@type'], 'sanctuary-type-classes/TypeClass');
  eq(Z.ChainRec.name, 'sanctuary-type-classes/ChainRec');
  eq(Z.ChainRec.test(null), false);
  eq(Z.ChainRec.test(''), false);
  eq(Z.ChainRec.test([]), true);
  eq(Z.ChainRec.test({}), false);
});

test('Monad', function() {
  eq(Z.Monad['@@type'], 'sanctuary-type-classes/TypeClass');
  eq(Z.Monad.name, 'sanctuary-type-classes/Monad');
  eq(Z.Monad.test(null), false);
  eq(Z.Monad.test(''), false);
  eq(Z.Monad.test([]), true);
  eq(Z.Monad.test({}), false);
});

test('Foldable', function() {
  eq(Z.Foldable['@@type'], 'sanctuary-type-classes/TypeClass');
  eq(Z.Foldable.name, 'sanctuary-type-classes/Foldable');
  eq(Z.Foldable.test(null), false);
  eq(Z.Foldable.test(''), false);
  eq(Z.Foldable.test([]), true);
  eq(Z.Foldable.test({}), true);
});

test('Traversable', function() {
  eq(Z.Traversable['@@type'], 'sanctuary-type-classes/TypeClass');
  eq(Z.Traversable.name, 'sanctuary-type-classes/Traversable');
  eq(Z.Traversable.test(null), false);
  eq(Z.Traversable.test(''), false);
  eq(Z.Traversable.test([]), true);
  eq(Z.Traversable.test({}), false);
});

test('Extend', function() {
  eq(Z.Extend['@@type'], 'sanctuary-type-classes/TypeClass');
  eq(Z.Extend.name, 'sanctuary-type-classes/Extend');
  eq(Z.Extend.test(null), false);
  eq(Z.Extend.test(''), false);
  eq(Z.Extend.test([]), true);
  eq(Z.Extend.test({}), false);
});

test('Comonad', function() {
  eq(Z.Comonad['@@type'], 'sanctuary-type-classes/TypeClass');
  eq(Z.Comonad.name, 'sanctuary-type-classes/Comonad');
  eq(Z.Comonad.test(null), false);
  eq(Z.Comonad.test(''), false);
  eq(Z.Comonad.test([]), false);
  eq(Z.Comonad.test({}), false);
  eq(Z.Comonad.test(Identity(0)), true);
});

test('toString', function() {
  eq(Z.toString.length, 1);
  eq(Z.toString.name, 'toString');

  eq(Z.toString(null), 'null');
  eq(Z.toString(undefined), 'undefined');
  eq(Z.toString(false), 'false');
  eq(Z.toString(true), 'true');
  eq(Z.toString(new Boolean(false)), 'new Boolean(false)');
  eq(Z.toString(new Boolean(true)), 'new Boolean(true)');
  eq(Z.toString(0), '0');
  eq(Z.toString(-0), '-0');
  eq(Z.toString(NaN), 'NaN');
  eq(Z.toString(3.14), '3.14');
  eq(Z.toString(Infinity), 'Infinity');
  eq(Z.toString(-Infinity), '-Infinity');
  eq(Z.toString(new Number(0)), 'new Number(0)');
  eq(Z.toString(new Number(-0)), 'new Number(-0)');
  eq(Z.toString(new Number(NaN)), 'new Number(NaN)');
  eq(Z.toString(new Number(3.14)), 'new Number(3.14)');
  eq(Z.toString(new Number(Infinity)), 'new Number(Infinity)');
  eq(Z.toString(new Number(-Infinity)), 'new Number(-Infinity)');
  eq(Z.toString(new Date(0)), 'new Date("1970-01-01T00:00:00.000Z")');
  eq(Z.toString(new Date(42)), 'new Date("1970-01-01T00:00:00.042Z")');
  eq(Z.toString(new Date(NaN)), 'new Date(NaN)');
  eq(Z.toString(new Date('2001-02-03T04:05:06')), 'new Date("2001-02-03T04:05:06.000Z")');
  eq(Z.toString(/def/g), '/def/g');
  eq(Z.toString(''), '""');
  eq(Z.toString('abc'), '"abc"');
  eq(Z.toString('foo "bar" baz'), '"foo \\"bar\\" baz"');
  eq(Z.toString(new String('')), 'new String("")');
  eq(Z.toString(new String('abc')), 'new String("abc")');
  eq(Z.toString(new String('foo "bar" baz')), 'new String("foo \\"bar\\" baz")');
  eq(Z.toString([]), '[]');
  eq(Z.toString(['foo']), '["foo"]');
  eq(Z.toString(['foo', 'bar']), '["foo", "bar"]');
  eq(Z.toString(/x/.exec('xyz')), '["x", "index": 0, "input": "xyz"]');
  eq(Z.toString((function() { var xs = []; xs.z = true; xs.a = true; return xs; }())), '["a": true, "z": true]');
  eq(Z.toString(circular), '["foo", <Circular>]');
  eq(Z.toString(args()), '(function () { return arguments; }())');
  eq(Z.toString(args('foo')), '(function () { return arguments; }("foo"))');
  eq(Z.toString(args('foo', 'bar')), '(function () { return arguments; }("foo", "bar"))');
  eq(Z.toString(new Error('a')), 'new Error("a")');
  eq(Z.toString(new TypeError('b')), 'new TypeError("b")');
  eq(Z.toString({}), '{}');
  eq(Z.toString({x: 1}), '{"x": 1}');
  eq(Z.toString({x: 1, y: 2}), '{"x": 1, "y": 2}');
  eq(Z.toString({y: 1, x: 2}), '{"x": 2, "y": 1}');
  eq(Z.toString(node1), '{"id": 1, "rels": [{"type": "child", "value": {"id": 2, "rels": [{"type": "parent", "value": <Circular>}]}}]}');
  eq(Z.toString(node2), '{"id": 2, "rels": [{"type": "parent", "value": {"id": 1, "rels": [{"type": "child", "value": <Circular>}]}}]}');
  eq(Z.toString(Object.create(null)), '{}');
  var Foo = function() {};
  Foo.prototype = {toString: function() { return '<b>foo</b>'; }};
  eq(Z.toString(Foo.prototype), '<b>foo</b>');
  eq(Z.toString(new Foo()), '<b>foo</b>');
  eq(Z.toString(Math.sqrt), 'function sqrt() { [native code] }');
});

test('equals', function() {
  eq(Z.equals.length, 2);
  eq(Z.equals.name, 'equals');

  eq(Z.equals(null, null), true);
  eq(Z.equals(null, undefined), false);
  eq(Z.equals(undefined, null), false);
  eq(Z.equals(undefined, undefined), true);
  eq(Z.equals(false, false), true);
  eq(Z.equals(false, true), false);
  eq(Z.equals(true, false), false);
  eq(Z.equals(true, true), true);
  eq(Z.equals(new Boolean(false), new Boolean(false)), true);
  eq(Z.equals(new Boolean(false), new Boolean(true)), false);
  eq(Z.equals(new Boolean(true), new Boolean(false)), false);
  eq(Z.equals(new Boolean(true), new Boolean(true)), true);
  eq(Z.equals(false, new Boolean(false)), false);
  eq(Z.equals(new Boolean(false), false), false);
  eq(Z.equals(true, new Boolean(true)), false);
  eq(Z.equals(new Boolean(true), true), false);
  eq(Z.equals(0, 0), true);
  eq(Z.equals(0, -0), false);
  eq(Z.equals(-0, 0), false);
  eq(Z.equals(-0, -0), true);
  eq(Z.equals(NaN, NaN), true);
  eq(Z.equals(Infinity, Infinity), true);
  eq(Z.equals(Infinity, -Infinity), false);
  eq(Z.equals(-Infinity, Infinity), false);
  eq(Z.equals(-Infinity, -Infinity), true);
  eq(Z.equals(NaN, Math.PI), false);
  eq(Z.equals(Math.PI, NaN), false);
  eq(Z.equals(new Number(0), new Number(0)), true);
  eq(Z.equals(new Number(0), new Number(-0)), false);
  eq(Z.equals(new Number(-0), new Number(0)), false);
  eq(Z.equals(new Number(-0), new Number(-0)), true);
  eq(Z.equals(new Number(NaN), new Number(NaN)), true);
  eq(Z.equals(new Number(Infinity), new Number(Infinity)), true);
  eq(Z.equals(new Number(Infinity), new Number(-Infinity)), false);
  eq(Z.equals(new Number(-Infinity), new Number(Infinity)), false);
  eq(Z.equals(new Number(-Infinity), new Number(-Infinity)), true);
  eq(Z.equals(new Number(NaN), new Number(Math.PI)), false);
  eq(Z.equals(new Number(Math.PI), new Number(NaN)), false);
  eq(Z.equals(42, new Number(42)), false);
  eq(Z.equals(new Number(42), 42), false);
  eq(Z.equals(new Date(0), new Date(0)), true);
  eq(Z.equals(new Date(0), new Date(1)), false);
  eq(Z.equals(new Date(1), new Date(0)), false);
  eq(Z.equals(new Date(1), new Date(1)), true);
  eq(Z.equals(new Date(NaN), new Date(NaN)), true);
  eq(Z.equals(/abc/, /xyz/), false);
  eq(Z.equals(/abc/, /abc/g), false);
  eq(Z.equals(/abc/, /abc/i), false);
  eq(Z.equals(/abc/, /abc/m), false);
  eq(Z.equals(/abc/, /abc/), true);
  eq(Z.equals(/abc/g, /abc/g), true);
  eq(Z.equals(/abc/i, /abc/i), true);
  eq(Z.equals(/abc/m, /abc/m), true);
  eq(Z.equals('', ''), true);
  eq(Z.equals('abc', 'abc'), true);
  eq(Z.equals('abc', 'xyz'), false);
  eq(Z.equals(new String(''), new String('')), true);
  eq(Z.equals(new String('abc'), new String('abc')), true);
  eq(Z.equals(new String('abc'), new String('xyz')), false);
  eq(Z.equals('abc', new String('abc')), false);
  eq(Z.equals(new String('abc'), 'abc'), false);
  eq(Z.equals([], []), true);
  eq(Z.equals([1, 2], [1, 2]), true);
  eq(Z.equals([1, 2, 3], [1, 2]), false);
  eq(Z.equals([1, 2], [1, 2, 3]), false);
  eq(Z.equals([1, 2], [2, 1]), false);
  eq(Z.equals([0], [-0]), false);
  eq(Z.equals([NaN], [NaN]), true);
  eq(Z.equals(circular, circular), true);
  eq(Z.equals(args(), args()), true);
  eq(Z.equals(args(1, 2), args(1, 2)), true);
  eq(Z.equals(args(1, 2, 3), args(1, 2)), false);
  eq(Z.equals(args(1, 2), args(1, 2, 3)), false);
  eq(Z.equals(args(1, 2), args(2, 1)), false);
  eq(Z.equals(args(0), args(-0)), false);
  eq(Z.equals(args(NaN), args(NaN)), true);
  eq(Z.equals(new Error('abc'), new Error('abc')), true);
  eq(Z.equals(new Error('abc'), new Error('xyz')), false);
  eq(Z.equals(new TypeError('abc'), new TypeError('abc')), true);
  eq(Z.equals(new TypeError('abc'), new TypeError('xyz')), false);
  eq(Z.equals(new Error('abc'), new TypeError('abc')), false);
  eq(Z.equals(new TypeError('abc'), new Error('abc')), false);
  eq(Z.equals({}, {}), true);
  eq(Z.equals({x: 1, y: 2}, {y: 2, x: 1}), true);
  eq(Z.equals({x: 1, y: 2, z: 3}, {x: 1, y: 2}), false);
  eq(Z.equals({x: 1, y: 2}, {x: 1, y: 2, z: 3}), false);
  eq(Z.equals({x: 1, y: 2}, {x: 2, y: 1}), false);
  eq(Z.equals({x: 0}, {x: -0}), false);
  eq(Z.equals({x: NaN}, {x: NaN}), true);
  eq(Z.equals(node1, node1), true);
  eq(Z.equals(node2, node2), true);
  eq(Z.equals(node1, node2), false);
  eq(Z.equals(node2, node1), false);
  eq(Z.equals(Math.sin, Math.sin), true);
  eq(Z.equals(Math.sin, Math.cos), false);
  eq(Z.equals(Identity(Identity(Identity(0))), Identity(Identity(Identity(0)))), true);
  eq(Z.equals(Identity(Identity(Identity(0))), Identity(Identity(Identity(1)))), false);
  eq(Z.equals({'@@type': 'my-package/Quux'}, {'@@type': 'my-package/Quux'}), false);
});

test('concat', function() {
  eq(Z.concat.length, 2);
  eq(Z.concat.name, 'concat');

  eq(Z.concat('', ''), '');
  eq(Z.concat('', 'abc'), 'abc');
  eq(Z.concat('abc', ''), 'abc');
  eq(Z.concat('abc', 'def'), 'abcdef');
  eq(Z.concat([], []), []);
  eq(Z.concat([], [1, 2, 3]), [1, 2, 3]);
  eq(Z.concat([1, 2, 3], []), [1, 2, 3]);
  eq(Z.concat([1, 2, 3], [4, 5, 6]), [1, 2, 3, 4, 5, 6]);
  eq(Z.concat({}, {}), {});
  eq(Z.concat({}, {x: 1, y: 2}), {x: 1, y: 2});
  eq(Z.concat({x: 1, y: 2}, {}), {x: 1, y: 2});
  eq(Z.concat({x: 1, y: 2}, {y: 3, z: 4}), {x: 1, y: 3, z: 4});
  eq(Z.concat(Identity(''), Identity('')), Identity(''));
  eq(Z.concat(Identity(''), Identity('abc')), Identity('abc'));
  eq(Z.concat(Identity('abc'), Identity('')), Identity('abc'));
  eq(Z.concat(Identity('abc'), Identity('def')), Identity('abcdef'));
  eq(Z.concat(Nil, Nil), Nil);
  eq(Z.concat(Nil, Cons(1, Cons(2, Cons(3, Nil)))), Cons(1, Cons(2, Cons(3, Nil))));
  eq(Z.concat(Cons(1, Cons(2, Cons(3, Nil))), Nil), Cons(1, Cons(2, Cons(3, Nil))));
  eq(Z.concat(Cons(1, Cons(2, Cons(3, Nil))), Cons(4, Cons(5, Cons(6, Nil)))), Cons(1, Cons(2, Cons(3, Cons(4, Cons(5, Cons(6, Nil)))))));
});

test('empty', function() {
  eq(Z.empty.length, 1);
  eq(Z.empty.name, 'empty');

  eq(Z.empty(String), '');
  eq(Z.empty(Array), []);
  eq(Z.empty(Object), {});
  eq(Z.empty(List), Nil);
});

test('map', function() {
  eq(Z.map.length, 2);
  eq(Z.map.name, 'map');

  eq(Z.map(inc, []), []);
  eq(Z.map(inc, [1, 2, 3]), [2, 3, 4]);
  eq(Z.map(inc, {}), {});
  eq(Z.map(inc, {x: 2, y: 4}), {x: 3, y: 5});
  eq(Z.map(inc, length)('abc'), 4);
  eq(Z.map(inc, Identity(42)), Identity(43));
  eq(Z.map(inc, Nil), Nil);
  eq(Z.map(inc, Cons(1, Cons(2, Cons(3, Nil)))), Cons(2, Cons(3, Cons(4, Nil))));
});

test('bimap', function() {
  eq(Z.bimap.length, 3);
  eq(Z.bimap.name, 'bimap');

  eq(Z.bimap(toUpper, inc, Tuple('abc', 123)), Tuple('ABC', 124));
});

test('promap', function() {
  eq(Z.promap.length, 3);
  eq(Z.promap.name, 'promap');

  eq(Z.promap(
       function(xs) { return xs.reduce(function(acc, x) { return acc.concat([x.length]); }, []); },
       square,
       function(xs) { return xs.reduce(function(acc, x) { return acc + x; }, 0); }
     )(['foo', 'bar', 'baz', 'quux']),
     169);
});

test('ap', function() {
  eq(Z.ap.length, 2);
  eq(Z.ap.name, 'ap');

  eq(Z.ap([], []), []);
  eq(Z.ap([], [1, 2, 3]), []);
  eq(Z.ap([inc], []), []);
  eq(Z.ap([inc], [1, 2, 3]), [2, 3, 4]);
  eq(Z.ap([inc, square], [1, 2, 3]), [2, 3, 4, 1, 4, 9]);
  eq(Z.ap(pow, abs)(-1), pow(-1)(abs(-1)));
  eq(Z.ap(pow, abs)(-2), pow(-2)(abs(-2)));
  eq(Z.ap(pow, abs)(-3), pow(-3)(abs(-3)));
  eq(Z.ap(Identity(inc), Identity(42)), Identity(43));
  eq(Z.ap(Nil, Nil), Nil);
  eq(Z.ap(Nil, Cons(1, Cons(2, Cons(3, Nil)))), Nil);
  eq(Z.ap(Cons(inc, Nil), Nil), Nil);
  eq(Z.ap(Cons(inc, Nil), Cons(1, Cons(2, Cons(3, Nil)))), Cons(2, Cons(3, Cons(4, Nil))));
  eq(Z.ap(Cons(inc, Cons(square, Nil)), Cons(1, Cons(2, Cons(3, Nil)))), Cons(2, Cons(3, Cons(4, Cons(1, Cons(4, Cons(9, Nil)))))));
});

test('of', function() {
  eq(Z.of.length, 2);
  eq(Z.of.name, 'of');

  eq(Z.of(Array, 42), [42]);
  eq(Z.of(Function, 42)(null), 42);
  eq(Z.of(Identity, 42), Identity(42));
  eq(Z.of(List, 42), Cons(42, Nil));
});

test('chain', function() {
  eq(Z.chain.length, 2);
  eq(Z.chain.name, 'chain');

  eq(Z.chain(duplicate, []), []);
  eq(Z.chain(duplicate, [1, 2, 3]), [1, 1, 2, 2, 3, 3]);
  eq(Z.chain(identity, [[1, 2], [3, 4], [5, 6]]), [1, 2, 3, 4, 5, 6]);
  eq(Z.chain(repeat, abs)(-1), [-1]);
  eq(Z.chain(repeat, abs)(-2), [-2, -2]);
  eq(Z.chain(repeat, abs)(-3), [-3, -3, -3]);
  eq(Z.chain(identInc, Identity(42)), Identity(43));
  eq(Z.chain(identity, Identity(Identity(0))), Identity(0));
});

test('chainRec', function() {
  eq(Z.chainRec.length, 3);
  eq(Z.chainRec.name, 'chainRec');

  var count = 0;

  //  squash :: (Any -> a, Any -> a, Any) -> Array b
  var squash = function(next, done, x) {
    if (Array.isArray(x)) return x.map(next);
    count += 1;
    return [done(x)];
  };

  eq(Z.chainRec(Array, squash, [1, [[2, 3], 4], 5]), [1, 2, 3, 4, 5]);
  eq(count, 5);

  eq(Z.chainRec(Array, function(next, done, n) { return n === 0 ? [done('DONE')] : [next(n - 1)]; }, 100000), ['DONE']);
});

test('filter', function() {
  eq(Z.filter.length, 2);
  eq(Z.filter.name, 'filter');

  eq(Z.filter(odd, []), []);
  eq(Z.filter(odd, [1, 2, 3, 4, 5]), [1, 3, 5]);
  eq(Z.filter(odd, Nil), Nil);
  eq(Z.filter(odd, Cons(1, Cons(2, Cons(3, Cons(4, Cons(5, Nil)))))), Cons(1, Cons(3, Cons(5, Nil))));
});

test('filterM', function() {
  eq(Z.filterM.length, 2);
  eq(Z.filterM.name, 'filterM');

  eq(Z.filterM(odd, []), []);
  eq(Z.filterM(odd, [1, 2, 3, 4, 5]), [1, 3, 5]);
  eq(Z.filterM(odd, Nil), Nil);
  eq(Z.filterM(odd, Cons(1, Cons(2, Cons(3, Cons(4, Cons(5, Nil)))))), Cons(1, Cons(3, Cons(5, Nil))));
});

test('reduce', function() {
  eq(Z.reduce.length, 3);
  eq(Z.reduce.name, 'reduce');

  eq(Z.reduce(Z.concat, 'x', []), 'x');
  eq(Z.reduce(Z.concat, 'x', ['a', 'b', 'c']), 'xabc');
  eq(Z.reduce(add, 0, {}), 0);
  eq(Z.reduce(add, 0, {a: 1, b: 2, c: 3, d: 4, e: 5}), 15);
  eq(Z.reduce(Z.concat, 'x', Nil), 'x');
  eq(Z.reduce(Z.concat, 'x', Cons('a', Cons('b', Cons('c', Nil)))), 'xabc');
});

test('traverse', function() {
  eq(Z.traverse.length, 3);
  eq(Z.traverse.name, 'traverse');

  eq(Z.traverse(Array$of, identity, []), [[]]);
  eq(Z.traverse(Array$of, identity, [[1], [2], [3]]), [[1, 2, 3]]);
  eq(Z.traverse(Array$of, identity, [[1, 2, 3], [4, 5]]), [[1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5]]);
  eq(Z.traverse(Array$of, identity, repeat(6)(range(10))).length, Math.pow(10, 6));
  eq(Z.traverse(Identity, identInc, []), Identity([]));
  eq(Z.traverse(Identity, identInc, [1, 2, 3]), Identity([2, 3, 4]));
  eq(Z.traverse(Identity, identInc, Nil), Identity(Nil));
  eq(Z.traverse(Identity, identInc, Cons(1, Cons(2, Cons(3, Nil)))), Identity(Cons(2, Cons(3, Cons(4, Nil)))));
});

test('sequence', function() {
  eq(Z.sequence.length, 2);
  eq(Z.sequence.name, 'sequence');

  eq(Z.sequence(Identity, []), Identity([]));
  eq(Z.sequence(Identity, [Identity(1), Identity(2), Identity(3)]), Identity([1, 2, 3]));
  eq(Z.sequence(Array$of, Identity([])), []);
  eq(Z.sequence(Array$of, Identity([1, 2, 3])), [Identity(1), Identity(2), Identity(3)]);
  eq(Z.sequence(Identity, Nil), Identity(Nil));
  eq(Z.sequence(Identity, Cons(Identity(1), Cons(Identity(2), Cons(Identity(3), Nil)))), Identity(Cons(1, Cons(2, Cons(3, Nil)))));
  eq(Z.sequence(List$of, Identity(Nil)), Nil);
  eq(Z.sequence(List$of, Identity(Cons(1, Cons(2, Cons(3, Nil))))), Cons(Identity(1), Cons(Identity(2), Cons(Identity(3), Nil))));
});

test('extend', function() {
  eq(Z.extend.length, 2);
  eq(Z.extend.name, 'extend');

  eq(Z.extend(length, []), [0]);
  eq(Z.extend(length, [1, 2, 3]), [3]);
  eq(Z.extend(function(id) { return Z.reduce(add, 1, id); }, Identity(42)), Identity(43));
});

test('extract', function() {
  eq(Z.extract.length, 1);
  eq(Z.extract.name, 'extract');

  eq(Z.extract(Identity(42)), 42);
});
