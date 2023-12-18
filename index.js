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
//.
//. ```javascript
//. > import Identity from 'sanctuary-identity'
//. > import Maybe from 'sanctuary-maybe'
//. > import Pair from 'sanctuary-pair'
//. > import Useless from 'sanctuary-useless'
//. > import {List, Nil, Cons} from './test/List.js'
//. > import {Sum} from './test/Sum.js'
//. > const {Nothing, Just} = Maybe
//. ```

import type from 'sanctuary-type-identifiers';

//  Array$concat :: Array a -> Array a -> Array a
const Array$concat = xs => ys => xs.concat (ys);

//  has :: (String, Object) -> Boolean
const has = (k, o) => Object.prototype.hasOwnProperty.call (o, k);

//  identity :: a -> a
const identity = x => x;

//  pair :: a -> b -> Array2 a b
const pair = x => y => [x, y];

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
const String$empty = () => '';

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
    if (!(equals (this[idx], other[idx]))) return false;
  }
  return true;
}

//  Array$prototype$lte :: Ord a => Array a ~> Array a -> Boolean
function Array$prototype$lte(other) {
  for (let idx = 0; true; idx += 1) {
    if (idx === this.length) break;
    if (idx === other.length) return false;
    if (!(equals (this[idx], other[idx]))) {
      return lte (this[idx], other[idx]);
    }
  }
  return true;
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
      case 0: return of (typeRep, []);
      case 2: return lift2 (pair, f (this[idx]), f (this[idx + 1]));
      default: {
        const m = Math.floor (n / 4) * 2;
        return lift2 (Array$concat, go (idx, m), go (idx + m, n - m));
      }
    }
  };
  return this.length % 2 === 1 ?
    lift2 (
      Array$concat,
      map (Array$of, f (this[0])), go (1, this.length - 1)
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
  return equals (this.name, other.name) &&
         equals (this.message, other.message);
}

//  Object$empty :: () -> StrMap a
const Object$empty = () => ({});

//  Object$zero :: () -> StrMap a
const Object$zero = () => ({});

//  Object$prototype$equals :: Setoid a => StrMap a ~> StrMap a -> Boolean
function Object$prototype$equals(other) {
  const keys = sortedKeys (this);
  return equals (keys, sortedKeys (other)) &&
         keys.every (k => equals (this[k], other[k]));
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
    if (!(equals (this[k], other[k]))) return lte (this[k], other[k]);
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
             lift2 (
               o => v => Object$prototype$concat.call (o, {[k]: v}),
               applicative,
               f (this[k])
             )
           ),
           of (typeRep, {})
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
  return x => f (y => this (concat (x, y)));
}

//  Function$prototype$contramap :: (b -> c) ~> (a -> b) -> (a -> c)
function Function$prototype$contramap(f) {
  return x => this (f (x));
}

const staticMethod = (name, implementations, typeRep) => {
  switch (typeRep) {
    case String: return implementations.String;
    case Array: return implementations.Array;
    case Object: return implementations.Object;
    case Function: return implementations.Function;
  }

  const prefixedName = 'fantasy-land/' + name;
  if (typeof typeRep[prefixedName] === 'function') {
    return typeRep[prefixedName];
  }

  switch (typeRep.name) {
    case 'String': return implementations.String;
    case 'Array': return implementations.Array;
    case 'Object': return implementations.Object;
    case 'Function': return implementations.Function;
  }
};

const hasPrototypeMethod = (name, implementations, value) => {
  switch (value) {
    case null: return implementations.Null != null;
    case undefined: return implementations.Undefined != null;
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
      return value.every (Setoid.test);
    }

    if (value.constructor === Object || type (value) === 'Object') {
      return (Object.values (value)).every (Setoid.test);
    }
    return true;
  }

  if (name === 'lte') {
    if (value.constructor === Array || type (value) === 'Array') {
      return value.every (Ord.test);
    }

    if (value.constructor === Object || type (value) === 'Object') {
      return (Object.values (value)).every (Ord.test);
    }
  }

  return customPrototypeMethod (implementations, value) != null;
};

