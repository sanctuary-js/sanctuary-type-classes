'use strict';

var assert = require ('assert');

var laws = require ('fantasy-laws');
var jsc = require ('jsverify');
var Identity = require ('sanctuary-identity');
var Maybe = require ('sanctuary-maybe');
var Pair = require ('sanctuary-pair');
var type = require ('sanctuary-type-identifiers');

var Z = require ('..');
var version = (require ('../package.json')).version;

var Lazy = require ('./Lazy');
var List = require ('./List');
var Sum = require ('./Sum');
var eq = require ('./eq');
var withUnstableArraySort = (require ('./quicksort')).withUnstableArraySort;


var Nil = List.Nil;
var Cons = List.Cons;

var Nothing = Maybe.Nothing;
var Just = Maybe.Just;


//  Lazy$of :: a -> Lazy a
function Lazy$of(x) {
  eq (arguments.length, Lazy$of.length);
  return Z.of (Lazy, x);
}

//  ListArb :: Arbitrary a -> Arbitrary (List a)
function ListArb(arb) {
  return (jsc.array (arb)).smap (function(xs) {
    var list = Nil;
    for (var idx = 0; idx < xs.length; idx += 1) list = Cons (xs[idx], list);
    return list;
  });
}

//  MaybeArb :: Arbitrary a -> Arbitrary (Maybe a)
function MaybeArb(arb) {
  return jsc.oneof (jsc.constant (Nothing), arb.smap (Just));
}

//  Point :: () -> Point
function Point() {
  eq (arguments.length, Point.length);
  if (!(this instanceof Point)) return new Point ();
}
Point.prototype.x = 0;
Point.prototype.y = 0;

//  abs :: Number -> Number
function abs(x) {
  eq (arguments.length, abs.length);
  return Math.abs (x);
}

//  add :: (Number, Number) -> Number
function add(x, y) {
  eq (arguments.length, add.length);
  return x + y;
}

//  append :: a -> Array a -> Array a
function append(x) {
  eq (arguments.length, append.length);
  return function append$1(xs) {
    eq (arguments.length, append$1.length);
    return xs.concat ([x]);
  };
}

//  args :: (Any...) -> Arguments
function args() {
  return arguments;
}

//  compose :: (b -> c) -> (a -> b) -> a -> c
function compose(f) {
  eq (arguments.length, compose.length);
  return function compose$1(g) {
    eq (arguments.length, compose$1.length);
    return function compose$2(x) {
      eq (arguments.length, compose$2.length);
      return f (g (x));
    };
  };
}

//  concat :: Array a -> Array a -> Array a
function concat(xs) {
  eq (arguments.length, concat.length);
  return function concat$1(ys) {
    eq (arguments.length, concat$1.length);
    return xs.concat (ys);
  };
}

//  double :: a -> Array2 a a
function double(x) {
  eq (arguments.length, double.length);
  return [x, x];
}

//  gt :: Number -> Number -> Boolean
function gt(x) {
  eq (arguments.length, gt.length);
  return function gt$1(y) {
    eq (arguments.length, gt$1.length);
    return y > x;
  };
}

//  identInc :: Number -> Identity Number
function identInc(x) {
  eq (arguments.length, identInc.length);
  return Identity (x + 1);
}

//  identity :: a -> a
function identity(x) {
  eq (arguments.length, identity.length);
  return x;
}

//  inc :: Number -> Number
function inc(x) {
  eq (arguments.length, inc.length);
  return x + 1;
}

//  joinWith :: String -> Array String -> String
function joinWith(s) {
  eq (arguments.length, joinWith.length);
  return function joinWith$1(ss) {
    eq (arguments.length, joinWith$1.length);
    return ss.join (s);
  };
}

//  length :: List a -> Integer
function length(xs) {
  eq (arguments.length, length.length);
  return xs.length;
}

//  listToArray :: List a -> Array a
function listToArray(xs) {
  eq (arguments.length, listToArray.length);
  var result = [];
  for (var list = xs; list.isCons; list = list.tail) result.push (list.head);
  return result;
}

//  lt :: Number -> Number -> Boolean
function lt(x) {
  eq (arguments.length, lt.length);
  return function lt$1(y) {
    eq (arguments.length, lt$1.length);
    return y < x;
  };
}

var node1 = {id: 1, rels: []};
var node2 = {id: 2, rels: []};
node1.rels.push ({type: 'child', value: node2});
node2.rels.push ({type: 'parent', value: node1});

//  odd :: Integer -> Boolean
function odd(x) {
  eq (arguments.length, odd.length);
  return x % 2 === 1;
}

//  ones :: Array2 Number (Array2 Number (Array2 Number ...))
var ones = [1]; ones.push (ones);

//  ones_ :: Array2 Number (Array2 Number (Array2 Number ...))
var ones_ = [1]; ones_.push ([1, ones_]);

//  parseInt_ :: Integer -> String -> Maybe Integer
function parseInt_(radix) {
  eq (arguments.length, parseInt_.length);
  return function parseInt$1(s) {
    eq (arguments.length, parseInt$1.length);
    var n = parseInt (s, radix);
    return isNaN (n) ? Nothing : Just (n);
  };
}

//  pow :: Number -> Number -> Number
function pow(base) {
  eq (arguments.length, pow.length);
  return function pow$1(exp) {
    eq (arguments.length, pow$1.length);
    return Math.pow (base, exp);
  };
}

//  product :: Foldable f => f Number -> Number
function product(xs) {
  eq (arguments.length, product.length);
  return Z.reduce (function(x, y) { return x * y; }, 1, xs);
}

//  range :: Integer -> Array Integer
function range(n) {
  eq (arguments.length, range.length);
  var result = [];
  for (var m = 0; m < n; m += 1) result.push (m);
  return result;
}

//  repeat :: Integer -> a -> Array a
function repeat(n) {
  eq (arguments.length, repeat.length);
  return function repeat$1(x) {
    eq (arguments.length, repeat$1.length);
    var result = [];
    for (var m = 0; m < n; m += 1) result.push (x);
    return result;
  };
}

//  splitOn :: String -> String -> Array String
function splitOn(sep) {
  eq (arguments.length, splitOn.length);
  return function splitOn$1(s) {
    eq (arguments.length, splitOn$1.length);
    return s.split (sep);
  };
}

//  square :: Number -> Number
function square(x) {
  eq (arguments.length, square.length);
  return x * x;
}

//  sum :: Foldable f => f Number -> Number
function sum(xs) {
  eq (arguments.length, sum.length);
  return Z.reduce (add, 0, xs);
}

//  toUpper :: String -> String
function toUpper(s) {
  eq (arguments.length, toUpper.length);
  return s.toUpperCase ();
}

//  wrap :: String -> String -> String -> String
function wrap(before) {
  eq (arguments.length, wrap.length);
  return function wrap$1(after) {
    eq (arguments.length, wrap$1.length);
    return function wrap$2(s) {
      eq (arguments.length, wrap$2.length);
      return before + s + after;
    };
  };
}


test ('TypeClass', function() {
  eq (typeof Z.TypeClass, 'function');
  eq (Z.TypeClass.length, 4);

  //  hasMethod :: String -> a -> Boolean
  function hasMethod(name) {
    return function(x) {
      return x != null && typeof x[name] === 'function';
    };
  }

  //  Foo :: TypeClass
  var Foo = Z.TypeClass (
    'my-package/Foo',
    'http://example.com/my-package#Foo',
    [],
    hasMethod ('foo')
  );

  //  Bar :: TypeClass
  var Bar = Z.TypeClass (
    'my-package/Bar',
    'http://example.com/my-package#Bar',
    [Foo],
    hasMethod ('bar')
  );

  eq (type (Foo), 'sanctuary-type-classes/TypeClass@1');
  eq (Foo.name, 'my-package/Foo');
  eq (Foo.url, 'http://example.com/my-package#Foo');
  eq (Foo.test (null), false);
  eq (Foo.test ({}), false);
  eq (Foo.test ({foo: function() {}}), true);
  eq (Foo.test ({bar: function() {}}), false);
  eq (Foo.test ({foo: function() {}, bar: function() {}}), true);

  eq (type (Bar), 'sanctuary-type-classes/TypeClass@1');
  eq (Bar.name, 'my-package/Bar');
  eq (Bar.url, 'http://example.com/my-package#Bar');
  eq (Bar.test (null), false);
  eq (Bar.test ({}), false);
  eq (Bar.test ({foo: function() {}}), false);
  eq (Bar.test ({bar: function() {}}), false);
  eq (Bar.test ({foo: function() {}, bar: function() {}}), true);
});

