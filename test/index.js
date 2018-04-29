'use strict';

var type = require('sanctuary-type-identifiers');

var Z = require('..');
var version = require('../package.json').version;

var Identity = require('./Identity');
var Lazy = require('./Lazy');
var List = require('./List');
var Maybe = require('./Maybe');
var Sum = require('./Sum');
var Tuple = require('./Tuple');
var eq = require('./eq');
var withUnstableArraySort = require('./quicksort').withUnstableArraySort;


var Nil = List.Nil;
var Cons = List.Cons;

var Nothing = Maybe.Nothing;
var Just = Maybe.Just;


//  Lazy$of :: a -> Lazy a
function Lazy$of(x) {
  eq(arguments.length, Lazy$of.length);
  return Z.of(Lazy, x);
}

//  Point :: () -> Point
function Point() {
  eq(arguments.length, Point.length);
  if (!(this instanceof Point)) return new Point();
}
Point.prototype.x = 0;
Point.prototype.y = 0;

//  abs :: Number -> Number
function abs(x) {
  eq(arguments.length, abs.length);
  return Math.abs(x);
}

//  add :: (Number, Number) -> Number
function add(x, y) {
  eq(arguments.length, add.length);
  return x + y;
}

//  args :: (Any...) -> Arguments
function args() {
  return arguments;
}

//  double :: a -> Pair a a
function double(x) {
  eq(arguments.length, double.length);
  return [x, x];
}

//  identInc :: Number -> Identity Number
function identInc(x) {
  eq(arguments.length, identInc.length);
  return Identity(x + 1);
}

//  identity :: a -> a
function identity(x) {
  eq(arguments.length, identity.length);
  return x;
}

//  inc :: Number -> Number
function inc(x) {
  eq(arguments.length, inc.length);
  return x + 1;
}

//  joinWith :: String -> Array String -> String
function joinWith(s) {
  eq(arguments.length, joinWith.length);
  return function joinWith$1(ss) {
    eq(arguments.length, joinWith$1.length);
    return ss.join(s);
  };
}

//  length :: List a -> Integer
function length(xs) {
  eq(arguments.length, length.length);
  return xs.length;
}

var node1 = {id: 1, rels: []};
var node2 = {id: 2, rels: []};
node1.rels.push({type: 'child', value: node2});
node2.rels.push({type: 'parent', value: node1});

//  odd :: Integer -> Boolean
function odd(x) {
  eq(arguments.length, odd.length);
  return x % 2 === 1;
}

//  ones :: Pair Number (Pair Number (Pair Number ...))
var ones = [1]; ones.push(ones);

//  ones_ :: Pair Number (Pair Number (Pair Number ...))
var ones_ = [1]; ones_.push([1, ones_]);

//  parseInt_ :: Integer -> String -> Maybe Integer
function parseInt_(radix) {
  eq(arguments.length, parseInt_.length);
  return function parseInt$1(s) {
    eq(arguments.length, parseInt$1.length);
    var n = parseInt(s, radix);
    return isNaN(n) ? Nothing : Just(n);
  };
}

//  pow :: Number -> Number -> Number
function pow(base) {
  eq(arguments.length, pow.length);
  return function pow$1(exp) {
    eq(arguments.length, pow$1.length);
    return Math.pow(base, exp);
  };
}

//  range :: Integer -> Array Integer
function range(n) {
  eq(arguments.length, range.length);
  var result = [];
  for (var m = 0; m < n; m += 1) result.push(m);
  return result;
}

//  repeat :: Integer -> a -> Array a
function repeat(n) {
  eq(arguments.length, repeat.length);
  return function repeat$1(x) {
    eq(arguments.length, repeat$1.length);
    var result = [];
    for (var m = 0; m < n; m += 1) result.push(x);
    return result;
  };
}

//  square :: Number -> Number
function square(x) {
  eq(arguments.length, square.length);
  return x * x;
}

//  toUpper :: String -> String
function toUpper(s) {
  eq(arguments.length, toUpper.length);
  return s.toUpperCase();
}

//  wrap :: String -> String -> String -> String
function wrap(before) {
  eq(arguments.length, wrap.length);
  return function wrap$1(after) {
    eq(arguments.length, wrap$1.length);
    return function wrap$2(s) {
      eq(arguments.length, wrap$2.length);
      return before + s + after;
    };
  };
}


test('TypeClass', function() {
  eq(typeof Z.TypeClass, 'function');
  eq(Z.TypeClass.length, 4);

  //  hasMethod :: String -> a -> Boolean
  function hasMethod(name) {
    return function(x) {
      return x != null && typeof x[name] === 'function';
    };
  }

  //  Foo :: TypeClass
  var Foo = Z.TypeClass(
    'my-package/Foo',
    'http://example.com/my-package#Foo',
    [],
    hasMethod('foo')
  );

  //  Bar :: TypeClass
  var Bar = Z.TypeClass(
    'my-package/Bar',
    'http://example.com/my-package#Bar',
    [Foo],
    hasMethod('bar')
  );

  eq(type(Foo), 'sanctuary-type-classes/TypeClass');
  eq(Foo.name, 'my-package/Foo');
  eq(Foo.url, 'http://example.com/my-package#Foo');
  eq(Foo.test(null), false);
  eq(Foo.test({}), false);
  eq(Foo.test({foo: function() {}}), true);
  eq(Foo.test({bar: function() {}}), false);
  eq(Foo.test({foo: function() {}, bar: function() {}}), true);

  eq(type(Bar), 'sanctuary-type-classes/TypeClass');
  eq(Bar.name, 'my-package/Bar');
  eq(Bar.url, 'http://example.com/my-package#Bar');
  eq(Bar.test(null), false);
  eq(Bar.test({}), false);
  eq(Bar.test({foo: function() {}}), false);
  eq(Bar.test({bar: function() {}}), false);
  eq(Bar.test({foo: function() {}, bar: function() {}}), true);
});