const prototypeMethod = (name, implementations, value) => {
  // Single-member types are identified most quickly.
  switch (value) {
    case null: return implementations.Null;
    case undefined: return implementations.Undefined;
  }

  // Check if we can dispatch to a Fantasy Land method.
  const prefixedName = 'fantasy-land/' + name;
  const isPrototype = value.constructor == null ||
                      value.constructor.prototype !== value;
  if (isPrototype && typeof value[prefixedName] === 'function') {
    return value[prefixedName];
  }

  // Separate function for performance reasons.
  return customPrototypeMethod (implementations, value);
};

const customPrototypeMethod = (implementations, value) => {
  // Checking constructor reference has the best performance.
  switch (value.constructor) {
    case Boolean: return implementations.Boolean;
    case Number: return implementations.Number;
    case Date: return implementations.Date;
    case RegExp: return implementations.RegExp;
    case String: return implementations.String;
    case Array: return implementations.Array;
    case Function: return implementations.Function;
  }

  // For all other values we use their type-identity.
  switch (type (value)) {
    case 'Arguments': return implementations.Arguments;
    case 'Error': return implementations.Error;
    case 'Object': return implementations.Object;

    // A repeat of the constructor-matched values, in case they were created
    // in other contexts (e.g. vm.runInNewContext).
    case 'Boolean': return implementations.Boolean;
    case 'Number': return implementations.Number;
    case 'Date': return implementations.Date;
    case 'RegExp': return implementations.RegExp;
    case 'String': return implementations.String;
    case 'Array': return implementations.Array;
    case 'Function': return implementations.Function;
  }
};

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
//. const Foo = TypeClass (
//.   'my-package/Foo',
//.   'http://example.com/my-package#Foo',
//.   [],
//.   hasMethod ('foo')
//. );
//.
//. //    Bar :: TypeClass
//. const Bar = TypeClass (
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
export const TypeClass = (name, url, dependencies, test) => ({
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
  const version = '13.0.0';  // updated programmatically

  const staticMethods = requirements.filter (req => (
    req.location === Constructor
  ));

  const prototypeMethods = requirements.filter (req => (
    req.location === Value
  ));

  const typeClass = TypeClass (
    `sanctuary-type-classes/${_name}`,
    `https://github.com/sanctuary-js/sanctuary-type-classes/tree/v${version}#${_name}`,
    dependencies,
    ($seen => x => {
      if ($seen.includes (x)) return true;

      $seen.push (x);
      try {
        return (
          staticMethods.every (({name, implementations}) => (
            x != null &&
            staticMethod (name, implementations, x.constructor) != null
          )) &&
          prototypeMethods.every (({name, implementations}) => (
            hasPrototypeMethod (name, implementations, x)
          ))
        );
      } finally {
        $seen.pop ();
      }
    }) ([])
  );

  typeClass.methods = {};

  staticMethods.forEach (({name, arity, implementations}) => {
    typeClass.methods[name] = (
      arity === 0 ? typeRep => (
        staticMethod (name, implementations, typeRep) ()
      ) :
      arity === 1 ? (typeRep, a) => (
        staticMethod (name, implementations, typeRep) (a)
      ) :
      (typeRep, a, b) => (
        staticMethod (name, implementations, typeRep) (a, b)
      )
    );
  });

  prototypeMethods.forEach (({name, arity, implementations}) => {
    typeClass.methods[name] = (
      arity === 0 ? context => (
        (prototypeMethod (name, implementations, context)).call (context)
      ) :
      arity === 1 ? (a, context) => (
        (prototypeMethod (name, implementations, context)).call (context, a)
      ) :
      (a, b, context) => (
        (prototypeMethod (name, implementations, context))
        .call (context, a, b)
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
//. > Setoid.test (null)
//. true
//.
//. > Setoid.test (Useless)
//. false
//.
//. > Setoid.test ([1, 2, 3])
//. true
//.
//. > Setoid.test ([Useless])
//. false
//. ```
export const Setoid = $ ('Setoid', [], [{
  name: 'equals',
  location: Value,
  arity: 1,
  implementations: {
    Arguments: Arguments$prototype$equals,
    Array: Array$prototype$equals,
    Boolean: Boolean$prototype$equals,
    Date: Date$prototype$equals,
    Error: Error$prototype$equals,
    Function: Function$prototype$equals,
    Null: Null$prototype$equals,
    Number: Number$prototype$equals,
    Object: Object$prototype$equals,
    RegExp: RegExp$prototype$equals,
    String: String$prototype$equals,
    Undefined: Undefined$prototype$equals,
  },
}]);

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
//.
//. > Ord.test ([1, 2, 3])
//. true
//.
//. > Ord.test ([Math.sqrt])
//. false
//. ```
export const Ord = $ ('Ord', [Setoid], [{
  name: 'lte',
  location: Value,
  arity: 1,
  implementations: {
    Arguments: Arguments$prototype$lte,
    Array: Array$prototype$lte,
    Boolean: Boolean$prototype$lte,
    Date: Date$prototype$lte,
    Null: Null$prototype$lte,
    Number: Number$prototype$lte,
    Object: Object$prototype$lte,
    String: String$prototype$lte,
    Undefined: Undefined$prototype$lte,
  },
}]);

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
export const Semigroupoid = $ ('Semigroupoid', [], [{
  name: 'compose',
  location: Value,
  arity: 1,
  implementations: {
    Function: Function$prototype$compose,
  },
}]);

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
export const Category = $ ('Category', [Semigroupoid], [{
  name: 'id',
  location: Constructor,
  arity: 0,
  implementations: {
    Function: Function$id,
  },
}]);

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
export const Semigroup = $ ('Semigroup', [], [{
  name: 'concat',
  location: Value,
  arity: 1,
  implementations: {
    Array: Array$prototype$concat,
    Object: Object$prototype$concat,
    String: String$prototype$concat,
  },
}]);

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
export const Monoid = $ ('Monoid', [Semigroup], [{
  name: 'empty',
  location: Constructor,
  arity: 0,
  implementations: {
    Array: Array$empty,
    Object: Object$empty,
    String: String$empty,
  },
}]);

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
export const Group = $ ('Group', [Monoid], [{
  name: 'invert',
  location: Value,
  arity: 0,
  implementations: {},
}]);

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
export const Filterable = $ ('Filterable', [], [{
  name: 'filter',
  location: Value,
  arity: 1,
  implementations: {
    Array: Array$prototype$filter,
    Object: Object$prototype$filter,
  },
}]);

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
export const Functor = $ ('Functor', [], [{
  name: 'map',
  location: Value,
  arity: 1,
  implementations: {
    Array: Array$prototype$map,
    Function: Function$prototype$map,
    Object: Object$prototype$map,
  },
}]);

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
export const Bifunctor = $ ('Bifunctor', [Functor], [{
  name: 'bimap',
  location: Value,
  arity: 2,
  implementations: {},
}]);

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
export const Profunctor = $ ('Profunctor', [Functor], [{
  name: 'promap',
  location: Value,
  arity: 2,
  implementations: {
    Function: Function$prototype$promap,
  },
}]);

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
export const Apply = $ ('Apply', [Functor], [{
  name: 'ap',
  location: Value,
  arity: 1,
  implementations: {
    Array: Array$prototype$ap,
    Function: Function$prototype$ap,
    Object: Object$prototype$ap,
  },
}]);

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
export const Applicative = $ ('Applicative', [Apply], [{
  name: 'of',
  location: Constructor,
  arity: 1,
  implementations: {
    Array: Array$of,
    Function: Function$of,
  },
}]);

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
export const Chain = $ ('Chain', [Apply], [{
  name: 'chain',
  location: Value,
  arity: 1,
  implementations: {
    Array: Array$prototype$chain,
    Function: Function$prototype$chain,
  },
}]);

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
export const ChainRec = $ ('ChainRec', [Chain], [{
  name: 'chainRec',
  location: Constructor,
  arity: 2,
  implementations: {
    Array: Array$chainRec,
    Function: Function$chainRec,
  },
}]);

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
export const Monad = $ ('Monad', [Applicative, Chain], []);

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
export const Alt = $ ('Alt', [Functor], [{
  name: 'alt',
  location: Value,
  arity: 1,
  implementations: {
    Array: Array$prototype$alt,
    Object: Object$prototype$alt,
  },
}]);

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
export const Plus = $ ('Plus', [Alt], [{
  name: 'zero',
  location: Constructor,
  arity: 0,
  implementations: {
    Array: Array$zero,
    Object: Object$zero,
  },
}]);

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
export const Alternative = $ ('Alternative', [Applicative, Plus], []);

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
export const Foldable = $ ('Foldable', [], [{
  name: 'reduce',
  location: Value,
  arity: 2,
  implementations: {
    Array: Array$prototype$reduce,
    Object: Object$prototype$reduce,
  },
}]);

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
export const Traversable = $ ('Traversable', [Functor, Foldable], [{
  name: 'traverse',
  location: Value,
  arity: 2,
  implementations: {
    Array: Array$prototype$traverse,
    Object: Object$prototype$traverse,
  },
}]);

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
export const Extend = $ ('Extend', [Functor], [{
  name: 'extend',
  location: Value,
  arity: 1,
  implementations: {
    Array: Array$prototype$extend,
    Function: Function$prototype$extend,
  },
}]);

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
export const Comonad = $ ('Comonad', [Extend], [{
  name: 'extract',
  location: Value,
  arity: 0,
  implementations: {},
}]);

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
export const Contravariant = $ ('Contravariant', [], [{
  name: 'contramap',
  location: Value,
  arity: 1,
  implementations: {
    Function: Function$prototype$contramap,
  },
}]);

//# equals :: Setoid a => (a, a) -> Boolean
//.
//. Returns `true` if its arguments are equal; `false` otherwise.
//.
//. > [!IMPORTANT]
//. >
//. > Arguments must be Setoids of the same type; providing arguments of
//. > differing types, or non-Setoid arguments, has undefined behaviour.
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
export const equals = (() => {
  //  $pairs :: Array (Array2 Any Any)
  const $pairs = [];

  return (x, y) => {
    //  This algorithm for comparing circular data structures was
    //  suggested in <http://stackoverflow.com/a/40622794/312785>.
    if ($pairs.some (([xx, yy]) => xx === x && yy === y)) {
      return true;
    }

    $pairs.push ([x, y]);
    try {
      return Setoid.methods.equals (y, x);
    } finally {
      $pairs.pop ();
    }
  };
}) ();

//# lt :: Ord a => (a, a) -> Boolean
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
export const lt = (x, y) => !(lte (y, x));

//# lte :: Ord a => (a, a) -> Boolean
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
export const lte = (() => {
  //  $pairs :: Array (Array2 Any Any)
  const $pairs = [];

  return (x, y) => {
    //  This algorithm for comparing circular data structures was
    //  suggested in <http://stackoverflow.com/a/40622794/312785>.
    if ($pairs.some (([xx, yy]) => xx === x && yy === y)) {
      return equals (x, y);
    }

    $pairs.push ([x, y]);
    try {
      return Ord.methods.lte (y, x);
    } finally {
      $pairs.pop ();
    }
  };
}) ();

//# gt :: Ord a => (a, a) -> Boolean
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
export const gt = (x, y) => lt (y, x);

//# gte :: Ord a => (a, a) -> Boolean
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
export const gte = (x, y) => lte (y, x);

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
export const min = (x, y) => lte (x, y) ? x : y;

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
export const max = (x, y) => lte (x, y) ? y : x;

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
export const clamp = (lower, upper, x) => max (lower, min (upper, x));

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
export const compose = Semigroupoid.methods.compose;

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
export const id = Category.methods.id;

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
export const concat = (a, b) => Semigroup.methods.concat (b, a);

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
export const empty = Monoid.methods.empty;

//# invert :: Group g => g -> g
//.
//. Function wrapper for [`fantasy-land/invert`][].
//.
//. ```javascript
//. > invert (Sum (5))
//. Sum (-5)
//. ```
export const invert = Group.methods.invert;

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
export const filter = Filterable.methods.filter;

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
export const reject = (pred, filterable) => (
  filter (x => !(pred (x)), filterable)
);

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
export const map = Functor.methods.map;

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
export const flip = (functor, x) => map (f => f (x), functor);

//# bimap :: Bifunctor f => (a -> b, c -> d, f a c) -> f b d
//.
//. Function wrapper for [`fantasy-land/bimap`][].
//.
//. ```javascript
//. > bimap (s => s.toUpperCase (), Math.sqrt, Pair ('foo') (64))
//. Pair ('FOO') (8)
//. ```
export const bimap = Bifunctor.methods.bimap;

//# mapLeft :: Bifunctor f => (a -> b, f a c) -> f b c
//.
//. Maps the given function over the left side of a Bifunctor.
//.
//. ```javascript
//. > mapLeft (Math.sqrt, Pair (64) (9))
//. Pair (8) (9)
//. ```
export const mapLeft = (f, bifunctor) => bimap (f, identity, bifunctor);

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
export const promap = Profunctor.methods.promap;

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
export const ap = Apply.methods.ap;

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
export const lift2 = (f, x, y) => ap (map (f, x), y);

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
export const lift3 = (f, x, y, z) => ap (ap (map (f, x), y), z);

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
export const apFirst = (x, y) => lift2 (x => y => x, x, y);

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
export const apSecond = (x, y) => lift2 (x => y => y, x, y);

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
export const of = Applicative.methods.of;

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
export const append = (x, xs) => concat (xs, of (xs.constructor, x));

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
export const prepend = (x, xs) => concat (of (xs.constructor, x), xs);

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
export const chain = Chain.methods.chain;

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
export const join = chain_ => chain (identity, chain_);

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
export const chainRec = ChainRec.methods.chainRec;

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
export const alt = (a, b) => Alt.methods.alt (b, a);

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
export const zero = Plus.methods.zero;

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
//.
//. > reduce (concat, '', {foo: 'x', bar: 'y', baz: 'z'})
//. 'yzx'
//. ```
export const reduce = Foldable.methods.reduce;

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
export const size = foldable => (
  Array.isArray (foldable)
  ? foldable.length
  : reduce ((n, _) => n + 1, 0, foldable)
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
//. > all (Number.isInteger, [])
//. true
//.
//. > all (Number.isInteger, [1, 2, 3])
//. true
//.
//. > all (Number.isInteger, [0, 0.25, 0.5, 0.75, 1])
//. false
//. ```
export const all = (pred, foldable) => (
  Array.isArray (foldable)
  ? foldable.every (x => pred (x))
  : reduce ((b, x) => b && pred (x), true, foldable)
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
//. > any (Number.isInteger, [])
//. false
//.
//. > any (Number.isInteger, [1, 2, 3])
//. true
//.
//. > any (Number.isInteger, [0, 0.25, 0.5, 0.75, 1])
//. true
//. ```
export const any = (pred, foldable) => (
  Array.isArray (foldable)
  ? foldable.some (x => pred (x))
  : reduce ((b, x) => b || pred (x), false, foldable)
);

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
export const none = (pred, foldable) => !(any (pred, foldable));

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
export const elem = (x, foldable) => any (y => equals (x, y), foldable);

//# intercalate :: (Monoid m, Foldable f) => (m, f m) -> m
//.
//. Concatenates the elements of the given structure, separating each pair
//. of adjacent elements with the given separator.
//.
//. This function is derived from [`concat`](#concat), [`empty`](#empty),
//. and [`reduce`](#reduce).
//.
//. ```javascript
//. > intercalate (', ', [])
//. ''
//.
//. > intercalate (', ', ['foo', 'bar', 'baz'])
//. 'foo, bar, baz'
//.
//. > intercalate (', ', Nil)
//. ''
//.
//. > intercalate (', ', Cons ('foo', Cons ('bar', Cons ('baz', Nil))))
//. 'foo, bar, baz'
//.
//. > intercalate ([0, 0, 0], [])
//. []
//.
//. > intercalate ([0, 0, 0], [[1], [2, 3], [4, 5, 6], [7, 8], [9]])
//. [1, 0, 0, 0, 2, 3, 0, 0, 0, 4, 5, 6, 0, 0, 0, 7, 8, 0, 0, 0, 9]
//. ```
export const intercalate = (separator, foldable) => (
  reduce (
    ({empty, value}, x) => ({
      empty: false,
      value: concat (value, empty ? x : concat (separator, x)),
    }),
    {empty: true, value: empty (separator.constructor)},
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
//. > foldMap (String, f => f.name, [Math.sin, Math.cos, Math.tan])
//. 'sincostan'
//. ```
export const foldMap = (typeRep, f, foldable) => (
  reduce (
    (monoid, x) => concat (monoid, f (x)),
    empty (typeRep),
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
//. > reverse ([1, 2, 3])
//. [3, 2, 1]
//.
//. > reverse (Cons (1, Cons (2, Cons (3, Nil))))
//. Cons (3, Cons (2, Cons (1, Nil)))
//. ```
export const reverse = foldable => {
  //  Fast path for arrays.
  if (Array.isArray (foldable)) return (foldable.slice ()).reverse ();
  const F = foldable.constructor;
  return reduce (
    (xs, x) => concat (of (F, x), xs),
    empty (F),
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
//. > sort (['foo', 'bar', 'baz'])
//. ['bar', 'baz', 'foo']
//.
//. > sort ([Just (2), Nothing, Just (1)])
//. [Nothing, Just (1), Just (2)]
//.
//. > sort (Cons ('foo', Cons ('bar', Cons ('baz', Nil))))
//. Cons ('bar', Cons ('baz', Cons ('foo', Nil)))
//. ```
export const sort = foldable => sortBy (identity, foldable);

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
export const sortBy = (f, foldable) => {
  const rs = reduce ((rs, x) => {
    rs.push ({idx: rs.length, x, fx: f (x)});
    return rs;
  }, [], foldable);

  const lte_ = (r => {
    switch (typeof (r && r.fx)) {
      case 'number':  return (x, y) => x <= y || x !== x;
      case 'string':  return (x, y) => x <= y;
      default:        return lte;
    }
  }) (rs[0]);

  rs.sort ((a, b) => (
    lte_ (a.fx, b.fx) ? lte_ (b.fx, a.fx) ? a.idx - b.idx : -1 : 1
  ));

  if (Array.isArray (foldable)) {
    for (let idx = 0; idx < rs.length; idx += 1) rs[idx] = rs[idx].x;
    return rs;
  }

  const F = foldable.constructor;
  let result = empty (F);
  for (let idx = 0; idx < rs.length; idx += 1) {
    result = concat (result, of (F, rs[idx].x));
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
//. > traverse (Array, x => x, [[1, 2, 3], [4, 5]])
//. [[1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5]]
//.
//. > traverse (Identity, x => Identity (x + 1), [1, 2, 3])
//. Identity ([2, 3, 4])
//. ```
export const traverse = Traversable.methods.traverse;

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
export const sequence = (typeRep, traversable) => (
  traverse (typeRep, identity, traversable)
);

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
export const extend = Extend.methods.extend;

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
export const duplicate = extend_ => extend (identity, extend_);

//# extract :: Comonad w => w a -> a
//.
//. Function wrapper for [`fantasy-land/extract`][].
//.
//. ```javascript
//. > extract (Identity (42))
//. 42
//. ```
export const extract = Comonad.methods.extract;

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
export const contramap = Contravariant.methods.contramap;

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
