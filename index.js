/*
             ############                  #
            ############                  ###
                  #####                  #####
                #####      ####################
              #####       ######################
            #####                     ###########
          #####         ######################
        #####          ####################
      #####                        #####
     ############                 ###
    ############                 */

//. # sanctuary-type-classes
//.
//. The [Fantasy Land Specification][FL] "specifies interoperability of common
//. algebraic structures" by defining a number of type classes. For each type
//. class, it states laws which every member of a type must obey in order for
//. the type to be a member of the type class. In order for the Maybe type to
//. be considered a [Functor][], for example, every `Maybe a` value must have
//. a `fantasy-land/map` method which obeys the identity and composition laws.
//.
//. This project provides:
//.
//.   - [`TypeClass`](#TypeClass), a function for defining type classes;
//.   - one `TypeClass` value for each Fantasy Land type class;
//.   - lawful Fantasy Land methods for JavaScript's built-in types;
//.   - one function for each Fantasy Land method; and
//.   - several functions derived from these functions.
//.
//. ## Type-class hierarchy
//.
/* eslint-disable max-len */
//. <pre>
//.  Setoid   Semigroupoid  Semigroup   Foldable        Functor      Contravariant  Filterable
//. (equals)    (compose)    (concat)   (reduce)         (map)        (contramap)    (filter)
//.     |           |           |           \         / | | | | \
//.     |           |           |            \       /  | | | |  \
//.     |           |           |             \     /   | | | |   \
//.     |           |           |              \   /    | | | |    \
//.     |           |           |               \ /     | | | |     \
//.    Ord      Category     Monoid         Traversable | | | |      \
//.   (lte)       (id)       (empty)        (traverse)  / | | \       \
//.                             |                      /  | |  \       \
//.                             |                     /   / \   \       \
//.                             |             Profunctor /   \ Bifunctor \
//.                             |              (promap) /     \ (bimap)   \
//.                             |                      /       \           \
//.                           Group                   /         \           \
//.                          (invert)               Alt        Apply      Extend
//.                                                (alt)        (ap)     (extend)
//.                                                 /           / \           \
//.                                                /           /   \           \
//.                                               /           /     \           \
//.                                              /           /       \           \
//.                                             /           /         \           \
//.                                           Plus    Applicative    Chain      Comonad
//.                                          (zero)       (of)      (chain)    (extract)
//.                                             \         / \         / \
//.                                              \       /   \       /   \
//.                                               \     /     \     /     \
//.                                                \   /       \   /       \
//.                                                 \ /         \ /         \
//.                                             Alternative    Monad     ChainRec
//.                                                                     (chainRec)
//. </pre>
/* eslint-enable max-len */
//.
//. ## API