test ('Setoid', function() {
  eq (type (Z.Setoid), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Setoid.name, 'sanctuary-type-classes/Setoid');
  eq (Z.Setoid.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Setoid');
  eq (Z.Setoid.test (null), true);
  eq (Z.Setoid.test (''), true);
  eq (Z.Setoid.test ([]), true);
  eq (Z.Setoid.test ({}), true);
  eq (Z.Setoid.test ({'@@type': 'my-package/Quux@1'}), false);
});

test ('Ord', function() {
  eq (type (Z.Ord), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Ord.name, 'sanctuary-type-classes/Ord');
  eq (Z.Ord.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Ord');
  eq (Z.Ord.test (null), true);
  eq (Z.Ord.test (''), true);
  eq (Z.Ord.test ([]), true);
  eq (Z.Ord.test ({}), true);
  eq (Z.Ord.test (Math.abs), false);
});

test ('Semigroupoid', function() {
  eq (type (Z.Semigroupoid), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Semigroupoid.name, 'sanctuary-type-classes/Semigroupoid');
  eq (Z.Semigroupoid.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Semigroupoid');
  eq (Z.Semigroupoid.test (null), false);
  eq (Z.Semigroupoid.test (''), false);
  eq (Z.Semigroupoid.test ([]), false);
  eq (Z.Semigroupoid.test ({}), false);
  eq (Z.Semigroupoid.test (Math.abs), true);
});

test ('Category', function() {
  eq (type (Z.Category), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Category.name, 'sanctuary-type-classes/Category');
  eq (Z.Category.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Category');
  eq (Z.Category.test (null), false);
  eq (Z.Category.test (''), false);
  eq (Z.Category.test ([]), false);
  eq (Z.Category.test ({}), false);
  eq (Z.Category.test (Math.abs), true);
});

test ('Semigroup', function() {
  eq (type (Z.Semigroup), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Semigroup.name, 'sanctuary-type-classes/Semigroup');
  eq (Z.Semigroup.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Semigroup');
  eq (Z.Semigroup.test (null), false);
  eq (Z.Semigroup.test (''), true);
  eq (Z.Semigroup.test ([]), true);
  eq (Z.Semigroup.test ({}), true);
});

test ('Monoid', function() {
  eq (type (Z.Monoid), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Monoid.name, 'sanctuary-type-classes/Monoid');
  eq (Z.Monoid.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Monoid');
  eq (Z.Monoid.test (null), false);
  eq (Z.Monoid.test (''), true);
  eq (Z.Monoid.test ([]), true);
  eq (Z.Monoid.test ({}), true);
});

test ('Group', function() {
  eq (type (Z.Group), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Group.name, 'sanctuary-type-classes/Group');
  eq (Z.Group.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Group');
  eq (Z.Group.test (null), false);
  eq (Z.Group.test (''), false);
  eq (Z.Group.test ([]), false);
  eq (Z.Group.test ({}), false);
  eq (Z.Group.test (Sum (0)), true);
});

test ('Filterable', function() {
  eq (type (Z.Filterable), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Filterable.name, 'sanctuary-type-classes/Filterable');
  eq (Z.Filterable.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Filterable');
  eq (Z.Filterable.test (null), false);
  eq (Z.Filterable.test (''), false);
  eq (Z.Filterable.test ([]), true);
  eq (Z.Filterable.test ({}), true);
});

test ('Functor', function() {
  eq (type (Z.Functor), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Functor.name, 'sanctuary-type-classes/Functor');
  eq (Z.Functor.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Functor');
  eq (Z.Functor.test (null), false);
  eq (Z.Functor.test (''), false);
  eq (Z.Functor.test ([]), true);
  eq (Z.Functor.test ({}), true);
});

test ('Bifunctor', function() {
  eq (type (Z.Bifunctor), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Bifunctor.name, 'sanctuary-type-classes/Bifunctor');
  eq (Z.Bifunctor.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Bifunctor');
  eq (Z.Bifunctor.test (null), false);
  eq (Z.Bifunctor.test (''), false);
  eq (Z.Bifunctor.test ([]), false);
  eq (Z.Bifunctor.test ({}), false);
  eq (Z.Bifunctor.test (Pair ('abc') (123)), true);
});

test ('Profunctor', function() {
  eq (type (Z.Profunctor), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Profunctor.name, 'sanctuary-type-classes/Profunctor');
  eq (Z.Profunctor.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Profunctor');
  eq (Z.Profunctor.test (null), false);
  eq (Z.Profunctor.test (''), false);
  eq (Z.Profunctor.test ([]), false);
  eq (Z.Profunctor.test ({}), false);
  eq (Z.Profunctor.test (Math.abs), true);
});

test ('Apply', function() {
  eq (type (Z.Apply), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Apply.name, 'sanctuary-type-classes/Apply');
  eq (Z.Apply.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Apply');
  eq (Z.Apply.test (null), false);
  eq (Z.Apply.test (''), false);
  eq (Z.Apply.test ([]), true);
  eq (Z.Apply.test ({}), true);
});

test ('Applicative', function() {
  eq (type (Z.Applicative), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Applicative.name, 'sanctuary-type-classes/Applicative');
  eq (Z.Applicative.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Applicative');
  eq (Z.Applicative.test (null), false);
  eq (Z.Applicative.test (''), false);
  eq (Z.Applicative.test ([]), true);
  eq (Z.Applicative.test ({}), false);
});

test ('Chain', function() {
  eq (type (Z.Chain), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Chain.name, 'sanctuary-type-classes/Chain');
  eq (Z.Chain.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Chain');
  eq (Z.Chain.test (null), false);
  eq (Z.Chain.test (''), false);
  eq (Z.Chain.test ([]), true);
  eq (Z.Chain.test ({}), false);
});

test ('ChainRec', function() {
  eq (type (Z.ChainRec), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.ChainRec.name, 'sanctuary-type-classes/ChainRec');
  eq (Z.ChainRec.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#ChainRec');
  eq (Z.ChainRec.test (null), false);
  eq (Z.ChainRec.test (''), false);
  eq (Z.ChainRec.test ([]), true);
  eq (Z.ChainRec.test ({}), false);
});

test ('Monad', function() {
  eq (type (Z.Monad), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Monad.name, 'sanctuary-type-classes/Monad');
  eq (Z.Monad.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Monad');
  eq (Z.Monad.test (null), false);
  eq (Z.Monad.test (''), false);
  eq (Z.Monad.test ([]), true);
  eq (Z.Monad.test ({}), false);
});

test ('Alt', function() {
  eq (type (Z.Alt), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Alt.name, 'sanctuary-type-classes/Alt');
  eq (Z.Alt.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Alt');
  eq (Z.Alt.test (null), false);
  eq (Z.Alt.test (''), false);
  eq (Z.Alt.test ([]), true);
  eq (Z.Alt.test ({}), true);
});

test ('Plus', function() {
  eq (type (Z.Plus), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Plus.name, 'sanctuary-type-classes/Plus');
  eq (Z.Plus.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Plus');
  eq (Z.Plus.test (null), false);
  eq (Z.Plus.test (''), false);
  eq (Z.Plus.test ([]), true);
  eq (Z.Plus.test ({}), true);
});

test ('Alternative', function() {
  eq (type (Z.Alternative), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Alternative.name, 'sanctuary-type-classes/Alternative');
  eq (Z.Alternative.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Alternative');
  eq (Z.Alternative.test (null), false);
  eq (Z.Alternative.test (''), false);
  eq (Z.Alternative.test ([]), true);
  eq (Z.Alternative.test ({}), false);
});

test ('Foldable', function() {
  eq (type (Z.Foldable), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Foldable.name, 'sanctuary-type-classes/Foldable');
  eq (Z.Foldable.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Foldable');
  eq (Z.Foldable.test (null), false);
  eq (Z.Foldable.test (''), false);
  eq (Z.Foldable.test ([]), true);
  eq (Z.Foldable.test ({}), true);
});

test ('Traversable', function() {
  eq (type (Z.Traversable), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Traversable.name, 'sanctuary-type-classes/Traversable');
  eq (Z.Traversable.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Traversable');
  eq (Z.Traversable.test (null), false);
  eq (Z.Traversable.test (''), false);
  eq (Z.Traversable.test ([]), true);
  eq (Z.Traversable.test ({}), true);
});

test ('Extend', function() {
  eq (type (Z.Extend), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Extend.name, 'sanctuary-type-classes/Extend');
  eq (Z.Extend.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Extend');
  eq (Z.Extend.test (null), false);
  eq (Z.Extend.test (''), false);
  eq (Z.Extend.test ([]), true);
  eq (Z.Extend.test ({}), false);
});

test ('Comonad', function() {
  eq (type (Z.Comonad), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Comonad.name, 'sanctuary-type-classes/Comonad');
  eq (Z.Comonad.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Comonad');
  eq (Z.Comonad.test (null), false);
  eq (Z.Comonad.test (''), false);
  eq (Z.Comonad.test ([]), false);
  eq (Z.Comonad.test ({}), false);
  eq (Z.Comonad.test (Identity (0)), true);
});

test ('Contravariant', function() {
  eq (type (Z.Contravariant), 'sanctuary-type-classes/TypeClass@1');
  eq (Z.Contravariant.name, 'sanctuary-type-classes/Contravariant');
  eq (Z.Contravariant.url, 'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version + '#Contravariant');
  eq (Z.Contravariant.test (null), false);
  eq (Z.Contravariant.test (''), false);
  eq (Z.Contravariant.test ([]), false);
  eq (Z.Contravariant.test ({}), false);
  eq (Z.Contravariant.test (Math.abs), true);
});

test ('equals', function() {
  eq (Z.equals.length, 2);
  eq (Z.equals.name, 'equals');

  eq (Z.equals (null, null), true);
  eq (Z.equals (null, undefined), false);
  eq (Z.equals (undefined, null), false);
  eq (Z.equals (undefined, undefined), true);
  eq (Z.equals (false, false), true);
  eq (Z.equals (false, true), false);
  eq (Z.equals (true, false), false);
  eq (Z.equals (true, true), true);
  eq (Z.equals (new Boolean (false), new Boolean (false)), true);
  eq (Z.equals (new Boolean (false), new Boolean (true)), false);
  eq (Z.equals (new Boolean (true), new Boolean (false)), false);
  eq (Z.equals (new Boolean (true), new Boolean (true)), true);
  eq (Z.equals (false, new Boolean (false)), false);
  eq (Z.equals (new Boolean (false), false), false);
  eq (Z.equals (true, new Boolean (true)), false);
  eq (Z.equals (new Boolean (true), true), false);
  eq (Z.equals (0, 0), true);
  eq (Z.equals (0, -0), true);
  eq (Z.equals (-0, 0), true);
  eq (Z.equals (-0, -0), true);
  eq (Z.equals (NaN, NaN), true);
  eq (Z.equals (Infinity, Infinity), true);
  eq (Z.equals (Infinity, -Infinity), false);
  eq (Z.equals (-Infinity, Infinity), false);
  eq (Z.equals (-Infinity, -Infinity), true);
  eq (Z.equals (NaN, Math.PI), false);
  eq (Z.equals (Math.PI, NaN), false);
  eq (Z.equals (new Number (0), new Number (0)), true);
  eq (Z.equals (new Number (0), new Number (-0)), true);
  eq (Z.equals (new Number (-0), new Number (0)), true);
  eq (Z.equals (new Number (-0), new Number (-0)), true);
  eq (Z.equals (new Number (NaN), new Number (NaN)), true);
  eq (Z.equals (new Number (Infinity), new Number (Infinity)), true);
  eq (Z.equals (new Number (Infinity), new Number (-Infinity)), false);
  eq (Z.equals (new Number (-Infinity), new Number (Infinity)), false);
  eq (Z.equals (new Number (-Infinity), new Number (-Infinity)), true);
  eq (Z.equals (new Number (NaN), new Number (Math.PI)), false);
  eq (Z.equals (new Number (Math.PI), new Number (NaN)), false);
  eq (Z.equals (42, new Number (42)), false);
  eq (Z.equals (new Number (42), 42), false);
  eq (Z.equals (NaN, new Number (NaN)), false);
  eq (Z.equals (new Number (NaN), NaN), false);
  eq (Z.equals (new Date (0), new Date (0)), true);
  eq (Z.equals (new Date (0), new Date (1)), false);
  eq (Z.equals (new Date (1), new Date (0)), false);
  eq (Z.equals (new Date (1), new Date (1)), true);
  eq (Z.equals (new Date (NaN), new Date (NaN)), true);
  eq (Z.equals (/abc/, /xyz/), false);
  eq (Z.equals (/abc/, /abc/g), false);
  eq (Z.equals (/abc/, /abc/i), false);
  eq (Z.equals (/abc/, /abc/m), false);
  eq (Z.equals (/abc/, /abc/), true);
  eq (Z.equals (/abc/g, /abc/g), true);
  eq (Z.equals (/abc/i, /abc/i), true);
  eq (Z.equals (/abc/m, /abc/m), true);
  eq (Z.equals ('', ''), true);
  eq (Z.equals ('abc', 'abc'), true);
  eq (Z.equals ('abc', 'xyz'), false);
  eq (Z.equals (new String (''), new String ('')), true);
  eq (Z.equals (new String ('abc'), new String ('abc')), true);
  eq (Z.equals (new String ('abc'), new String ('xyz')), false);
  eq (Z.equals ('abc', new String ('abc')), false);
  eq (Z.equals (new String ('abc'), 'abc'), false);
  eq (Z.equals ([], []), true);
  eq (Z.equals ([1, 2], [1, 2]), true);
  eq (Z.equals ([1, 2, 3], [1, 2]), false);
  eq (Z.equals ([1, 2], [1, 2, 3]), false);
  eq (Z.equals ([1, 2], [2, 1]), false);
  eq (Z.equals ([0], [-0]), true);
  eq (Z.equals ([NaN], [NaN]), true);
  eq (Z.equals (ones, ones), true);
  eq (Z.equals (ones, [1, [1, [1, [1, []]]]]), false);
  eq (Z.equals (ones, [1, [1, [1, [1, [0, ones]]]]]), false);
  eq (Z.equals (ones, [1, [1, [1, [1, [1, ones]]]]]), true);
  eq (Z.equals (ones, ones_), true);
  eq (Z.equals (ones_, ones), true);
  eq (Z.equals (args (), args ()), true);
  eq (Z.equals (args (1, 2), args (1, 2)), true);
  eq (Z.equals (args (1, 2, 3), args (1, 2)), false);
  eq (Z.equals (args (1, 2), args (1, 2, 3)), false);
  eq (Z.equals (args (1, 2), args (2, 1)), false);
  eq (Z.equals (args (0), args (-0)), true);
  eq (Z.equals (args (NaN), args (NaN)), true);
  eq (Z.equals (new Error ('abc'), new Error ('abc')), true);
  eq (Z.equals (new Error ('abc'), new Error ('xyz')), false);
  eq (Z.equals (new TypeError ('abc'), new TypeError ('abc')), true);
  eq (Z.equals (new TypeError ('abc'), new TypeError ('xyz')), false);
  eq (Z.equals (new Error ('abc'), new TypeError ('abc')), false);
  eq (Z.equals (new TypeError ('abc'), new Error ('abc')), false);
  eq (Z.equals ({}, {}), true);
  eq (Z.equals ({x: 1, y: 2}, {y: 2, x: 1}), true);
  eq (Z.equals ({x: 1, y: 2, z: 3}, {x: 1, y: 2}), false);
  eq (Z.equals ({x: 1, y: 2}, {x: 1, y: 2, z: 3}), false);
  eq (Z.equals ({x: 1, y: 2}, {x: 2, y: 1}), false);
  eq (Z.equals ({x: 0}, {x: -0}), true);
  eq (Z.equals ({x: NaN}, {x: NaN}), true);
  eq (Z.equals (node1, node1), true);
  eq (Z.equals (node2, node2), true);
  eq (Z.equals (node1, node2), false);
  eq (Z.equals (node2, node1), false);
  eq (Z.equals (Math.sin, Math.sin), true);
  eq (Z.equals (Math.sin, Math.cos), false);
  eq (Z.equals (Identity (Identity (Identity (0))), Identity (Identity (Identity (0)))), true);
  eq (Z.equals (Identity (Identity (Identity (0))), Identity (Identity (Identity (1)))), false);
  eq (Z.equals ({'@@type': 'my-package/Quux@1'}, {'@@type': 'my-package/Quux@1'}), false);
  eq (Z.equals (Array.prototype, Array.prototype), true);
  eq (Z.equals (Nothing.constructor, Maybe), true);
  eq (Z.equals ((Just (0)).constructor, Maybe), true);
  eq (Z.equals (Lazy$of (0), Lazy$of (0)), false);
});

test ('lt', function() {
  eq (Z.lt.length, 2);
  eq (Z.lt.name, 'lt');

  eq (Z.lt (0, 0), false);
  eq (Z.lt (0, 1), true);
  eq (Z.lt (1, 0), false);
  eq (Z.lt ('abc', 123), false);
});

test ('lte', function() {
  eq (Z.lte.length, 2);
  eq (Z.lte.name, 'lte');

  eq (Z.lte (null, null), true);
  eq (Z.lte (null, undefined), false);
  eq (Z.lte (undefined, null), false);
  eq (Z.lte (undefined, undefined), true);
  eq (Z.lte (false, false), true);
  eq (Z.lte (false, true), true);
  eq (Z.lte (true, false), false);
  eq (Z.lte (true, true), true);
  eq (Z.lte (new Boolean (false), new Boolean (false)), true);
  eq (Z.lte (new Boolean (false), new Boolean (true)), true);
  eq (Z.lte (new Boolean (true), new Boolean (false)), false);
  eq (Z.lte (new Boolean (true), new Boolean (true)), true);
  eq (Z.lte (false, new Boolean (false)), false);
  eq (Z.lte (new Boolean (false), false), false);
  eq (Z.lte (true, new Boolean (true)), false);
  eq (Z.lte (new Boolean (true), true), false);
  eq (Z.lte (42, 42), true);
  eq (Z.lte (42, 43), true);
  eq (Z.lte (43, 42), false);
  eq (Z.lte (0, 0), true);
  eq (Z.lte (0, -0), true);
  eq (Z.lte (-0, 0), true);
  eq (Z.lte (-0, -0), true);
  eq (Z.lte (NaN, NaN), true);
  eq (Z.lte (Infinity, Infinity), true);
  eq (Z.lte (Infinity, -Infinity), false);
  eq (Z.lte (-Infinity, Infinity), true);
  eq (Z.lte (-Infinity, -Infinity), true);
  eq (Z.lte (NaN, Math.PI), true);
  eq (Z.lte (Math.PI, NaN), false);
  eq (Z.lte (new Number (0), new Number (0)), true);
  eq (Z.lte (new Number (0), new Number (-0)), true);
  eq (Z.lte (new Number (-0), new Number (0)), true);
  eq (Z.lte (new Number (-0), new Number (-0)), true);
  eq (Z.lte (new Number (NaN), new Number (NaN)), true);
  eq (Z.lte (new Number (Infinity), new Number (Infinity)), true);
  eq (Z.lte (new Number (Infinity), new Number (-Infinity)), false);
  eq (Z.lte (new Number (-Infinity), new Number (Infinity)), true);
  eq (Z.lte (new Number (-Infinity), new Number (-Infinity)), true);
  eq (Z.lte (new Number (NaN), new Number (Math.PI)), true);
  eq (Z.lte (new Number (Math.PI), new Number (NaN)), false);
  eq (Z.lte (42, new Number (42)), false);
  eq (Z.lte (new Number (42), 42), false);
  eq (Z.lte (new Date (0), new Date (0)), true);
  eq (Z.lte (new Date (0), new Date (1)), true);
  eq (Z.lte (new Date (1), new Date (0)), false);
  eq (Z.lte (new Date (1), new Date (1)), true);
  eq (Z.lte (new Date (NaN), new Date (NaN)), true);
  eq (Z.lte ('', ''), true);
  eq (Z.lte ('abc', 'abc'), true);
  eq (Z.lte ('abc', 'xyz'), true);
  eq (Z.lte (new String (''), new String ('')), true);
  eq (Z.lte (new String ('abc'), new String ('abc')), true);
  eq (Z.lte (new String ('abc'), new String ('xyz')), true);
  eq (Z.lte ('abc', new String ('abc')), false);
  eq (Z.lte (new String ('abc'), 'abc'), false);
  eq (Z.lte ([], []), true);
  eq (Z.lte ([1, 2], [1, 2]), true);
  eq (Z.lte ([1, 2, 3], [1, 2]), false);
  eq (Z.lte ([1, 2], [1, 2, 3]), true);
  eq (Z.lte ([1, 2], [2]), true);
  eq (Z.lte ([], [undefined]), true);
  eq (Z.lte ([undefined], []), false);
  eq (Z.lte ([1], [undefined]), false);
  eq (Z.lte ([undefined], [1]), false);
  eq (Z.lte ([0], [-0]), true);
  eq (Z.lte ([NaN], [NaN]), true);
  eq (Z.lte (ones, ones), true);
  eq (Z.lte (ones, [1, [1, [1, [1, []]]]]), false);
  eq (Z.lte (ones, [1, [1, [1, [1, [0, ones]]]]]), false);
  eq (Z.lte (ones, [1, [1, [1, [1, [1, ones]]]]]), true);
  eq (Z.lte (ones, ones_), true);
  eq (Z.lte (ones_, ones), true);
  eq (Z.lte (args (), args ()), true);
  eq (Z.lte (args (1, 2), args (1, 2)), true);
  eq (Z.lte (args (1, 2, 3), args (1, 2)), false);
  eq (Z.lte (args (1, 2), args (1, 2, 3)), true);
  eq (Z.lte (args (1, 2), args (2, 1)), true);
  eq (Z.lte (args (0), args (-0)), true);
  eq (Z.lte (args (NaN), args (NaN)), true);
  eq (Z.lte ({}, {}), true);
  eq (Z.lte ({a: 0}, {z: 0}), true);
  eq (Z.lte ({z: 0}, {a: 0}), false);
  eq (Z.lte ({x: 1, y: 2}, {y: 2, x: 1}), true);
  eq (Z.lte ({x: 1, y: 2, z: 3}, {x: 1, y: 2}), false);
  eq (Z.lte ({x: 1, y: 2}, {x: 1, y: 2, z: 3}), true);
  eq (Z.lte ({x: 1, y: 2, z: 3}, {x: 1, y: 2, z: undefined}), false);
  eq (Z.lte ({x: 1, y: 2, z: undefined}, {x: 1, y: 2, z: 3}), false);
  eq (Z.lte ({x: 1, y: 1}, {x: 2, y: 1}), true);
  eq (Z.lte ({x: 2, y: 1}, {x: 1, y: 2}), false);
  eq (Z.lte ({x: 0, y: 0}, {x: 1}), true);
  eq (Z.lte ({x: 0}, {x: 0, y: 0}), true);
  eq (Z.lte ({x: -0}, {x: 0}), true);
  eq (Z.lte ({x: 0}, {x: -0}), true);
  eq (Z.lte ({x: NaN}, {x: NaN}), true);
  eq (Z.lte (Identity (Identity (Identity (0))), Identity (Identity (Identity (0)))), true);
  eq (Z.lte (Identity (Identity (Identity (0))), Identity (Identity (Identity (1)))), true);
  eq (Z.lte (Identity (Identity (Identity (1))), Identity (Identity (Identity (0)))), false);
  eq (Z.lte (Lazy$of (0), Lazy$of (0)), false);
  eq (Z.lte ('abc', 123), false);

  var $0 = {z: 0};
  var $1 = {z: 1};
  $0.a = $1;
  $1.a = $0;
  eq (Z.lte ($0, $0), true);
  eq (Z.lte ($0, $1), false);
  eq (Z.lte ($1, $0), false);
});

test ('gt', function() {
  eq (Z.gt.length, 2);
  eq (Z.gt.name, 'gt');

  eq (Z.gt (0, 0), false);
  eq (Z.gt (0, 1), false);
  eq (Z.gt (1, 0), true);
  eq (Z.gt ('abc', 123), false);
});

test ('gte', function() {
  eq (Z.gte.length, 2);
  eq (Z.gte.name, 'gte');

  eq (Z.gte (0, 0), true);
  eq (Z.gte (0, 1), false);
  eq (Z.gte (1, 0), true);
  eq (Z.gte ('abc', 123), false);
});

test ('min', function() {
  eq (Z.min.length, 2);
  eq (Z.min.name, 'min');

  eq (Z.min (0, 1), 0);
  eq (Z.min (['x', 'x'], ['x']), ['x']);
});

test ('max', function() {
  eq (Z.max.length, 2);
  eq (Z.max.name, 'max');

  eq (Z.max (0, 1), 1);
  eq (Z.max (['x', 'x'], ['x']), ['x', 'x']);
});

test ('clamp', function() {
  eq (Z.clamp.length, 3);
  eq (Z.clamp.name, 'clamp');

  eq (Z.clamp (0, 100, -1), 0);
  eq (Z.clamp (0, 100, 0), 0);
  eq (Z.clamp (0, 100, 50), 50);
  eq (Z.clamp (0, 100, 100), 100);
  eq (Z.clamp (0, 100, 101), 100);
  eq (Z.clamp ('A', 'Z', '0'), 'A');
  eq (Z.clamp ('A', 'Z', 'A'), 'A');
  eq (Z.clamp ('A', 'Z', 'X'), 'X');
  eq (Z.clamp ('A', 'Z', 'Z'), 'Z');
  eq (Z.clamp ('A', 'Z', '~'), 'Z');
});

test ('compose', function() {
  eq (Z.compose.length, 2);
  eq (Z.compose.name, 'compose');

  eq (Z.compose (Math.sqrt, inc) (99), 10);
});

test ('id', function() {
  eq (Z.id.length, 1);
  eq (Z.id.name, 'id');

  eq (Z.id (Function) (42), 42);
});

test ('concat', function() {
  eq (Z.concat.length, 2);
  eq (Z.concat.name, 'concat');

  eq (Z.concat ('', ''), '');
  eq (Z.concat ('', 'abc'), 'abc');
  eq (Z.concat ('abc', ''), 'abc');
  eq (Z.concat ('abc', 'def'), 'abcdef');
  eq (Z.concat ([], []), []);
  eq (Z.concat ([], [1, 2, 3]), [1, 2, 3]);
  eq (Z.concat ([1, 2, 3], []), [1, 2, 3]);
  eq (Z.concat ([1, 2, 3], [4, 5, 6]), [1, 2, 3, 4, 5, 6]);
  eq (Z.concat ({}, {}), {});
  eq (Z.concat ({}, {x: 1, y: 2}), {x: 1, y: 2});
  eq (Z.concat ({x: 1, y: 2}, {}), {x: 1, y: 2});
  eq (Z.concat ({x: 1, y: 2}, {y: 3, z: 4}), {x: 1, y: 3, z: 4});
  eq (Z.concat ({x: 1}, Point ()), {x: 1});
  eq (Z.concat (Point (), {x: 1}), {x: 1});
  eq (Z.concat (Point (), Point ()), {});
  eq (Z.concat (Identity (''), Identity ('')), Identity (''));
  eq (Z.concat (Identity (''), Identity ('abc')), Identity ('abc'));
  eq (Z.concat (Identity ('abc'), Identity ('')), Identity ('abc'));
  eq (Z.concat (Identity ('abc'), Identity ('def')), Identity ('abcdef'));
  eq (Z.concat (Nil, Nil), Nil);
  eq (Z.concat (Nil, Cons (1, Cons (2, Cons (3, Nil)))), Cons (1, Cons (2, Cons (3, Nil))));
  eq (Z.concat (Cons (1, Cons (2, Cons (3, Nil))), Nil), Cons (1, Cons (2, Cons (3, Nil))));
  eq (Z.concat (Cons (1, Cons (2, Cons (3, Nil))), Cons (4, Cons (5, Cons (6, Nil)))), Cons (1, Cons (2, Cons (3, Cons (4, Cons (5, Cons (6, Nil)))))));
});

test ('empty', function() {
  eq (Z.empty.length, 1);
  eq (Z.empty.name, 'empty');

  eq (Z.empty (String), '');
  eq (Z.empty (Array), []);
  eq (Z.empty (Object), {});
  eq (Z.empty (List), Nil);
  eq (Z.empty (Maybe), Nothing);

  assert.throws (
    () => Z.empty (null),
    new TypeError ('Monoid.methods.empty(...) is not a function')
  );
});

test ('invert', function() {
  eq (Z.invert.length, 1);
  eq (Z.invert.name, 'invert');

  eq (Z.invert (Sum (5)), Sum (-5));
  eq (Z.invert (Sum (-5)), Sum (5));
});

test ('filter', function() {
  eq (Z.filter.length, 2);
  eq (Z.filter.name, 'filter');

  eq (Z.filter (odd, []), []);
  eq (Z.filter (odd, [1, 2, 3, 4, 5]), [1, 3, 5]);
  eq (Z.filter (odd, {}), {});
  eq (Z.filter (odd, {x: 1, y: 2, z: 3}), {x: 1, z: 3});
  eq (Z.filter (odd, Nil), Nil);
  eq (Z.filter (odd, Cons (1, Cons (2, Cons (3, Cons (4, Cons (5, Nil)))))), Cons (1, Cons (3, Cons (5, Nil))));
  eq (Z.filter (odd, Nothing), Nothing);
  eq (Z.filter (odd, Just (0)), Nothing);
  eq (Z.filter (odd, Just (1)), Just (1));
});

test ('reject', function() {
  eq (Z.reject.length, 2);
  eq (Z.reject.name, 'reject');

  eq (Z.reject (odd, []), []);
  eq (Z.reject (odd, [1, 2, 3, 4, 5]), [2, 4]);
  eq (Z.reject (odd, {}), {});
  eq (Z.reject (odd, {x: 1, y: 2, z: 3}), {y: 2});
  eq (Z.reject (odd, Nil), Nil);
  eq (Z.reject (odd, Cons (1, Cons (2, Cons (3, Cons (4, Cons (5, Nil)))))), Cons (2, Cons (4, Nil)));
  eq (Z.reject (odd, Nothing), Nothing);
  eq (Z.reject (odd, Just (0)), Just (0));
  eq (Z.reject (odd, Just (1)), Nothing);
});

test ('map', function() {
  eq (Z.map.length, 2);
  eq (Z.map.name, 'map');

  eq (Z.map (inc, []), []);
  eq (Z.map (inc, [1, 2, 3]), [2, 3, 4]);
  eq (Z.map (inc, {}), {});
  eq (Z.map (inc, {x: 2, y: 4}), {x: 3, y: 5});
  eq (Z.map (inc, Point ()), {});
  eq (Z.map (inc, length) ('abc'), 4);
  eq (Z.map (inc, Identity (42)), Identity (43));
  eq (Z.map (inc, Nil), Nil);
  eq (Z.map (inc, Cons (1, Cons (2, Cons (3, Nil)))), Cons (2, Cons (3, Cons (4, Nil))));
});

test ('flip', function() {
  eq (Z.flip.length, 2);
  eq (Z.flip.name, 'flip');

  eq (Z.flip (pow, 2) (10), 100);
  eq (Z.flip ([Math.floor, Math.ceil], 1.5), [1, 2]);
  eq (Z.flip ({floor: Math.floor, ceil: Math.ceil}, 1.5), {floor: 1, ceil: 2});
  eq (Z.flip (Cons (Math.floor, Cons (Math.ceil, Nil)), 1.5), Cons (1, Cons (2, Nil)));
});

test ('bimap', function() {
  eq (Z.bimap.length, 3);
  eq (Z.bimap.name, 'bimap');

  eq (Z.bimap (toUpper, inc, Pair ('abc') (123)), Pair ('ABC') (124));
});

test ('mapLeft', function() {
  eq (Z.mapLeft.length, 2);
  eq (Z.mapLeft.name, 'mapLeft');

  eq (Z.mapLeft (toUpper, Pair ('abc') ('def')), Pair ('ABC') ('def'));
});

test ('promap', function() {
  eq (Z.promap.length, 3);
  eq (Z.promap.name, 'promap');

  function lengths(xs) { return Z.map (length, xs); }
  eq (Z.promap (lengths, square, sum) (['foo', 'bar', 'baz', 'quux']), 169);
});

test ('ap', function() {
  eq (Z.ap.length, 2);
  eq (Z.ap.name, 'ap');

  eq (Z.ap ([], []), []);
  eq (Z.ap ([], [1, 2, 3]), []);
  eq (Z.ap ([inc], []), []);
  eq (Z.ap ([inc], [1, 2, 3]), [2, 3, 4]);
  eq (Z.ap ([inc, square], [1, 2, 3]), [2, 3, 4, 1, 4, 9]);
  eq (Z.ap ({}, {}), {});
  eq (Z.ap ({}, {x: 1, y: 2, z: 3}), {});
  eq (Z.ap ({x: inc}, {}), {});
  eq (Z.ap ({x: inc}, {x: 1}), {x: 2});
  eq (Z.ap ({x: inc, y: square}, {x: 1, y: 2}), {x: 2, y: 4});
  eq (Z.ap ({x: inc, y: square, z: abs}, {w: 4, x: 1, y: 2}), {x: 2, y: 4});
  eq (Z.ap ({}, {toString: 42}), {});
  eq (Z.ap ({x: inc, y: inc}, Point ()), {});
  eq (Z.ap (pow, abs) (-1), pow (-1) (abs (-1)));
  eq (Z.ap (pow, abs) (-2), pow (-2) (abs (-2)));
  eq (Z.ap (pow, abs) (-3), pow (-3) (abs (-3)));
  eq (Z.ap (Identity (inc), Identity (42)), Identity (43));
  eq (Z.ap (Nil, Nil), Nil);
  eq (Z.ap (Nil, Cons (1, Cons (2, Cons (3, Nil)))), Nil);
  eq (Z.ap (Cons (inc, Nil), Nil), Nil);
  eq (Z.ap (Cons (inc, Nil), Cons (1, Cons (2, Cons (3, Nil)))), Cons (2, Cons (3, Cons (4, Nil))));
  eq (Z.ap (Cons (inc, Cons (square, Nil)), Cons (1, Cons (2, Cons (3, Nil)))), Cons (2, Cons (3, Cons (4, Cons (1, Cons (4, Cons (9, Nil)))))));
});

test ('lift2', function() {
  eq (Z.lift2.length, 3);
  eq (Z.lift2.name, 'lift2');

  eq (Z.lift2 (pow, [10], [1, 2, 3]), [10, 100, 1000]);
  eq (Z.lift2 (pow, Identity (10), Identity (3)), Identity (1000));
});

test ('lift3', function() {
  eq (Z.lift3.length, 4);
  eq (Z.lift3.name, 'lift3');

  eq (Z.lift3 (wrap, ['<'], ['>'], ['foo', 'bar', 'baz']), ['<foo>', '<bar>', '<baz>']);
  eq (Z.lift3 (wrap, Identity ('<'), Identity ('>'), Identity ('baz')), Identity ('<baz>'));
});

test ('apFirst', function() {
  eq (Z.apFirst.length, 2);
  eq (Z.apFirst.name, 'apFirst');

  eq (Z.apFirst ([1, 2], [3, 4]), [1, 1, 2, 2]);
  eq (Z.apFirst (Identity (1), Identity (2)), Identity (1));
});

test ('apSecond', function() {
  eq (Z.apSecond.length, 2);
  eq (Z.apSecond.name, 'apSecond');

  eq (Z.apSecond ([1, 2], [3, 4]), [3, 4, 3, 4]);
  eq (Z.apSecond (Identity (1), Identity (2)), Identity (2));
});

test ('of', function() {
  eq (Z.of.length, 2);
  eq (Z.of.name, 'of');

  eq (Z.of (Array, 42), [42]);
  eq (Z.of (Function, 42) (null), 42);
  eq (Z.of (Identity, 42), Identity (42));
  eq (Z.of (List, 42), Cons (42, Nil));
  eq (Z.of (Maybe, 42), Just (42));
});

test ('append', function() {
  eq (Z.append.length, 2);
  eq (Z.append.name, 'append');

  eq (Z.append (3, []), [3]);
  eq (Z.append (3, [1, 2]), [1, 2, 3]);
  eq (Z.append (3, Nil), Cons (3, Nil));
  eq (Z.append (3, Cons (1, Cons (2, Nil))), Cons (1, Cons (2, Cons (3, Nil))));
  eq (Z.append ([5, 6], [[1, 2], [3, 4]]), [[1, 2], [3, 4], [5, 6]]);
  eq (Z.append ([2], Nothing), Just ([2]));
  eq (Z.append ([2], Just ([1])), Just ([1, 2]));
});

test ('prepend', function() {
  eq (Z.prepend.length, 2);
  eq (Z.prepend.name, 'prepend');

  eq (Z.prepend (1, []), [1]);
  eq (Z.prepend (1, [2, 3]), [1, 2, 3]);
  eq (Z.prepend (1, Nil), Cons (1, Nil));
  eq (Z.prepend (1, Cons (2, Cons (3, Nil))), Cons (1, Cons (2, Cons (3, Nil))));
  eq (Z.prepend ([1, 2], [[3, 4], [5, 6]]), [[1, 2], [3, 4], [5, 6]]);
  eq (Z.prepend ([1], Nothing), Just ([1]));
  eq (Z.prepend ([1], Just ([2])), Just ([1, 2]));
});

test ('chain', function() {
  eq (Z.chain.length, 2);
  eq (Z.chain.name, 'chain');

  eq (Z.chain (double, []), []);
  eq (Z.chain (double, [1, 2, 3]), [1, 1, 2, 2, 3, 3]);
  eq (Z.chain (identity, [[1, 2], [3, 4], [5, 6]]), [1, 2, 3, 4, 5, 6]);
  eq (Z.chain (repeat, abs) (-1), [-1]);
  eq (Z.chain (repeat, abs) (-2), [-2, -2]);
  eq (Z.chain (repeat, abs) (-3), [-3, -3, -3]);
  eq (Z.chain (identInc, Identity (42)), Identity (43));
  eq (Z.chain (identity, Identity (Identity (0))), Identity (0));
  eq ((Z.chain (identity, [((new Array (1e6)).join ('x')).split ('')])).length, 999999);
});

test ('join', function() {
  eq (Z.join.length, 1);
  eq (Z.join.name, 'join');

  eq (Z.join ([]), []);
  eq (Z.join ([[]]), []);
  eq (Z.join ([[[]]]), [[]]);
  eq (Z.join ([[1], [2], [3]]), [1, 2, 3]);
  eq (Z.join ([[[1, 2, 3]]]), [[1, 2, 3]]);
  eq (Z.join (Identity (Identity (1))), Identity (1));
  eq (Z.join (Identity (Identity (Identity (1)))), Identity (Identity (1)));
});

test ('chainRec', function() {
  eq (Z.chainRec.length, 3);
  eq (Z.chainRec.name, 'chainRec');

  var count = 0;

  //  squash :: (Any -> a, Any -> a, Any) -> Array b
  function squash(next, done, x) {
    if (Array.isArray (x)) return x.map (next);
    count += 1;
    return [done (x)];
  }

  eq (Z.chainRec (Array, squash, [1, [[2, 3], 4], 5]), [1, 2, 3, 4, 5]);
  eq (count, 5);

  eq (Z.chainRec (Array, function(next, done, n) { return n === 0 ? [done ('DONE')] : [next (n - 1)]; }, 100000), ['DONE']);

  function stepper(next, done, n) {
    return n === 30000
      ? Z.map (done, function(env) { return n + env.inc; })
      : Z.map (next, function(env) { return n + env.step; });
  }

  eq (Z.chainRec (Function, stepper, 0) ({step: 2, inc: 100}), 30100);

  eq (Z.chainRec (Array, function(next, done, n) { return n === 0 ? [done (0)] : Z.map (next, repeat (n) (0)); }, 1e6).length, 1e6);
});

test ('alt', function() {
  eq (Z.alt.length, 2);
  eq (Z.alt.name, 'alt');

  eq (Z.alt ([], []), []);
  eq (Z.alt ([], [1, 2, 3]), [1, 2, 3]);
  eq (Z.alt ([1, 2, 3], []), [1, 2, 3]);
  eq (Z.alt ([1, 2, 3], [4, 5, 6]), [1, 2, 3, 4, 5, 6]);
  eq (Z.alt ({}, {}), {});
  eq (Z.alt ({}, {a: 1, b: 2, c: 3}), {a: 1, b: 2, c: 3});
  eq (Z.alt ({a: 1, b: 2, c: 3}, {}), {a: 1, b: 2, c: 3});
  eq (Z.alt ({a: 1, b: 2, c: 3}, {d: 4, e: 5, f: 6}), {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6});
  eq (Z.alt ({a: 1}, Point ()), {a: 1});
  eq (Z.alt (Point (), {a: 1}), {a: 1});
  eq (Z.alt (Point (), Point ()), {});
  eq (Z.alt (Nothing, Nothing), Nothing);
  eq (Z.alt (Nothing, Just (1)), Just (1));
  eq (Z.alt (Just (2), Nothing), Just (2));
  eq (Z.alt (Just (3), Just (4)), Just (3));
});

test ('zero', function() {
  eq (Z.zero.length, 1);
  eq (Z.zero.name, 'zero');

  eq (Z.zero (Array), []);
  eq (Z.zero (Object), {});
  eq (Z.zero (Maybe), Nothing);
});

function testReduce(reduce) {
  eq (reduce (Z.concat, 'x', []), 'x');
  eq (reduce (Z.concat, 'x', ['a', 'b', 'c']), 'xabc');
  eq (reduce (add, 0, {}), 0);
  eq (reduce (add, 0, {a: 1, b: 2, c: 3, d: 4, e: 5}), 15);
  eq (reduce (function(xs, x) { return Z.concat (xs, [x]); }, [], {a: 1, b: 2, c: 3}), [1, 2, 3]);
  eq (reduce (function(xs, x) { return Z.concat (xs, [x]); }, [], {c: 3, b: 2, a: 1}), [1, 2, 3]);
  eq (reduce (Z.concat, 'x', Nil), 'x');
  eq (reduce (Z.concat, 'x', Cons ('a', Cons ('b', Cons ('c', Nil)))), 'xabc');
}

test ('reduce', function() {
  eq (Z.reduce.length, 3);
  eq (Z.reduce.name, 'reduce');

  testReduce (Z.reduce);
});

test ('size', function() {
  eq (Z.size.length, 1);
  eq (Z.size.name, 'size');

  eq (Z.size ([]), 0);
  eq (Z.size (['foo']), 1);
  eq (Z.size (['foo', 'bar']), 2);
  eq (Z.size (['foo', 'bar', 'baz']), 3);
  eq (Z.size (Nil), 0);
  eq (Z.size (Cons ('foo', Nil)), 1);
  eq (Z.size (Cons ('foo', Cons ('bar', Nil))), 2);
  eq (Z.size (Cons ('foo', Cons ('bar', Cons ('baz', Nil)))), 3);
  eq (Z.size (Identity ('quux')), 1);
  eq (Z.size (Nothing), 0);
  eq (Z.size (Just (0)), 1);
  eq (Z.size (Pair ('abc') (123)), 1);
});

test ('all', function() {
  eq (Z.all.length, 2);
  eq (Z.all.name, 'all');

  eq (Z.all (gt (0), []), true);
  eq (Z.all (gt (0), [0]), false);
  eq (Z.all (gt (0), [1]), true);
  eq (Z.all (gt (0), [0, 0]), false);
  eq (Z.all (gt (0), [0, 1]), false);
  eq (Z.all (gt (0), [1, 0]), false);
  eq (Z.all (gt (0), [1, 1]), true);
  eq (Z.all (gt (0), Nil), true);
  eq (Z.all (gt (0), Cons (0, Nil)), false);
  eq (Z.all (gt (0), Cons (1, Nil)), true);
  eq (Z.all (gt (0), Cons (0, Cons (0, Nil))), false);
  eq (Z.all (gt (0), Cons (0, Cons (1, Nil))), false);
  eq (Z.all (gt (0), Cons (1, Cons (0, Nil))), false);
  eq (Z.all (gt (0), Cons (1, Cons (1, Nil))), true);
  eq (Z.all (gt (0), Nothing), true);
  eq (Z.all (gt (0), Just (0)), false);
  eq (Z.all (gt (0), Just (1)), true);
});

test ('any', function() {
  eq (Z.any.length, 2);
  eq (Z.any.name, 'any');

  eq (Z.any (gt (0), []), false);
  eq (Z.any (gt (0), [0]), false);
  eq (Z.any (gt (0), [1]), true);
  eq (Z.any (gt (0), [0, 0]), false);
  eq (Z.any (gt (0), [0, 1]), true);
  eq (Z.any (gt (0), [1, 0]), true);
  eq (Z.any (gt (0), [1, 1]), true);
  eq (Z.any (gt (0), Nil), false);
  eq (Z.any (gt (0), Cons (0, Nil)), false);
  eq (Z.any (gt (0), Cons (1, Nil)), true);
  eq (Z.any (gt (0), Cons (0, Cons (0, Nil))), false);
  eq (Z.any (gt (0), Cons (0, Cons (1, Nil))), true);
  eq (Z.any (gt (0), Cons (1, Cons (0, Nil))), true);
  eq (Z.any (gt (0), Cons (1, Cons (1, Nil))), true);
  eq (Z.any (gt (0), Nothing), false);
  eq (Z.any (gt (0), Just (0)), false);
  eq (Z.any (gt (0), Just (1)), true);
});

test ('none', function() {
  eq (Z.none.length, 2);
  eq (Z.none.name, 'none');

  eq (Z.none (gt (0), []), true);
  eq (Z.none (gt (0), [0]), true);
  eq (Z.none (gt (0), [1]), false);
  eq (Z.none (gt (0), [0, 0]), true);
  eq (Z.none (gt (0), [0, 1]), false);
  eq (Z.none (gt (0), [1, 0]), false);
  eq (Z.none (gt (0), [1, 1]), false);
  eq (Z.none (gt (0), Nil), true);
  eq (Z.none (gt (0), Cons (0, Nil)), true);
  eq (Z.none (gt (0), Cons (1, Nil)), false);
  eq (Z.none (gt (0), Cons (0, Cons (0, Nil))), true);
  eq (Z.none (gt (0), Cons (0, Cons (1, Nil))), false);
  eq (Z.none (gt (0), Cons (1, Cons (0, Nil))), false);
  eq (Z.none (gt (0), Cons (1, Cons (1, Nil))), false);
  eq (Z.none (gt (0), Nothing), true);
  eq (Z.none (gt (0), Just (0)), true);
  eq (Z.none (gt (0), Just (1)), false);
});

test ('elem', function() {
  eq (Z.elem.length, 2);
  eq (Z.elem.name, 'elem');

  eq (Z.elem ('a', ['a', 'b', 'c']), true);
  eq (Z.elem ('b', ['a', 'b', 'c']), true);
  eq (Z.elem ('c', ['a', 'b', 'c']), true);
  eq (Z.elem ('d', ['a', 'b', 'c']), false);
  eq (Z.elem (1, {x: 1, y: 2, z: 3}), true);
  eq (Z.elem (2, {x: 1, y: 2, z: 3}), true);
  eq (Z.elem (3, {x: 1, y: 2, z: 3}), true);
  eq (Z.elem (4, {x: 1, y: 2, z: 3}), false);
  eq (Z.elem (0, Just (0)), true);
  eq (Z.elem (0, Just (1)), false);
  eq (Z.elem (0, Nothing), false);
});

test ('intercalate', function() {
  eq (Z.intercalate.length, 2);
  eq (Z.intercalate.name, 'intercalate');

  eq (Z.intercalate (', ', []), '');
  eq (Z.intercalate (', ', ['foo']), 'foo');
  eq (Z.intercalate (', ', ['foo', 'bar']), 'foo, bar');
  eq (Z.intercalate (', ', ['foo', 'bar', 'baz']), 'foo, bar, baz');
  eq (Z.intercalate ([0, 0, 0], []), []);
  eq (Z.intercalate ([0, 0, 0], [[1]]), [1]);
  eq (Z.intercalate ([0, 0, 0], [[1], [2]]), [1, 0, 0, 0, 2]);
  eq (Z.intercalate ([0, 0, 0], [[1], [2], [3]]), [1, 0, 0, 0, 2, 0, 0, 0, 3]);
  eq (Z.intercalate ('.', Nil), '');
  eq (Z.intercalate ('.', Cons ('x', Nil)), 'x');
  eq (Z.intercalate ('.', Cons ('x', Cons ('y', Nil))), 'x.y');
  eq (Z.intercalate ('.', Cons ('x', Cons ('y', Cons ('z', Nil)))), 'x.y.z');
});

test ('foldMap', function() {
  eq (Z.foldMap.length, 3);
  eq (Z.foldMap.name, 'foldMap');

  // Monoid instance for functions of type a -> a corresponding
  // to reverse function composition
  function DualEndo(f) {
    if (!(this instanceof DualEndo)) return new DualEndo (f);
    this.runEndo = f;
  }
  DualEndo['fantasy-land/empty'] = function() { return DualEndo (identity); };
  DualEndo.prototype['fantasy-land/concat'] = function(other) {
    return DualEndo (a => other.runEndo (this.runEndo (a)));
  };

  // Derive reduce (foldl) from foldMap
  function reduce(f, z, x) {
    function mmap(a) { return DualEndo (function(b) { return f (b, a); }); }
    var finalEndo = Z.foldMap (DualEndo, mmap, x);
    return finalEndo.runEndo (z);
  }

  // Test derived reduce behaves identically to Z.reduce
  testReduce (reduce);
});

test ('reverse', function() {
  eq (Z.reverse.length, 1);
  eq (Z.reverse.name, 'reverse');

  eq (Z.reverse ([]), []);
  eq (Z.reverse ([1]), [1]);
  eq (Z.reverse ([1, 2]), [2, 1]);
  eq (Z.reverse ([1, 2, 3]), [3, 2, 1]);
  eq (Z.reverse (Nil), Nil);
  eq (Z.reverse (Cons (1, Nil)), Cons (1, Nil));
  eq (Z.reverse (Cons (1, Cons (2, Nil))), Cons (2, Cons (1, Nil)));
  eq (Z.reverse (Cons (1, Cons (2, Cons (3, Nil)))), Cons (3, Cons (2, Cons (1, Nil))));
});

test ('sort', function() {
  eq (Z.sort.length, 1);
  eq (Z.sort.name, 'sort');

  function runAssertions() {
    eq (Z.sort ([]), []);
    eq (Z.sort (['foo']), ['foo']);
    eq (Z.sort (['foo', 'bar']), ['bar', 'foo']);
    eq (Z.sort (['foo', 'bar', 'baz']), ['bar', 'baz', 'foo']);
    eq (Z.sort (Nil), Nil);
    eq (Z.sort (Cons ('foo', Nil)), Cons ('foo', Nil));
    eq (Z.sort (Cons ('foo', Cons ('bar', Nil))), Cons ('bar', Cons ('foo', Nil)));
    eq (Z.sort (Cons ('foo', Cons ('bar', Cons ('baz', Nil)))), Cons ('bar', Cons ('baz', Cons ('foo', Nil))));
    eq (Z.sort ([NaN, 3, NaN, 1, NaN, 2, NaN]), [NaN, NaN, NaN, NaN, 1, 2, 3]);
    eq (Z.sort ([Just (3), Just (1), Just (2)]), [Just (1), Just (2), Just (3)]);
  }

  runAssertions ();
  withUnstableArraySort (runAssertions);
});

test ('sortBy', function() {
  eq (Z.sortBy.length, 2);
  eq (Z.sortBy.name, 'sortBy');

  function rank(card) { return card.rank; }
  function suit(card) { return card.suit; }
  var _7s = {rank: 7, suit: 's'};
  var _5h = {rank: 5, suit: 'h'};
  var _2h = {rank: 2, suit: 'h'};
  var _5s = {rank: 5, suit: 's'};

  function runAssertions() {
    eq (Z.sortBy (rank, [_7s, _5h, _2h, _5s]), [_2h, _5h, _5s, _7s]);
    eq (Z.sortBy (rank, [_7s, _5s, _2h, _5h]), [_2h, _5s, _5h, _7s]);
    eq (Z.sortBy (suit, [_7s, _5h, _2h, _5s]), [_5h, _2h, _7s, _5s]);
    eq (Z.sortBy (suit, [_5s, _2h, _5h, _7s]), [_2h, _5h, _5s, _7s]);
  }

  runAssertions ();
  withUnstableArraySort (runAssertions);
});

test ('traverse', function() {
  eq (Z.traverse.length, 3);
  eq (Z.traverse.name, 'traverse');

  eq (Z.traverse (Array, identity, []), [[]]);
  eq (Z.traverse (Array, identity, [[1], [2], [3]]), [[1, 2, 3]]);
  eq (Z.traverse (Array, identity, [[1, 2, 3], [4, 5]]), [[1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5]]);
  eq ((Z.traverse (Array, identity, repeat (6) (range (10)))).length, 1e6);
  eq (Z.traverse (Maybe, parseInt_ (16), {a: 'A', b: 'B', c: 'C'}), Just ({a: 10, b: 11, c: 12}));
  eq (Z.traverse (Maybe, parseInt_ (16), {a: 'A', b: 'B', c: 'C', x: 'X'}), Nothing);
  eq (Z.traverse (Identity, identInc, []), Identity ([]));
  eq (Z.traverse (Identity, identInc, [1, 2, 3]), Identity ([2, 3, 4]));
  eq (Z.traverse (Identity, identInc, Nil), Identity (Nil));
  eq (Z.traverse (Identity, identInc, Cons (1, Cons (2, Cons (3, Nil)))), Identity (Cons (2, Cons (3, Cons (4, Nil)))));
  eq (((Z.traverse (Lazy, Lazy$of, range (70000))).run ()).length, 70000);
  eq (Z.traverse (Array, identity, {a: [1, 2], b: [3, 4]}), [{a: 1, b: 3}, {a: 1, b: 4}, {a: 2, b: 3}, {a: 2, b: 4}]);
});

test ('sequence', function() {
  eq (Z.sequence.length, 2);
  eq (Z.sequence.name, 'sequence');

  eq (Z.sequence (Identity, []), Identity ([]));
  eq (Z.sequence (Identity, [Identity (1), Identity (2), Identity (3)]), Identity ([1, 2, 3]));
  eq (Z.sequence (Array, Identity ([])), []);
  eq (Z.sequence (Array, Identity ([1, 2, 3])), [Identity (1), Identity (2), Identity (3)]);
  eq (Z.sequence (Identity, Nil), Identity (Nil));
  eq (Z.sequence (Identity, Cons (Identity (1), Cons (Identity (2), Cons (Identity (3), Nil)))), Identity (Cons (1, Cons (2, Cons (3, Nil)))));
  eq (Z.sequence (List, Identity (Nil)), Nil);
  eq (Z.sequence (List, Identity (Cons (1, Cons (2, Cons (3, Nil))))), Cons (Identity (1), Cons (Identity (2), Cons (Identity (3), Nil))));
  eq (Z.sequence (Maybe, {a: Just ('A'), b: Just ('B'), c: Just ('C')}), Just ({a: 'A', b: 'B', c: 'C'}));
  eq (Z.sequence (Maybe, {a: Just ('A'), b: Just ('B'), c: Just ('C'), x: Nothing}), Nothing);
  eq (Z.sequence (Array, {a: [1, 2], b: [3, 4]}), [{a: 1, b: 3}, {a: 1, b: 4}, {a: 2, b: 3}, {a: 2, b: 4}]);
});

test ('extend', function() {
  eq (Z.extend.length, 2);
  eq (Z.extend.name, 'extend');

  eq (Z.extend (joinWith (''), []), []);
  eq (Z.extend (joinWith (''), ['x']), ['x']);
  eq (Z.extend (joinWith (''), ['x', 'y']), ['xy', 'y']);
  eq (Z.extend (joinWith (''), ['x', 'y', 'z']), ['xyz', 'yz', 'z']);
  eq (Z.extend (function(id) { return Z.reduce (add, 1, id); }, Identity (42)), Identity (43));
  eq (Z.extend (function(f) { return f ([3, 4]); }, Z.reverse) ([1, 2]), [4, 3, 2, 1]);
});

test ('duplicate', function() {
  eq (Z.duplicate.length, 1);
  eq (Z.duplicate.name, 'duplicate');

  eq (Z.duplicate ([]), []);
  eq (Z.duplicate ([[]]), [[[]]]);
  eq (Z.duplicate ([1, 2, 3]), [[1, 2, 3], [2, 3], [3]]);
  eq (Z.duplicate ([[1, 2, 3]]), [[[1, 2, 3]]]);
  eq (Z.duplicate (Identity (1)), Identity (Identity (1)));
  eq (Z.duplicate (Identity (Identity (1))), Identity (Identity (Identity (1))));
});

test ('extract', function() {
  eq (Z.extract.length, 1);
  eq (Z.extract.name, 'extract');

  eq (Z.extract (Identity (42)), 42);
});

test ('contramap', function() {
  eq (Z.contramap.length, 2);
  eq (Z.contramap.name, 'contramap');

  eq (Z.contramap (length, inc) ('abc'), 4);
});

function testLaws(specs) {
  (Object.keys (specs)).forEach (function(typeClassName) {
    suite (typeClassName, function() {
      var spec = specs[typeClassName];
      (Object.keys (spec.module)).forEach (function(name) {
        test (name.replace (/[A-Z]/g, function(c) { return ' ' + c.toLowerCase (); }),
              spec.module[name].apply (spec.module, spec.laws[name]));
      });
    });
  });
}

suite ('laws', function() {

  suite ('Null', function() {
    testLaws ({
      Setoid: {
        module: laws.Setoid,
        laws: {
          reflexivity: [
            jsc.constant (null)
          ],
          symmetry: [
            jsc.constant (null),
            jsc.constant (null)
          ],
          transitivity: [
            jsc.constant (null),
            jsc.constant (null),
            jsc.constant (null)
          ]
        }
      },
      Ord: {
        module: laws.Ord,
        laws: {
          totality: [
            jsc.constant (null),
            jsc.constant (null)
          ],
          antisymmetry: [
            jsc.constant (null),
            jsc.constant (null),
            jsc.constant (null)
          ],
          transitivity: [
            jsc.constant (null),
            jsc.constant (null),
            jsc.constant (null)
          ]
        }
      }
    });
  });

  suite ('Undefined', function() {
    testLaws ({
      Setoid: {
        module: laws.Setoid,
        laws: {
          reflexivity: [
            jsc.constant (undefined)
          ],
          symmetry: [
            jsc.constant (undefined),
            jsc.constant (undefined)
          ],
          transitivity: [
            jsc.constant (undefined),
            jsc.constant (undefined),
            jsc.constant (undefined)
          ]
        }
      },
      Ord: {
        module: laws.Ord,
        laws: {
          totality: [
            jsc.constant (undefined),
            jsc.constant (undefined)
          ],
          antisymmetry: [
            jsc.constant (undefined),
            jsc.constant (undefined),
            jsc.constant (undefined)
          ],
          transitivity: [
            jsc.constant (undefined),
            jsc.constant (undefined),
            jsc.constant (undefined)
          ]
        }
      }
    });
  });

  suite ('Boolean', function() {
    testLaws ({
      Setoid: {
        module: laws.Setoid,
        laws: {
          reflexivity: [
            jsc.bool
          ],
          symmetry: [
            jsc.bool,
            jsc.bool
          ],
          transitivity: [
            jsc.bool,
            jsc.bool,
            jsc.bool
          ]
        }
      },
      Ord: {
        module: laws.Ord,
        laws: {
          totality: [
            jsc.bool,
            jsc.bool
          ],
          antisymmetry: [
            jsc.bool,
            jsc.bool,
            jsc.bool
          ],
          transitivity: [
            jsc.bool,
            jsc.bool,
            jsc.bool
          ]
        }
      }
    });
  });

  suite ('Number', function() {
    var arb = jsc.oneof (jsc.number, jsc.number, jsc.number, jsc.constant (Infinity), jsc.constant (-Infinity), jsc.constant (NaN));
    testLaws ({
      Setoid: {
        module: laws.Setoid,
        laws: {
          reflexivity: [
            arb
          ],
          symmetry: [
            arb,
            arb
          ],
          transitivity: [
            arb,
            arb,
            arb
          ]
        }
      },
      Ord: {
        module: laws.Ord,
        laws: {
          totality: [
            arb,
            arb
          ],
          antisymmetry: [
            arb,
            arb
          ],
          transitivity: [
            arb,
            arb,
            arb
          ]
        }
      }
    });
  });

  suite ('Date', function() {
    var arb = jsc.oneof (jsc.datetime, jsc.datetime, jsc.constant (new Date (NaN)));
    testLaws ({
      Setoid: {
        module: laws.Setoid,
        laws: {
          reflexivity: [
            arb
          ],
          symmetry: [
            arb,
            arb
          ],
          transitivity: [
            arb,
            arb,
            arb
          ]
        }
      },
      Ord: {
        module: laws.Ord,
        laws: {
          totality: [
            arb,
            arb
          ],
          antisymmetry: [
            arb,
            arb
          ],
          transitivity: [
            arb,
            arb,
            arb
          ]
        }
      }
    });
  });

  suite ('RegExp', function() {
    var arb = jsc.string.smap (function(s) {
      var validFlags = ['', 'g', 'i', 'm', 'gi', 'gm', 'im', 'gim'];
      var flags = validFlags[Math.floor (Math.random () * validFlags.length)];
      try {
        return new RegExp (s, flags);
      } catch (err) {
        return /(?:)/;
      }
    });
    testLaws ({
      Setoid: {
        module: laws.Setoid,
        laws: {
          reflexivity: [
            arb
          ],
          symmetry: [
            arb,
            arb
          ],
          transitivity: [
            arb,
            arb,
            arb
          ]
        }
      }
    });
  });

  suite ('String', function() {
    testLaws ({
      Setoid: {
        module: laws.Setoid,
        laws: {
          reflexivity: [
            jsc.string
          ],
          symmetry: [
            jsc.string,
            jsc.string
          ],
          transitivity: [
            jsc.string,
            jsc.string,
            jsc.string
          ]
        }
      },
      Ord: {
        module: laws.Ord,
        laws: {
          totality: [
            jsc.string,
            jsc.string
          ],
          antisymmetry: [
            jsc.string,
            jsc.string
          ],
          transitivity: [
            jsc.string,
            jsc.string,
            jsc.string
          ]
        }
      },
      Semigroup: {
        module: laws.Semigroup (Z.equals),
        laws: {
          associativity: [
            jsc.string,
            jsc.string,
            jsc.string
          ]
        }
      },
      Monoid: {
        module: laws.Monoid (Z.equals, String),
        laws: {
          leftIdentity: [
            jsc.string
          ],
          rightIdentity: [
            jsc.string
          ]
        }
      }
    });
  });

  suite ('Array', function() {
    testLaws ({
      Setoid: {
        module: laws.Setoid,
        laws: {
          reflexivity: [
            jsc.array (jsc.number)
          ],
          symmetry: [
            jsc.array (jsc.number),
            jsc.array (jsc.number)
          ],
          transitivity: [
            jsc.array (jsc.number),
            jsc.array (jsc.number),
            jsc.array (jsc.number)
          ]
        }
      },
      Ord: {
        module: laws.Ord,
        laws: {
          totality: [
            jsc.array (jsc.number),
            jsc.array (jsc.number)
          ],
          antisymmetry: [
            jsc.array (jsc.number),
            jsc.array (jsc.number)
          ],
          transitivity: [
            jsc.array (jsc.number),
            jsc.array (jsc.number),
            jsc.array (jsc.number)
          ]
        }
      },
      Semigroup: {
        module: laws.Semigroup (Z.equals),
        laws: {
          associativity: [
            jsc.array (jsc.number),
            jsc.array (jsc.number),
            jsc.array (jsc.number)
          ]
        }
      },
      Monoid: {
        module: laws.Monoid (Z.equals, Array),
        laws: {
          leftIdentity: [
            jsc.array (jsc.number)
          ],
          rightIdentity: [
            jsc.array (jsc.number)
          ]
        }
      },
      Filterable: {
        module: laws.Filterable (Z.equals),
        laws: {
          distributivity: [
            jsc.array (jsc.number),
            jsc.constant (gt (-10)),
            jsc.constant (lt (10))
          ],
          identity: [
            jsc.array (jsc.number)
          ],
          annihilation: [
            jsc.array (jsc.number),
            jsc.array (jsc.number)
          ]
        }
      },
      Functor: {
        module: laws.Functor (Z.equals),
        laws: {
          identity: [
            jsc.array (jsc.number)
          ],
          composition: [
            jsc.array (jsc.number),
            jsc.constant (Math.sqrt),
            jsc.constant (Math.abs)
          ]
        }
      },
      Apply: {
        module: laws.Apply (Z.equals),
        laws: {
          composition: [
            jsc.constant ([Math.sqrt, square]),
            jsc.constant ([Math.abs]),
            jsc.array (jsc.number)
          ]
        }
      },
      Applicative: {
        module: laws.Applicative (Z.equals, Array),
        laws: {
          identity: [
            jsc.array (jsc.number)
          ],
          homomorphism: [
            jsc.constant (square),
            jsc.number
          ],
          interchange: [
            jsc.constant ([Math.abs, square]),
            jsc.number
          ]
        }
      },
      Chain: {
        module: laws.Chain (Z.equals),
        laws: {
          associativity: [
            jsc.array (jsc.number),
            jsc.constant (function(x) { return x > 0 ? [x] : []; }),
            jsc.constant (function(x) { return [-x, x]; })
          ]
        }
      },
      ChainRec: {
        module: laws.ChainRec (Z.equals, Array),
        laws: {
          equivalence: [
            jsc.constant (function(s) { return s.length === 2; }),
            jsc.constant (function(s) { return [s + 'o', s + 'n']; }),
            jsc.constant (function(s) { return [s + '!', s + '?']; }),
            jsc.constant ('')
          ]
        }
      },
      Monad: {
        module: laws.Monad (Z.equals, Array),
        laws: {
          leftIdentity: [
            jsc.constant (double),
            jsc.number
          ],
          rightIdentity: [
            jsc.array (jsc.number)
          ]
        }
      },
      Alt: {
        module: laws.Alt (Z.equals),
        laws: {
          associativity: [
            jsc.array (jsc.number),
            jsc.array (jsc.number),
            jsc.array (jsc.number)
          ],
          distributivity: [
            jsc.array (jsc.number),
            jsc.array (jsc.number),
            jsc.constant (square)
          ]
        }
      },
      Plus: {
        module: laws.Plus (Z.equals, Array),
        laws: {
          leftIdentity: [
            jsc.array (jsc.number)
          ],
          rightIdentity: [
            jsc.array (jsc.number)
          ],
          annihilation: [
            jsc.constant (square)
          ]
        }
      },
      Alternative: {
        module: laws.Alternative (Z.equals, Array),
        laws: {
          distributivity: [
            jsc.array (jsc.number),
            jsc.constant ([Math.abs, Math.sqrt]),
            jsc.constant ([square])
          ],
          annihilation: [
            jsc.array (jsc.number)
          ]
        }
      },
      Foldable: {
        module: laws.Foldable (Z.equals),
        laws: {
          associativity: [
            jsc.constant (function(x, y) { return x - y; }),
            jsc.number,
            jsc.array (jsc.number)
          ]
        }
      },
      Traversable: {
        module: laws.Traversable (Z.equals),
        laws: {
          naturality: [
            jsc.constant (List),
            jsc.constant (Array),
            jsc.constant (listToArray),
            jsc.array (ListArb (jsc.number))
          ],
          identity: [
            jsc.constant (Identity),
            jsc.array (jsc.number)
          ],
          composition: [
            jsc.constant (Maybe),
            jsc.constant (List),
            jsc.array (MaybeArb (ListArb (jsc.number)))
          ]
        }
      },
      Extend: {
        module: laws.Extend (Z.equals),
        laws: {
          associativity: [
            jsc.array (jsc.number),
            jsc.constant (product),
            jsc.constant (sum)
          ]
        }
      }
    });
  });

  suite ('Arguments', function() {
    var arb = (jsc.array (jsc.oneof (jsc.number, jsc.string))).smap (Function.prototype.apply.bind (args));
    testLaws ({
      Setoid: {
        module: laws.Setoid,
        laws: {
          reflexivity: [
            arb
          ],
          symmetry: [
            arb,
            arb
          ],
          transitivity: [
            arb,
            arb,
            arb
          ]
        }
      },
      Ord: {
        module: laws.Ord,
        laws: {
          totality: [
            arb,
            arb
          ],
          antisymmetry: [
            arb,
            arb
          ],
          transitivity: [
            arb,
            arb,
            arb
          ]
        }
      }
    });
  });

  suite ('Error', function() {
    var arb = jsc.string.smap (function(s) { return new Error (s); });
    testLaws ({
      Setoid: {
        module: laws.Setoid,
        laws: {
          reflexivity: [
            arb
          ],
          symmetry: [
            arb,
            arb
          ],
          transitivity: [
            arb,
            arb,
            arb
          ]
        }
      }
    });
  });

  suite ('Object', function() {
    testLaws ({
      Setoid: {
        module: laws.Setoid,
        laws: {
          reflexivity: [
            jsc.dict (jsc.array (jsc.number))
          ],
          symmetry: [
            jsc.dict (jsc.array (jsc.number)),
            jsc.dict (jsc.array (jsc.number))
          ],
          transitivity: [
            jsc.dict (jsc.array (jsc.number)),
            jsc.dict (jsc.array (jsc.number)),
            jsc.dict (jsc.array (jsc.number))
          ]
        }
      },
      Ord: {
        module: laws.Ord,
        laws: {
          totality: [
            jsc.dict (jsc.array (jsc.number)),
            jsc.dict (jsc.array (jsc.number))
          ],
          antisymmetry: [
            jsc.dict (jsc.array (jsc.number)),
            jsc.dict (jsc.array (jsc.number))
          ],
          transitivity: [
            jsc.dict (jsc.array (jsc.number)),
            jsc.dict (jsc.array (jsc.number)),
            jsc.dict (jsc.array (jsc.number))
          ]
        }
      },
      Semigroup: {
        module: laws.Semigroup (Z.equals),
        laws: {
          associativity: [
            jsc.dict (jsc.array (jsc.number)),
            jsc.dict (jsc.array (jsc.number)),
            jsc.dict (jsc.array (jsc.number))
          ]
        }
      },
      Monoid: {
        module: laws.Monoid (Z.equals, Object),
        laws: {
          leftIdentity: [
            jsc.dict (jsc.array (jsc.number))
          ],
          rightIdentity: [
            jsc.dict (jsc.array (jsc.number))
          ]
        }
      },
      Filterable: {
        module: laws.Filterable (Z.equals),
        laws: {
          distributivity: [
            jsc.dict (jsc.array (jsc.number)),
            jsc.constant (function(xs) { return xs.length % 2 === 0; }),
            jsc.constant (compose (gt (0)) (sum))
          ],
          identity: [
            jsc.dict (jsc.array (jsc.number))
          ],
          annihilation: [
            jsc.dict (jsc.array (jsc.number)),
            jsc.dict (jsc.array (jsc.number))
          ]
        }
      },
      Functor: {
        module: laws.Functor (Z.equals),
        laws: {
          identity: [
            jsc.dict (jsc.array (jsc.number))
          ],
          composition: [
            jsc.dict (jsc.array (jsc.number)),
            jsc.constant (Math.round),
            jsc.constant (sum)
          ]
        }
      },
      Apply: {
        module: laws.Apply (Z.equals),
        laws: {
          composition: [
            jsc.dict (jsc.constant (Math.round)),
            jsc.dict (jsc.constant (sum)),
            jsc.dict (jsc.array (jsc.number))
          ]
        }
      },
      Alt: {
        module: laws.Alt (Z.equals),
        laws: {
          associativity: [
            jsc.dict (jsc.array (jsc.number)),
            jsc.dict (jsc.array (jsc.number)),
            jsc.dict (jsc.array (jsc.number))
          ],
          distributivity: [
            jsc.dict (jsc.array (jsc.number)),
            jsc.dict (jsc.array (jsc.number)),
            jsc.constant (sum)
          ]
        }
      },
      Plus: {
        module: laws.Plus (Z.equals, Object),
        laws: {
          leftIdentity: [
            jsc.dict (jsc.array (jsc.number))
          ],
          rightIdentity: [
            jsc.dict (jsc.array (jsc.number))
          ],
          annihilation: [
            jsc.constant (sum)
          ]
        }
      },
      Foldable: {
        module: laws.Foldable (Z.equals),
        laws: {
          associativity: [
            jsc.constant (Z.concat),
            jsc.array (jsc.number),
            jsc.dict (jsc.array (jsc.number))
          ]
        }
      },
      Traversable: {
        module: laws.Traversable (Z.equals),
        laws: {
          naturality: [
            jsc.constant (List),
            jsc.constant (Array),
            jsc.constant (listToArray),
            jsc.dict (ListArb (jsc.number))
          ],
          identity: [
            jsc.constant (Identity),
            jsc.dict (jsc.array (jsc.number))
          ],
          composition: [
            jsc.constant (Maybe),
            jsc.constant (List),
            jsc.dict (MaybeArb (ListArb (jsc.number)))
          ]
        }
      }
    });
  });

  suite ('Function', function() {
    function resultsEqual(x) {
      return function(f, g) {
        return Z.equals (f (x), g (x));
      };
    }
    var arb = jsc.oneof (jsc.constant (abs), jsc.constant (square));
    testLaws ({
      Setoid: {
        module: laws.Setoid,
        laws: {
          reflexivity: [
            arb
          ],
          symmetry: [
            arb,
            arb
          ],
          transitivity: [
            arb,
            arb,
            arb
          ]
        }
      },
      Semigroupoid: {
        module: laws.Semigroupoid (resultsEqual (['foo', 'bar', 'baz'])),
        laws: {
          associativity: [
            jsc.constant (square),
            jsc.constant (length),
            jsc.constant (joinWith (''))
          ]
        }
      },
      Category: {
        module: laws.Category (resultsEqual (['foo', 'bar', 'baz'])),
        laws: {
          leftIdentity: [
            jsc.constant (Function),
            jsc.constant (joinWith (''))
          ],
          rightIdentity: [
            jsc.constant (Function),
            jsc.constant (joinWith (''))
          ]
        }
      },
      Functor: {
        module: laws.Functor (resultsEqual (['foo', 'bar', 'baz'])),
        laws: {
          identity: [
            jsc.constant (Z.reverse)
          ],
          composition: [
            jsc.constant (Z.reverse),
            jsc.constant (splitOn ('a')),
            jsc.constant (joinWith ('-'))
          ]
        }
      },
      Profunctor: {
        module: laws.Profunctor (resultsEqual (['foo', 'bar', 'baz'])),
        laws: {
          identity: [
            jsc.constant (append ('3'))
          ],
          composition: [
            jsc.constant (append ('3')),
            jsc.constant (append ('2')),
            jsc.constant (append ('1')),
            jsc.constant (append ('5')),
            jsc.constant (append ('4'))
          ]
        }
      },
      Apply: {
        module: laws.Apply (resultsEqual (['foo', 'bar', 'baz'])),
        laws: {
          composition: [
            jsc.constant (function(xs) { return function(x) { return [x].concat (xs); }; }),
            jsc.constant (function(xs) { return function(n) { return xs[n - 1]; }; }),
            jsc.constant (length)
          ]
        }
      },
      Applicative: {
        module: laws.Applicative (resultsEqual (['foo', 'bar', 'baz']), Function),
        laws: {
          identity: [
            jsc.constant (length)
          ],
          homomorphism: [
            jsc.constant (joinWith ('')),
            jsc.array (jsc.string)
          ],
          interchange: [
            jsc.constant (concat),
            jsc.array (jsc.string)
          ]
        }
      },
      Chain: {
        module: laws.Chain (resultsEqual (['foo', 'bar', 'baz'])),
        laws: {
          associativity: [
            jsc.constant (length),
            jsc.constant (function(n) { return function(xs) { return xs[n - 1]; }; }),
            jsc.constant (function(x) { return function(xs) { return [x].concat (xs); }; })
          ]
        }
      },
      ChainRec: {
        module: laws.ChainRec (resultsEqual ({step: 2, inc: 100}), Function),
        laws: {
          equivalence: [
            jsc.constant (function p(n) { return n === 3000; }),
            jsc.constant (function n(n) { return function(env) { return n + env.step; }; }),
            jsc.constant (function d(n) { return function(env) { return n + env.inc; }; }),
            jsc.constant (0)
          ]
        }
      },
      Monad: {
        module: laws.Monad (resultsEqual (['foo', 'bar', 'baz']), Function),
        laws: {
          leftIdentity: [
            jsc.constant (compose (joinWith ('-'))),
            jsc.constant (Z.reverse)
          ],
          rightIdentity: [
            jsc.constant (Z.reverse)
          ]
        }
      },
      Extend: {
        module: laws.Extend (resultsEqual (['foo', 'bar', 'baz'])),
        laws: {
          associativity: [
            jsc.constant (Z.reverse),
            jsc.constant (function(f) { return f (['(w b) -> c']); }),
            jsc.constant (function(f) { return f (['(w a) -> b']); })
          ]
        }
      },
      Contravariant: {
        module: laws.Contravariant (resultsEqual (['foo', 'bar', 'baz'])),
        laws: {
          identity: [
            jsc.constant (Z.reverse)
          ],
          composition: [
            jsc.constant (Z.reverse),
            jsc.constant (splitOn ('a')),
            jsc.constant (joinWith ('-'))
          ]
        }
      }
    });
  });

});
