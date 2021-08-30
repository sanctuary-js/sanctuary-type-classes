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

(f => {

  'use strict';

  /* istanbul ignore else */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = f (require ('sanctuary-type-identifiers'));
  } else if (typeof define === 'function' && define.amd != null) {
    define (['sanctuary-type-identifiers'], f);
  } else {
    self.sanctuaryTypeClasses = f (self.sanctuaryTypeIdentifiers);
  }

}) (type => {

  'use strict';

  /* istanbul ignore if */
  if (typeof __doctest !== 'undefined') {
    /* eslint-disable no-unused-vars, no-var */
    var Identity = __doctest.require ('sanctuary-identity');
    var List = __doctest.require ('./test/List');
    var Maybe = __doctest.require ('sanctuary-maybe');
    var Pair = __doctest.require ('sanctuary-pair');
    var Sum = __doctest.require ('./test/Sum');
    var Useless = __doctest.require ('sanctuary-useless');

    var {Nil, Cons} = List;
    var {Nothing, Just} = Maybe;
    /* eslint-enable no-unused-vars, no-var */
  }

  //  concat :: Array a -> Array a -> Array a
  const concat = xs => ys => xs.concat (ys);

  //  has :: (String, Object) -> Boolean
  const has = (k, o) => Object.prototype.hasOwnProperty.call (o, k);

  //  identity :: a -> a
  const identity = x => x;

  //  nameProp :: { name :: a } -> a
  const nameProp = x => x.name;

  //  pair :: a -> b -> Array2 a b
  const pair = x => y => [x, y];

  //  sameType :: (a, b) -> Boolean
  const sameType = (x, y) => typeof x === typeof y && type (x) === type (y);

  //  sortedKeys :: Object -> Array String
  const sortedKeys = o => (Object.keys (o)).sort ();

  //  type Iteration a = { value :: a, done :: Boolean }

  //  iterationNext :: a -> Iteration a
  const iterationNext = x => ({value: x, done: false});

  //  iterationDone :: a -> Iteration a
  const iterationDone = x => ({value: x, done: true});

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
      Z.equals (this.valueOf (), other.valueOf ()) :
      this === other;
  }

  //  Boolean$prototype$lte :: Boolean ~> Boolean -> Boolean
  function Boolean$prototype$lte(other) {
    return typeof this === 'object' ?
      Z.lte (this.valueOf (), other.valueOf ()) :
      this === false || other === true;
  }

  //  Number$prototype$equals :: Number ~> Number -> Boolean
  function Number$prototype$equals(other) {
    return typeof this === 'object' ?
      Z.equals (this.valueOf (), other.valueOf ()) :
      isNaN (this) && isNaN (other) || this === other;
  }

  //  Number$prototype$lte :: Number ~> Number -> Boolean
  function Number$prototype$lte(other) {
    return typeof this === 'object' ?
      Z.lte (this.valueOf (), other.valueOf ()) :
      isNaN (this) || this <= other;
  }

  //  Date$prototype$equals :: Date ~> Date -> Boolean
  function Date$prototype$equals(other) {
    return Z.equals (this.valueOf (), other.valueOf ());
  }

  //  Date$prototype$lte :: Date ~> Date -> Boolean
  function Date$prototype$lte(other) {
    return Z.lte (this.valueOf (), other.valueOf ());
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
  const String$empty = () => '';

  //  String$prototype$equals :: String ~> String -> Boolean
  function String$prototype$equals(other) {
    return typeof this === 'object' ?
      Z.equals (this.valueOf (), other.valueOf ()) :
      this === other;
  }

  //  String$prototype$lte :: String ~> String -> Boolean
  function String$prototype$lte(other) {
    return typeof this === 'object' ?
      Z.lte (this.valueOf (), other.valueOf ()) :
      this <= other;
  }

  //  String$prototype$concat :: String ~> String -> String
  function String$prototype$concat(other) {
    return this + other;
  }

  //  Array$empty :: () -> Array a
  const Array$empty = () => [];

  //  Array$of :: a -> Array a
  const Array$of = x => [x];

  //  Array$chainRec :: ((a -> c, b -> c, a) -> Array c, a) -> Array b
  const Array$chainRec = (f, x) => {
    const result = [];
    const nil = {};
    let todo = {head: x, tail: nil};
    while (todo !== nil) {
      let more = nil;
      const steps = f (iterationNext, iterationDone, todo.head);
      for (let idx = 0; idx < steps.length; idx += 1) {
        const step = steps[idx];
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
  };

  //  Array$zero :: () -> Array a
  const Array$zero = () => [];

  //  Array$prototype$equals :: Setoid a => Array a ~> Array a -> Boolean
  function Array$prototype$equals(other) {
    if (other.length !== this.length) return false;
    for (let idx = 0; idx < this.length; idx += 1) {
      if (!(Z.equals (this[idx], other[idx]))) return false;
    }
    return true;
  }

  //  Array$prototype$lte :: Ord a => Array a ~> Array a -> Boolean
  function Array$prototype$lte(other) {
    for (let idx = 0; true; idx += 1) {
      if (idx === this.length) return true;
      if (idx === other.length) return false;
      if (!(Z.equals (this[idx], other[idx]))) {
        return Z.lte (this[idx], other[idx]);
      }
    }
  }

  //  Array$prototype$concat :: Array a ~> Array a -> Array a
  function Array$prototype$concat(other) {
    return this.concat (other);
  }

  //  Array$prototype$filter :: Array a ~> (a -> Boolean) -> Array a
  function Array$prototype$filter(pred) {
    return this.filter (x => pred (x));
  }

  //  Array$prototype$map :: Array a ~> (a -> b) -> Array b
  function Array$prototype$map(f) {
    return this.map (x => f (x));
  }

  //  Array$prototype$ap :: Array a ~> Array (a -> b) -> Array b
  function Array$prototype$ap(fs) {
    const result = [];
    for (let idx = 0; idx < fs.length; idx += 1) {
      for (let idx2 = 0; idx2 < this.length; idx2 += 1) {
        result.push (fs[idx] (this[idx2]));
      }
    }
    return result;
  }

  //  Array$prototype$chain :: Array a ~> (a -> Array b) -> Array b
  function Array$prototype$chain(f) {
    const result = [];
    for (let idx = 0; idx < this.length; idx += 1) {
      for (let idx2 = 0, xs = f (this[idx]); idx2 < xs.length; idx2 += 1) {
        result.push (xs[idx2]);
      }
    }
    return result;
  }

  //  Array$prototype$alt :: Array a ~> Array a -> Array a
  const Array$prototype$alt = Array$prototype$concat;

  //  Array$prototype$reduce :: Array a ~> ((b, a) -> b, b) -> b
  function Array$prototype$reduce(f, initial) {
    let acc = initial;
    for (let idx = 0; idx < this.length; idx += 1) acc = f (acc, this[idx]);
    return acc;
  }

  //  Array$prototype$traverse :: Applicative f => Array a ~> (TypeRep f, a -> f b) -> f (Array b)
  function Array$prototype$traverse(typeRep, f) {
    const go = (idx, n) => {
      switch (n) {
        case 0: return Z.of (typeRep, []);
        case 2: return Z.lift2 (pair, f (this[idx]), f (this[idx + 1]));
        default: {
          const m = Math.floor (n / 4) * 2;
          return Z.lift2 (concat, go (idx, m), go (idx + m, n - m));
        }
      }
    };
    return this.length % 2 === 1 ?
      Z.lift2 (
        concat,
        Z.map (Array$of, f (this[0])), go (1, this.length - 1)
      ) :
      go (0, this.length);
  }

  //  Array$prototype$extend :: Array a ~> (Array a -> b) -> Array b
  function Array$prototype$extend(f) {
    return this.map ((_, idx, xs) => f (xs.slice (idx)));
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
    return Z.equals (this.name, other.name) &&
           Z.equals (this.message, other.message);
  }

  //  Object$empty :: () -> StrMap a
  const Object$empty = () => ({});

  //  Object$zero :: () -> StrMap a
  const Object$zero = () => ({});

  //  Object$prototype$equals :: Setoid a => StrMap a ~> StrMap a -> Boolean
  function Object$prototype$equals(other) {
    const keys = sortedKeys (this);
    return Z.equals (keys, sortedKeys (other)) &&
           keys.every (k => Z.equals (this[k], other[k]));
  }

  //  Object$prototype$lte :: Ord a => StrMap a ~> StrMap a -> Boolean
  function Object$prototype$lte(other) {
    const theseKeys = sortedKeys (this);
    const otherKeys = sortedKeys (other);
    while (true) {
      if (theseKeys.length === 0) return true;
      if (otherKeys.length === 0) return false;
      const k = theseKeys.shift ();
      const z = otherKeys.shift ();
      if (k < z) return true;
      if (k > z) return false;
      if (!(Z.equals (this[k], other[k]))) return Z.lte (this[k], other[k]);
    }
  }

  //  Object$prototype$concat :: StrMap a ~> StrMap a -> StrMap a
  function Object$prototype$concat(other) {
    const result = {};
    (Object.keys (this)).forEach (k => { result[k] = this[k]; });
    (Object.keys (other)).forEach (k => { result[k] = other[k]; });
    return result;
  }

  //  Object$prototype$filter :: StrMap a ~> (a -> Boolean) -> StrMap a
  function Object$prototype$filter(pred) {
    const result = {};
    (Object.keys (this)).forEach (k => {
      if (pred (this[k])) result[k] = this[k];
    });
    return result;
  }

  //  Object$prototype$map :: StrMap a ~> (a -> b) -> StrMap b
  function Object$prototype$map(f) {
    const result = {};
    (Object.keys (this)).forEach (k => { result[k] = f (this[k]); });
    return result;
  }

  //  Object$prototype$ap :: StrMap a ~> StrMap (a -> b) -> StrMap b
  function Object$prototype$ap(other) {
    const result = {};
    (Object.keys (this)).forEach (k => {
      if (has (k, other)) result[k] = other[k] (this[k]);
    });
    return result;
  }

  //  Object$prototype$alt :: StrMap a ~> StrMap a -> StrMap a
  const Object$prototype$alt = Object$prototype$concat;

  //  Object$prototype$reduce :: StrMap a ~> ((b, a) -> b, b) -> b
  function Object$prototype$reduce(f, initial) {
    return sortedKeys (this)
           .reduce ((acc, k) => f (acc, this[k]), initial);
  }

  //  Object$prototype$traverse :: Applicative f => StrMap a ~> (TypeRep f, a -> f b) -> f (StrMap b)
  function Object$prototype$traverse(typeRep, f) {
    return Object.keys (this)
           .reduce (
             (applicative, k) => (
               Z.lift2 (
                 o => v => Object$prototype$concat.call (o, {[k]: v}),
                 applicative,
                 f (this[k])
               )
             ),
             Z.of (typeRep, {})
           );
  }

  //  Function$id :: () -> a -> a
  const Function$id = () => identity;

  //  Function$of :: b -> (a -> b)
  const Function$of = x => _ => x;

  //  Function$chainRec :: ((a -> c, b -> c, a) -> (z -> c), a) -> (z -> b)
  const Function$chainRec = (f, x) => a => {
    let step = iterationNext (x);
    while (!step.done) step = f (iterationNext, iterationDone, step.value) (a);
    return step.value;
  };

  //  Function$prototype$equals :: Function ~> Function -> Boolean
  function Function$prototype$equals(other) {
    return other === this;
  }

  //  Function$prototype$compose :: (a -> b) ~> (b -> c) -> (a -> c)
  function Function$prototype$compose(other) {
    return x => other (this (x));
  }

  //  Function$prototype$map :: (a -> b) ~> (b -> c) -> (a -> c)
  function Function$prototype$map(f) {
    return x => f (this (x));
  }

  //  Function$prototype$promap :: (b -> c) ~> (a -> b, c -> d) -> (a -> d)
  function Function$prototype$promap(f, g) {
    return x => g (this (f (x)));
  }

  //  Function$prototype$ap :: (a -> b) ~> (a -> b -> c) -> (a -> c)
  function Function$prototype$ap(f) {
    return x => f (x) (this (x));
  }

  //  Function$prototype$chain :: (a -> b) ~> (b -> a -> c) -> (a -> c)
  function Function$prototype$chain(f) {
    return x => f (this (x)) (x);
  }

  //  Function$prototype$extend :: Semigroup a => (a -> b) ~> ((a -> b) -> c) -> (a -> c)
  function Function$prototype$extend(f) {
    return x => f (y => this (Z.concat (x, y)));
  }

  //  Function$prototype$contramap :: (b -> c) ~> (a -> b) -> (a -> c)
  function Function$prototype$contramap(f) {
    return x => this (f (x));
  }

  const staticImplementations = {
    String: {
      empty: String$empty,
    },
    Array: {
      empty: Array$empty,
      of: Array$of,
      chainRec: Array$chainRec,
      zero: Array$zero,
    },
    Object: {
      empty: Object$empty,
      zero: Object$zero,
    },
    Function: {
      id: Function$id,
      of: Function$of,
      chainRec: Function$chainRec,
    },
  };

  const staticMethod = (name, typeRep) => {
    switch (typeRep) {
      case String: return staticImplementations.String[name];
      case Array: return staticImplementations.Array[name];
      case Object: return staticImplementations.Object[name];
      case Function: return staticImplementations.Function[name];
    }

    const prefixedName = 'fantasy-land/' + name;
    if (typeof typeRep[prefixedName] === 'function') {
      return typeRep[prefixedName];
    }

    switch (typeRep.name) {
      case 'String': return staticImplementations.String[name];
      case 'Array': return staticImplementations.Array[name];
      case 'Object': return staticImplementations.Object[name];
      case 'Function': return staticImplementations.Function[name];
    }
  };

  const prototypeImplementations = {
    Null: {
      equals: Null$prototype$equals,
      lte: Null$prototype$lte,
    },
    Undefined: {
      equals: Undefined$prototype$equals,
      lte: Undefined$prototype$lte,
    },
    Boolean: {
      equals: Boolean$prototype$equals,
      lte: Boolean$prototype$lte,
    },
    Number: {
      equals: Number$prototype$equals,
      lte: Number$prototype$lte,
    },
    Date: {
      equals: Date$prototype$equals,
      lte: Date$prototype$lte,
    },
    RegExp: {
      equals: RegExp$prototype$equals,
    },
    String: {
      equals: String$prototype$equals,
      lte: String$prototype$lte,
      concat: String$prototype$concat,
    },
    Array: {
      equals: Array$prototype$equals,
      lte: Array$prototype$lte,
      concat: Array$prototype$concat,
      filter: Array$prototype$filter,
      map: Array$prototype$map,
      ap: Array$prototype$ap,
      chain: Array$prototype$chain,
      alt: Array$prototype$alt,
      reduce: Array$prototype$reduce,
      traverse: Array$prototype$traverse,
      extend: Array$prototype$extend,
    },
    Arguments: {
      equals: Arguments$prototype$equals,
      lte: Arguments$prototype$lte,
    },
    Error: {
      equals: Error$prototype$equals,
    },
    Object: {
      equals: Object$prototype$equals,
      lte: Object$prototype$lte,
      concat: Object$prototype$concat,
      filter: Object$prototype$filter,
      map: Object$prototype$map,
      ap: Object$prototype$ap,
      alt: Object$prototype$alt,
      reduce: Object$prototype$reduce,
      traverse: Object$prototype$traverse,
    },
    Function: {
      equals: Function$prototype$equals,
      compose: Function$prototype$compose,
      map: Function$prototype$map,
      promap: Function$prototype$promap,
      ap: Function$prototype$ap,
      chain: Function$prototype$chain,
      extend: Function$prototype$extend,
      contramap: Function$prototype$contramap,
    },
  };

  const hasPrototypeMethod = (name, value) => {
    switch (value) {
      case null: return prototypeImplementations.Null[name] != null;
      case undefined: return prototypeImplementations.Undefined[name] != null;
    }

    const prefixedName = 'fantasy-land/' + name;
    const isPrototype = value.constructor == null ||
                        value.constructor.prototype !== value;
    if (isPrototype && typeof value[prefixedName] === 'function') {
      return true;
    }

    if (typeof value['@@type'] === 'string') return false;

    if (name === 'equals') {
      if (value.constructor === Array || type (value) === 'Array') {
        return value.every (Z.Setoid.test);
      }

      if (value.constructor === Object || type (value) === 'Object') {
        return (Object.values (value)).every (Z.Setoid.test);
      }
    }

    if (name === 'lte') {
      if (value.constructor === Array || type (value) === 'Array') {
        return value.every (Z.Ord.test);
      }

      if (value.constructor === Object || type (value) === 'Object') {
        return (Object.values (value)).every (Z.Ord.test);
      }
    }

    return customPrototypeMethod (name, value) != null;
  };

  const prototypeMethod = (name, value) => {
    // Single-member types are identified most quickly.
    switch (value) {
      case null: return prototypeImplementations.Null[name];
      case undefined: return prototypeImplementations.Undefined[name];
    }

    // Check if we can dispatch to a Fantasy Land method.
    const prefixedName = 'fantasy-land/' + name;
    const isPrototype = value.constructor == null ||
                        value.constructor.prototype !== value;
    if (isPrototype && typeof value[prefixedName] === 'function') {
      return value[prefixedName];
    }

    // Separate function for performance reasons.
    return customPrototypeMethod (name, value);
  };

  const customPrototypeMethod = (name, value) => {
    // Checking constructor reference has the best performance.
    switch (value.constructor) {
      case Boolean: return prototypeImplementations.Boolean[name];
      case Number: return prototypeImplementations.Number[name];
      case Date: return prototypeImplementations.Date[name];
      case RegExp: return prototypeImplementations.RegExp[name];
      case String: return prototypeImplementations.String[name];
      case Array: return prototypeImplementations.Array[name];
      case Function: return prototypeImplementations.Function[name];
    }

    // For all other values we use their type-identity.
    switch (type (value)) {
      case 'Arguments': return prototypeImplementations.Arguments[name];
      case 'Error': return prototypeImplementations.Error[name];
      case 'Object': return prototypeImplementations.Object[name];

      // A repeat of the constructor-matched values, in case they were created
      // in other contexts (e.g. vm.runInNewContext).
      case 'Boolean': return prototypeImplementations.Boolean[name];
      case 'Number': return prototypeImplementations.Number[name];
      case 'Date': return prototypeImplementations.Date[name];
      case 'RegExp': return prototypeImplementations.RegExp[name];
      case 'String': return prototypeImplementations.String[name];
      case 'Array': return prototypeImplementations.Array[name];
      case 'Function': return prototypeImplementations.Function[name];
    }
  };

  const Z = {};

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
  Z.TypeClass = (name, url, dependencies, test) => ({
    '@@type': 'sanctuary-type-classes/TypeClass@1',
    'name': name,
    'url': url,
    'test': x => dependencies.every (d => d.test (x)) && test (x),
  });

  //  data Location = Constructor | Value

  //  Constructor :: Location
  const Constructor = 'Constructor';

  //  Value :: Location
  const Value = 'Value';

  //  $ :: (String, Array TypeClass, StrMap (Array Location)) -> TypeClass
  const $ = (_name, dependencies, requirements) => {
    const version = '12.1.0';  // updated programmatically

    const staticMethods = requirements.filter (req => (
      req.location === Constructor
    ));

    const prototypeMethods = requirements.filter (req => (
      req.location === Value
    ));

    const staticMethodNames = staticMethods.map (nameProp);
    const prototypeMethodNames = prototypeMethods.map (nameProp);

    const typeClass = Z.TypeClass (
      `sanctuary-type-classes/${_name}`,
      `https://github.com/sanctuary-js/sanctuary-type-classes/tree/v${version}#${_name}`,
      dependencies,
      ($seen => x => {
        if ($seen.includes (x)) return true;

        $seen.push (x);
        try {
          return (
            staticMethodNames.every (_name => (
              x != null && staticMethod (_name, x.constructor) != null
            )) &&
            prototypeMethodNames.every (_name => hasPrototypeMethod (_name, x))
          );
        } finally {
          $seen.pop ();
        }
      }) ([])
    );

    typeClass.methods = {};

    staticMethods.forEach (method => {
      const _name = method.name;
      typeClass.methods[_name] = (
        method.arity === 0 ? typeRep => (
          staticMethod (_name, typeRep) ()
        ) :
        method.arity === 1 ? (typeRep, a) => (
          staticMethod (_name, typeRep) (a)
        ) :
        (typeRep, a, b) => (
          staticMethod (_name, typeRep) (a, b)
        )
      );
    });

    prototypeMethods.forEach (method => {
      const _name = method.name;
      typeClass.methods[_name] = (
        method.arity === 0 ? context => (
          (prototypeMethod (_name, context)).call (context)
        ) :
        method.arity === 1 ? (a, context) => (
          (prototypeMethod (_name, context)).call (context, a)
        ) :
        (a, b, context) => (
          (prototypeMethod (_name, context)).call (context, a, b)
        )
      );
    });

    return typeClass;
  };

  //# Setoid :: TypeClass
  //.
  //. `TypeClass` value for [Setoid][].
  //.
  //. ```javascript
  //. > Z.Setoid.test (null)
  //. true
  //.
  //. > Z.Setoid.test (Useless)
  //. false
  //.
  //. > Z.Setoid.test ([1, 2, 3])
  //. true
  //.
  //. > Z.Setoid.test ([Useless])
  //. false
  //. ```
  Z.Setoid = $ ('Setoid', [], [{
    name: 'equals',
    location: Value,
    arity: 1,
  }]);

  //# Ord :: TypeClass
  //.
  //. `TypeClass` value for [Ord][].
  //.
  //. ```javascript
  //. > Z.Ord.test (0)
  //. true
  //.
  //. > Z.Ord.test (Math.sqrt)
  //. false
  //.
  //. > Z.Ord.test ([1, 2, 3])
  //. true
  //.
  //. > Z.Ord.test ([Math.sqrt])
  //. false
  //. ```
  Z.Ord = $ ('Ord', [Z.Setoid], [{
    name: 'lte',
    location: Value,
    arity: 1,
  }]);

  //# Semigroupoid :: TypeClass
  //.
  //. `TypeClass` value for [Semigroupoid][].
  //.
  //. ```javascript
  //. > Z.Semigroupoid.test (Math.sqrt)
  //. true
  //.
  //. > Z.Semigroupoid.test (0)
  //. false
  //. ```
  Z.Semigroupoid = $ ('Semigroupoid', [], [{
    name: 'compose',
    location: Value,
    arity: 1,
  }]);

  //# Category :: TypeClass
  //.
  //. `TypeClass` value for [Category][].
  //.
  //. ```javascript
  //. > Z.Category.test (Math.sqrt)
  //. true
  //.
  //. > Z.Category.test (0)
  //. false
  //. ```
  Z.Category = $ ('Category', [Z.Semigroupoid], [{
    name: 'id',
    location: Constructor,
    arity: 0,
  }]);

  //# Semigroup :: TypeClass
  //.
  //. `TypeClass` value for [Semigroup][].
  //.
  //. ```javascript
  //. > Z.Semigroup.test ('')
  //. true
  //.
  //. > Z.Semigroup.test (0)
  //. false
  //. ```
  Z.Semigroup = $ ('Semigroup', [], [{
    name: 'concat',
    location: Value,
    arity: 1,
  }]);

  //# Monoid :: TypeClass
  //.
  //. `TypeClass` value for [Monoid][].
  //.
  //. ```javascript
  //. > Z.Monoid.test ('')
  //. true
  //.
  //. > Z.Monoid.test (0)
  //. false
  //. ```
  Z.Monoid = $ ('Monoid', [Z.Semigroup], [{
    name: 'empty',
    location: Constructor,
    arity: 0,
  }]);

  //# Group :: TypeClass
  //.
  //. `TypeClass` value for [Group][].
  //.
  //. ```javascript
  //. > Z.Group.test (Sum (0))
  //. true
  //.
  //. > Z.Group.test ('')
  //. false
  //. ```
  Z.Group = $ ('Group', [Z.Monoid], [{
    name: 'invert',
    location: Value,
    arity: 0,
  }]);

  //# Filterable :: TypeClass
  //.
  //. `TypeClass` value for [Filterable][].
  //.
  //. ```javascript
  //. > Z.Filterable.test ({})
  //. true
  //.
  //. > Z.Filterable.test ('')
  //. false
  //. ```
  Z.Filterable = $ ('Filterable', [], [{
    name: 'filter',
    location: Value,
    arity: 1,
  }]);

  //# Functor :: TypeClass
  //.
  //. `TypeClass` value for [Functor][].
  //.
  //. ```javascript
  //. > Z.Functor.test ([])
  //. true
  //.
  //. > Z.Functor.test ('')
  //. false
  //. ```
  Z.Functor = $ ('Functor', [], [{
    name: 'map',
    location: Value,
    arity: 1,
  }]);

  //# Bifunctor :: TypeClass
  //.
  //. `TypeClass` value for [Bifunctor][].
  //.
  //. ```javascript
  //. > Z.Bifunctor.test (Pair ('foo') (64))
  //. true
  //.
  //. > Z.Bifunctor.test ([])
  //. false
  //. ```
  Z.Bifunctor = $ ('Bifunctor', [Z.Functor], [{
    name: 'bimap',
    location: Value,
    arity: 2,
  }]);

  //# Profunctor :: TypeClass
  //.
  //. `TypeClass` value for [Profunctor][].
  //.
  //. ```javascript
  //. > Z.Profunctor.test (Math.sqrt)
  //. true
  //.
  //. > Z.Profunctor.test ([])
  //. false
  //. ```
  Z.Profunctor = $ ('Profunctor', [Z.Functor], [{
    name: 'promap',
    location: Value,
    arity: 2,
  }]);

  //# Apply :: TypeClass
  //.
  //. `TypeClass` value for [Apply][].
  //.
  //. ```javascript
  //. > Z.Apply.test ([])
  //. true
  //.
  //. > Z.Apply.test ('')
  //. false
  //. ```
  Z.Apply = $ ('Apply', [Z.Functor], [{
    name: 'ap',
    location: Value,
    arity: 1,
  }]);

  //# Applicative :: TypeClass
  //.
  //. `TypeClass` value for [Applicative][].
  //.
  //. ```javascript
  //. > Z.Applicative.test ([])
  //. true
  //.
  //. > Z.Applicative.test ({})
  //. false
  //. ```
  Z.Applicative = $ ('Applicative', [Z.Apply], [{
    name: 'of',
    location: Constructor,
    arity: 1,
  }]);

  //# Chain :: TypeClass
  //.
  //. `TypeClass` value for [Chain][].
  //.
  //. ```javascript
  //. > Z.Chain.test ([])
  //. true
  //.
  //. > Z.Chain.test ({})
  //. false
  //. ```
  Z.Chain = $ ('Chain', [Z.Apply], [{
    name: 'chain',
    location: Value,
    arity: 1,
  }]);

  //# ChainRec :: TypeClass
  //.
  //. `TypeClass` value for [ChainRec][].
  //.
  //. ```javascript
  //. > Z.ChainRec.test ([])
  //. true
  //.
  //. > Z.ChainRec.test ({})
  //. false
  //. ```
  Z.ChainRec = $ ('ChainRec', [Z.Chain], [{
    name: 'chainRec',
    location: Constructor,
    arity: 2,
  }]);

  //# Monad :: TypeClass
  //.
  //. `TypeClass` value for [Monad][].
  //.
  //. ```javascript
  //. > Z.Monad.test ([])
  //. true
  //.
  //. > Z.Monad.test ({})
  //. false
  //. ```
  Z.Monad = $ ('Monad', [Z.Applicative, Z.Chain], []);

  //# Alt :: TypeClass
  //.
  //. `TypeClass` value for [Alt][].
  //.
  //. ```javascript
  //. > Z.Alt.test ({})
  //. true
  //.
  //. > Z.Alt.test ('')
  //. false
  //. ```
  Z.Alt = $ ('Alt', [Z.Functor], [{
    name: 'alt',
    location: Value,
    arity: 1,
  }]);

  //# Plus :: TypeClass
  //.
  //. `TypeClass` value for [Plus][].
  //.
  //. ```javascript
  //. > Z.Plus.test ({})
  //. true
  //.
  //. > Z.Plus.test ('')
  //. false
  //. ```
  Z.Plus = $ ('Plus', [Z.Alt], [{
    name: 'zero',
    location: Constructor,
    arity: 0,
  }]);

  //# Alternative :: TypeClass
  //.
  //. `TypeClass` value for [Alternative][].
  //.
  //. ```javascript
  //. > Z.Alternative.test ([])
  //. true
  //.
  //. > Z.Alternative.test ({})
  //. false
  //. ```
  Z.Alternative = $ ('Alternative', [Z.Applicative, Z.Plus], []);

  //# Foldable :: TypeClass
  //.
  //. `TypeClass` value for [Foldable][].
  //.
  //. ```javascript
  //. > Z.Foldable.test ({})
  //. true
  //.
  //. > Z.Foldable.test ('')
  //. false
  //. ```
  Z.Foldable = $ ('Foldable', [], [{
    name: 'reduce',
    location: Value,
    arity: 2,
  }]);

  //# Traversable :: TypeClass
  //.
  //. `TypeClass` value for [Traversable][].
  //.
  //. ```javascript
  //. > Z.Traversable.test ([])
  //. true
  //.
  //. > Z.Traversable.test ('')
  //. false
  //. ```
  Z.Traversable = $ ('Traversable', [Z.Functor, Z.Foldable], [{
    name: 'traverse',
    location: Value,
    arity: 2,
  }]);

  //# Extend :: TypeClass
  //.
  //. `TypeClass` value for [Extend][].
  //.
  //. ```javascript
  //. > Z.Extend.test ([])
  //. true
  //.
  //. > Z.Extend.test ({})
  //. false
  //. ```
  Z.Extend = $ ('Extend', [Z.Functor], [{
    name: 'extend',
    location: Value,
    arity: 1,
  }]);

  //# Comonad :: TypeClass
  //.
  //. `TypeClass` value for [Comonad][].
  //.
  //. ```javascript
  //. > Z.Comonad.test (Identity (0))
  //. true
  //.
  //. > Z.Comonad.test ([])
  //. false
  //. ```
  Z.Comonad = $ ('Comonad', [Z.Extend], [{
    name: 'extract',
    location: Value,
    arity: 0,
  }]);

  //# Contravariant :: TypeClass
  //.
  //. `TypeClass` value for [Contravariant][].
  //.
  //. ```javascript
  //. > Z.Contravariant.test (Math.sqrt)
  //. true
  //.
  //. > Z.Contravariant.test ([])
  //. false
  //. ```
  Z.Contravariant = $ ('Contravariant', [], [{
    name: 'contramap',
    location: Value,
    arity: 1,
  }]);

  //# equals :: (a, b) -> Boolean
  //.
  //. Returns `true` if its arguments are equal; `false` otherwise.
  //.
  //. Specifically:
  //.
  //.   - Arguments with different [type identities][] are unequal.
  //.
  //.   - If the first argument has a [`fantasy-land/equals`][] method,
  //.     that method is invoked to determine whether the arguments are
  //.     equal (`fantasy-land/equals` implementations are provided for the
  //.     following built-in types: Null, Undefined, Boolean, Number, Date,
  //.     RegExp, String, Array, Arguments, Error, Object, and Function).
  //.
  //.   - Otherwise, the arguments are equal if their
  //.     [entries][`Object.entries`] are equal (according to this algorithm).
  //.
  //. The algorithm supports circular data structures. Two arrays are equal
  //. if they have the same index paths and for each path have equal values.
  //. Two arrays which represent `[1, [1, [1, [1, [1, ...]]]]]`, for example,
  //. are equal even if their internal structures differ. Two objects are equal
  //. if they have the same property paths and for each path have equal values.
  //.
  //. ```javascript
  //. > Z.equals (0, -0)
  //. true
  //.
  //. > Z.equals (NaN, NaN)
  //. true
  //.
  //. > Z.equals (Cons (1, Cons (2, Nil)), Cons (1, Cons (2, Nil)))
  //. true
  //.
  //. > Z.equals (Cons (1, Cons (2, Nil)), Cons (2, Cons (1, Nil)))
  //. false
  //. ```
  {
    //  $pairs :: Array (Array2 Any Any)
    const $pairs = [];

    Z.equals = (x, y) => {
      if (!(sameType (x, y))) return false;

      //  This algorithm for comparing circular data structures was
      //  suggested in <http://stackoverflow.com/a/40622794/312785>.
      if ($pairs.some (([xx, yy]) => xx === x && yy === y)) {
        return true;
      }

      $pairs.push ([x, y]);
      try {
        return Z.Setoid.test (x) ?
               Z.Setoid.methods.equals (y, x) :
               Object$prototype$equals.call (x, y);
      } finally {
        $pairs.pop ();
      }
    };
  }

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
  //. > Z.lt (0, 0)
  //. false
  //.
  //. > Z.lt (0, 1)
  //. true
  //.
  //. > Z.lt (1, 0)
  //. false
  //. ```
  Z.lt = (x, y) => sameType (x, y) && !(Z.lte (y, x));

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
  //. > Z.lte (0, 0)
  //. true
  //.
  //. > Z.lte (0, 1)
  //. true
  //.
  //. > Z.lte (1, 0)
  //. false
  //. ```
  {
    //  $pairs :: Array (Array2 Any Any)
    const $pairs = [];

    Z.lte = (x, y) => {
      if (!(sameType (x, y))) return false;

      //  This algorithm for comparing circular data structures was
      //  suggested in <http://stackoverflow.com/a/40622794/312785>.
      if ($pairs.some (([xx, yy]) => xx === x && yy === y)) {
        return Z.equals (x, y);
      }

      $pairs.push ([x, y]);
      try {
        return Z.Ord.test (x) && Z.Ord.methods.lte (y, x);
      } finally {
        $pairs.pop ();
      }
    };
  }

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
  //. > Z.gt (0, 0)
  //. false
  //.
  //. > Z.gt (0, 1)
  //. false
  //.
  //. > Z.gt (1, 0)
  //. true
  //. ```
  Z.gt = (x, y) => Z.lt (y, x);

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
  //. > Z.gte (0, 0)
  //. true
  //.
  //. > Z.gte (0, 1)
  //. false
  //.
  //. > Z.gte (1, 0)
  //. true
  //. ```
  Z.gte = (x, y) => Z.lte (y, x);

  //# min :: Ord a => (a, a) -> a
  //.
  //. Returns the smaller of its two arguments.
  //.
  //. This function is derived from [`lte`](#lte).
  //.
  //. See also [`max`](#max).
  //.
  //. ```javascript
  //. > Z.min (10, 2)
  //. 2
  //.
  //. > Z.min (new Date ('1999-12-31'), new Date ('2000-01-01'))
  //. new Date ('1999-12-31')
  //.
  //. > Z.min ('10', '2')
  //. '10'
  //. ```
  Z.min = (x, y) => Z.lte (x, y) ? x : y;

  //# max :: Ord a => (a, a) -> a
  //.
  //. Returns the larger of its two arguments.
  //.
  //. This function is derived from [`lte`](#lte).
  //.
  //. See also [`min`](#min).
  //.
  //. ```javascript
  //. > Z.max (10, 2)
  //. 10
  //.
  //. > Z.max (new Date ('1999-12-31'), new Date ('2000-01-01'))
  //. new Date ('2000-01-01')
  //.
  //. > Z.max ('10', '2')
  //. '2'
  //. ```
  Z.max = (x, y) => Z.lte (x, y) ? y : x;

  //# clamp :: Ord a => (a, a, a) -> a
  //.
  //. Takes a lower bound, an upper bound, and a value of the same type.
  //. Returns the value if it is within the bounds; the nearer bound otherwise.
  //.
  //. This function is derived from [`min`](#min) and [`max`](#max).
  //.
  //. ```javascript
  //. > Z.clamp (0, 100, 42)
  //. 42
  //.
  //. > Z.clamp (0, 100, -1)
  //. 0
  //.
  //. > Z.clamp ('A', 'Z', '~')
  //. 'Z'
  //. ```
  Z.clamp = (lower, upper, x) => Z.max (lower, Z.min (upper, x));

  //# compose :: Semigroupoid c => (c j k, c i j) -> c i k
  //.
  //. Function wrapper for [`fantasy-land/compose`][].
  //.
  //. `fantasy-land/compose` implementations are provided for the following
  //. built-in types: Function.
  //.
  //. ```javascript
  //. > Z.compose (Math.sqrt, x => x + 1) (99)
  //. 10
  //. ```
  Z.compose = Z.Semigroupoid.methods.compose;

  //# id :: Category c => TypeRep c -> c
  //.
  //. Function wrapper for [`fantasy-land/id`][].
  //.
  //. `fantasy-land/id` implementations are provided for the following
  //. built-in types: Function.
  //.
  //. ```javascript
  //. > Z.id (Function) ('foo')
  //. 'foo'
  //. ```
  Z.id = Z.Category.methods.id;

  //# concat :: Semigroup a => (a, a) -> a
  //.
  //. Function wrapper for [`fantasy-land/concat`][].
  //.
  //. `fantasy-land/concat` implementations are provided for the following
  //. built-in types: String, Array, and Object.
  //.
  //. ```javascript
  //. > Z.concat ('abc', 'def')
  //. 'abcdef'
  //.
  //. > Z.concat ([1, 2, 3], [4, 5, 6])
  //. [1, 2, 3, 4, 5, 6]
  //.
  //. > Z.concat ({x: 1, y: 2}, {y: 3, z: 4})
  //. {x: 1, y: 3, z: 4}
  //.
  //. > Z.concat (Cons ('foo', Cons ('bar', Cons ('baz', Nil))), Cons ('quux', Nil))
  //. Cons ('foo', Cons ('bar', Cons ('baz', Cons ('quux', Nil))))
  //. ```
  Z.concat = (a, b) => Z.Semigroup.methods.concat (b, a);

  //# empty :: Monoid m => TypeRep m -> m
  //.
  //. Function wrapper for [`fantasy-land/empty`][].
  //.
  //. `fantasy-land/empty` implementations are provided for the following
  //. built-in types: String, Array, and Object.
  //.
  //. ```javascript
  //. > Z.empty (String)
  //. ''
  //.
  //. > Z.empty (Array)
  //. []
  //.
  //. > Z.empty (Object)
  //. {}
  //.
  //. > Z.empty (List)
  //. Nil
  //. ```
  Z.empty = Z.Monoid.methods.empty;

  //# invert :: Group g => g -> g
  //.
  //. Function wrapper for [`fantasy-land/invert`][].
  //.
  //. ```javascript
  //. > Z.invert (Sum (5))
  //. Sum (-5)
  //. ```
  Z.invert = Z.Group.methods.invert;

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
  //. > Z.filter (x => x % 2 == 1, [1, 2, 3])
  //. [1, 3]
  //.
  //. > Z.filter (x => x % 2 == 1, {x: 1, y: 2, z: 3})
  //. {x: 1, z: 3}
  //.
  //. > Z.filter (x => x % 2 == 1, Cons (1, Cons (2, Cons (3, Nil))))
  //. Cons (1, Cons (3, Nil))
  //.
  //. > Z.filter (x => x % 2 == 1, Nothing)
  //. Nothing
  //.
  //. > Z.filter (x => x % 2 == 1, Just (0))
  //. Nothing
  //.
  //. > Z.filter (x => x % 2 == 1, Just (1))
  //. Just (1)
  //. ```
  Z.filter = Z.Filterable.methods.filter;

  //# reject :: Filterable f => (a -> Boolean, f a) -> f a
  //.
  //. Discards every element which satisfies the predicate.
  //.
  //. This function is derived from [`filter`](#filter).
  //.
  //. ```javascript
  //. > Z.reject (x => x % 2 == 1, [1, 2, 3])
  //. [2]
  //.
  //. > Z.reject (x => x % 2 == 1, {x: 1, y: 2, z: 3})
  //. {y: 2}
  //.
  //. > Z.reject (x => x % 2 == 1, Cons (1, Cons (2, Cons (3, Nil))))
  //. Cons (2, Nil)
  //.
  //. > Z.reject (x => x % 2 == 1, Nothing)
  //. Nothing
  //.
  //. > Z.reject (x => x % 2 == 1, Just (0))
  //. Just (0)
  //.
  //. > Z.reject (x => x % 2 == 1, Just (1))
  //. Nothing
  //. ```
  Z.reject = (pred, filterable) => Z.filter (x => !(pred (x)), filterable);

  //# map :: Functor f => (a -> b, f a) -> f b
  //.
  //. Function wrapper for [`fantasy-land/map`][].
  //.
  //. `fantasy-land/map` implementations are provided for the following
  //. built-in types: Array, Object, and Function.
  //.
  //. ```javascript
  //. > Z.map (Math.sqrt, [1, 4, 9])
  //. [1, 2, 3]
  //.
  //. > Z.map (Math.sqrt, {x: 1, y: 4, z: 9})
  //. {x: 1, y: 2, z: 3}
  //.
  //. > Z.map (Math.sqrt, s => s.length) ('Sanctuary')
  //. 3
  //.
  //. > Z.map (Math.sqrt, Pair ('foo') (64))
  //. Pair ('foo') (8)
  //.
  //. > Z.map (Math.sqrt, Nil)
  //. Nil
  //.
  //. > Z.map (Math.sqrt, Cons (1, Cons (4, Cons (9, Nil))))
  //. Cons (1, Cons (2, Cons (3, Nil)))
  //. ```
  Z.map = Z.Functor.methods.map;

  //# flip :: Functor f => (f (a -> b), a) -> f b
  //.
  //. Maps over the given functions, applying each to the given value.
  //.
  //. This function is derived from [`map`](#map).
  //.
  //. ```javascript
  //. > Z.flip (x => y => x + y, '!') ('foo')
  //. 'foo!'
  //.
  //. > Z.flip ([Math.floor, Math.ceil], 1.5)
  //. [1, 2]
  //.
  //. > Z.flip ({floor: Math.floor, ceil: Math.ceil}, 1.5)
  //. {floor: 1, ceil: 2}
  //.
  //. > Z.flip (Cons (Math.floor, Cons (Math.ceil, Nil)), 1.5)
  //. Cons (1, Cons (2, Nil))
  //. ```
  Z.flip = (functor, x) => Z.map (f => f (x), functor);

  //# bimap :: Bifunctor f => (a -> b, c -> d, f a c) -> f b d
  //.
  //. Function wrapper for [`fantasy-land/bimap`][].
  //.
  //. ```javascript
  //. > Z.bimap (s => s.toUpperCase (), Math.sqrt, Pair ('foo') (64))
  //. Pair ('FOO') (8)
  //. ```
  Z.bimap = Z.Bifunctor.methods.bimap;

  //# mapLeft :: Bifunctor f => (a -> b, f a c) -> f b c
  //.
  //. Maps the given function over the left side of a Bifunctor.
  //.
  //. ```javascript
  //. > Z.mapLeft (Math.sqrt, Pair (64) (9))
  //. Pair (8) (9)
  //. ```
  Z.mapLeft = (f, bifunctor) => Z.bimap (f, identity, bifunctor);

  //# promap :: Profunctor p => (a -> b, c -> d, p b c) -> p a d
  //.
  //. Function wrapper for [`fantasy-land/promap`][].
  //.
  //. `fantasy-land/promap` implementations are provided for the following
  //. built-in types: Function.
  //.
  //. ```javascript
  //. > Z.promap (Math.abs, x => x + 1, Math.sqrt) (-100)
  //. 11
  //. ```
  Z.promap = Z.Profunctor.methods.promap;

  //# ap :: Apply f => (f (a -> b), f a) -> f b
  //.
  //. Function wrapper for [`fantasy-land/ap`][].
  //.
  //. `fantasy-land/ap` implementations are provided for the following
  //. built-in types: Array, Object, and Function.
  //.
  //. ```javascript
  //. > Z.ap ([Math.sqrt, x => x * x], [1, 4, 9, 16, 25])
  //. [1, 2, 3, 4, 5, 1, 16, 81, 256, 625]
  //.
  //. > Z.ap ({a: Math.sqrt, b: x => x * x}, {a: 16, b: 10, c: 1})
  //. {a: 4, b: 100}
  //.
  //. > Z.ap (s => n => s.slice (0, n), s => Math.ceil (s.length / 2)) ('Haskell')
  //. 'Hask'
  //.
  //. > Z.ap (Identity (Math.sqrt), Identity (64))
  //. Identity (8)
  //.
  //. > Z.ap (Cons (Math.sqrt, Cons (x => x * x, Nil)), Cons (16, Cons (100, Nil)))
  //. Cons (4, Cons (10, Cons (256, Cons (10000, Nil))))
  //. ```
  Z.ap = Z.Apply.methods.ap;

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
  //. > Z.lift2 (x => y => Math.pow (x, y), [10], [1, 2, 3])
  //. [10, 100, 1000]
  //.
  //. > Z.lift2 (x => y => Math.pow (x, y), Identity (10), Identity (3))
  //. Identity (1000)
  //. ```
  Z.lift2 = (f, x, y) => Z.ap (Z.map (f, x), y);

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
  //. > Z.lift3 (x => y => z => x + z + y,
  //. .          ['<', '['],
  //. .          ['>', ']'],
  //. .          ['foo', 'bar', 'baz'])
  //. [ '<foo>', '<bar>', '<baz>',
  //. . '<foo]', '<bar]', '<baz]',
  //. . '[foo>', '[bar>', '[baz>',
  //. . '[foo]', '[bar]', '[baz]' ]
  //.
  //. > Z.lift3 (x => y => z => x + z + y,
  //. .          Identity ('<'),
  //. .          Identity ('>'),
  //. .          Identity ('baz'))
  //. Identity ('<baz>')
  //. ```
  Z.lift3 = (f, x, y, z) => Z.ap (Z.ap (Z.map (f, x), y), z);

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
  //. > Z.apFirst ([1, 2], [3, 4])
  //. [1, 1, 2, 2]
  //.
  //. > Z.apFirst (Identity (1), Identity (2))
  //. Identity (1)
  //. ```
  Z.apFirst = (x, y) => Z.lift2 (x => y => x, x, y);

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
  //. > Z.apSecond ([1, 2], [3, 4])
  //. [3, 4, 3, 4]
  //.
  //. > Z.apSecond (Identity (1), Identity (2))
  //. Identity (2)
  //. ```
  Z.apSecond = (x, y) => Z.lift2 (x => y => y, x, y);

  //# of :: Applicative f => (TypeRep f, a) -> f a
  //.
  //. Function wrapper for [`fantasy-land/of`][].
  //.
  //. `fantasy-land/of` implementations are provided for the following
  //. built-in types: Array and Function.
  //.
  //. ```javascript
  //. > Z.of (Array, 42)
  //. [42]
  //.
  //. > Z.of (Function, 42) (null)
  //. 42
  //.
  //. > Z.of (List, 42)
  //. Cons (42, Nil)
  //. ```
  Z.of = Z.Applicative.methods.of;

  //# append :: (Applicative f, Semigroup (f a)) => (a, f a) -> f a
  //.
  //. Returns the result of appending the first argument to the second.
  //.
  //. This function is derived from [`concat`](#concat) and [`of`](#of).
  //.
  //. See also [`prepend`](#prepend).
  //.
  //. ```javascript
  //. > Z.append (3, [1, 2])
  //. [1, 2, 3]
  //.
  //. > Z.append (3, Cons (1, Cons (2, Nil)))
  //. Cons (1, Cons (2, Cons (3, Nil)))
  //. ```
  Z.append = (x, xs) => Z.concat (xs, Z.of (xs.constructor, x));

  //# prepend :: (Applicative f, Semigroup (f a)) => (a, f a) -> f a
  //.
  //. Returns the result of prepending the first argument to the second.
  //.
  //. This function is derived from [`concat`](#concat) and [`of`](#of).
  //.
  //. See also [`append`](#append).
  //.
  //. ```javascript
  //. > Z.prepend (1, [2, 3])
  //. [1, 2, 3]
  //.
  //. > Z.prepend (1, Cons (2, Cons (3, Nil)))
  //. Cons (1, Cons (2, Cons (3, Nil)))
  //. ```
  Z.prepend = (x, xs) => Z.concat (Z.of (xs.constructor, x), xs);

  //# chain :: Chain m => (a -> m b, m a) -> m b
  //.
  //. Function wrapper for [`fantasy-land/chain`][].
  //.
  //. `fantasy-land/chain` implementations are provided for the following
  //. built-in types: Array and Function.
  //.
  //. ```javascript
  //. > Z.chain (x => [x, x], [1, 2, 3])
  //. [1, 1, 2, 2, 3, 3]
  //.
  //. > Z.chain (x => x % 2 == 1 ? Z.of (List, x) : Nil,
  //. .          Cons (1, Cons (2, Cons (3, Nil))))
  //. Cons (1, Cons (3, Nil))
  //.
  //. > Z.chain (n => s => s.slice (0, n),
  //. .          s => Math.ceil (s.length / 2))
  //. .         ('Haskell')
  //. 'Hask'
  //. ```
  Z.chain = Z.Chain.methods.chain;

  //# join :: Chain m => m (m a) -> m a
  //.
  //. Removes one level of nesting from a nested monadic structure.
  //.
  //. This function is derived from [`chain`](#chain).
  //.
  //. ```javascript
  //. > Z.join ([[1], [2], [3]])
  //. [1, 2, 3]
  //.
  //. > Z.join ([[[1, 2, 3]]])
  //. [[1, 2, 3]]
  //.
  //. > Z.join (Identity (Identity (1)))
  //. Identity (1)
  //. ```
  Z.join = chain => Z.chain (identity, chain);

  //# chainRec :: ChainRec m => (TypeRep m, (a -> c, b -> c, a) -> m c, a) -> m b
  //.
  //. Function wrapper for [`fantasy-land/chainRec`][].
  //.
  //. `fantasy-land/chainRec` implementations are provided for the following
  //. built-in types: Array.
  //.
  //. ```javascript
  //. > Z.chainRec (
  //. .   Array,
  //. .   (next, done, s) => s.length == 2 ? [s + '!', s + '?'].map (done)
  //. .                                    : [s + 'o', s + 'n'].map (next),
  //. .   ''
  //. . )
  //. ['oo!', 'oo?', 'on!', 'on?', 'no!', 'no?', 'nn!', 'nn?']
  //. ```
  Z.chainRec = Z.ChainRec.methods.chainRec;

  //# alt :: Alt f => (f a, f a) -> f a
  //.
  //. Function wrapper for [`fantasy-land/alt`][].
  //.
  //. `fantasy-land/alt` implementations are provided for the following
  //. built-in types: Array and Object.
  //.
  //. ```javascript
  //. > Z.alt ([1, 2, 3], [4, 5, 6])
  //. [1, 2, 3, 4, 5, 6]
  //.
  //. > Z.alt (Nothing, Nothing)
  //. Nothing
  //.
  //. > Z.alt (Nothing, Just (1))
  //. Just (1)
  //.
  //. > Z.alt (Just (2), Just (3))
  //. Just (2)
  //. ```
  Z.alt = (a, b) => Z.Alt.methods.alt (b, a);

  //# zero :: Plus f => TypeRep f -> f a
  //.
  //. Function wrapper for [`fantasy-land/zero`][].
  //.
  //. `fantasy-land/zero` implementations are provided for the following
  //. built-in types: Array and Object.
  //.
  //. ```javascript
  //. > Z.zero (Array)
  //. []
  //.
  //. > Z.zero (Object)
  //. {}
  //.
  //. > Z.zero (Maybe)
  //. Nothing
  //. ```
  Z.zero = Z.Plus.methods.zero;

  //# reduce :: Foldable f => ((b, a) -> b, b, f a) -> b
  //.
  //. Function wrapper for [`fantasy-land/reduce`][].
  //.
  //. `fantasy-land/reduce` implementations are provided for the following
  //. built-in types: Array and Object.
  //.
  //. ```javascript
  //. > Z.reduce ((xs, x) => [x].concat (xs), [], [1, 2, 3])
  //. [3, 2, 1]
  //.
  //. > Z.reduce (Z.concat, '', Cons ('foo', Cons ('bar', Cons ('baz', Nil))))
  //. 'foobarbaz'
  //.
  //. > Z.reduce (Z.concat, '', {foo: 'x', bar: 'y', baz: 'z'})
  //. 'yzx'
  //. ```
  Z.reduce = Z.Foldable.methods.reduce;

  //# size :: Foldable f => f a -> Integer
  //.
  //. Returns the number of elements of the given structure.
  //.
  //. This function is derived from [`reduce`](#reduce).
  //.
  //. ```javascript
  //. > Z.size ([])
  //. 0
  //.
  //. > Z.size (['foo', 'bar', 'baz'])
  //. 3
  //.
  //. > Z.size (Nil)
  //. 0
  //.
  //. > Z.size (Cons ('foo', Cons ('bar', Cons ('baz', Nil))))
  //. 3
  //. ```
  Z.size = foldable => (
    Array.isArray (foldable)
    ? foldable.length
    : Z.reduce ((n, _) => n + 1, 0, foldable)
  );

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
  //. > Z.all (Number.isInteger, [])
  //. true
  //.
  //. > Z.all (Number.isInteger, [1, 2, 3])
  //. true
  //.
  //. > Z.all (Number.isInteger, [0, 0.25, 0.5, 0.75, 1])
  //. false
  //. ```
  Z.all = (pred, foldable) => (
    Array.isArray (foldable)
    ? foldable.every (x => pred (x))
    : Z.reduce ((b, x) => b && pred (x), true, foldable)
  );

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
  //. > Z.any (Number.isInteger, [])
  //. false
  //.
  //. > Z.any (Number.isInteger, [1, 2, 3])
  //. true
  //.
  //. > Z.any (Number.isInteger, [0, 0.25, 0.5, 0.75, 1])
  //. true
  //. ```
  Z.any = (pred, foldable) => (
    Array.isArray (foldable)
    ? foldable.some (x => pred (x))
    : Z.reduce ((b, x) => b || pred (x), false, foldable)
  );

  //# none :: Foldable f => (a -> Boolean, f a) -> Boolean
  //.
  //. Returns `true` if none of the elements of the structure satisfies the
  //. predicate; `false` otherwise.
  //.
  //. This function is derived from [`any`](#any). `Z.none (pred, foldable)` is
  //. equivalent to `!(Z.any (pred, foldable))`.
  //.
  //. See also [`all`](#all).
  //.
  //. ```javascript
  //. > Z.none (Number.isInteger, [])
  //. true
  //.
  //. > Z.none (Number.isInteger, [0, 0.25, 0.5, 0.75, 1])
  //. false
  //. ```
  Z.none = (pred, foldable) => !(Z.any (pred, foldable));

  //# elem :: (Setoid a, Foldable f) => (a, f a) -> Boolean
  //.
  //. Takes a value and a structure and returns `true` if the
  //. value is an element of the structure; `false` otherwise.
  //.
  //. This function is derived from [`equals`](#equals) and
  //. [`reduce`](#reduce).
  //.
  //. ```javascript
  //. > Z.elem ('c', ['a', 'b', 'c'])
  //. true
  //.
  //. > Z.elem ('x', ['a', 'b', 'c'])
  //. false
  //.
  //. > Z.elem (3, {x: 1, y: 2, z: 3})
  //. true
  //.
  //. > Z.elem (8, {x: 1, y: 2, z: 3})
  //. false
  //.
  //. > Z.elem (0, Just (0))
  //. true
  //.
  //. > Z.elem (0, Just (1))
  //. false
  //.
  //. > Z.elem (0, Nothing)
  //. false
  //. ```
  Z.elem = (x, foldable) => Z.any (y => Z.equals (x, y), foldable);

  //# intercalate :: (Monoid m, Foldable f) => (m, f m) -> m
  //.
  //. Concatenates the elements of the given structure, separating each pair
  //. of adjacent elements with the given separator.
  //.
  //. This function is derived from [`concat`](#concat), [`empty`](#empty),
  //. and [`reduce`](#reduce).
  //.
  //. ```javascript
  //. > Z.intercalate (', ', [])
  //. ''
  //.
  //. > Z.intercalate (', ', ['foo', 'bar', 'baz'])
  //. 'foo, bar, baz'
  //.
  //. > Z.intercalate (', ', Nil)
  //. ''
  //.
  //. > Z.intercalate (', ', Cons ('foo', Cons ('bar', Cons ('baz', Nil))))
  //. 'foo, bar, baz'
  //.
  //. > Z.intercalate ([0, 0, 0], [])
  //. []
  //.
  //. > Z.intercalate ([0, 0, 0], [[1], [2, 3], [4, 5, 6], [7, 8], [9]])
  //. [1, 0, 0, 0, 2, 3, 0, 0, 0, 4, 5, 6, 0, 0, 0, 7, 8, 0, 0, 0, 9]
  //. ```
  Z.intercalate = (separator, foldable) => (
    Z.reduce (
      ({empty, value}, x) => ({
        empty: false,
        value: Z.concat (value, empty ? x : Z.concat (separator, x)),
      }),
      {empty: true, value: Z.empty (separator.constructor)},
      foldable
    )
    .value
  );

  //# foldMap :: (Monoid m, Foldable f) => (TypeRep m, a -> m, f a) -> m
  //.
  //. Deconstructs a foldable by mapping every element to a monoid and
  //. concatenating the results.
  //.
  //. This function is derived from [`concat`](#concat), [`empty`](#empty),
  //. and [`reduce`](#reduce).
  //.
  //. ```javascript
  //. > Z.foldMap (String, f => f.name, [Math.sin, Math.cos, Math.tan])
  //. 'sincostan'
  //. ```
  Z.foldMap = (typeRep, f, foldable) => (
    Z.reduce (
      (monoid, x) => Z.concat (monoid, f (x)),
      Z.empty (typeRep),
      foldable
    )
  );

  //# reverse :: (Applicative f, Foldable f, Monoid (f a)) => f a -> f a
  //.
  //. Reverses the elements of the given structure.
  //.
  //. This function is derived from [`concat`](#concat), [`empty`](#empty),
  //. [`of`](#of), and [`reduce`](#reduce).
  //.
  //. ```javascript
  //. > Z.reverse ([1, 2, 3])
  //. [3, 2, 1]
  //.
  //. > Z.reverse (Cons (1, Cons (2, Cons (3, Nil))))
  //. Cons (3, Cons (2, Cons (1, Nil)))
  //. ```
  Z.reverse = foldable => {
    //  Fast path for arrays.
    if (Array.isArray (foldable)) return (foldable.slice ()).reverse ();
    const F = foldable.constructor;
    return Z.reduce (
      (xs, x) => Z.concat (Z.of (F, x), xs),
      Z.empty (F),
      foldable
    );
  };

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
  //. > Z.sort (['foo', 'bar', 'baz'])
  //. ['bar', 'baz', 'foo']
  //.
  //. > Z.sort ([Just (2), Nothing, Just (1)])
  //. [Nothing, Just (1), Just (2)]
  //.
  //. > Z.sort (Cons ('foo', Cons ('bar', Cons ('baz', Nil))))
  //. Cons ('bar', Cons ('baz', Cons ('foo', Nil)))
  //. ```
  Z.sort = foldable => Z.sortBy (identity, foldable);

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
  //. > Z.sortBy (s => s.length, ['red', 'green', 'blue'])
  //. ['red', 'blue', 'green']
  //.
  //. > Z.sortBy (s => s.length, ['black', 'white'])
  //. ['black', 'white']
  //.
  //. > Z.sortBy (s => s.length, ['white', 'black'])
  //. ['white', 'black']
  //.
  //. > Z.sortBy (s => s.length, Cons ('red', Cons ('green', Cons ('blue', Nil))))
  //. Cons ('red', Cons ('blue', Cons ('green', Nil)))
  //. ```
  Z.sortBy = (f, foldable) => {
    const rs = Z.reduce ((rs, x) => {
      rs.push ({idx: rs.length, x, fx: f (x)});
      return rs;
    }, [], foldable);

    const lte = (r => {
      switch (typeof (r && r.fx)) {
        case 'number':  return (x, y) => x <= y || x !== x;
        case 'string':  return (x, y) => x <= y;
        default:        return Z.lte;
      }
    }) (rs[0]);

    rs.sort ((a, b) => (
      lte (a.fx, b.fx) ? lte (b.fx, a.fx) ? a.idx - b.idx : -1 : 1
    ));

    if (Array.isArray (foldable)) {
      for (let idx = 0; idx < rs.length; idx += 1) rs[idx] = rs[idx].x;
      return rs;
    }

    const F = foldable.constructor;
    let result = Z.empty (F);
    for (let idx = 0; idx < rs.length; idx += 1) {
      result = Z.concat (result, Z.of (F, rs[idx].x));
    }
    return result;
  };

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
  //. > Z.traverse (Array, x => x, [[1, 2, 3], [4, 5]])
  //. [[1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5]]
  //.
  //. > Z.traverse (Identity, x => Identity (x + 1), [1, 2, 3])
  //. Identity ([2, 3, 4])
  //. ```
  Z.traverse = Z.Traversable.methods.traverse;

  //# sequence :: (Applicative f, Traversable t) => (TypeRep f, t (f a)) -> f (t a)
  //.
  //. Inverts the given `t (f a)` to produce an `f (t a)`.
  //.
  //. This function is derived from [`traverse`](#traverse).
  //.
  //. ```javascript
  //. > Z.sequence (Array, Identity ([1, 2, 3]))
  //. [Identity (1), Identity (2), Identity (3)]
  //.
  //. > Z.sequence (Identity, [Identity (1), Identity (2), Identity (3)])
  //. Identity ([1, 2, 3])
  //. ```
  Z.sequence = (typeRep, traversable) => (
    Z.traverse (typeRep, identity, traversable)
  );

  //# extend :: Extend w => (w a -> b, w a) -> w b
  //.
  //. Function wrapper for [`fantasy-land/extend`][].
  //.
  //. `fantasy-land/extend` implementations are provided for the following
  //. built-in types: Array and Function.
  //.
  //. ```javascript
  //. > Z.extend (ss => ss.join (''), ['x', 'y', 'z'])
  //. ['xyz', 'yz', 'z']
  //.
  //. > Z.extend (f => f ([3, 4]), Z.reverse) ([1, 2])
  //. [4, 3, 2, 1]
  //. ```
  Z.extend = Z.Extend.methods.extend;

  //# duplicate :: Extend w => w a -> w (w a)
  //.
  //. Adds one level of nesting to a comonadic structure.
  //.
  //. This function is derived from [`extend`](#extend).
  //.
  //. ```javascript
  //. > Z.duplicate (Identity (1))
  //. Identity (Identity (1))
  //.
  //. > Z.duplicate ([1])
  //. [[1]]
  //.
  //. > Z.duplicate ([1, 2, 3])
  //. [[1, 2, 3], [2, 3], [3]]
  //.
  //. > Z.duplicate (Z.reverse) ([1, 2]) ([3, 4])
  //. [4, 3, 2, 1]
  //. ```
  Z.duplicate = extend => Z.extend (identity, extend);

  //# extract :: Comonad w => w a -> a
  //.
  //. Function wrapper for [`fantasy-land/extract`][].
  //.
  //. ```javascript
  //. > Z.extract (Identity (42))
  //. 42
  //. ```
  Z.extract = Z.Comonad.methods.extract;

  //# contramap :: Contravariant f => (b -> a, f a) -> f b
  //.
  //. Function wrapper for [`fantasy-land/contramap`][].
  //.
  //. `fantasy-land/contramap` implementations are provided for the following
  //. built-in types: Function.
  //.
  //. ```javascript
  //. > Z.contramap (s => s.length, Math.sqrt) ('Sanctuary')
  //. 3
  //. ```
  Z.contramap = Z.Contravariant.methods.contramap;

  return Z;

});

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
//. [`Object.entries`]:         https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
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
//. [type identities]:          v:sanctuary-js/sanctuary-type-identifiers
//. [type-classes]:             https://github.com/sanctuary-js/sanctuary-def#type-classes