(function(f) {

  'use strict';

  /* istanbul ignore else */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = f (require ('sanctuary-type-identifiers'));
  } else if (typeof define === 'function' && define.amd != null) {
    define (['sanctuary-type-identifiers'], f);
  } else {
    self.sanctuaryTypeClasses = f (self.sanctuaryTypeIdentifiers);
  }

} (function(type) {

  'use strict';

  /* istanbul ignore if */
  if (typeof __doctest !== 'undefined') {
    /* eslint-disable no-unused-vars */
    var Identity = __doctest.require ('sanctuary-identity');
    var List = __doctest.require ('./test/List');
    var Maybe = __doctest.require ('sanctuary-maybe');
    var Pair = __doctest.require ('sanctuary-pair');
    var Sum = __doctest.require ('./test/Sum');

    var Nil = List.Nil, Cons = List.Cons;
    var Nothing = Maybe.Nothing, Just = Maybe.Just;
    /* eslint-enable no-unused-vars */
  }

  //  concat_ :: Array a -> Array a -> Array a
  function concat_(xs) {
    return function(ys) {
      return xs.concat (ys);
    };
  }

  //  constant :: a -> b -> a
  function constant(x) {
    return function(y) {
      return x;
    };
  }

  //  forEachKey :: (StrMap a, StrMap a ~> String -> Undefined) -> Undefined
  function forEachKey(strMap, f) {
    (Object.keys (strMap)).forEach (f, strMap);
  }

  //  has :: (String, Object) -> Boolean
  function has(k, o) {
    return Object.prototype.hasOwnProperty.call (o, k);
  }

  //  identity :: a -> a
  function identity(x) { return x; }

  //  pair :: a -> b -> Array2 a b
  function pair(x) {
    return function(y) {
      return [x, y];
    };
  }

  //  sameType :: (a, b) -> Boolean
  function sameType(x, y) {
    return typeof x === typeof y && type (x) === type (y);
  }

  //  sortedKeys :: Object -> Array String
  function sortedKeys(o) {
    return (Object.keys (o)).sort ();
  }

  //  thrush :: a -> (a -> b) -> b
  function thrush(x) {
    return function(f) {
      return f (x);
    };
  }

  //  unary :: (a -> b) -> (a, Any...) -> b
  function unary(f) {
    return function(x) {
      return f (x);
    };
  }

  //  type Iteration a = { value :: a, done :: Boolean }

  //  iterationNext :: a -> Iteration a
  function iterationNext(x) { return {value: x, done: false}; }

  //  iterationDone :: a -> Iteration a
  function iterationDone(x) { return {value: x, done: true}; }

  //# TypeClass :: (String, String, Array TypeClass, a -> Boolean) -> TypeClass
  //.
  //. The arguments are:
  //.
  //.   - the name of the type class, prefixed by its npm package name;
  //.   - the documentation URL of the type class;
  //.   - an array of dependencies; and
  //.   - a predicate which accepts any JavaScript value and returns `true`
  //.     if the value satisfies the requirements of the type class; `false`
  //.     otherwise.
  //.
  //. Example:
  //.
  //. ```javascript
  //. //    hasMethod :: String -> a -> Boolean
  //. const hasMethod = name => x => x != null && typeof x[name] == 'function';
  //.
  //. //    Foo :: TypeClass
  //. const Foo = Z.TypeClass (
  //.   'my-package/Foo',
  //.   'http://example.com/my-package#Foo',
  //.   [],
  //.   hasMethod ('foo')
  //. );
  //.
  //. //    Bar :: TypeClass
  //. const Bar = Z.TypeClass (
  //.   'my-package/Bar',
  //.   'http://example.com/my-package#Bar',
  //.   [Foo],
  //.   hasMethod ('bar')
  //. );
  //. ```
  //.
  //. Types whose values have a `foo` method are members of the Foo type class.
  //. Members of the Foo type class whose values have a `bar` method are also
  //. members of the Bar type class.
  //.
  //. Each `TypeClass` value has a `test` field: a function which accepts
  //. any JavaScript value and returns `true` if the value satisfies the
  //. type class's predicate and the predicates of all the type class's
  //. dependencies; `false` otherwise.
  //.
  //. `TypeClass` values may be used with [sanctuary-def][type-classes]
  //. to define parametrically polymorphic functions which verify their
  //. type-class constraints at run time.
  function TypeClass(name, url, dependencies, test) {
    if (!(this instanceof TypeClass)) {
      return new TypeClass (name, url, dependencies, test);
    }
    this.name = name;
    this.url = url;
    this.test = function(x) {
      return dependencies.every (function(d) { return d.test (x); }) &&
             test (x);
    };
  }

  TypeClass['@@type'] = 'sanctuary-type-classes/TypeClass@1';

  //  data Location = Constructor | Value

  //  Constructor :: Location
  var Constructor = 'Constructor';

  //  Value :: Location
  var Value = 'Value';

  //  _funcPath :: (Boolean, Array String, a) -> Nullable Function
  function _funcPath(allowInheritedProps, path, _x) {
    var x = _x;
    for (var idx = 0; idx < path.length; idx += 1) {
      var k = path[idx];
      if (x == null || !(allowInheritedProps || has (k, x))) return null;
      x = x[k];
    }
    return typeof x === 'function' ? x : null;
  }

  //  funcPath :: (Array String, a) -> Nullable Function
  function funcPath(path, x) {
    return _funcPath (true, path, x);
  }

  //  implPath :: Array String -> Nullable Function
  function implPath(path) {
    return _funcPath (false, path, implementations);
  }

  //  functionName :: Function -> String
  var functionName = has ('name', function f() {}) ?
    function functionName(f) { return f.name; } :
    /* istanbul ignore next */
    function functionName(f) {
      var match = /function (\w*)/.exec (f);
      return match == null ? '' : match[1];
    };

  //  $ :: (String, Array TypeClass, StrMap (Array Location)) -> TypeClass
  function $(_name, dependencies, requirements) {
    function getBoundMethod(_name) {
      var name = 'fantasy-land/' + _name;
      return requirements[_name] === Constructor ?
        function(typeRep) {
          var f = funcPath ([name], typeRep);
          return f == null && typeof typeRep === 'function' ?
            implPath ([functionName (typeRep), name]) :
            f;
        } :
        function(x) {
          var isPrototype = x != null &&
                            x.constructor != null &&
                            x.constructor.prototype === x;
          var m = null;
          if (!isPrototype) m = funcPath ([name], x);
          if (m == null)    m = implPath ([type (x), 'prototype', name]);
          return m && m.bind (x);
        };
    }

    var version = '11.0.0';  // updated programmatically
    var keys = Object.keys (requirements);

    var typeClass = TypeClass (
      'sanctuary-type-classes/' + _name,
      'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version
        + '#' + _name,
      dependencies,
      function(x) {
        return keys.every (function(_name) {
          var arg = requirements[_name] === Constructor ? x.constructor : x;
          return getBoundMethod (_name) (arg) != null;
        });
      }
    );

    typeClass.methods = keys.reduce (function(methods, _name) {
      methods[_name] = getBoundMethod (_name);
      return methods;
    }, {});

    return typeClass;
  }

  //# Setoid :: TypeClass
  //.
  //. `TypeClass` value for [Setoid][].
  //.
  //. ```javascript
  //. > Setoid.test (null)
  //. true
  //. ```
  var Setoid = $ ('Setoid', [], {equals: Value});

  //# Ord :: TypeClass
  //.
  //. `TypeClass` value for [Ord][].
  //.
  //. ```javascript
  //. > Ord.test (0)
  //. true
  //.
  //. > Ord.test (Math.sqrt)
  //. false
  //. ```
  var Ord = $ ('Ord', [Setoid], {lte: Value});

  //# Semigroupoid :: TypeClass
  //.
  //. `TypeClass` value for [Semigroupoid][].
  //.
  //. ```javascript
  //. > Semigroupoid.test (Math.sqrt)
  //. true
  //.
  //. > Semigroupoid.test (0)
  //. false
  //. ```
  var Semigroupoid = $ ('Semigroupoid', [], {compose: Value});

  //# Category :: TypeClass
  //.
  //. `TypeClass` value for [Category][].
  //.
  //. ```javascript
  //. > Category.test (Math.sqrt)
  //. true
  //.
  //. > Category.test (0)
  //. false
  //. ```
  var Category = $ ('Category', [Semigroupoid], {id: Constructor});

  //# Semigroup :: TypeClass
  //.
  //. `TypeClass` value for [Semigroup][].
  //.
  //. ```javascript
  //. > Semigroup.test ('')
  //. true
  //.
  //. > Semigroup.test (0)
  //. false
  //. ```
  var Semigroup = $ ('Semigroup', [], {concat: Value});

  //# Monoid :: TypeClass
  //.
  //. `TypeClass` value for [Monoid][].
  //.
  //. ```javascript
  //. > Monoid.test ('')
  //. true
  //.
  //. > Monoid.test (0)
  //. false
  //. ```
  var Monoid = $ ('Monoid', [Semigroup], {empty: Constructor});

  //# Group :: TypeClass
  //.
  //. `TypeClass` value for [Group][].
  //.
  //. ```javascript
  //. > Group.test (Sum (0))
  //. true
  //.
  //. > Group.test ('')
  //. false
  //. ```
  var Group = $ ('Group', [Monoid], {invert: Value});

  //# Filterable :: TypeClass
  //.
  //. `TypeClass` value for [Filterable][].
  //.
  //. ```javascript
  //. > Filterable.test ({})
  //. true
  //.
  //. > Filterable.test ('')
  //. false
  //. ```
  var Filterable = $ ('Filterable', [], {filter: Value});

  //# Functor :: TypeClass
  //.
  //. `TypeClass` value for [Functor][].
  //.
  //. ```javascript
  //. > Functor.test ([])
  //. true
  //.
  //. > Functor.test ('')
  //. false
  //. ```
  var Functor = $ ('Functor', [], {map: Value});

  //# Bifunctor :: TypeClass
  //.
  //. `TypeClass` value for [Bifunctor][].
  //.
  //. ```javascript
  //. > Bifunctor.test (Pair ('foo') (64))
  //. true
  //.
  //. > Bifunctor.test ([])
  //. false
  //. ```
  var Bifunctor = $ ('Bifunctor', [Functor], {bimap: Value});

  //# Profunctor :: TypeClass
  //.
  //. `TypeClass` value for [Profunctor][].
  //.
  //. ```javascript
  //. > Profunctor.test (Math.sqrt)
  //. true
  //.
  //. > Profunctor.test ([])
  //. false
  //. ```
  var Profunctor = $ ('Profunctor', [Functor], {promap: Value});

  //# Apply :: TypeClass
  //.
  //. `TypeClass` value for [Apply][].
  //.
  //. ```javascript
  //. > Apply.test ([])
  //. true
  //.
  //. > Apply.test ('')
  //. false
  //. ```
  var Apply = $ ('Apply', [Functor], {ap: Value});

  //# Applicative :: TypeClass
  //.
  //. `TypeClass` value for [Applicative][].
  //.
  //. ```javascript
  //. > Applicative.test ([])
  //. true
  //.
  //. > Applicative.test ({})
  //. false
  //. ```
  var Applicative = $ ('Applicative', [Apply], {of: Constructor});

  //# Chain :: TypeClass
  //.
  //. `TypeClass` value for [Chain][].
  //.
  //. ```javascript
  //. > Chain.test ([])
  //. true
  //.
  //. > Chain.test ({})
  //. false
  //. ```
  var Chain = $ ('Chain', [Apply], {chain: Value});

  //# ChainRec :: TypeClass
  //.
  //. `TypeClass` value for [ChainRec][].
  //.
  //. ```javascript
  //. > ChainRec.test ([])
  //. true
  //.
  //. > ChainRec.test ({})
  //. false
  //. ```
  var ChainRec = $ ('ChainRec', [Chain], {chainRec: Constructor});

  //# Monad :: TypeClass
  //.
  //. `TypeClass` value for [Monad][].
  //.
  //. ```javascript
  //. > Monad.test ([])
  //. true
  //.
  //. > Monad.test ({})
  //. false
  //. ```
  var Monad = $ ('Monad', [Applicative, Chain], {});

  //# Alt :: TypeClass
  //.
  //. `TypeClass` value for [Alt][].
  //.
  //. ```javascript
  //. > Alt.test ({})
  //. true
  //.
  //. > Alt.test ('')
  //. false
  //. ```
  var Alt = $ ('Alt', [Functor], {alt: Value});

  //# Plus :: TypeClass
  //.
  //. `TypeClass` value for [Plus][].
  //.
  //. ```javascript
  //. > Plus.test ({})
  //. true
  //.
  //. > Plus.test ('')
  //. false
  //. ```
  var Plus = $ ('Plus', [Alt], {zero: Constructor});

  //# Alternative :: TypeClass
  //.
  //. `TypeClass` value for [Alternative][].
  //.
  //. ```javascript
  //. > Alternative.test ([])
  //. true
  //.
  //. > Alternative.test ({})
  //. false
  //. ```
  var Alternative = $ ('Alternative', [Applicative, Plus], {});

  //# Foldable :: TypeClass
  //.
  //. `TypeClass` value for [Foldable][].
  //.
  //. ```javascript
  //. > Foldable.test ({})
  //. true
  //.
  //. > Foldable.test ('')
  //. false
  //. ```
  var Foldable = $ ('Foldable', [], {reduce: Value});

  //# Traversable :: TypeClass
  //.
  //. `TypeClass` value for [Traversable][].
  //.
  //. ```javascript
  //. > Traversable.test ([])
  //. true
  //.
  //. > Traversable.test ('')
  //. false
  //. ```
  var Traversable = $ ('Traversable', [Functor, Foldable], {traverse: Value});

  //# Extend :: TypeClass
  //.
  //. `TypeClass` value for [Extend][].
  //.
  //. ```javascript
  //. > Extend.test ([])
  //. true
  //.
  //. > Extend.test ({})
  //. false
  //. ```
  var Extend = $ ('Extend', [Functor], {extend: Value});

  //# Comonad :: TypeClass
  //.
  //. `TypeClass` value for [Comonad][].
  //.
  //. ```javascript
  //. > Comonad.test (Identity (0))
  //. true
  //.
  //. > Comonad.test ([])
  //. false
  //. ```
  var Comonad = $ ('Comonad', [Extend], {extract: Value});

  //# Contravariant :: TypeClass
  //.
  //. `TypeClass` value for [Contravariant][].
  //.
  //. ```javascript
  //. > Contravariant.test (Math.sqrt)
  //. true
  //.
  //. > Contravariant.test ([])
  //. false
  //. ```
  var Contravariant = $ ('Contravariant', [], {contramap: Value});

  //  Null$prototype$equals :: Null ~> Null -> Boolean
  function Null$prototype$equals(other) {
    return true;
  }

  //  Null$prototype$lte :: Null ~> Null -> Boolean
  function Null$prototype$lte(other) {
    return true;
  }

  //  Undefined$prototype$equals :: Undefined ~> Undefined -> Boolean
  function Undefined$prototype$equals(other) {
    return true;
  }

  //  Undefined$prototype$lte :: Undefined ~> Undefined -> Boolean
  function Undefined$prototype$lte(other) {
    return true;
  }

  //  Boolean$prototype$equals :: Boolean ~> Boolean -> Boolean
  function Boolean$prototype$equals(other) {
    return typeof this === 'object' ?
      equals (this.valueOf (), other.valueOf ()) :
      this === other;
  }

  //  Boolean$prototype$lte :: Boolean ~> Boolean -> Boolean
  function Boolean$prototype$lte(other) {
    return typeof this === 'object' ?
      lte (this.valueOf (), other.valueOf ()) :
      this === false || other === true;
  }

  //  Number$prototype$equals :: Number ~> Number -> Boolean
  function Number$prototype$equals(other) {
    return typeof this === 'object' ?
      equals (this.valueOf (), other.valueOf ()) :
      isNaN (this) && isNaN (other) || this === other;
  }

  //  Number$prototype$lte :: Number ~> Number -> Boolean
  function Number$prototype$lte(other) {
    return typeof this === 'object' ?
      lte (this.valueOf (), other.valueOf ()) :
      isNaN (this) || this <= other;
  }

  //  Date$prototype$equals :: Date ~> Date -> Boolean
  function Date$prototype$equals(other) {
    return equals (this.valueOf (), other.valueOf ());
  }

  //  Date$prototype$lte :: Date ~> Date -> Boolean
  function Date$prototype$lte(other) {
    return lte (this.valueOf (), other.valueOf ());
  }

  //  RegExp$prototype$equals :: RegExp ~> RegExp -> Boolean
  function RegExp$prototype$equals(other) {
    return other.source === this.source &&
           other.global === this.global &&
           other.ignoreCase === this.ignoreCase &&
           other.multiline === this.multiline &&
           other.sticky === this.sticky &&
           other.unicode === this.unicode;
  }

  //  String$empty :: () -> String
  function String$empty() {
    return '';
  }

  //  String$prototype$equals :: String ~> String -> Boolean
  function String$prototype$equals(other) {
    return typeof this === 'object' ?
      equals (this.valueOf (), other.valueOf ()) :
      this === other;
  }

  //  String$prototype$lte :: String ~> String -> Boolean
  function String$prototype$lte(other) {
    return typeof this === 'object' ?
      lte (this.valueOf (), other.valueOf ()) :
      this <= other;
  }

  //  String$prototype$concat :: String ~> String -> String
  function String$prototype$concat(other) {
    return this + other;
  }

  //  Array$empty :: () -> Array a
  function Array$empty() {
    return [];
  }

  //  Array$of :: a -> Array a
  function Array$of(x) {
    return [x];
  }

  //  Array$chainRec :: ((a -> c, b -> c, a) -> Array c, a) -> Array b
  function Array$chainRec(f, x) {
    var result = [];
    var nil = {};
    var todo = {head: x, tail: nil};
    while (todo !== nil) {
      var more = nil;
      var steps = f (iterationNext, iterationDone, todo.head);
      for (var idx = 0; idx < steps.length; idx += 1) {
        var step = steps[idx];
        if (step.done) {
          result.push (step.value);
        } else {
          more = {head: step.value, tail: more};
        }
      }
      todo = todo.tail;
      while (more !== nil) {
        todo = {head: more.head, tail: todo};
        more = more.tail;
      }
    }
    return result;
  }

  //  Array$zero :: () -> Array a
  function Array$zero() {
    return [];
  }

  //  Array$prototype$equals :: Array a ~> Array a -> Boolean
  function Array$prototype$equals(other) {
    if (other.length !== this.length) return false;
    for (var idx = 0; idx < this.length; idx += 1) {
      if (!(equals (this[idx], other[idx]))) return false;
    }
    return true;
  }

  //  Array$prototype$lte :: Array a ~> Array a -> Boolean
  function Array$prototype$lte(other) {
    for (var idx = 0; true; idx += 1) {
      if (idx === this.length) return true;
      if (idx === other.length) return false;
      if (!(equals (this[idx], other[idx]))) {
        return lte (this[idx], other[idx]);
      }
    }
  }

  //  Array$prototype$concat :: Array a ~> Array a -> Array a
  function Array$prototype$concat(other) {
    return this.concat (other);
  }

  //  Array$prototype$filter :: Array a ~> (a -> Boolean) -> Array a
  function Array$prototype$filter(pred) {
    return this.filter (function(x) { return pred (x); });
  }

  //  Array$prototype$map :: Array a ~> (a -> b) -> Array b
  function Array$prototype$map(f) {
    return this.map (function(x) { return f (x); });
  }

  //  Array$prototype$ap :: Array a ~> Array (a -> b) -> Array b
  function Array$prototype$ap(fs) {
    var result = [];
    for (var idx = 0; idx < fs.length; idx += 1) {
      for (var idx2 = 0; idx2 < this.length; idx2 += 1) {
        result.push (fs[idx] (this[idx2]));
      }
    }
    return result;
  }

  //  Array$prototype$chain :: Array a ~> (a -> Array b) -> Array b
  function Array$prototype$chain(f) {
    var result = [];
    for (var idx = 0; idx < this.length; idx += 1) {
      for (var idx2 = 0, xs = f (this[idx]); idx2 < xs.length; idx2 += 1) {
        result.push (xs[idx2]);
      }
    }
    return result;
  }

  //  Array$prototype$alt :: Array a ~> Array a -> Array a
  var Array$prototype$alt = Array$prototype$concat;

  //  Array$prototype$reduce :: Array a ~> ((b, a) -> b, b) -> b
  function Array$prototype$reduce(f, initial) {
    var acc = initial;
    for (var idx = 0; idx < this.length; idx += 1) acc = f (acc, this[idx]);
    return acc;
  }

  //  Array$prototype$traverse :: Applicative f => Array a ~> (TypeRep f, a -> f b) -> f (Array b)
  function Array$prototype$traverse(typeRep, f) {
    var xs = this;
    function go(idx, n) {
      switch (n) {
        case 0: return of (typeRep, []);
        case 2: return lift2 (pair, f (xs[idx]), f (xs[idx + 1]));
        default:
          var m = Math.floor (n / 4) * 2;
          return lift2 (concat_, go (idx, m), go (idx + m, n - m));
      }
    }
    return this.length % 2 === 1 ?
      lift2 (concat_, map (Array$of, f (this[0])), go (1, this.length - 1)) :
      go (0, this.length);
  }

  //  Array$prototype$extend :: Array a ~> (Array a -> b) -> Array b
  function Array$prototype$extend(f) {
    return this.map (function(_, idx, xs) { return f (xs.slice (idx)); });
  }

  //  Arguments$prototype$equals :: Arguments ~> Arguments -> Boolean
  function Arguments$prototype$equals(other) {
    return Array$prototype$equals.call (this, other);
  }

  //  Arguments$prototype$lte :: Arguments ~> Arguments -> Boolean
  function Arguments$prototype$lte(other) {
    return Array$prototype$lte.call (this, other);
  }

  //  Error$prototype$equals :: Error ~> Error -> Boolean
  function Error$prototype$equals(other) {
    return equals (this.name, other.name) &&
           equals (this.message, other.message);
  }

  //  Object$empty :: () -> StrMap a
  function Object$empty() {
    return {};
  }

  //  Object$zero :: () -> StrMap a
  function Object$zero() {
    return {};
  }

  //  Object$prototype$equals :: StrMap a ~> StrMap a -> Boolean
  function Object$prototype$equals(other) {
    var self = this;
    var keys = sortedKeys (this);
    return equals (keys, sortedKeys (other)) &&
           keys.every (function(k) { return equals (self[k], other[k]); });
  }

  //  Object$prototype$lte :: StrMap a ~> StrMap a -> Boolean
  function Object$prototype$lte(other) {
    var theseKeys = sortedKeys (this);
    var otherKeys = sortedKeys (other);
    while (true) {
      if (theseKeys.length === 0) return true;
      if (otherKeys.length === 0) return false;
      var k = theseKeys.shift ();
      var z = otherKeys.shift ();
      if (k < z) return true;
      if (k > z) return false;
      if (!(equals (this[k], other[k]))) return lte (this[k], other[k]);
    }
  }

  //  Object$prototype$concat :: StrMap a ~> StrMap a -> StrMap a
  function Object$prototype$concat(other) {
    var result = {};
    function assign(k) { result[k] = this[k]; }
    forEachKey (this, assign);
    forEachKey (other, assign);
    return result;
  }

  //  Object$prototype$filter :: StrMap a ~> (a -> Boolean) -> StrMap a
  function Object$prototype$filter(pred) {
    var result = {};
    forEachKey (this, function(k) {
      if (pred (this[k])) result[k] = this[k];
    });
    return result;
  }

  //  Object$prototype$map :: StrMap a ~> (a -> b) -> StrMap b
  function Object$prototype$map(f) {
    var result = {};
    forEachKey (this, function(k) { result[k] = f (this[k]); });
    return result;
  }

  //  Object$prototype$ap :: StrMap a ~> StrMap (a -> b) -> StrMap b
  function Object$prototype$ap(other) {
    var result = {};
    forEachKey (this, function(k) {
      if (has (k, other)) result[k] = other[k] (this[k]);
    });
    return result;
  }

  //  Object$prototype$alt :: StrMap a ~> StrMap a -> StrMap a
  var Object$prototype$alt = Object$prototype$concat;

  //  Object$prototype$reduce :: StrMap a ~> ((b, a) -> b, b) -> b
  function Object$prototype$reduce(f, initial) {
    var self = this;
    function reducer(acc, k) { return f (acc, self[k]); }
    return (sortedKeys (this)).reduce (reducer, initial);
  }

  //  Object$prototype$traverse :: Applicative f => StrMap a ~> (TypeRep f, a -> f b) -> f (StrMap b)
  function Object$prototype$traverse(typeRep, f) {
    var self = this;
    return (Object.keys (this)).reduce (function(applicative, k) {
      function set(o) {
        return function(v) {
          var singleton = {}; singleton[k] = v;
          return Object$prototype$concat.call (o, singleton);
        };
      }
      return lift2 (set, applicative, f (self[k]));
    }, of (typeRep, {}));
  }

  //  Function$id :: () -> a -> a
  function Function$id() {
    return identity;
  }

  //  Function$of :: b -> (a -> b)
  function Function$of(x) {
    return function(_) { return x; };
  }

  //  Function$chainRec :: ((a -> c, b -> c, a) -> (z -> c), a) -> (z -> b)
  function Function$chainRec(f, x) {
    return function(a) {
      var step = iterationNext (x);
      while (!step.done) {
        step = f (iterationNext, iterationDone, step.value) (a);
      }
      return step.value;
    };
  }

  //  Function$prototype$equals :: Function ~> Function -> Boolean
  function Function$prototype$equals(other) {
    return other === this;
  }

  //  Function$prototype$compose :: (a -> b) ~> (b -> c) -> (a -> c)
  function Function$prototype$compose(other) {
    var semigroupoid = this;
    return function(x) { return other (semigroupoid (x)); };
  }

  //  Function$prototype$map :: (a -> b) ~> (b -> c) -> (a -> c)
  function Function$prototype$map(f) {
    var functor = this;
    return function(x) { return f (functor (x)); };
  }

  //  Function$prototype$promap :: (b -> c) ~> (a -> b, c -> d) -> (a -> d)
  function Function$prototype$promap(f, g) {
    var profunctor = this;
    return function(x) { return g (profunctor (f (x))); };
  }

  //  Function$prototype$ap :: (a -> b) ~> (a -> b -> c) -> (a -> c)
  function Function$prototype$ap(f) {
    var apply = this;
    return function(x) { return f (x) (apply (x)); };
  }

  //  Function$prototype$chain :: (a -> b) ~> (b -> a -> c) -> (a -> c)
  function Function$prototype$chain(f) {
    var chain = this;
    return function(x) { return f (chain (x)) (x); };
  }

  //  Function$prototype$extend :: Semigroup a => (a -> b) ~> ((a -> b) -> c) -> (a -> c)
  function Function$prototype$extend(f) {
    var extend = this;
    return function(x) {
      return f (function(y) { return extend (concat (x, y)); });
    };
  }

  //  Function$prototype$contramap :: (b -> c) ~> (a -> b) -> (a -> c)
  function Function$prototype$contramap(f) {
    var contravariant = this;
    return function(x) { return contravariant (f (x)); };
  }

  /* eslint-disable key-spacing */
  var implementations = {
    Null: {
      'prototype': {
        'fantasy-land/equals':      Null$prototype$equals,
        'fantasy-land/lte':         Null$prototype$lte
      }
    },
    Undefined: {
      'prototype': {
        'fantasy-land/equals':      Undefined$prototype$equals,
        'fantasy-land/lte':         Undefined$prototype$lte
      }
    },
    Boolean: {
      'prototype': {
        'fantasy-land/equals':      Boolean$prototype$equals,
        'fantasy-land/lte':         Boolean$prototype$lte
      }
    },
    Number: {
      'prototype': {
        'fantasy-land/equals':      Number$prototype$equals,
        'fantasy-land/lte':         Number$prototype$lte
      }
    },
    Date: {
      'prototype': {
        'fantasy-land/equals':      Date$prototype$equals,
        'fantasy-land/lte':         Date$prototype$lte
      }
    },
    RegExp: {
      'prototype': {
        'fantasy-land/equals':      RegExp$prototype$equals
      }
    },
    String: {
      'fantasy-land/empty':         String$empty,
      'prototype': {
        'fantasy-land/equals':      String$prototype$equals,
        'fantasy-land/lte':         String$prototype$lte,
        'fantasy-land/concat':      String$prototype$concat
      }
    },
    Array: {
      'fantasy-land/empty':         Array$empty,
      'fantasy-land/of':            Array$of,
      'fantasy-land/chainRec':      Array$chainRec,
      'fantasy-land/zero':          Array$zero,
      'prototype': {
        'fantasy-land/equals':      Array$prototype$equals,
        'fantasy-land/lte':         Array$prototype$lte,
        'fantasy-land/concat':      Array$prototype$concat,
        'fantasy-land/filter':      Array$prototype$filter,
        'fantasy-land/map':         Array$prototype$map,
        'fantasy-land/ap':          Array$prototype$ap,
        'fantasy-land/chain':       Array$prototype$chain,
        'fantasy-land/alt':         Array$prototype$alt,
        'fantasy-land/reduce':      Array$prototype$reduce,
        'fantasy-land/traverse':    Array$prototype$traverse,
        'fantasy-land/extend':      Array$prototype$extend
      }
    },
    Arguments: {
      'prototype': {
        'fantasy-land/equals':      Arguments$prototype$equals,
        'fantasy-land/lte':         Arguments$prototype$lte
      }
    },
    Error: {
      'prototype': {
        'fantasy-land/equals':      Error$prototype$equals
      }
    },
    Object: {
      'fantasy-land/empty':         Object$empty,
      'fantasy-land/zero':          Object$zero,
      'prototype': {
        'fantasy-land/equals':      Object$prototype$equals,
        'fantasy-land/lte':         Object$prototype$lte,
        'fantasy-land/concat':      Object$prototype$concat,
        'fantasy-land/filter':      Object$prototype$filter,
        'fantasy-land/map':         Object$prototype$map,
        'fantasy-land/ap':          Object$prototype$ap,
        'fantasy-land/alt':         Object$prototype$alt,
        'fantasy-land/reduce':      Object$prototype$reduce,
        'fantasy-land/traverse':    Object$prototype$traverse
      }
    },
    Function: {
      'fantasy-land/id':            Function$id,
      'fantasy-land/of':            Function$of,
      'fantasy-land/chainRec':      Function$chainRec,
      'prototype': {
        'fantasy-land/equals':      Function$prototype$equals,
        'fantasy-land/compose':     Function$prototype$compose,
        'fantasy-land/map':         Function$prototype$map,
        'fantasy-land/promap':      Function$prototype$promap,
        'fantasy-land/ap':          Function$prototype$ap,
        'fantasy-land/chain':       Function$prototype$chain,
        'fantasy-land/extend':      Function$prototype$extend,
        'fantasy-land/contramap':   Function$prototype$contramap
      }
    }
  };
  /* eslint-enable key-spacing */

  //# equals :: (a, b) -> Boolean
  //.
  //. Returns `true` if its arguments are of the same type and equal according
  //. to the type's [`fantasy-land/equals`][] method; `false` otherwise.
  //.
  //. `fantasy-land/equals` implementations are provided for the following
  //. built-in types: Null, Undefined, Boolean, Number, Date, RegExp, String,
  //. Array, Arguments, Error, Object, and Function.
  //.
  //. The algorithm supports circular data structures. Two arrays are equal
  //. if they have the same index paths and for each path have equal values.
  //. Two arrays which represent `[1, [1, [1, [1, [1, ...]]]]]`, for example,
  //. are equal even if their internal structures differ. Two objects are equal
  //. if they have the same property paths and for each path have equal values.
  //.
  //. ```javascript
  //. > equals (0, -0)
  //. true
  //.
  //. > equals (NaN, NaN)
  //. true
  //.
  //. > equals (Cons (1, Cons (2, Nil)), Cons (1, Cons (2, Nil)))
  //. true
  //.
  //. > equals (Cons (1, Cons (2, Nil)), Cons (2, Cons (1, Nil)))
  //. false
  //. ```
  var equals = (function() {
    //  $pairs :: Array (Array2 Any Any)
    var $pairs = [];

    return function equals(x, y) {
      if (!(sameType (x, y))) return false;

      //  This algorithm for comparing circular data structures was
      //  suggested in <http://stackoverflow.com/a/40622794/312785>.
      if ($pairs.some (function(p) { return p[0] === x && p[1] === y; })) {
        return true;
      }

      $pairs.push ([x, y]);
      try {
        return Setoid.test (x) &&
               Setoid.test (y) &&
               Setoid.methods.equals (x) (y);
      } finally {
        $pairs.pop ();
      }
    };
  } ());

  //# lt :: (a, b) -> Boolean
  //.
  //. Returns `true` if its arguments are of the same type and the first is
  //. less than the second according to the type's [`fantasy-land/lte`][]
  //. method; `false` otherwise.
  //.
  //. This function is derived from [`lte`](#lte).
  //.
  //. See also [`gt`](#gt) and [`gte`](#gte).
  //.
  //. ```javascript
  //. > lt (0, 0)
  //. false
  //.
  //. > lt (0, 1)
  //. true
  //.
  //. > lt (1, 0)
  //. false
  //. ```
  function lt(x, y) {
    return sameType (x, y) && !(lte (y, x));
  }

  //# lte :: (a, b) -> Boolean
  //.
  //. Returns `true` if its arguments are of the same type and the first
  //. is less than or equal to the second according to the type's
  //. [`fantasy-land/lte`][] method; `false` otherwise.
  //.
  //. `fantasy-land/lte` implementations are provided for the following
  //. built-in types: Null, Undefined, Boolean, Number, Date, String, Array,
  //. Arguments, and Object.
  //.
  //. The algorithm supports circular data structures in the same manner as
  //. [`equals`](#equals).
  //.
  //. See also [`lt`](#lt), [`gt`](#gt), and [`gte`](#gte).
  //.
  //. ```javascript
  //. > lte (0, 0)
  //. true
  //.
  //. > lte (0, 1)
  //. true
  //.
  //. > lte (1, 0)
  //. false
  //. ```
  var lte = (function() {
    //  $pairs :: Array (Array2 Any Any)
    var $pairs = [];

    return function lte(x, y) {
      if (!(sameType (x, y))) return false;

      //  This algorithm for comparing circular data structures was
      //  suggested in <http://stackoverflow.com/a/40622794/312785>.
      if ($pairs.some (function(p) { return p[0] === x && p[1] === y; })) {
        return equals (x, y);
      }

      $pairs.push ([x, y]);
      try {
        return Ord.test (x) && Ord.test (y) && Ord.methods.lte (x) (y);
      } finally {
        $pairs.pop ();
      }
    };
  } ());

  //# gt :: (a, b) -> Boolean
  //.
  //. Returns `true` if its arguments are of the same type and the first is
  //. greater than the second according to the type's [`fantasy-land/lte`][]
  //. method; `false` otherwise.
  //.
  //. This function is derived from [`lte`](#lte).
  //.
  //. See also [`lt`](#lt) and [`gte`](#gte).
  //.
  //. ```javascript
  //. > gt (0, 0)
  //. false
  //.
  //. > gt (0, 1)
  //. false
  //.
  //. > gt (1, 0)
  //. true
  //. ```
  function gt(x, y) {
    return lt (y, x);
  }

  //# gte :: (a, b) -> Boolean
  //.
  //. Returns `true` if its arguments are of the same type and the first
  //. is greater than or equal to the second according to the type's
  //. [`fantasy-land/lte`][] method; `false` otherwise.
  //.
  //. This function is derived from [`lte`](#lte).
  //.
  //. See also [`lt`](#lt) and [`gt`](#gt).
  //.
  //. ```javascript
  //. > gte (0, 0)
  //. true
  //.
  //. > gte (0, 1)
  //. false
  //.
  //. > gte (1, 0)
  //. true
  //. ```
  function gte(x, y) {
    return lte (y, x);
  }

  //# min :: Ord a => (a, a) -> a
  //.
  //. Returns the smaller of its two arguments.
  //.
  //. This function is derived from [`lte`](#lte).
  //.
  //. See also [`max`](#max).
  //.
  //. ```javascript
  //. > min (10, 2)
  //. 2
  //.
  //. > min (new Date ('1999-12-31'), new Date ('2000-01-01'))
  //. new Date ('1999-12-31')
  //.
  //. > min ('10', '2')
  //. '10'
  //. ```
  function min(x, y) {
    return lte (x, y) ? x : y;
  }

  //# max :: Ord a => (a, a) -> a
  //.
  //. Returns the larger of its two arguments.
  //.
  //. This function is derived from [`lte`](#lte).
  //.
  //. See also [`min`](#min).
  //.
  //. ```javascript
  //. > max (10, 2)
  //. 10
  //.
  //. > max (new Date ('1999-12-31'), new Date ('2000-01-01'))
  //. new Date ('2000-01-01')
  //.
  //. > max ('10', '2')
  //. '2'
  //. ```
  function max(x, y) {
    return lte (x, y) ? y : x;
  }

  //# clamp :: Ord a => (a, a, a) -> a
  //.
  //. Takes a lower bound, an upper bound, and a value of the same type.
  //. Returns the value if it is within the bounds; the nearer bound otherwise.
  //.
  //. This function is derived from [`min`](#min) and [`max`](#max).
  //.
  //. ```javascript
  //. > clamp (0, 100, 42)
  //. 42
  //.
  //. > clamp (0, 100, -1)
  //. 0
  //.
  //. > clamp ('A', 'Z', '~')
  //. 'Z'
  //. ```
  function clamp(lower, upper, x) {
    return max (lower, min (upper, x));
  }

  //# compose :: Semigroupoid c => (c j k, c i j) -> c i k
  //.
  //. Function wrapper for [`fantasy-land/compose`][].
  //.
  //. `fantasy-land/compose` implementations are provided for the following
  //. built-in types: Function.
  //.
  //. ```javascript
  //. > compose (Math.sqrt, x => x + 1) (99)
  //. 10
  //. ```
  function compose(x, y) {
    return Semigroupoid.methods.compose (y) (x);
  }

  //# id :: Category c => TypeRep c -> c
  //.
  //. Function wrapper for [`fantasy-land/id`][].
  //.
  //. `fantasy-land/id` implementations are provided for the following
  //. built-in types: Function.
  //.
  //. ```javascript
  //. > id (Function) ('foo')
  //. 'foo'
  //. ```
  function id(typeRep) {
    return Category.methods.id (typeRep) ();
  }

  //# concat :: Semigroup a => (a, a) -> a
  //.
  //. Function wrapper for [`fantasy-land/concat`][].
  //.
  //. `fantasy-land/concat` implementations are provided for the following
  //. built-in types: String, Array, and Object.
  //.
  //. ```javascript
  //. > concat ('abc', 'def')
  //. 'abcdef'
  //.
  //. > concat ([1, 2, 3], [4, 5, 6])
  //. [1, 2, 3, 4, 5, 6]
  //.
  //. > concat ({x: 1, y: 2}, {y: 3, z: 4})
  //. {x: 1, y: 3, z: 4}
  //.
  //. > concat (Cons ('foo', Cons ('bar', Cons ('baz', Nil))), Cons ('quux', Nil))
  //. Cons ('foo', Cons ('bar', Cons ('baz', Cons ('quux', Nil))))
  //. ```
  function concat(x, y) {
    return Semigroup.methods.concat (x) (y);
  }

  //# empty :: Monoid m => TypeRep m -> m
  //.
  //. Function wrapper for [`fantasy-land/empty`][].
  //.
  //. `fantasy-land/empty` implementations are provided for the following
  //. built-in types: String, Array, and Object.
  //.
  //. ```javascript
  //. > empty (String)
  //. ''
  //.
  //. > empty (Array)
  //. []
  //.
  //. > empty (Object)
  //. {}
  //.
  //. > empty (List)
  //. Nil
  //. ```
  function empty(typeRep) {
    return Monoid.methods.empty (typeRep) ();
  }

  //# invert :: Group g => g -> g
  //.
  //. Function wrapper for [`fantasy-land/invert`][].
  //.
  //. ```javascript
  //. > invert (Sum (5))
  //. Sum (-5)
  //. ```
  function invert(group) {
    return Group.methods.invert (group) ();
  }

  //# filter :: Filterable f => (a -> Boolean, f a) -> f a
  //.
  //. Function wrapper for [`fantasy-land/filter`][]. Discards every element
  //. which does not satisfy the predicate.
  //.
  //. `fantasy-land/filter` implementations are provided for the following
  //. built-in types: Array and Object.
  //.
  //. See also [`reject`](#reject).
  //.
  //. ```javascript
  //. > filter (x => x % 2 == 1, [1, 2, 3])
  //. [1, 3]
  //.
  //. > filter (x => x % 2 == 1, {x: 1, y: 2, z: 3})
  //. {x: 1, z: 3}
  //.
  //. > filter (x => x % 2 == 1, Cons (1, Cons (2, Cons (3, Nil))))
  //. Cons (1, Cons (3, Nil))
  //.
  //. > filter (x => x % 2 == 1, Nothing)
  //. Nothing
  //.
  //. > filter (x => x % 2 == 1, Just (0))
  //. Nothing
  //.
  //. > filter (x => x % 2 == 1, Just (1))
  //. Just (1)
  //. ```
  function filter(pred, filterable) {
    return Filterable.methods.filter (filterable) (pred);
  }

  //# reject :: Filterable f => (a -> Boolean, f a) -> f a
  //.
  //. Discards every element which satisfies the predicate.
  //.
  //. This function is derived from [`filter`](#filter).
  //.
  //. ```javascript
  //. > reject (x => x % 2 == 1, [1, 2, 3])
  //. [2]
  //.
  //. > reject (x => x % 2 == 1, {x: 1, y: 2, z: 3})
  //. {y: 2}
  //.
  //. > reject (x => x % 2 == 1, Cons (1, Cons (2, Cons (3, Nil))))
  //. Cons (2, Nil)
  //.
  //. > reject (x => x % 2 == 1, Nothing)
  //. Nothing
  //.
  //. > reject (x => x % 2 == 1, Just (0))
  //. Just (0)
  //.
  //. > reject (x => x % 2 == 1, Just (1))
  //. Nothing
  //. ```
  function reject(pred, filterable) {
    return filter (function(x) { return !(pred (x)); }, filterable);
  }

  //# map :: Functor f => (a -> b, f a) -> f b
  //.
  //. Function wrapper for [`fantasy-land/map`][].
  //.
  //. `fantasy-land/map` implementations are provided for the following
  //. built-in types: Array, Object, and Function.
  //.
  //. ```javascript
  //. > map (Math.sqrt, [1, 4, 9])
  //. [1, 2, 3]
  //.
  //. > map (Math.sqrt, {x: 1, y: 4, z: 9})
  //. {x: 1, y: 2, z: 3}
  //.
  //. > map (Math.sqrt, s => s.length) ('Sanctuary')
  //. 3
  //.
  //. > map (Math.sqrt, Pair ('foo') (64))
  //. Pair ('foo') (8)
  //.
  //. > map (Math.sqrt, Nil)
  //. Nil
  //.
  //. > map (Math.sqrt, Cons (1, Cons (4, Cons (9, Nil))))
  //. Cons (1, Cons (2, Cons (3, Nil)))
  //. ```
  function map(f, functor) {
    return Functor.methods.map (functor) (f);
  }

  //# flip :: Functor f => (f (a -> b), a) -> f b
  //.
  //. Maps over the given functions, applying each to the given value.
  //.
  //. This function is derived from [`map`](#map).
  //.
  //. ```javascript
  //. > flip (x => y => x + y, '!') ('foo')
  //. 'foo!'
  //.
  //. > flip ([Math.floor, Math.ceil], 1.5)
  //. [1, 2]
  //.
  //. > flip ({floor: Math.floor, ceil: Math.ceil}, 1.5)
  //. {floor: 1, ceil: 2}
  //.
  //. > flip (Cons (Math.floor, Cons (Math.ceil, Nil)), 1.5)
  //. Cons (1, Cons (2, Nil))
  //. ```
  function flip(functor, x) {
    return Functor.methods.map (functor) (thrush (x));
  }

  //# bimap :: Bifunctor f => (a -> b, c -> d, f a c) -> f b d
  //.
  //. Function wrapper for [`fantasy-land/bimap`][].
  //.
  //. ```javascript
  //. > bimap (s => s.toUpperCase (), Math.sqrt, Pair ('foo') (64))
  //. Pair ('FOO') (8)
  //. ```
  function bimap(f, g, bifunctor) {
    return Bifunctor.methods.bimap (bifunctor) (f, g);
  }

  //# mapLeft :: Bifunctor f => (a -> b, f a c) -> f b c
  //.
  //. Maps the given function over the left side of a Bifunctor.
  //.
  //. ```javascript
  //. > mapLeft (Math.sqrt, Pair (64) (9))
  //. Pair (8) (9)
  //. ```
  function mapLeft(f, bifunctor) {
    return bimap (f, identity, bifunctor);
  }

  //# promap :: Profunctor p => (a -> b, c -> d, p b c) -> p a d
  //.
  //. Function wrapper for [`fantasy-land/promap`][].
  //.
  //. `fantasy-land/promap` implementations are provided for the following
  //. built-in types: Function.
  //.
  //. ```javascript
  //. > promap (Math.abs, x => x + 1, Math.sqrt) (-100)
  //. 11
  //. ```
  function promap(f, g, profunctor) {
    return Profunctor.methods.promap (profunctor) (f, g);
  }

  //# ap :: Apply f => (f (a -> b), f a) -> f b
  //.
  //. Function wrapper for [`fantasy-land/ap`][].
  //.
  //. `fantasy-land/ap` implementations are provided for the following
  //. built-in types: Array, Object, and Function.
  //.
  //. ```javascript
  //. > ap ([Math.sqrt, x => x * x], [1, 4, 9, 16, 25])
  //. [1, 2, 3, 4, 5, 1, 16, 81, 256, 625]
  //.
  //. > ap ({a: Math.sqrt, b: x => x * x}, {a: 16, b: 10, c: 1})
  //. {a: 4, b: 100}
  //.
  //. > ap (s => n => s.slice (0, n), s => Math.ceil (s.length / 2)) ('Haskell')
  //. 'Hask'
  //.
  //. > ap (Identity (Math.sqrt), Identity (64))
  //. Identity (8)
  //.
  //. > ap (Cons (Math.sqrt, Cons (x => x * x, Nil)), Cons (16, Cons (100, Nil)))
  //. Cons (4, Cons (10, Cons (256, Cons (10000, Nil))))
  //. ```
  function ap(applyF, applyX) {
    return Apply.methods.ap (applyX) (applyF);
  }

  //# lift2 :: Apply f => (a -> b -> c, f a, f b) -> f c
  //.
  //. Lifts `a -> b -> c` to `Apply f => f a -> f b -> f c` and returns the
  //. result of applying this to the given arguments.
  //.
  //. This function is derived from [`map`](#map) and [`ap`](#ap).
  //.
  //. See also [`lift3`](#lift3).
  //.
  //. ```javascript
  //. > lift2 (x => y => Math.pow (x, y), [10], [1, 2, 3])
  //. [10, 100, 1000]
  //.
  //. > lift2 (x => y => Math.pow (x, y), Identity (10), Identity (3))
  //. Identity (1000)
  //. ```
  function lift2(f, x, y) {
    return ap (map (f, x), y);
  }

  //# lift3 :: Apply f => (a -> b -> c -> d, f a, f b, f c) -> f d
  //.
  //. Lifts `a -> b -> c -> d` to `Apply f => f a -> f b -> f c -> f d` and
  //. returns the result of applying this to the given arguments.
  //.
  //. This function is derived from [`map`](#map) and [`ap`](#ap).
  //.
  //. See also [`lift2`](#lift2).
  //.
  //. ```javascript
  //. > lift3 (x => y => z => x + z + y,
  //. .        ['<', '['],
  //. .        ['>', ']'],
  //. .        ['foo', 'bar', 'baz'])
  //. [ '<foo>', '<bar>', '<baz>',
  //. . '<foo]', '<bar]', '<baz]',
  //. . '[foo>', '[bar>', '[baz>',
  //. . '[foo]', '[bar]', '[baz]' ]
  //.
  //. > lift3 (x => y => z => x + z + y,
  //. .        Identity ('<'),
  //. .        Identity ('>'),
  //. .        Identity ('baz'))
  //. Identity ('<baz>')
  //. ```
  function lift3(f, x, y, z) {
    return ap (ap (map (f, x), y), z);
  }

  //# apFirst :: Apply f => (f a, f b) -> f a
  //.
  //. Combines two effectful actions, keeping only the result of the first.
  //. Equivalent to Haskell's `(<*)` function.
  //.
  //. This function is derived from [`lift2`](#lift2).
  //.
  //. See also [`apSecond`](#apSecond).
  //.
  //. ```javascript
  //. > apFirst ([1, 2], [3, 4])
  //. [1, 1, 2, 2]
  //.
  //. > apFirst (Identity (1), Identity (2))
  //. Identity (1)
  //. ```
  function apFirst(x, y) {
    return lift2 (constant, x, y);
  }

  //# apSecond :: Apply f => (f a, f b) -> f b
  //.
  //. Combines two effectful actions, keeping only the result of the second.
  //. Equivalent to Haskell's `(*>)` function.
  //.
  //. This function is derived from [`lift2`](#lift2).
  //.
  //. See also [`apFirst`](#apFirst).
  //.
  //. ```javascript
  //. > apSecond ([1, 2], [3, 4])
  //. [3, 4, 3, 4]
  //.
  //. > apSecond (Identity (1), Identity (2))
  //. Identity (2)
  //. ```
  function apSecond(x, y) {
    return lift2 (constant (identity), x, y);
  }

  //# of :: Applicative f => (TypeRep f, a) -> f a
  //.
  //. Function wrapper for [`fantasy-land/of`][].
  //.
  //. `fantasy-land/of` implementations are provided for the following
  //. built-in types: Array and Function.
  //.
  //. ```javascript
  //. > of (Array, 42)
  //. [42]
  //.
  //. > of (Function, 42) (null)
  //. 42
  //.
  //. > of (List, 42)
  //. Cons (42, Nil)
  //. ```
  function of(typeRep, x) {
    return Applicative.methods.of (typeRep) (x);
  }

  //# append :: (Applicative f, Semigroup (f a)) => (a, f a) -> f a
  //.
  //. Returns the result of appending the first argument to the second.
  //.
  //. This function is derived from [`concat`](#concat) and [`of`](#of).
  //.
  //. See also [`prepend`](#prepend).
  //.
  //. ```javascript
  //. > append (3, [1, 2])
  //. [1, 2, 3]
  //.
  //. > append (3, Cons (1, Cons (2, Nil)))
  //. Cons (1, Cons (2, Cons (3, Nil)))
  //. ```
  function append(x, xs) {
    return concat (xs, of (xs.constructor, x));
  }

  //# prepend :: (Applicative f, Semigroup (f a)) => (a, f a) -> f a
  //.
  //. Returns the result of prepending the first argument to the second.
  //.
  //. This function is derived from [`concat`](#concat) and [`of`](#of).
  //.
  //. See also [`append`](#append).
  //.
  //. ```javascript
  //. > prepend (1, [2, 3])
  //. [1, 2, 3]
  //.
  //. > prepend (1, Cons (2, Cons (3, Nil)))
  //. Cons (1, Cons (2, Cons (3, Nil)))
  //. ```
  function prepend(x, xs) {
    return concat (of (xs.constructor, x), xs);
  }

  //# chain :: Chain m => (a -> m b, m a) -> m b
  //.
  //. Function wrapper for [`fantasy-land/chain`][].
  //.
  //. `fantasy-land/chain` implementations are provided for the following
  //. built-in types: Array and Function.
  //.
  //. ```javascript
  //. > chain (x => [x, x], [1, 2, 3])
  //. [1, 1, 2, 2, 3, 3]
  //.
  //. > chain (x => x % 2 == 1 ? of (List, x) : Nil,
  //. .        Cons (1, Cons (2, Cons (3, Nil))))
  //. Cons (1, Cons (3, Nil))
  //.
  //. > chain (n => s => s.slice (0, n),
  //. .        s => Math.ceil (s.length / 2))
  //. .       ('Haskell')
  //. 'Hask'
  //. ```
  function chain(f, chain_) {
    return Chain.methods.chain (chain_) (f);
  }

  //# join :: Chain m => m (m a) -> m a
  //.
  //. Removes one level of nesting from a nested monadic structure.
  //.
  //. This function is derived from [`chain`](#chain).
  //.
  //. ```javascript
  //. > join ([[1], [2], [3]])
  //. [1, 2, 3]
  //.
  //. > join ([[[1, 2, 3]]])
  //. [[1, 2, 3]]
  //.
  //. > join (Identity (Identity (1)))
  //. Identity (1)
  //. ```
  function join(chain_) {
    return chain (identity, chain_);
  }

  //# chainRec :: ChainRec m => (TypeRep m, (a -> c, b -> c, a) -> m c, a) -> m b
  //.
  //. Function wrapper for [`fantasy-land/chainRec`][].
  //.
  //. `fantasy-land/chainRec` implementations are provided for the following
  //. built-in types: Array.
  //.
  //. ```javascript
  //. > chainRec (
  //. .   Array,
  //. .   (next, done, s) => s.length == 2 ? [s + '!', s + '?'].map (done)
  //. .                                    : [s + 'o', s + 'n'].map (next),
  //. .   ''
  //. . )
  //. ['oo!', 'oo?', 'on!', 'on?', 'no!', 'no?', 'nn!', 'nn?']
  //. ```
  function chainRec(typeRep, f, x) {
    return ChainRec.methods.chainRec (typeRep) (f, x);
  }

  //# alt :: Alt f => (f a, f a) -> f a
  //.
  //. Function wrapper for [`fantasy-land/alt`][].
  //.
  //. `fantasy-land/alt` implementations are provided for the following
  //. built-in types: Array and Object.
  //.
  //. ```javascript
  //. > alt ([1, 2, 3], [4, 5, 6])
  //. [1, 2, 3, 4, 5, 6]
  //.
  //. > alt (Nothing, Nothing)
  //. Nothing
  //.
  //. > alt (Nothing, Just (1))
  //. Just (1)
  //.
  //. > alt (Just (2), Just (3))
  //. Just (2)
  //. ```
  function alt(x, y) {
    return Alt.methods.alt (x) (y);
  }

  //# zero :: Plus f => TypeRep f -> f a
  //.
  //. Function wrapper for [`fantasy-land/zero`][].
  //.
  //. `fantasy-land/zero` implementations are provided for the following
  //. built-in types: Array and Object.
  //.
  //. ```javascript
  //. > zero (Array)
  //. []
  //.
  //. > zero (Object)
  //. {}
  //.
  //. > zero (Maybe)
  //. Nothing
  //. ```
  function zero(typeRep) {
    return Plus.methods.zero (typeRep) ();
  }

  //# reduce :: Foldable f => ((b, a) -> b, b, f a) -> b
  //.
  //. Function wrapper for [`fantasy-land/reduce`][].
  //.
  //. `fantasy-land/reduce` implementations are provided for the following
  //. built-in types: Array and Object.
  //.
  //. ```javascript
  //. > reduce ((xs, x) => [x].concat (xs), [], [1, 2, 3])
  //. [3, 2, 1]
  //.
  //. > reduce (concat, '', Cons ('foo', Cons ('bar', Cons ('baz', Nil))))
  //. 'foobarbaz'
  //. ```
  function reduce(f, x, foldable) {
    return Foldable.methods.reduce (foldable) (f, x);
  }

  //# size :: Foldable f => f a -> Integer
  //.
  //. Returns the number of elements of the given structure.
  //.
  //. This function is derived from [`reduce`](#reduce).
  //.
  //. ```javascript
  //. > size ([])
  //. 0
  //.
  //. > size (['foo', 'bar', 'baz'])
  //. 3
  //.
  //. > size (Nil)
  //. 0
  //.
  //. > size (Cons ('foo', Cons ('bar', Cons ('baz', Nil))))
  //. 3
  //. ```
  function size(foldable) {
    //  Fast path for arrays.
    if (Array.isArray (foldable)) return foldable.length;
    return reduce (function(n, _) { return n + 1; }, 0, foldable);
  }

  //# all :: Foldable f => (a -> Boolean, f a) -> Boolean
  //.
  //. Returns `true` if all the elements of the structure satisfy the
  //. predicate; `false` otherwise.
  //.
  //. This function is derived from [`reduce`](#reduce).
  //.
  //. See also [`any`](#any) and [`none`](#none).
  //.
  //. ```javascript
  //. > all (Number.isInteger, [])
  //. true
  //.
  //. > all (Number.isInteger, [1, 2, 3])
  //. true
  //.
  //. > all (Number.isInteger, [0, 0.25, 0.5, 0.75, 1])
  //. false
  //. ```
  function all(pred, foldable) {
    //  Fast path for arrays.
    if (Array.isArray (foldable)) return foldable.every (unary (pred));
    return reduce (function(b, x) { return b && pred (x); }, true, foldable);
  }

  //# any :: Foldable f => (a -> Boolean, f a) -> Boolean
  //.
  //. Returns `true` if any element of the structure satisfies the predicate;
  //. `false` otherwise.
  //.
  //. This function is derived from [`reduce`](#reduce).
  //.
  //. See also [`all`](#all) and [`none`](#none).
  //.
  //. ```javascript
  //. > any (Number.isInteger, [])
  //. false
  //.
  //. > any (Number.isInteger, [1, 2, 3])
  //. true
  //.
  //. > any (Number.isInteger, [0, 0.25, 0.5, 0.75, 1])
  //. true
  //. ```
  function any(pred, foldable) {
    //  Fast path for arrays.
    if (Array.isArray (foldable)) return foldable.some (unary (pred));
    return reduce (function(b, x) { return b || pred (x); }, false, foldable);
  }

  //# none :: Foldable f => (a -> Boolean, f a) -> Boolean
  //.
  //. Returns `true` if none of the elements of the structure satisfies the
  //. predicate; `false` otherwise.
  //.
  //. This function is derived from [`any`](#any). `none (pred, foldable)` is
  //. equivalent to `!(any (pred, foldable))`.
  //.
  //. See also [`all`](#all).
  //.
  //. ```javascript
  //. > none (Number.isInteger, [])
  //. true
  //.
  //. > none (Number.isInteger, [0, 0.25, 0.5, 0.75, 1])
  //. false
  //. ```
  function none(pred, foldable) {
    return !(any (pred, foldable));
  }

  //# elem :: (Setoid a, Foldable f) => (a, f a) -> Boolean
  //.
  //. Takes a value and a structure and returns `true` if the
  //. value is an element of the structure; `false` otherwise.
  //.
  //. This function is derived from [`equals`](#equals) and
  //. [`reduce`](#reduce).
  //.
  //. ```javascript
  //. > elem ('c', ['a', 'b', 'c'])
  //. true
  //.
  //. > elem ('x', ['a', 'b', 'c'])
  //. false
  //.
  //. > elem (3, {x: 1, y: 2, z: 3})
  //. true
  //.
  //. > elem (8, {x: 1, y: 2, z: 3})
  //. false
  //.
  //. > elem (0, Just (0))
  //. true
  //.
  //. > elem (0, Just (1))
  //. false
  //.
  //. > elem (0, Nothing)
  //. false
  //. ```
  function elem(x, foldable) {
    return any (function(y) { return equals (x, y); }, foldable);
  }

  //# foldMap :: (Monoid m, Foldable f) => (TypeRep m, a -> m, f a) -> m
  //.
  //. Deconstructs a foldable by mapping every element to a monoid and
  //. concatenating the results.
  //.
  //. This function is derived from [`concat`](#concat), [`empty`](#empty),
  //. and [`reduce`](#reduce).
  //.
  //. ```javascript
  //. > foldMap (String, f => f.name, [Math.sin, Math.cos, Math.tan])
  //. 'sincostan'
  //. ```
  function foldMap(typeRep, f, foldable) {
    return reduce (function(monoid, x) { return concat (monoid, f (x)); },
                   empty (typeRep),
                   foldable);
  }

  //# reverse :: (Applicative f, Foldable f, Monoid (f a)) => f a -> f a
  //.
  //. Reverses the elements of the given structure.
  //.
  //. This function is derived from [`concat`](#concat), [`empty`](#empty),
  //. [`of`](#of), and [`reduce`](#reduce).
  //.
  //. ```javascript
  //. > reverse ([1, 2, 3])
  //. [3, 2, 1]
  //.
  //. > reverse (Cons (1, Cons (2, Cons (3, Nil))))
  //. Cons (3, Cons (2, Cons (1, Nil)))
  //. ```
  function reverse(foldable) {
    //  Fast path for arrays.
    if (Array.isArray (foldable)) return (foldable.slice ()).reverse ();
    var F = foldable.constructor;
    return reduce (function(xs, x) { return concat (of (F, x), xs); },
                   empty (F),
                   foldable);
  }

  //# sort :: (Ord a, Applicative f, Foldable f, Monoid (f a)) => f a -> f a
  //.
  //. Performs a [stable sort][] of the elements of the given structure,
  //. using [`lte`](#lte) for comparisons.
  //.
  //. This function is derived from [`lte`](#lte), [`concat`](#concat),
  //. [`empty`](#empty), [`of`](#of), and [`reduce`](#reduce).
  //.
  //. See also [`sortBy`](#sortBy).
  //.
  //. ```javascript
  //. > sort (['foo', 'bar', 'baz'])
  //. ['bar', 'baz', 'foo']
  //.
  //. > sort ([Just (2), Nothing, Just (1)])
  //. [Nothing, Just (1), Just (2)]
  //.
  //. > sort (Cons ('foo', Cons ('bar', Cons ('baz', Nil))))
  //. Cons ('bar', Cons ('baz', Cons ('foo', Nil)))
  //. ```
  function sort(foldable) {
    return sortBy (identity, foldable);
  }

  //# sortBy :: (Ord b, Applicative f, Foldable f, Monoid (f a)) => (a -> b, f a) -> f a
  //.
  //. Performs a [stable sort][] of the elements of the given structure,
  //. using [`lte`](#lte) to compare the values produced by applying the
  //. given function to each element of the structure.
  //.
  //. This function is derived from [`lte`](#lte), [`concat`](#concat),
  //. [`empty`](#empty), [`of`](#of), and [`reduce`](#reduce).
  //.
  //. See also [`sort`](#sort).
  //.
  //. ```javascript
  //. > sortBy (s => s.length, ['red', 'green', 'blue'])
  //. ['red', 'blue', 'green']
  //.
  //. > sortBy (s => s.length, ['black', 'white'])
  //. ['black', 'white']
  //.
  //. > sortBy (s => s.length, ['white', 'black'])
  //. ['white', 'black']
  //.
  //. > sortBy (s => s.length, Cons ('red', Cons ('green', Cons ('blue', Nil))))
  //. Cons ('red', Cons ('blue', Cons ('green', Nil)))
  //. ```
  function sortBy(f, foldable) {
    var rs = reduce (function(rs, x) {
      rs.push ({idx: rs.length, x: x, fx: f (x)});
      return rs;
    }, [], foldable);

    var lte_ = (function(r) {
      switch (typeof (r && r.fx)) {
        case 'number':  return function(x, y) { return x <= y || x !== x; };
        case 'string':  return function(x, y) { return x <= y; };
        default:        return lte;
      }
    } (rs[0]));

    rs.sort (function(a, b) {
      return lte_ (a.fx, b.fx) ? lte_ (b.fx, a.fx) ? a.idx - b.idx : -1 : 1;
    });

    if (Array.isArray (foldable)) {
      for (var idx = 0; idx < rs.length; idx += 1) rs[idx] = rs[idx].x;
      return rs;
    }

    var F = foldable.constructor;
    var result = empty (F);
    for (idx = 0; idx < rs.length; idx += 1) {
      result = concat (result, of (F, rs[idx].x));
    }
    return result;
  }

  //# traverse :: (Applicative f, Traversable t) => (TypeRep f, a -> f b, t a) -> f (t b)
  //.
  //. Function wrapper for [`fantasy-land/traverse`][].
  //.
  //. `fantasy-land/traverse` implementations are provided for the following
  //. built-in types: Array and Object.
  //.
  //. See also [`sequence`](#sequence).
  //.
  //. ```javascript
  //. > traverse (Array, x => x, [[1, 2, 3], [4, 5]])
  //. [[1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5]]
  //.
  //. > traverse (Identity, x => Identity (x + 1), [1, 2, 3])
  //. Identity ([2, 3, 4])
  //. ```
  function traverse(typeRep, f, traversable) {
    return Traversable.methods.traverse (traversable) (typeRep, f);
  }

  //# sequence :: (Applicative f, Traversable t) => (TypeRep f, t (f a)) -> f (t a)
  //.
  //. Inverts the given `t (f a)` to produce an `f (t a)`.
  //.
  //. This function is derived from [`traverse`](#traverse).
  //.
  //. ```javascript
  //. > sequence (Array, Identity ([1, 2, 3]))
  //. [Identity (1), Identity (2), Identity (3)]
  //.
  //. > sequence (Identity, [Identity (1), Identity (2), Identity (3)])
  //. Identity ([1, 2, 3])
  //. ```
  function sequence(typeRep, traversable) {
    return traverse (typeRep, identity, traversable);
  }

  //# extend :: Extend w => (w a -> b, w a) -> w b
  //.
  //. Function wrapper for [`fantasy-land/extend`][].
  //.
  //. `fantasy-land/extend` implementations are provided for the following
  //. built-in types: Array and Function.
  //.
  //. ```javascript
  //. > extend (ss => ss.join (''), ['x', 'y', 'z'])
  //. ['xyz', 'yz', 'z']
  //.
  //. > extend (f => f ([3, 4]), reverse) ([1, 2])
  //. [4, 3, 2, 1]
  //. ```
  function extend(f, extend_) {
    return Extend.methods.extend (extend_) (f);
  }

  //# duplicate :: Extend w => w a -> w (w a)
  //.
  //. Adds one level of nesting to a comonadic structure.
  //.
  //. This function is derived from [`extend`](#extend).
  //.
  //. ```javascript
  //. > duplicate (Identity (1))
  //. Identity (Identity (1))
  //.
  //. > duplicate ([1])
  //. [[1]]
  //.
  //. > duplicate ([1, 2, 3])
  //. [[1, 2, 3], [2, 3], [3]]
  //.
  //. > duplicate (reverse) ([1, 2]) ([3, 4])
  //. [4, 3, 2, 1]
  //. ```
  function duplicate(extend_) {
    return extend (identity, extend_);
  }

  //# extract :: Comonad w => w a -> a
  //.
  //. Function wrapper for [`fantasy-land/extract`][].
  //.
  //. ```javascript
  //. > extract (Identity (42))
  //. 42
  //. ```
  function extract(comonad) {
    return Comonad.methods.extract (comonad) ();
  }

  //# contramap :: Contravariant f => (b -> a, f a) -> f b
  //.
  //. Function wrapper for [`fantasy-land/contramap`][].
  //.
  //. `fantasy-land/contramap` implementations are provided for the following
  //. built-in types: Function.
  //.
  //. ```javascript
  //. > contramap (s => s.length, Math.sqrt) ('Sanctuary')
  //. 3
  //. ```
  function contramap(f, contravariant) {
    return Contravariant.methods.contramap (contravariant) (f);
  }

  return {
    TypeClass: TypeClass,
    Setoid: Setoid,
    Ord: Ord,
    Semigroupoid: Semigroupoid,
    Category: Category,
    Semigroup: Semigroup,
    Monoid: Monoid,
    Group: Group,
    Filterable: Filterable,
    Functor: Functor,
    Bifunctor: Bifunctor,
    Profunctor: Profunctor,
    Apply: Apply,
    Applicative: Applicative,
    Chain: Chain,
    ChainRec: ChainRec,
    Monad: Monad,
    Alt: Alt,
    Plus: Plus,
    Alternative: Alternative,
    Foldable: Foldable,
    Traversable: Traversable,
    Extend: Extend,
    Comonad: Comonad,
    Contravariant: Contravariant,
    equals: equals,
    lt: lt,
    lte: lte,
    gt: gt,
    gte: gte,
    min: min,
    max: max,
    clamp: clamp,
    compose: compose,
    id: id,
    concat: concat,
    empty: empty,
    invert: invert,
    filter: filter,
    reject: reject,
    map: map,
    flip: flip,
    bimap: bimap,
    mapLeft: mapLeft,
    promap: promap,
    ap: ap,
    lift2: lift2,
    lift3: lift3,
    apFirst: apFirst,
    apSecond: apSecond,
    of: of,
    append: append,
    prepend: prepend,
    chain: chain,
    join: join,
    chainRec: chainRec,
    alt: alt,
    zero: zero,
    reduce: reduce,
    size: size,
    all: all,
    any: any,
    none: none,
    elem: elem,
    foldMap: foldMap,
    reverse: reverse,
    sort: sort,
    sortBy: sortBy,
    traverse: traverse,
    sequence: sequence,
    extend: extend,
    duplicate: duplicate,
    extract: extract,
    contramap: contramap
  };

}));