test('Setoid', function() {
  eq(type(Z.Setoid), 'sanctuary-type-classes/TypeClass');
  eq(Z.Setoid.name, 'sanctuary-type-classes/Setoid');
  eq(Z.Setoid.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Setoid');
  eq(Z.Setoid.test(null), true);
  eq(Z.Setoid.test(''), true);
  eq(Z.Setoid.test([]), true);
  eq(Z.Setoid.test({}), true);
  eq(Z.Setoid.test({'@@type': 'my-package/Quux'}), true);
});

test('Ord', function() {
  eq(type(Z.Ord), 'sanctuary-type-classes/TypeClass');
  eq(Z.Ord.name, 'sanctuary-type-classes/Ord');
  eq(Z.Ord.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Ord');
  eq(Z.Ord.test(null), true);
  eq(Z.Ord.test(''), true);
  eq(Z.Ord.test([]), true);
  eq(Z.Ord.test({}), true);
  eq(Z.Ord.test(Math.abs), false);
});

test('Semigroupoid', function() {
  eq(type(Z.Semigroupoid), 'sanctuary-type-classes/TypeClass');
  eq(Z.Semigroupoid.name, 'sanctuary-type-classes/Semigroupoid');
  eq(Z.Semigroupoid.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Semigroupoid');
  eq(Z.Semigroupoid.test(null), false);
  eq(Z.Semigroupoid.test(''), false);
  eq(Z.Semigroupoid.test([]), false);
  eq(Z.Semigroupoid.test({}), false);
  eq(Z.Semigroupoid.test(Math.abs), true);
});

test('Category', function() {
  eq(type(Z.Category), 'sanctuary-type-classes/TypeClass');
  eq(Z.Category.name, 'sanctuary-type-classes/Category');
  eq(Z.Category.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Category');
  eq(Z.Category.test(null), false);
  eq(Z.Category.test(''), false);
  eq(Z.Category.test([]), false);
  eq(Z.Category.test({}), false);
  eq(Z.Category.test(Math.abs), true);
});

test('Semigroup', function() {
  eq(type(Z.Semigroup), 'sanctuary-type-classes/TypeClass');
  eq(Z.Semigroup.name, 'sanctuary-type-classes/Semigroup');
  eq(Z.Semigroup.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Semigroup');
  eq(Z.Semigroup.test(null), false);
  eq(Z.Semigroup.test(''), true);
  eq(Z.Semigroup.test([]), true);
  eq(Z.Semigroup.test({}), true);
});

test('Monoid', function() {
  eq(type(Z.Monoid), 'sanctuary-type-classes/TypeClass');
  eq(Z.Monoid.name, 'sanctuary-type-classes/Monoid');
  eq(Z.Monoid.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Monoid');
  eq(Z.Monoid.test(null), false);
  eq(Z.Monoid.test(''), true);
  eq(Z.Monoid.test([]), true);
  eq(Z.Monoid.test({}), true);
});

test('Group', function() {
  eq(type(Z.Group), 'sanctuary-type-classes/TypeClass');
  eq(Z.Group.name, 'sanctuary-type-classes/Group');
  eq(Z.Group.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Group');
  eq(Z.Group.test(null), false);
  eq(Z.Group.test(''), false);
  eq(Z.Group.test([]), false);
  eq(Z.Group.test({}), false);
  eq(Z.Group.test(Sum(0)), true);
});

test('Filterable', function() {
  eq(type(Z.Filterable), 'sanctuary-type-classes/TypeClass');
  eq(Z.Filterable.name, 'sanctuary-type-classes/Filterable');
  eq(Z.Filterable.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Filterable');
  eq(Z.Filterable.test(null), false);
  eq(Z.Filterable.test(''), false);
  eq(Z.Filterable.test([]), true);
  eq(Z.Filterable.test({}), true);
});

test('Functor', function() {
  eq(type(Z.Functor), 'sanctuary-type-classes/TypeClass');
  eq(Z.Functor.name, 'sanctuary-type-classes/Functor');
  eq(Z.Functor.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Functor');
  eq(Z.Functor.test(null), false);
  eq(Z.Functor.test(''), false);
  eq(Z.Functor.test([]), true);
  eq(Z.Functor.test({}), true);
});

test('Bifunctor', function() {
  eq(type(Z.Bifunctor), 'sanctuary-type-classes/TypeClass');
  eq(Z.Bifunctor.name, 'sanctuary-type-classes/Bifunctor');
  eq(Z.Bifunctor.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Bifunctor');
  eq(Z.Bifunctor.test(null), false);
  eq(Z.Bifunctor.test(''), false);
  eq(Z.Bifunctor.test([]), false);
  eq(Z.Bifunctor.test({}), false);
  eq(Z.Bifunctor.test(Tuple('abc', 123)), true);
});

test('Profunctor', function() {
  eq(type(Z.Profunctor), 'sanctuary-type-classes/TypeClass');
  eq(Z.Profunctor.name, 'sanctuary-type-classes/Profunctor');
  eq(Z.Profunctor.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Profunctor');
  eq(Z.Profunctor.test(null), false);
  eq(Z.Profunctor.test(''), false);
  eq(Z.Profunctor.test([]), false);
  eq(Z.Profunctor.test({}), false);
  eq(Z.Profunctor.test(Math.abs), true);
});

test('Apply', function() {
  eq(type(Z.Apply), 'sanctuary-type-classes/TypeClass');
  eq(Z.Apply.name, 'sanctuary-type-classes/Apply');
  eq(Z.Apply.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Apply');
  eq(Z.Apply.test(null), false);
  eq(Z.Apply.test(''), false);
  eq(Z.Apply.test([]), true);
  eq(Z.Apply.test({}), true);
});

test('Applicative', function() {
  eq(type(Z.Applicative), 'sanctuary-type-classes/TypeClass');
  eq(Z.Applicative.name, 'sanctuary-type-classes/Applicative');
  eq(Z.Applicative.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Applicative');
  eq(Z.Applicative.test(null), false);
  eq(Z.Applicative.test(''), false);
  eq(Z.Applicative.test([]), true);
  eq(Z.Applicative.test({}), false);
});

test('Chain', function() {
  eq(type(Z.Chain), 'sanctuary-type-classes/TypeClass');
  eq(Z.Chain.name, 'sanctuary-type-classes/Chain');
  eq(Z.Chain.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Chain');
  eq(Z.Chain.test(null), false);
  eq(Z.Chain.test(''), false);
  eq(Z.Chain.test([]), true);
  eq(Z.Chain.test({}), false);
});

test('ChainRec', function() {
  eq(type(Z.ChainRec), 'sanctuary-type-classes/TypeClass');
  eq(Z.ChainRec.name, 'sanctuary-type-classes/ChainRec');
  eq(Z.ChainRec.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#ChainRec');
  eq(Z.ChainRec.test(null), false);
  eq(Z.ChainRec.test(''), false);
  eq(Z.ChainRec.test([]), true);
  eq(Z.ChainRec.test({}), false);
});

test('Monad', function() {
  eq(type(Z.Monad), 'sanctuary-type-classes/TypeClass');
  eq(Z.Monad.name, 'sanctuary-type-classes/Monad');
  eq(Z.Monad.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Monad');
  eq(Z.Monad.test(null), false);
  eq(Z.Monad.test(''), false);
  eq(Z.Monad.test([]), true);
  eq(Z.Monad.test({}), false);
});

test('Alt', function() {
  eq(type(Z.Alt), 'sanctuary-type-classes/TypeClass');
  eq(Z.Alt.name, 'sanctuary-type-classes/Alt');
  eq(Z.Alt.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Alt');
  eq(Z.Alt.test(null), false);
  eq(Z.Alt.test(''), false);
  eq(Z.Alt.test([]), true);
  eq(Z.Alt.test({}), true);
});

test('Plus', function() {
  eq(type(Z.Plus), 'sanctuary-type-classes/TypeClass');
  eq(Z.Plus.name, 'sanctuary-type-classes/Plus');
  eq(Z.Plus.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Plus');
  eq(Z.Plus.test(null), false);
  eq(Z.Plus.test(''), false);
  eq(Z.Plus.test([]), true);
  eq(Z.Plus.test({}), true);
});

test('Alternative', function() {
  eq(type(Z.Alternative), 'sanctuary-type-classes/TypeClass');
  eq(Z.Alternative.name, 'sanctuary-type-classes/Alternative');
  eq(Z.Alternative.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Alternative');
  eq(Z.Alternative.test(null), false);
  eq(Z.Alternative.test(''), false);
  eq(Z.Alternative.test([]), true);
  eq(Z.Alternative.test({}), false);
});

test('Foldable', function() {
  eq(type(Z.Foldable), 'sanctuary-type-classes/TypeClass');
  eq(Z.Foldable.name, 'sanctuary-type-classes/Foldable');
  eq(Z.Foldable.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Foldable');
  eq(Z.Foldable.test(null), false);
  eq(Z.Foldable.test(''), false);
  eq(Z.Foldable.test([]), true);
  eq(Z.Foldable.test({}), true);
});

test('Traversable', function() {
  eq(type(Z.Traversable), 'sanctuary-type-classes/TypeClass');
  eq(Z.Traversable.name, 'sanctuary-type-classes/Traversable');
  eq(Z.Traversable.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Traversable');
  eq(Z.Traversable.test(null), false);
  eq(Z.Traversable.test(''), false);
  eq(Z.Traversable.test([]), true);
  eq(Z.Traversable.test({}), true);
});

test('Extend', function() {
  eq(type(Z.Extend), 'sanctuary-type-classes/TypeClass');
  eq(Z.Extend.name, 'sanctuary-type-classes/Extend');
  eq(Z.Extend.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Extend');
  eq(Z.Extend.test(null), false);
  eq(Z.Extend.test(''), false);
  eq(Z.Extend.test([]), true);
  eq(Z.Extend.test({}), false);
});

test('Comonad', function() {
  eq(type(Z.Comonad), 'sanctuary-type-classes/TypeClass');
  eq(Z.Comonad.name, 'sanctuary-type-classes/Comonad');
  eq(Z.Comonad.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Comonad');
  eq(Z.Comonad.test(null), false);
  eq(Z.Comonad.test(''), false);
  eq(Z.Comonad.test([]), false);
  eq(Z.Comonad.test({}), false);
  eq(Z.Comonad.test(Identity(0)), true);
});

test('Contravariant', function() {
  eq(type(Z.Contravariant), 'sanctuary-type-classes/TypeClass');
  eq(Z.Contravariant.name, 'sanctuary-type-classes/Contravariant');
  eq(Z.Contravariant.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Contravariant');
  eq(Z.Contravariant.test(null), false);
  eq(Z.Contravariant.test(''), false);
  eq(Z.Contravariant.test([]), false);
  eq(Z.Contravariant.test({}), false);
  eq(Z.Contravariant.test(Math.abs), true);
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
  eq(Z.toString(new Date('2001-02-03')), 'new Date("2001-02-03T00:00:00.000Z")');
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
  eq(Z.toString(function() { var xs = []; xs.z = true; xs.a = true; return xs; }()), '["a": true, "z": true]');
  eq(Z.toString(ones), '[1, <Circular>]');
  eq(Z.toString(ones_), '[1, [1, <Circular>]]');
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
  function Foo() {}
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
  eq(Z.equals(0, -0), true);
  eq(Z.equals(-0, 0), true);
  eq(Z.equals(-0, -0), true);
  eq(Z.equals(NaN, NaN), true);
  eq(Z.equals(Infinity, Infinity), true);
  eq(Z.equals(Infinity, -Infinity), false);
  eq(Z.equals(-Infinity, Infinity), false);
  eq(Z.equals(-Infinity, -Infinity), true);
  eq(Z.equals(NaN, Math.PI), false);
  eq(Z.equals(Math.PI, NaN), false);
  eq(Z.equals(new Number(0), new Number(0)), true);
  eq(Z.equals(new Number(0), new Number(-0)), true);
  eq(Z.equals(new Number(-0), new Number(0)), true);
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
  eq(Z.equals(NaN, new Number(NaN)), false);
  eq(Z.equals(new Number(NaN), NaN), false);
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
  eq(Z.equals([0], [-0]), true);
  eq(Z.equals([NaN], [NaN]), true);
  eq(Z.equals(ones, ones), true);
  eq(Z.equals(ones, [1, [1, [1, [1, []]]]]), false);
  eq(Z.equals(ones, [1, [1, [1, [1, [0, ones]]]]]), false);
  eq(Z.equals(ones, [1, [1, [1, [1, [1, ones]]]]]), true);
  eq(Z.equals(ones, ones_), true);
  eq(Z.equals(ones_, ones), true);
  eq(Z.equals(args(), args()), true);
  eq(Z.equals(args(1, 2), args(1, 2)), true);
  eq(Z.equals(args(1, 2, 3), args(1, 2)), false);
  eq(Z.equals(args(1, 2), args(1, 2, 3)), false);
  eq(Z.equals(args(1, 2), args(2, 1)), false);
  eq(Z.equals(args(0), args(-0)), true);
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
  eq(Z.equals({x: 0}, {x: -0}), true);
  eq(Z.equals({x: NaN}, {x: NaN}), true);
  eq(Z.equals(node1, node1), true);
  eq(Z.equals(node2, node2), true);
  eq(Z.equals(node1, node2), false);
  eq(Z.equals(node2, node1), false);
  eq(Z.equals(Math.sin, Math.sin), true);
  eq(Z.equals(Math.sin, Math.cos), false);
  eq(Z.equals(Identity(Identity(Identity(0))), Identity(Identity(Identity(0)))), true);
  eq(Z.equals(Identity(Identity(Identity(0))), Identity(Identity(Identity(1)))), false);
  eq(Z.equals({'@@type': 'my-package/Quux'}, {'@@type': 'my-package/Quux'}), true);
  eq(Z.equals(Nothing.constructor, Maybe), true);
  eq(Z.equals(Just(0).constructor, Maybe), true);
  eq(Z.equals(Lazy$of(0), Lazy$of(0)), false);
});

test('lt', function() {
  eq(Z.lt.length, 2);
  eq(Z.lt.name, 'lt');

  eq(Z.lt(0, 0), false);
  eq(Z.lt(0, 1), true);
  eq(Z.lt(1, 0), false);
  eq(Z.lt('abc', 123), false);
});

test('lte', function() {
  eq(Z.lte.length, 2);
  eq(Z.lte.name, 'lte');

  eq(Z.lte(null, null), true);
  eq(Z.lte(null, undefined), false);
  eq(Z.lte(undefined, null), false);
  eq(Z.lte(undefined, undefined), true);
  eq(Z.lte(false, false), true);
  eq(Z.lte(false, true), true);
  eq(Z.lte(true, false), false);
  eq(Z.lte(true, true), true);
  eq(Z.lte(new Boolean(false), new Boolean(false)), true);
  eq(Z.lte(new Boolean(false), new Boolean(true)), true);
  eq(Z.lte(new Boolean(true), new Boolean(false)), false);
  eq(Z.lte(new Boolean(true), new Boolean(true)), true);
  eq(Z.lte(false, new Boolean(false)), false);
  eq(Z.lte(new Boolean(false), false), false);
  eq(Z.lte(true, new Boolean(true)), false);
  eq(Z.lte(new Boolean(true), true), false);
  eq(Z.lte(42, 42), true);
  eq(Z.lte(42, 43), true);
  eq(Z.lte(43, 42), false);
  eq(Z.lte(0, 0), true);
  eq(Z.lte(0, -0), true);
  eq(Z.lte(-0, 0), true);
  eq(Z.lte(-0, -0), true);
  eq(Z.lte(NaN, NaN), true);
  eq(Z.lte(Infinity, Infinity), true);
  eq(Z.lte(Infinity, -Infinity), false);
  eq(Z.lte(-Infinity, Infinity), true);
  eq(Z.lte(-Infinity, -Infinity), true);
  eq(Z.lte(NaN, Math.PI), true);
  eq(Z.lte(Math.PI, NaN), false);
  eq(Z.lte(new Number(0), new Number(0)), true);
  eq(Z.lte(new Number(0), new Number(-0)), true);
  eq(Z.lte(new Number(-0), new Number(0)), true);
  eq(Z.lte(new Number(-0), new Number(-0)), true);
  eq(Z.lte(new Number(NaN), new Number(NaN)), true);
  eq(Z.lte(new Number(Infinity), new Number(Infinity)), true);
  eq(Z.lte(new Number(Infinity), new Number(-Infinity)), false);
  eq(Z.lte(new Number(-Infinity), new Number(Infinity)), true);
  eq(Z.lte(new Number(-Infinity), new Number(-Infinity)), true);
  eq(Z.lte(new Number(NaN), new Number(Math.PI)), true);
  eq(Z.lte(new Number(Math.PI), new Number(NaN)), false);
  eq(Z.lte(42, new Number(42)), false);
  eq(Z.lte(new Number(42), 42), false);
  eq(Z.lte(new Date(0), new Date(0)), true);
  eq(Z.lte(new Date(0), new Date(1)), true);
  eq(Z.lte(new Date(1), new Date(0)), false);
  eq(Z.lte(new Date(1), new Date(1)), true);
  eq(Z.lte(new Date(NaN), new Date(NaN)), true);
  eq(Z.lte('', ''), true);
  eq(Z.lte('abc', 'abc'), true);
  eq(Z.lte('abc', 'xyz'), true);
  eq(Z.lte(new String(''), new String('')), true);
  eq(Z.lte(new String('abc'), new String('abc')), true);
  eq(Z.lte(new String('abc'), new String('xyz')), true);
  eq(Z.lte('abc', new String('abc')), false);
  eq(Z.lte(new String('abc'), 'abc'), false);
  eq(Z.lte([], []), true);
  eq(Z.lte([1, 2], [1, 2]), true);
  eq(Z.lte([1, 2, 3], [1, 2]), false);
  eq(Z.lte([1, 2], [1, 2, 3]), true);
  eq(Z.lte([1, 2], [2]), true);
  eq(Z.lte([], [undefined]), true);
  eq(Z.lte([undefined], []), false);
  eq(Z.lte([1], [undefined]), false);
  eq(Z.lte([undefined], [1]), false);
  eq(Z.lte([0], [-0]), true);
  eq(Z.lte([NaN], [NaN]), true);
  eq(Z.lte(ones, ones), true);
  eq(Z.lte(ones, [1, [1, [1, [1, []]]]]), false);
  eq(Z.lte(ones, [1, [1, [1, [1, [0, ones]]]]]), false);
  eq(Z.lte(ones, [1, [1, [1, [1, [1, ones]]]]]), true);
  eq(Z.lte(ones, ones_), true);
  eq(Z.lte(ones_, ones), true);
  eq(Z.lte(args(), args()), true);
  eq(Z.lte(args(1, 2), args(1, 2)), true);
  eq(Z.lte(args(1, 2, 3), args(1, 2)), false);
  eq(Z.lte(args(1, 2), args(1, 2, 3)), true);
  eq(Z.lte(args(1, 2), args(2, 1)), true);
  eq(Z.lte(args(0), args(-0)), true);
  eq(Z.lte(args(NaN), args(NaN)), true);
  eq(Z.lte({}, {}), true);
  eq(Z.lte({a: 0}, {z: 0}), true);
  eq(Z.lte({z: 0}, {a: 0}), false);
  eq(Z.lte({x: 1, y: 2}, {y: 2, x: 1}), true);
  eq(Z.lte({x: 1, y: 2, z: 3}, {x: 1, y: 2}), false);
  eq(Z.lte({x: 1, y: 2}, {x: 1, y: 2, z: 3}), true);
  eq(Z.lte({x: 1, y: 2, z: 3}, {x: 1, y: 2, z: undefined}), false);
  eq(Z.lte({x: 1, y: 2, z: undefined}, {x: 1, y: 2, z: 3}), false);
  eq(Z.lte({x: 1, y: 1}, {x: 2, y: 1}), true);
  eq(Z.lte({x: 2, y: 1}, {x: 1, y: 2}), false);
  eq(Z.lte({x: 0, y: 0}, {x: 1}), true);
  eq(Z.lte({x: 0}, {x: 0, y: 0}), true);
  eq(Z.lte({x: -0}, {x: 0}), true);
  eq(Z.lte({x: 0}, {x: -0}), true);
  eq(Z.lte({x: NaN}, {x: NaN}), true);
  eq(Z.lte(Identity(Identity(Identity(0))), Identity(Identity(Identity(0)))), true);
  eq(Z.lte(Identity(Identity(Identity(0))), Identity(Identity(Identity(1)))), true);
  eq(Z.lte(Identity(Identity(Identity(1))), Identity(Identity(Identity(0)))), false);
  eq(Z.lte(Lazy$of(0), Lazy$of(0)), false);
  eq(Z.lte('abc', 123), false);

  var $0 = {z: 0};
  var $1 = {z: 1};
  $0.a = $1;
  $1.a = $0;
  eq(Z.lte($0, $0), true);
  eq(Z.lte($0, $1), false);
  eq(Z.lte($1, $0), false);
});

test('gt', function() {
  eq(Z.gt.length, 2);
  eq(Z.gt.name, 'gt');

  eq(Z.gt(0, 0), false);
  eq(Z.gt(0, 1), false);
  eq(Z.gt(1, 0), true);
  eq(Z.gt('abc', 123), false);
});

test('gte', function() {
  eq(Z.gte.length, 2);
  eq(Z.gte.name, 'gte');

  eq(Z.gte(0, 0), true);
  eq(Z.gte(0, 1), false);
  eq(Z.gte(1, 0), true);
  eq(Z.gte('abc', 123), false);
});

test('min', function() {
  eq(Z.min.length, 2);
  eq(Z.min.name, 'min');

  eq(Z.min(0, 1), 0);
  eq(Z.min(['x', 'x'], ['x']), ['x']);
});

test('max', function() {
  eq(Z.max.length, 2);
  eq(Z.max.name, 'max');

  eq(Z.max(0, 1), 1);
  eq(Z.max(['x', 'x'], ['x']), ['x', 'x']);
});

test('compose', function() {
  eq(Z.compose.length, 2);
  eq(Z.compose.name, 'compose');

  eq(Z.compose(Math.sqrt, inc)(99), 10);
});

test('id', function() {
  eq(Z.id.length, 1);
  eq(Z.id.name, 'id');

  eq(Z.id(Function)(42), 42);
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
  eq(Z.concat({x: 1}, Point()), {x: 1});
  eq(Z.concat(Point(), {x: 1}), {x: 1});
  eq(Z.concat(Point(), Point()), {});
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
  eq(Z.empty(Maybe), Nothing);
});

test('invert', function() {
  eq(Z.invert.length, 1);
  eq(Z.invert.name, 'invert');

  eq(Z.invert(Sum(5)), Sum(-5));
  eq(Z.invert(Sum(-5)), Sum(5));
});

test('filter', function() {
  eq(Z.filter.length, 2);
  eq(Z.filter.name, 'filter');

  eq(Z.filter(odd, []), []);
  eq(Z.filter(odd, [1, 2, 3, 4, 5]), [1, 3, 5]);
  eq(Z.filter(odd, {}), {});
  eq(Z.filter(odd, {x: 1, y: 2, z: 3}), {x: 1, z: 3});
  eq(Z.filter(odd, Nil), Nil);
  eq(Z.filter(odd, Cons(1, Cons(2, Cons(3, Cons(4, Cons(5, Nil)))))), Cons(1, Cons(3, Cons(5, Nil))));
  eq(Z.filter(odd, Nothing), Nothing);
  eq(Z.filter(odd, Just(0)), Nothing);
  eq(Z.filter(odd, Just(1)), Just(1));
});

test('reject', function() {
  eq(Z.reject.length, 2);
  eq(Z.reject.name, 'reject');

  eq(Z.reject(odd, []), []);
  eq(Z.reject(odd, [1, 2, 3, 4, 5]), [2, 4]);
  eq(Z.reject(odd, {}), {});
  eq(Z.reject(odd, {x: 1, y: 2, z: 3}), {y: 2});
  eq(Z.reject(odd, Nil), Nil);
  eq(Z.reject(odd, Cons(1, Cons(2, Cons(3, Cons(4, Cons(5, Nil)))))), Cons(2, Cons(4, Nil)));
  eq(Z.reject(odd, Nothing), Nothing);
  eq(Z.reject(odd, Just(0)), Just(0));
  eq(Z.reject(odd, Just(1)), Nothing);
});

test('takeWhile', function() {
  eq(Z.takeWhile.length, 2);
  eq(Z.takeWhile.name, 'takeWhile');

  eq(Z.takeWhile(odd, []), []);
  eq(Z.takeWhile(odd, [1]), [1]);
  eq(Z.takeWhile(odd, [1, 3]), [1, 3]);
  eq(Z.takeWhile(odd, [1, 3, 6]), [1, 3]);
  eq(Z.takeWhile(odd, [1, 3, 6, 10]), [1, 3]);
  eq(Z.takeWhile(odd, [1, 3, 6, 10, 15]), [1, 3]);
  eq(Z.takeWhile(odd, Nil), Nil);
  eq(Z.takeWhile(odd, Cons(1, Nil)), Cons(1, Nil));
  eq(Z.takeWhile(odd, Cons(1, Cons(3, Nil))), Cons(1, Cons(3, Nil)));
  eq(Z.takeWhile(odd, Cons(1, Cons(3, Cons(6, Nil)))), Cons(1, Cons(3, Nil)));
  eq(Z.takeWhile(odd, Cons(1, Cons(3, Cons(6, Cons(10, Nil))))), Cons(1, Cons(3, Nil)));
  eq(Z.takeWhile(odd, Cons(1, Cons(3, Cons(6, Cons(10, Cons(15, Nil)))))), Cons(1, Cons(3, Nil)));
});

test('dropWhile', function() {
  eq(Z.dropWhile.length, 2);
  eq(Z.dropWhile.name, 'dropWhile');

  eq(Z.dropWhile(odd, []), []);
  eq(Z.dropWhile(odd, [1]), []);
  eq(Z.dropWhile(odd, [1, 3]), []);
  eq(Z.dropWhile(odd, [1, 3, 6]), [6]);
  eq(Z.dropWhile(odd, [1, 3, 6, 10]), [6, 10]);
  eq(Z.dropWhile(odd, [1, 3, 6, 10, 15]), [6, 10, 15]);
  eq(Z.dropWhile(odd, Nil), Nil);
  eq(Z.dropWhile(odd, Cons(1, Nil)), Nil);
  eq(Z.dropWhile(odd, Cons(1, Cons(3, Nil))), Nil);
  eq(Z.dropWhile(odd, Cons(1, Cons(3, Cons(6, Nil)))), Cons(6, Nil));
  eq(Z.dropWhile(odd, Cons(1, Cons(3, Cons(6, Cons(10, Nil))))), Cons(6, Cons(10, Nil)));
  eq(Z.dropWhile(odd, Cons(1, Cons(3, Cons(6, Cons(10, Cons(15, Nil)))))), Cons(6, Cons(10, Cons(15, Nil))));
});

test('map', function() {
  eq(Z.map.length, 2);
  eq(Z.map.name, 'map');

  eq(Z.map(inc, []), []);
  eq(Z.map(inc, [1, 2, 3]), [2, 3, 4]);
  eq(Z.map(inc, {}), {});
  eq(Z.map(inc, {x: 2, y: 4}), {x: 3, y: 5});
  eq(Z.map(inc, Point()), {});
  eq(Z.map(inc, length)('abc'), 4);
  eq(Z.map(inc, Identity(42)), Identity(43));
  eq(Z.map(inc, Nil), Nil);
  eq(Z.map(inc, Cons(1, Cons(2, Cons(3, Nil)))), Cons(2, Cons(3, Cons(4, Nil))));
});

test('flip', function() {
  eq(Z.flip.length, 2);
  eq(Z.flip.name, 'flip');

  eq(Z.flip(pow, 2)(10), 100);
  eq(Z.flip([Math.floor, Math.ceil], 1.5), [1, 2]);
  eq(Z.flip({floor: Math.floor, ceil: Math.ceil}, 1.5), {floor: 1, ceil: 2});
  eq(Z.flip(Cons(Math.floor, Cons(Math.ceil, Nil)), 1.5), Cons(1, Cons(2, Nil)));
});

test('bimap', function() {
  eq(Z.bimap.length, 3);
  eq(Z.bimap.name, 'bimap');

  eq(Z.bimap(toUpper, inc, Tuple('abc', 123)), Tuple('ABC', 124));
});

test('mapLeft', function() {
  eq(Z.mapLeft.length, 2);
  eq(Z.mapLeft.name, 'mapLeft');

  eq(Z.mapLeft(toUpper, Tuple('abc', 'def')), Tuple('ABC', 'def'));
});

test('promap', function() {
  eq(Z.promap.length, 3);
  eq(Z.promap.name, 'promap');

  function lengths(xs) { return Z.map(length, xs); }
  function sum(xs) { return Z.reduce(add, 0, xs); }
  eq(Z.promap(lengths, square, sum)(['foo', 'bar', 'baz', 'quux']), 169);
});

test('ap', function() {
  eq(Z.ap.length, 2);
  eq(Z.ap.name, 'ap');

  eq(Z.ap([], []), []);
  eq(Z.ap([], [1, 2, 3]), []);
  eq(Z.ap([inc], []), []);
  eq(Z.ap([inc], [1, 2, 3]), [2, 3, 4]);
  eq(Z.ap([inc, square], [1, 2, 3]), [2, 3, 4, 1, 4, 9]);
  eq(Z.ap({}, {}), {});
  eq(Z.ap({}, {x: 1, y: 2, z: 3}), {});
  eq(Z.ap({x: inc}, {}), {});
  eq(Z.ap({x: inc}, {x: 1}), {x: 2});
  eq(Z.ap({x: inc, y: square}, {x: 1, y: 2}), {x: 2, y: 4});
  eq(Z.ap({x: inc, y: square, z: abs}, {w: 4, x: 1, y: 2}), {x: 2, y: 4});
  eq(Z.ap({}, {toString: 42}), {});
  eq(Z.ap({x: inc, y: inc}, Point()), {});
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

test('lift2', function() {
  eq(Z.lift2.length, 3);
  eq(Z.lift2.name, 'lift2');

  eq(Z.lift2(pow, [10], [1, 2, 3]), [10, 100, 1000]);
  eq(Z.lift2(pow, Identity(10), Identity(3)), Identity(1000));
});

test('lift3', function() {
  eq(Z.lift3.length, 4);
  eq(Z.lift3.name, 'lift3');

  eq(Z.lift3(wrap, ['<'], ['>'], ['foo', 'bar', 'baz']), ['<foo>', '<bar>', '<baz>']);
  eq(Z.lift3(wrap, Identity('<'), Identity('>'), Identity('baz')), Identity('<baz>'));
});

test('apFirst', function() {
  eq(Z.apFirst.length, 2);
  eq(Z.apFirst.name, 'apFirst');

  eq(Z.apFirst([1, 2], [3, 4]), [1, 1, 2, 2]);
  eq(Z.apFirst(Identity(1), Identity(2)), Identity(1));
});

test('apSecond', function() {
  eq(Z.apSecond.length, 2);
  eq(Z.apSecond.name, 'apSecond');

  eq(Z.apSecond([1, 2], [3, 4]), [3, 4, 3, 4]);
  eq(Z.apSecond(Identity(1), Identity(2)), Identity(2));
});

test('of', function() {
  eq(Z.of.length, 2);
  eq(Z.of.name, 'of');

  eq(Z.of(Array, 42), [42]);
  eq(Z.of(Function, 42)(null), 42);
  eq(Z.of(Identity, 42), Identity(42));
  eq(Z.of(List, 42), Cons(42, Nil));
  eq(Z.of(Maybe, 42), Just(42));
});

test('append', function() {
  eq(Z.append.length, 2);
  eq(Z.append.name, 'append');

  eq(Z.append(3, []), [3]);
  eq(Z.append(3, [1, 2]), [1, 2, 3]);
  eq(Z.append(3, Nil), Cons(3, Nil));
  eq(Z.append(3, Cons(1, Cons(2, Nil))), Cons(1, Cons(2, Cons(3, Nil))));
  eq(Z.append([5, 6], [[1, 2], [3, 4]]), [[1, 2], [3, 4], [5, 6]]);
  eq(Z.append([2], Nothing), Just([2]));
  eq(Z.append([2], Just([1])), Just([1, 2]));
});

test('prepend', function() {
  eq(Z.prepend.length, 2);
  eq(Z.prepend.name, 'prepend');

  eq(Z.prepend(1, []), [1]);
  eq(Z.prepend(1, [2, 3]), [1, 2, 3]);
  eq(Z.prepend(1, Nil), Cons(1, Nil));
  eq(Z.prepend(1, Cons(2, Cons(3, Nil))), Cons(1, Cons(2, Cons(3, Nil))));
  eq(Z.prepend([1, 2], [[3, 4], [5, 6]]), [[1, 2], [3, 4], [5, 6]]);
  eq(Z.prepend([1], Nothing), Just([1]));
  eq(Z.prepend([1], Just([2])), Just([1, 2]));
});

test('chain', function() {
  eq(Z.chain.length, 2);
  eq(Z.chain.name, 'chain');

  eq(Z.chain(double, []), []);
  eq(Z.chain(double, [1, 2, 3]), [1, 1, 2, 2, 3, 3]);
  eq(Z.chain(identity, [[1, 2], [3, 4], [5, 6]]), [1, 2, 3, 4, 5, 6]);
  eq(Z.chain(repeat, abs)(-1), [-1]);
  eq(Z.chain(repeat, abs)(-2), [-2, -2]);
  eq(Z.chain(repeat, abs)(-3), [-3, -3, -3]);
  eq(Z.chain(identInc, Identity(42)), Identity(43));
  eq(Z.chain(identity, Identity(Identity(0))), Identity(0));
});

test('join', function() {
  eq(Z.join.length, 1);
  eq(Z.join.name, 'join');

  eq(Z.join([]), []);
  eq(Z.join([[]]), []);
  eq(Z.join([[[]]]), [[]]);
  eq(Z.join([[1], [2], [3]]), [1, 2, 3]);
  eq(Z.join([[[1, 2, 3]]]), [[1, 2, 3]]);
  eq(Z.join(Identity(Identity(1))), Identity(1));
  eq(Z.join(Identity(Identity(Identity(1)))), Identity(Identity(1)));
});

test('chainRec', function() {
  eq(Z.chainRec.length, 3);
  eq(Z.chainRec.name, 'chainRec');

  var count = 0;

  //  squash :: (Any -> a, Any -> a, Any) -> Array b
  function squash(next, done, x) {
    if (Array.isArray(x)) return x.map(next);
    count += 1;
    return [done(x)];
  }

  eq(Z.chainRec(Array, squash, [1, [[2, 3], 4], 5]), [1, 2, 3, 4, 5]);
  eq(count, 5);

  eq(Z.chainRec(Array, function(next, done, n) { return n === 0 ? [done('DONE')] : [next(n - 1)]; }, 100000), ['DONE']);

  function stepper(next, done, n) {
    return n === 30000
      ? Z.map(done, function(env) { return n + env.inc; })
      : Z.map(next, function(env) { return n + env.step; });
  }

  eq(Z.chainRec(Function, stepper, 0)({step: 2, inc: 100}), 30100);
});

test('alt', function() {
  eq(Z.alt.length, 2);
  eq(Z.alt.name, 'alt');

  eq(Z.alt([], []), []);
  eq(Z.alt([], [1, 2, 3]), [1, 2, 3]);
  eq(Z.alt([1, 2, 3], []), [1, 2, 3]);
  eq(Z.alt([1, 2, 3], [4, 5, 6]), [1, 2, 3, 4, 5, 6]);
  eq(Z.alt({}, {}), {});
  eq(Z.alt({}, {a: 1, b: 2, c: 3}), {a: 1, b: 2, c: 3});
  eq(Z.alt({a: 1, b: 2, c: 3}, {}), {a: 1, b: 2, c: 3});
  eq(Z.alt({a: 1, b: 2, c: 3}, {d: 4, e: 5, f: 6}), {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6});
  eq(Z.alt({a: 1}, Point()), {a: 1});
  eq(Z.alt(Point(), {a: 1}), {a: 1});
  eq(Z.alt(Point(), Point()), {});
  eq(Z.alt(Nothing, Nothing), Nothing);
  eq(Z.alt(Nothing, Just(1)), Just(1));
  eq(Z.alt(Just(2), Nothing), Just(2));
  eq(Z.alt(Just(3), Just(4)), Just(3));
});

test('zero', function() {
  eq(Z.zero.length, 1);
  eq(Z.zero.name, 'zero');

  eq(Z.zero(Array), []);
  eq(Z.zero(Object), {});
  eq(Z.zero(Maybe), Nothing);
});

function testReduce(reduce) {
  eq(reduce(Z.concat, 'x', []), 'x');
  eq(reduce(Z.concat, 'x', ['a', 'b', 'c']), 'xabc');
  eq(reduce(add, 0, {}), 0);
  eq(reduce(add, 0, {a: 1, b: 2, c: 3, d: 4, e: 5}), 15);
  eq(reduce(function(xs, x) { return Z.concat(xs, [x]); }, [], {a: 1, b: 2, c: 3}), [1, 2, 3]);
  eq(reduce(function(xs, x) { return Z.concat(xs, [x]); }, [], {c: 3, b: 2, a: 1}), [1, 2, 3]);
  eq(reduce(Z.concat, 'x', Nil), 'x');
  eq(reduce(Z.concat, 'x', Cons('a', Cons('b', Cons('c', Nil)))), 'xabc');
}

test('reduce', function() {
  eq(Z.reduce.length, 3);
  eq(Z.reduce.name, 'reduce');

  testReduce(Z.reduce);
});

test('size', function() {
  eq(Z.size.length, 1);
  eq(Z.size.name, 'size');

  eq(Z.size([]), 0);
  eq(Z.size(['foo']), 1);
  eq(Z.size(['foo', 'bar']), 2);
  eq(Z.size(['foo', 'bar', 'baz']), 3);
  eq(Z.size(Nil), 0);
  eq(Z.size(Cons('foo', Nil)), 1);
  eq(Z.size(Cons('foo', Cons('bar', Nil))), 2);
  eq(Z.size(Cons('foo', Cons('bar', Cons('baz', Nil)))), 3);
  eq(Z.size(Identity('quux')), 1);
  eq(Z.size(Nothing), 0);
  eq(Z.size(Just(0)), 1);
  eq(Z.size(Tuple('abc', 123)), 1);
});

test('elem', function() {
  eq(Z.elem.length, 2);
  eq(Z.elem.name, 'elem');

  eq(Z.elem('a', ['a', 'b', 'c']), true);
  eq(Z.elem('b', ['a', 'b', 'c']), true);
  eq(Z.elem('c', ['a', 'b', 'c']), true);
  eq(Z.elem('d', ['a', 'b', 'c']), false);
  eq(Z.elem(1, {x: 1, y: 2, z: 3}), true);
  eq(Z.elem(2, {x: 1, y: 2, z: 3}), true);
  eq(Z.elem(3, {x: 1, y: 2, z: 3}), true);
  eq(Z.elem(4, {x: 1, y: 2, z: 3}), false);
  eq(Z.elem(0, Just(0)), true);
  eq(Z.elem(0, Just(1)), false);
  eq(Z.elem(0, Nothing), false);
});

test('foldMap', function() {
  eq(Z.foldMap.length, 3);
  eq(Z.foldMap.name, 'foldMap');

  // Monoid instance for functions of type a -> a corresponding
  // to reverse function composition
  function DualEndo(f) {
    if (!(this instanceof DualEndo)) return new DualEndo(f);
    this.runEndo = f;
  }
  DualEndo['fantasy-land/empty'] = function() { return DualEndo(identity); };
  DualEndo.prototype['fantasy-land/concat'] = function(other) {
    return DualEndo(a => other.runEndo(this.runEndo(a)));
  };

  // Derive reduce (foldl) from foldMap
  function reduce(f, z, x) {
    function mmap(a) { return DualEndo(function(b) { return f(b, a); }); }
    var finalEndo = Z.foldMap(DualEndo, mmap, x);
    return finalEndo.runEndo(z);
  }

  // Test derived reduce behaves identically to Z.reduce
  testReduce(reduce);
});

test('reverse', function() {
  eq(Z.reverse.length, 1);
  eq(Z.reverse.name, 'reverse');

  eq(Z.reverse([]), []);
  eq(Z.reverse([1]), [1]);
  eq(Z.reverse([1, 2]), [2, 1]);
  eq(Z.reverse([1, 2, 3]), [3, 2, 1]);
  eq(Z.reverse(Nil), Nil);
  eq(Z.reverse(Cons(1, Nil)), Cons(1, Nil));
  eq(Z.reverse(Cons(1, Cons(2, Nil))), Cons(2, Cons(1, Nil)));
  eq(Z.reverse(Cons(1, Cons(2, Cons(3, Nil)))), Cons(3, Cons(2, Cons(1, Nil))));
});

test('sort', function() {
  eq(Z.sort.length, 1);
  eq(Z.sort.name, 'sort');

  function runAssertions() {
    eq(Z.sort([]), []);
    eq(Z.sort(['foo']), ['foo']);
    eq(Z.sort(['foo', 'bar']), ['bar', 'foo']);
    eq(Z.sort(['foo', 'bar', 'baz']), ['bar', 'baz', 'foo']);
    eq(Z.sort(Nil), Nil);
    eq(Z.sort(Cons('foo', Nil)), Cons('foo', Nil));
    eq(Z.sort(Cons('foo', Cons('bar', Nil))), Cons('bar', Cons('foo', Nil)));
    eq(Z.sort(Cons('foo', Cons('bar', Cons('baz', Nil)))), Cons('bar', Cons('baz', Cons('foo', Nil))));
    eq(Z.sort([NaN, 3, NaN, 1, NaN, 2, NaN]), [NaN, NaN, NaN, NaN, 1, 2, 3]);
    eq(Z.sort([Just(3), Just(1), Just(2)]), [Just(1), Just(2), Just(3)]);
  }

  runAssertions();
  withUnstableArraySort(runAssertions);
});

test('sortBy', function() {
  eq(Z.sortBy.length, 2);
  eq(Z.sortBy.name, 'sortBy');

  function rank(card) { return card.rank; }
  function suit(card) { return card.suit; }
  var _7s = {rank: 7, suit: 's'};
  var _5h = {rank: 5, suit: 'h'};
  var _2h = {rank: 2, suit: 'h'};
  var _5s = {rank: 5, suit: 's'};

  function runAssertions() {
    eq(Z.sortBy(rank, [_7s, _5h, _2h, _5s]), [_2h, _5h, _5s, _7s]);
    eq(Z.sortBy(rank, [_7s, _5s, _2h, _5h]), [_2h, _5s, _5h, _7s]);
    eq(Z.sortBy(suit, [_7s, _5h, _2h, _5s]), [_5h, _2h, _7s, _5s]);
    eq(Z.sortBy(suit, [_5s, _2h, _5h, _7s]), [_2h, _5h, _5s, _7s]);
  }

  runAssertions();
  withUnstableArraySort(runAssertions);
});

test('traverse', function() {
  eq(Z.traverse.length, 3);
  eq(Z.traverse.name, 'traverse');

  eq(Z.traverse(Array, identity, []), [[]]);
  eq(Z.traverse(Array, identity, [[1], [2], [3]]), [[1, 2, 3]]);
  eq(Z.traverse(Array, identity, [[1, 2, 3], [4, 5]]), [[1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5]]);
  eq(Z.traverse(Array, identity, repeat(6)(range(10))).length, Math.pow(10, 6));
  eq(Z.traverse(Maybe, parseInt_(16), {a: 'A', b: 'B', c: 'C'}), Just({a: 10, b: 11, c: 12}));
  eq(Z.traverse(Maybe, parseInt_(16), {a: 'A', b: 'B', c: 'C', x: 'X'}), Nothing);
  eq(Z.traverse(Identity, identInc, []), Identity([]));
  eq(Z.traverse(Identity, identInc, [1, 2, 3]), Identity([2, 3, 4]));
  eq(Z.traverse(Identity, identInc, Nil), Identity(Nil));
  eq(Z.traverse(Identity, identInc, Cons(1, Cons(2, Cons(3, Nil)))), Identity(Cons(2, Cons(3, Cons(4, Nil)))));
  eq(Z.traverse(Lazy, Lazy$of, range(70000)).run().length, 70000);
  eq(Z.traverse(Array, identity, {a: [1, 2], b: [3, 4]}), [{a: 1, b: 3}, {a: 1, b: 4}, {a: 2, b: 3}, {a: 2, b: 4}]);
});

test('sequence', function() {
  eq(Z.sequence.length, 2);
  eq(Z.sequence.name, 'sequence');

  eq(Z.sequence(Identity, []), Identity([]));
  eq(Z.sequence(Identity, [Identity(1), Identity(2), Identity(3)]), Identity([1, 2, 3]));
  eq(Z.sequence(Array, Identity([])), []);
  eq(Z.sequence(Array, Identity([1, 2, 3])), [Identity(1), Identity(2), Identity(3)]);
  eq(Z.sequence(Identity, Nil), Identity(Nil));
  eq(Z.sequence(Identity, Cons(Identity(1), Cons(Identity(2), Cons(Identity(3), Nil)))), Identity(Cons(1, Cons(2, Cons(3, Nil)))));
  eq(Z.sequence(List, Identity(Nil)), Nil);
  eq(Z.sequence(List, Identity(Cons(1, Cons(2, Cons(3, Nil))))), Cons(Identity(1), Cons(Identity(2), Cons(Identity(3), Nil))));
  eq(Z.sequence(Maybe, {a: Just('A'), b: Just('B'), c: Just('C')}), Just({a: 'A', b: 'B', c: 'C'}));
  eq(Z.sequence(Maybe, {a: Just('A'), b: Just('B'), c: Just('C'), x: Nothing}), Nothing);
  eq(Z.sequence(Array, {a: [1, 2], b: [3, 4]}), [{a: 1, b: 3}, {a: 1, b: 4}, {a: 2, b: 3}, {a: 2, b: 4}]);
});

test('extend', function() {
  eq(Z.extend.length, 2);
  eq(Z.extend.name, 'extend');

  eq(Z.extend(joinWith(''), []), []);
  eq(Z.extend(joinWith(''), ['x']), ['x']);
  eq(Z.extend(joinWith(''), ['x', 'y']), ['xy', 'y']);
  eq(Z.extend(joinWith(''), ['x', 'y', 'z']), ['xyz', 'yz', 'z']);
  eq(Z.extend(function(id) { return Z.reduce(add, 1, id); }, Identity(42)), Identity(43));
  eq(Z.extend(function(f) { return f([3, 4]); }, Z.reverse)([1, 2]), [4, 3, 2, 1]);
});

test('duplicate', function() {
  eq(Z.duplicate.length, 1);
  eq(Z.duplicate.name, 'duplicate');

  eq(Z.duplicate([]), []);
  eq(Z.duplicate([[]]), [[[]]]);
  eq(Z.duplicate([1, 2, 3]), [[1, 2, 3], [2, 3], [3]]);
  eq(Z.duplicate([[1, 2, 3]]), [[[1, 2, 3]]]);
  eq(Z.duplicate(Identity(1)), Identity(Identity(1)));
  eq(Z.duplicate(Identity(Identity(1))), Identity(Identity(Identity(1))));
});

test('extract', function() {
  eq(Z.extract.length, 1);
  eq(Z.extract.name, 'extract');

  eq(Z.extract(Identity(42)), 42);
});

test('contramap', function() {
  eq(Z.contramap.length, 2);
  eq(Z.contramap.name, 'contramap');

  eq(Z.contramap(length, inc)('abc'), 4);
});