//. [Alt]:                      v:fantasyland/fantasy-land#alt
//. [Alternative]:              v:fantasyland/fantasy-land#alternative
//. [Applicative]:              v:fantasyland/fantasy-land#applicative
//. [Apply]:                    v:fantasyland/fantasy-land#apply
//. [Bifunctor]:                v:fantasyland/fantasy-land#bifunctor
//. [Category]:                 v:fantasyland/fantasy-land#category
//. [Chain]:                    v:fantasyland/fantasy-land#chain
//. [ChainRec]:                 v:fantasyland/fantasy-land#chainrec
//. [Comonad]:                  v:fantasyland/fantasy-land#comonad
//. [Contravariant]:            v:fantasyland/fantasy-land#contravariant
//. [Extend]:                   v:fantasyland/fantasy-land#extend
//. [FL]:                       v:fantasyland/fantasy-land
//. [Filterable]:               v:fantasyland/fantasy-land#filterable
//. [Foldable]:                 v:fantasyland/fantasy-land#foldable
//. [Functor]:                  v:fantasyland/fantasy-land#functor
//. [Group]:                    v:fantasyland/fantasy-land#group
//. [Monad]:                    v:fantasyland/fantasy-land#monad
//. [Monoid]:                   v:fantasyland/fantasy-land#monoid
//. [Ord]:                      v:fantasyland/fantasy-land#ord
//. [Plus]:                     v:fantasyland/fantasy-land#plus
//. [Profunctor]:               v:fantasyland/fantasy-land#profunctor
//. [Semigroup]:                v:fantasyland/fantasy-land#semigroup
//. [Semigroupoid]:             v:fantasyland/fantasy-land#semigroupoid
//. [Setoid]:                   v:fantasyland/fantasy-land#setoid
//. [Traversable]:              v:fantasyland/fantasy-land#traversable
//. [`fantasy-land/alt`]:       v:fantasyland/fantasy-land#alt-method
//. [`fantasy-land/ap`]:        v:fantasyland/fantasy-land#ap-method
//. [`fantasy-land/bimap`]:     v:fantasyland/fantasy-land#bimap-method
//. [`fantasy-land/chain`]:     v:fantasyland/fantasy-land#chain-method
//. [`fantasy-land/chainRec`]:  v:fantasyland/fantasy-land#chainrec-method
//. [`fantasy-land/compose`]:   v:fantasyland/fantasy-land#compose-method
//. [`fantasy-land/concat`]:    v:fantasyland/fantasy-land#concat-method
//. [`fantasy-land/contramap`]: v:fantasyland/fantasy-land#contramap-method
//. [`fantasy-land/empty`]:     v:fantasyland/fantasy-land#empty-method
//. [`fantasy-land/equals`]:    v:fantasyland/fantasy-land#equals-method
//. [`fantasy-land/extend`]:    v:fantasyland/fantasy-land#extend-method
//. [`fantasy-land/extract`]:   v:fantasyland/fantasy-land#extract-method
//. [`fantasy-land/filter`]:    v:fantasyland/fantasy-land#filter-method
//. [`fantasy-land/id`]:        v:fantasyland/fantasy-land#id-method
//. [`fantasy-land/invert`]:    v:fantasyland/fantasy-land#invert-method
//. [`fantasy-land/lte`]:       v:fantasyland/fantasy-land#lte-method
//. [`fantasy-land/map`]:       v:fantasyland/fantasy-land#map-method
//. [`fantasy-land/of`]:        v:fantasyland/fantasy-land#of-method
//. [`fantasy-land/promap`]:    v:fantasyland/fantasy-land#promap-method
//. [`fantasy-land/reduce`]:    v:fantasyland/fantasy-land#reduce-method
//. [`fantasy-land/traverse`]:  v:fantasyland/fantasy-land#traverse-method
//. [`fantasy-land/zero`]:      v:fantasyland/fantasy-land#zero-method
//. [stable sort]:              https://en.wikipedia.org/wiki/Sorting_algorithm#Stability
//. [type-classes]:             https://github.com/sanctuary-js/sanctuary-def#type-classes
