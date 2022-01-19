# sanctuary-type-classes

The [Fantasy Land Specification][FL] "specifies interoperability of common
algebraic structures" by defining a number of type classes. For each type
class, it states laws which every member of a type must obey in order for
the type to be a member of the type class. In order for the Maybe type to
be considered a [Functor][], for example, every `Maybe a` value must have
a `fantasy-land/map` method which obeys the identity and composition laws.

This project provides:

  - [`TypeClass`](#TypeClass), a function for defining type classes;
  - one `TypeClass` value for each Fantasy Land type class;
  - lawful Fantasy Land methods for JavaScript's built-in types;
  - one function for each Fantasy Land method; and
  - several functions derived from these functions.

## Type-class hierarchy

<pre>
 <a href="#Setoid">Setoid</a>   <a href="#Semigroupoid">Semigroupoid</a>  <a href="#Semigroup">Semigroup</a>   <a href="#Foldable">Foldable</a>        <a href="#Functor">Functor</a>      <a href="#Contravariant">Contravariant</a>  <a href="#Filterable">Filterable</a>
(<a href="#equals">equals</a>)    (<a href="#compose">compose</a>)    (<a href="#concat">concat</a>)   (<a href="#reduce">reduce</a>)         (<a href="#map">map</a>)        (<a href="#contramap">contramap</a>)    (<a href="#filter">filter</a>)
    |           |           |           \         / | | | | \
    |           |           |            \       /  | | | |  \
    |           |           |             \     /   | | | |   \
    |           |           |              \   /    | | | |    \
    |           |           |               \ /     | | | |     \
   <a href="#Ord">Ord</a>      <a href="#Category">Category</a>     <a href="#Monoid">Monoid</a>         <a href="#Traversable">Traversable</a> | | | |      \
  (<a href="#lte">lte</a>)       (<a href="#id">id</a>)       (<a href="#empty">empty</a>)        (<a href="#traverse">traverse</a>)  / | | \       \
                            |                      /  | |  \       \
                            |                     /   / \   \       \
                            |             <a href="#Profunctor">Profunctor</a> /   \ <a href="#Bifunctor">Bifunctor</a> \
                            |              (<a href="#promap">promap</a>) /     \ (<a href="#bimap">bimap</a>)   \
                            |                      /       \           \
                          <a href="#Group">Group</a>                   /         \           \
                         (<a href="#invert">invert</a>)               <a href="#Alt">Alt</a>        <a href="#Apply">Apply</a>      <a href="#Extend">Extend</a>
                                               (<a href="#alt">alt</a>)        (<a href="#ap">ap</a>)     (<a href="#extend">extend</a>)
                                                /           / \           \
                                               /           /   \           \
                                              /           /     \           \
                                             /           /       \           \
                                            /           /         \           \
                                          <a href="#Plus">Plus</a>    <a href="#Applicative">Applicative</a>    <a href="#Chain">Chain</a>      <a href="#Comonad">Comonad</a>
                                         (<a href="#zero">zero</a>)       (<a href="#of">of</a>)      (<a href="#chain">chain</a>)    (<a href="#extract">extract</a>)
                                            \         / \         / \
                                             \       /   \       /   \
                                              \     /     \     /     \
                                               \   /       \   /       \
                                                \ /         \ /         \
                                            <a href="#Alternative">Alternative</a>    <a href="#Monad">Monad</a>     <a href="#ChainRec">ChainRec</a>
                                                                    (<a href="#chainRec">chainRec</a>)
</pre>

## API

#### <a name="TypeClass" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L609">`TypeClass :: (String, String, Array TypeClass, a -⁠> Boolean) -⁠> TypeClass`</a>

The arguments are:

  - the name of the type class, prefixed by its npm package name;
  - the documentation URL of the type class;
  - an array of dependencies; and
  - a predicate which accepts any JavaScript value and returns `true`
    if the value satisfies the requirements of the type class; `false`
    otherwise.

Example:

```javascript
//    hasMethod :: String -> a -> Boolean
const hasMethod = name => x => x != null && typeof x[name] == 'function';

//    Foo :: TypeClass
const Foo = Z.TypeClass (
  'my-package/Foo',
  'http://example.com/my-package#Foo',
  [],
  hasMethod ('foo')
);

//    Bar :: TypeClass
const Bar = Z.TypeClass (
  'my-package/Bar',
  'http://example.com/my-package#Bar',
  [Foo],
  hasMethod ('bar')
);
```

Types whose values have a `foo` method are members of the Foo type class.
Members of the Foo type class whose values have a `bar` method are also
members of the Bar type class.

Each `TypeClass` value has a `test` field: a function which accepts
any JavaScript value and returns `true` if the value satisfies the
type class's predicate and the predicates of all the type class's
dependencies; `false` otherwise.

`TypeClass` values may be used with [sanctuary-def][type-classes]
to define parametrically polymorphic functions which verify their
type-class constraints at run time.

#### <a name="Setoid" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L740">`Setoid :: TypeClass`</a>

`TypeClass` value for [Setoid][].

```javascript
> Z.Setoid.test (null)
true

> Z.Setoid.test (Useless)
false

> Z.Setoid.test ([1, 2, 3])
true

> Z.Setoid.test ([Useless])
false
```

#### <a name="Ord" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L777">`Ord :: TypeClass`</a>

`TypeClass` value for [Ord][].

```javascript
> Z.Ord.test (0)
true

> Z.Ord.test (Math.sqrt)
false

> Z.Ord.test ([1, 2, 3])
true

> Z.Ord.test ([Math.sqrt])
false
```

#### <a name="Semigroupoid" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L811">`Semigroupoid :: TypeClass`</a>

`TypeClass` value for [Semigroupoid][].

```javascript
> Z.Semigroupoid.test (Math.sqrt)
true

> Z.Semigroupoid.test (0)
false
```

#### <a name="Category" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L831">`Category :: TypeClass`</a>

`TypeClass` value for [Category][].

```javascript
> Z.Category.test (Math.sqrt)
true

> Z.Category.test (0)
false
```

#### <a name="Semigroup" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L851">`Semigroup :: TypeClass`</a>

`TypeClass` value for [Semigroup][].

```javascript
> Z.Semigroup.test ('')
true

> Z.Semigroup.test (0)
false
```

#### <a name="Monoid" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L873">`Monoid :: TypeClass`</a>

`TypeClass` value for [Monoid][].

```javascript
> Z.Monoid.test ('')
true

> Z.Monoid.test (0)
false
```

#### <a name="Group" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L895">`Group :: TypeClass`</a>

`TypeClass` value for [Group][].

```javascript
> Z.Group.test (Sum (0))
true

> Z.Group.test ('')
false
```

#### <a name="Filterable" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L913">`Filterable :: TypeClass`</a>

`TypeClass` value for [Filterable][].

```javascript
> Z.Filterable.test ({})
true

> Z.Filterable.test ('')
false
```

#### <a name="Functor" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L934">`Functor :: TypeClass`</a>

`TypeClass` value for [Functor][].

```javascript
> Z.Functor.test ([])
true

> Z.Functor.test ('')
false
```

#### <a name="Bifunctor" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L956">`Bifunctor :: TypeClass`</a>

`TypeClass` value for [Bifunctor][].

```javascript
> Z.Bifunctor.test (Pair ('foo') (64))
true

> Z.Bifunctor.test ([])
false
```

#### <a name="Profunctor" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L974">`Profunctor :: TypeClass`</a>

`TypeClass` value for [Profunctor][].

```javascript
> Z.Profunctor.test (Math.sqrt)
true

> Z.Profunctor.test ([])
false
```

#### <a name="Apply" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L994">`Apply :: TypeClass`</a>

`TypeClass` value for [Apply][].

```javascript
> Z.Apply.test ([])
true

> Z.Apply.test ('')
false
```

#### <a name="Applicative" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1016">`Applicative :: TypeClass`</a>

`TypeClass` value for [Applicative][].

```javascript
> Z.Applicative.test ([])
true

> Z.Applicative.test ({})
false
```

#### <a name="Chain" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1037">`Chain :: TypeClass`</a>

`TypeClass` value for [Chain][].

```javascript
> Z.Chain.test ([])
true

> Z.Chain.test ({})
false
```

#### <a name="ChainRec" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1058">`ChainRec :: TypeClass`</a>

`TypeClass` value for [ChainRec][].

```javascript
> Z.ChainRec.test ([])
true

> Z.ChainRec.test ({})
false
```

#### <a name="Monad" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1079">`Monad :: TypeClass`</a>

`TypeClass` value for [Monad][].

```javascript
> Z.Monad.test ([])
true

> Z.Monad.test ({})
false
```

#### <a name="Alt" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1092">`Alt :: TypeClass`</a>

`TypeClass` value for [Alt][].

```javascript
> Z.Alt.test ({})
true

> Z.Alt.test ('')
false
```

#### <a name="Plus" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1113">`Plus :: TypeClass`</a>

`TypeClass` value for [Plus][].

```javascript
> Z.Plus.test ({})
true

> Z.Plus.test ('')
false
```

#### <a name="Alternative" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1134">`Alternative :: TypeClass`</a>

`TypeClass` value for [Alternative][].

```javascript
> Z.Alternative.test ([])
true

> Z.Alternative.test ({})
false
```

#### <a name="Foldable" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1147">`Foldable :: TypeClass`</a>

`TypeClass` value for [Foldable][].

```javascript
> Z.Foldable.test ({})
true

> Z.Foldable.test ('')
false
```

#### <a name="Traversable" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1168">`Traversable :: TypeClass`</a>

`TypeClass` value for [Traversable][].

```javascript
> Z.Traversable.test ([])
true

> Z.Traversable.test ('')
false
```

#### <a name="Extend" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1189">`Extend :: TypeClass`</a>

`TypeClass` value for [Extend][].

```javascript
> Z.Extend.test ([])
true

> Z.Extend.test ({})
false
```

#### <a name="Comonad" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1210">`Comonad :: TypeClass`</a>

`TypeClass` value for [Comonad][].

```javascript
> Z.Comonad.test (Identity (0))
true

> Z.Comonad.test ([])
false
```

#### <a name="Contravariant" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1228">`Contravariant :: TypeClass`</a>

`TypeClass` value for [Contravariant][].

```javascript
> Z.Contravariant.test (Math.sqrt)
true

> Z.Contravariant.test ([])
false
```

#### <a name="equals" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1248">`equals :: (a, b) -⁠> Boolean`</a>

Returns `true` if its arguments are equal; `false` otherwise.

Specifically:

  - Arguments with different [type identities][] are unequal.

  - If the first argument has a [`fantasy-land/equals`][] method,
    that method is invoked to determine whether the arguments are
    equal (`fantasy-land/equals` implementations are provided for the
    following built-in types: Null, Undefined, Boolean, Number, Date,
    RegExp, String, Array, Arguments, Error, Object, and Function).

  - Otherwise, the arguments are equal if their
    [entries][`Object.entries`] are equal (according to this algorithm).

The algorithm supports circular data structures. Two arrays are equal
if they have the same index paths and for each path have equal values.
Two arrays which represent `[1, [1, [1, [1, [1, ...]]]]]`, for example,
are equal even if their internal structures differ. Two objects are equal
if they have the same property paths and for each path have equal values.

```javascript
> Z.equals (0, -0)
true

> Z.equals (NaN, NaN)
true

> Z.equals (Cons (1, Cons (2, Nil)), Cons (1, Cons (2, Nil)))
true

> Z.equals (Cons (1, Cons (2, Nil)), Cons (2, Cons (1, Nil)))
false
```

#### <a name="lt" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1308">`lt :: (a, b) -⁠> Boolean`</a>

Returns `true` if its arguments are of the same type and the first is
less than the second according to the type's [`fantasy-land/lte`][]
method; `false` otherwise.

This function is derived from [`lte`](#lte).

See also [`gt`](#gt) and [`gte`](#gte).

```javascript
> Z.lt (0, 0)
false

> Z.lt (0, 1)
true

> Z.lt (1, 0)
false
```

#### <a name="lte" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1330">`lte :: (a, b) -⁠> Boolean`</a>

Returns `true` if its arguments are of the same type and the first
is less than or equal to the second according to the type's
[`fantasy-land/lte`][] method; `false` otherwise.

`fantasy-land/lte` implementations are provided for the following
built-in types: Null, Undefined, Boolean, Number, Date, String, Array,
Arguments, and Object.

The algorithm supports circular data structures in the same manner as
[`equals`](#equals).

See also [`lt`](#lt), [`gt`](#gt), and [`gte`](#gte).

```javascript
> Z.lte (0, 0)
true

> Z.lte (0, 1)
true

> Z.lte (1, 0)
false
```

#### <a name="gt" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1377">`gt :: (a, b) -⁠> Boolean`</a>

Returns `true` if its arguments are of the same type and the first is
greater than the second according to the type's [`fantasy-land/lte`][]
method; `false` otherwise.

This function is derived from [`lte`](#lte).

See also [`lt`](#lt) and [`gte`](#gte).

```javascript
> Z.gt (0, 0)
false

> Z.gt (0, 1)
false

> Z.gt (1, 0)
true
```

#### <a name="gte" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1399">`gte :: (a, b) -⁠> Boolean`</a>

Returns `true` if its arguments are of the same type and the first
is greater than or equal to the second according to the type's
[`fantasy-land/lte`][] method; `false` otherwise.

This function is derived from [`lte`](#lte).

See also [`lt`](#lt) and [`gt`](#gt).

```javascript
> Z.gte (0, 0)
true

> Z.gte (0, 1)
false

> Z.gte (1, 0)
true
```

#### <a name="min" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1421">`min :: Ord a => (a, a) -⁠> a`</a>

Returns the smaller of its two arguments.

This function is derived from [`lte`](#lte).

See also [`max`](#max).

```javascript
> Z.min (10, 2)
2

> Z.min (new Date ('1999-12-31'), new Date ('2000-01-01'))
new Date ('1999-12-31')

> Z.min ('10', '2')
'10'
```

#### <a name="max" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1441">`max :: Ord a => (a, a) -⁠> a`</a>

Returns the larger of its two arguments.

This function is derived from [`lte`](#lte).

See also [`min`](#min).

```javascript
> Z.max (10, 2)
10

> Z.max (new Date ('1999-12-31'), new Date ('2000-01-01'))
new Date ('2000-01-01')

> Z.max ('10', '2')
'2'
```

#### <a name="clamp" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1461">`clamp :: Ord a => (a, a, a) -⁠> a`</a>

Takes a lower bound, an upper bound, and a value of the same type.
Returns the value if it is within the bounds; the nearer bound otherwise.

This function is derived from [`min`](#min) and [`max`](#max).

```javascript
> Z.clamp (0, 100, 42)
42

> Z.clamp (0, 100, -1)
0

> Z.clamp ('A', 'Z', '~')
'Z'
```

#### <a name="compose" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1480">`compose :: Semigroupoid c => (c j k, c i j) -⁠> c i k`</a>

Function wrapper for [`fantasy-land/compose`][].

`fantasy-land/compose` implementations are provided for the following
built-in types: Function.

```javascript
> Z.compose (Math.sqrt, x => x + 1) (99)
10
```

#### <a name="id" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1493">`id :: Category c => TypeRep c -⁠> c`</a>

Function wrapper for [`fantasy-land/id`][].

`fantasy-land/id` implementations are provided for the following
built-in types: Function.

```javascript
> Z.id (Function) ('foo')
'foo'
```

#### <a name="concat" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1506">`concat :: Semigroup a => (a, a) -⁠> a`</a>

Function wrapper for [`fantasy-land/concat`][].

`fantasy-land/concat` implementations are provided for the following
built-in types: String, Array, and Object.

```javascript
> Z.concat ('abc', 'def')
'abcdef'

> Z.concat ([1, 2, 3], [4, 5, 6])
[1, 2, 3, 4, 5, 6]

> Z.concat ({x: 1, y: 2}, {y: 3, z: 4})
{x: 1, y: 3, z: 4}

> Z.concat (Cons ('foo', Cons ('bar', Cons ('baz', Nil))), Cons ('quux', Nil))
Cons ('foo', Cons ('bar', Cons ('baz', Cons ('quux', Nil))))
```

#### <a name="empty" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1528">`empty :: Monoid m => TypeRep m -⁠> m`</a>

Function wrapper for [`fantasy-land/empty`][].

`fantasy-land/empty` implementations are provided for the following
built-in types: String, Array, and Object.

```javascript
> Z.empty (String)
''

> Z.empty (Array)
[]

> Z.empty (Object)
{}

> Z.empty (List)
Nil
```

#### <a name="invert" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1550">`invert :: Group g => g -⁠> g`</a>

Function wrapper for [`fantasy-land/invert`][].

```javascript
> Z.invert (Sum (5))
Sum (-5)
```

#### <a name="filter" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1560">`filter :: Filterable f => (a -⁠> Boolean, f a) -⁠> f a`</a>

Function wrapper for [`fantasy-land/filter`][]. Discards every element
which does not satisfy the predicate.

`fantasy-land/filter` implementations are provided for the following
built-in types: Array and Object.

See also [`reject`](#reject).

```javascript
> Z.filter (x => x % 2 == 1, [1, 2, 3])
[1, 3]

> Z.filter (x => x % 2 == 1, {x: 1, y: 2, z: 3})
{x: 1, z: 3}

> Z.filter (x => x % 2 == 1, Cons (1, Cons (2, Cons (3, Nil))))
Cons (1, Cons (3, Nil))

> Z.filter (x => x % 2 == 1, Nothing)
Nothing

> Z.filter (x => x % 2 == 1, Just (0))
Nothing

> Z.filter (x => x % 2 == 1, Just (1))
Just (1)
```

#### <a name="reject" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1591">`reject :: Filterable f => (a -⁠> Boolean, f a) -⁠> f a`</a>

Discards every element which satisfies the predicate.

This function is derived from [`filter`](#filter).

```javascript
> Z.reject (x => x % 2 == 1, [1, 2, 3])
[2]

> Z.reject (x => x % 2 == 1, {x: 1, y: 2, z: 3})
{y: 2}

> Z.reject (x => x % 2 == 1, Cons (1, Cons (2, Cons (3, Nil))))
Cons (2, Nil)

> Z.reject (x => x % 2 == 1, Nothing)
Nothing

> Z.reject (x => x % 2 == 1, Just (0))
Just (0)

> Z.reject (x => x % 2 == 1, Just (1))
Nothing
```

#### <a name="map" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1618">`map :: Functor f => (a -⁠> b, f a) -⁠> f b`</a>

Function wrapper for [`fantasy-land/map`][].

`fantasy-land/map` implementations are provided for the following
built-in types: Array, Object, and Function.

```javascript
> Z.map (Math.sqrt, [1, 4, 9])
[1, 2, 3]

> Z.map (Math.sqrt, {x: 1, y: 4, z: 9})
{x: 1, y: 2, z: 3}

> Z.map (Math.sqrt, s => s.length) ('Sanctuary')
3

> Z.map (Math.sqrt, Pair ('foo') (64))
Pair ('foo') (8)

> Z.map (Math.sqrt, Nil)
Nil

> Z.map (Math.sqrt, Cons (1, Cons (4, Cons (9, Nil))))
Cons (1, Cons (2, Cons (3, Nil)))
```

#### <a name="flip" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1646">`flip :: Functor f => (f (a -⁠> b), a) -⁠> f b`</a>

Maps over the given functions, applying each to the given value.

This function is derived from [`map`](#map).

```javascript
> Z.flip (x => y => x + y, '!') ('foo')
'foo!'

> Z.flip ([Math.floor, Math.ceil], 1.5)
[1, 2]

> Z.flip ({floor: Math.floor, ceil: Math.ceil}, 1.5)
{floor: 1, ceil: 2}

> Z.flip (Cons (Math.floor, Cons (Math.ceil, Nil)), 1.5)
Cons (1, Cons (2, Nil))
```

#### <a name="bimap" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1667">`bimap :: Bifunctor f => (a -⁠> b, c -⁠> d, f a c) -⁠> f b d`</a>

Function wrapper for [`fantasy-land/bimap`][].

```javascript
> Z.bimap (s => s.toUpperCase (), Math.sqrt, Pair ('foo') (64))
Pair ('FOO') (8)
```

#### <a name="mapLeft" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1677">`mapLeft :: Bifunctor f => (a -⁠> b, f a c) -⁠> f b c`</a>

Maps the given function over the left side of a Bifunctor.

```javascript
> Z.mapLeft (Math.sqrt, Pair (64) (9))
Pair (8) (9)
```

#### <a name="promap" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1687">`promap :: Profunctor p => (a -⁠> b, c -⁠> d, p b c) -⁠> p a d`</a>

Function wrapper for [`fantasy-land/promap`][].

`fantasy-land/promap` implementations are provided for the following
built-in types: Function.

```javascript
> Z.promap (Math.abs, x => x + 1, Math.sqrt) (-100)
11
```

#### <a name="ap" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1700">`ap :: Apply f => (f (a -⁠> b), f a) -⁠> f b`</a>

Function wrapper for [`fantasy-land/ap`][].

`fantasy-land/ap` implementations are provided for the following
built-in types: Array, Object, and Function.

```javascript
> Z.ap ([Math.sqrt, x => x * x], [1, 4, 9, 16, 25])
[1, 2, 3, 4, 5, 1, 16, 81, 256, 625]

> Z.ap ({a: Math.sqrt, b: x => x * x}, {a: 16, b: 10, c: 1})
{a: 4, b: 100}

> Z.ap (s => n => s.slice (0, n), s => Math.ceil (s.length / 2)) ('Haskell')
'Hask'

> Z.ap (Identity (Math.sqrt), Identity (64))
Identity (8)

> Z.ap (Cons (Math.sqrt, Cons (x => x * x, Nil)), Cons (16, Cons (100, Nil)))
Cons (4, Cons (10, Cons (256, Cons (10000, Nil))))
```

#### <a name="lift2" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1725">`lift2 :: Apply f => (a -⁠> b -⁠> c, f a, f b) -⁠> f c`</a>

Lifts `a -> b -> c` to `Apply f => f a -> f b -> f c` and returns the
result of applying this to the given arguments.

This function is derived from [`map`](#map) and [`ap`](#ap).

See also [`lift3`](#lift3).

```javascript
> Z.lift2 (x => y => Math.pow (x, y), [10], [1, 2, 3])
[10, 100, 1000]

> Z.lift2 (x => y => Math.pow (x, y), Identity (10), Identity (3))
Identity (1000)
```

#### <a name="lift3" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1743">`lift3 :: Apply f => (a -⁠> b -⁠> c -⁠> d, f a, f b, f c) -⁠> f d`</a>

Lifts `a -> b -> c -> d` to `Apply f => f a -> f b -> f c -> f d` and
returns the result of applying this to the given arguments.

This function is derived from [`map`](#map) and [`ap`](#ap).

See also [`lift2`](#lift2).

```javascript
> Z.lift3 (x => y => z => x + z + y,
.          ['<', '['],
.          ['>', ']'],
.          ['foo', 'bar', 'baz'])
[ '<foo>', '<bar>', '<baz>',
. '<foo]', '<bar]', '<baz]',
. '[foo>', '[bar>', '[baz>',
. '[foo]', '[bar]', '[baz]' ]

> Z.lift3 (x => y => z => x + z + y,
.          Identity ('<'),
.          Identity ('>'),
.          Identity ('baz'))
Identity ('<baz>')
```

#### <a name="apFirst" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1770">`apFirst :: Apply f => (f a, f b) -⁠> f a`</a>

Combines two effectful actions, keeping only the result of the first.
Equivalent to Haskell's `(<*)` function.

This function is derived from [`lift2`](#lift2).

See also [`apSecond`](#apSecond).

```javascript
> Z.apFirst ([1, 2], [3, 4])
[1, 1, 2, 2]

> Z.apFirst (Identity (1), Identity (2))
Identity (1)
```

#### <a name="apSecond" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1788">`apSecond :: Apply f => (f a, f b) -⁠> f b`</a>

Combines two effectful actions, keeping only the result of the second.
Equivalent to Haskell's `(*>)` function.

This function is derived from [`lift2`](#lift2).

See also [`apFirst`](#apFirst).

```javascript
> Z.apSecond ([1, 2], [3, 4])
[3, 4, 3, 4]

> Z.apSecond (Identity (1), Identity (2))
Identity (2)
```

#### <a name="of" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1806">`of :: Applicative f => (TypeRep f, a) -⁠> f a`</a>

Function wrapper for [`fantasy-land/of`][].

`fantasy-land/of` implementations are provided for the following
built-in types: Array and Function.

```javascript
> Z.of (Array, 42)
[42]

> Z.of (Function, 42) (null)
42

> Z.of (List, 42)
Cons (42, Nil)
```

#### <a name="append" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1825">`append :: (Applicative f, Semigroup (f a)) => (a, f a) -⁠> f a`</a>

Returns the result of appending the first argument to the second.

This function is derived from [`concat`](#concat) and [`of`](#of).

See also [`prepend`](#prepend).

```javascript
> Z.append (3, [1, 2])
[1, 2, 3]

> Z.append (3, Cons (1, Cons (2, Nil)))
Cons (1, Cons (2, Cons (3, Nil)))
```

#### <a name="prepend" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1842">`prepend :: (Applicative f, Semigroup (f a)) => (a, f a) -⁠> f a`</a>

Returns the result of prepending the first argument to the second.

This function is derived from [`concat`](#concat) and [`of`](#of).

See also [`append`](#append).

```javascript
> Z.prepend (1, [2, 3])
[1, 2, 3]

> Z.prepend (1, Cons (2, Cons (3, Nil)))
Cons (1, Cons (2, Cons (3, Nil)))
```

#### <a name="chain" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1859">`chain :: Chain m => (a -⁠> m b, m a) -⁠> m b`</a>

Function wrapper for [`fantasy-land/chain`][].

`fantasy-land/chain` implementations are provided for the following
built-in types: Array and Function.

```javascript
> Z.chain (x => [x, x], [1, 2, 3])
[1, 1, 2, 2, 3, 3]

> Z.chain (x => x % 2 == 1 ? Z.of (List, x) : Nil,
.          Cons (1, Cons (2, Cons (3, Nil))))
Cons (1, Cons (3, Nil))

> Z.chain (n => s => s.slice (0, n),
.          s => Math.ceil (s.length / 2))
.         ('Haskell')
'Hask'
```

#### <a name="join" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1881">`join :: Chain m => m (m a) -⁠> m a`</a>

Removes one level of nesting from a nested monadic structure.

This function is derived from [`chain`](#chain).

```javascript
> Z.join ([[1], [2], [3]])
[1, 2, 3]

> Z.join ([[[1, 2, 3]]])
[[1, 2, 3]]

> Z.join (Identity (Identity (1)))
Identity (1)
```

#### <a name="chainRec" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1899">`chainRec :: ChainRec m => (TypeRep m, (a -⁠> c, b -⁠> c, a) -⁠> m c, a) -⁠> m b`</a>

Function wrapper for [`fantasy-land/chainRec`][].

`fantasy-land/chainRec` implementations are provided for the following
built-in types: Array.

```javascript
> Z.chainRec (
.   Array,
.   (next, done, s) => s.length == 2 ? [s + '!', s + '?'].map (done)
.                                    : [s + 'o', s + 'n'].map (next),
.   ''
. )
['oo!', 'oo?', 'on!', 'on?', 'no!', 'no?', 'nn!', 'nn?']
```

#### <a name="alt" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1917">`alt :: Alt f => (f a, f a) -⁠> f a`</a>

Function wrapper for [`fantasy-land/alt`][].

`fantasy-land/alt` implementations are provided for the following
built-in types: Array and Object.

```javascript
> Z.alt ([1, 2, 3], [4, 5, 6])
[1, 2, 3, 4, 5, 6]

> Z.alt (Nothing, Nothing)
Nothing

> Z.alt (Nothing, Just (1))
Just (1)

> Z.alt (Just (2), Just (3))
Just (2)
```

#### <a name="zero" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1939">`zero :: Plus f => TypeRep f -⁠> f a`</a>

Function wrapper for [`fantasy-land/zero`][].

`fantasy-land/zero` implementations are provided for the following
built-in types: Array and Object.

```javascript
> Z.zero (Array)
[]

> Z.zero (Object)
{}

> Z.zero (Maybe)
Nothing
```

#### <a name="reduce" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1958">`reduce :: Foldable f => ((b, a) -⁠> b, b, f a) -⁠> b`</a>

Function wrapper for [`fantasy-land/reduce`][].

`fantasy-land/reduce` implementations are provided for the following
built-in types: Array and Object.

```javascript
> Z.reduce ((xs, x) => [x].concat (xs), [], [1, 2, 3])
[3, 2, 1]

> Z.reduce (Z.concat, '', Cons ('foo', Cons ('bar', Cons ('baz', Nil))))
'foobarbaz'

> Z.reduce (Z.concat, '', {foo: 'x', bar: 'y', baz: 'z'})
'yzx'
```

#### <a name="size" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L1977">`size :: Foldable f => f a -⁠> Integer`</a>

Returns the number of elements of the given structure.

This function is derived from [`reduce`](#reduce).

```javascript
> Z.size ([])
0

> Z.size (['foo', 'bar', 'baz'])
3

> Z.size (Nil)
0

> Z.size (Cons ('foo', Cons ('bar', Cons ('baz', Nil))))
3
```

#### <a name="all" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L2002">`all :: Foldable f => (a -⁠> Boolean, f a) -⁠> Boolean`</a>

Returns `true` if all the elements of the structure satisfy the
predicate; `false` otherwise.

This function is derived from [`reduce`](#reduce).

See also [`any`](#any) and [`none`](#none).

```javascript
> Z.all (Number.isInteger, [])
true

> Z.all (Number.isInteger, [1, 2, 3])
true

> Z.all (Number.isInteger, [0, 0.25, 0.5, 0.75, 1])
false
```

#### <a name="any" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L2027">`any :: Foldable f => (a -⁠> Boolean, f a) -⁠> Boolean`</a>

Returns `true` if any element of the structure satisfies the predicate;
`false` otherwise.

This function is derived from [`reduce`](#reduce).

See also [`all`](#all) and [`none`](#none).

```javascript
> Z.any (Number.isInteger, [])
false

> Z.any (Number.isInteger, [1, 2, 3])
true

> Z.any (Number.isInteger, [0, 0.25, 0.5, 0.75, 1])
true
```

#### <a name="none" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L2052">`none :: Foldable f => (a -⁠> Boolean, f a) -⁠> Boolean`</a>

Returns `true` if none of the elements of the structure satisfies the
predicate; `false` otherwise.

This function is derived from [`any`](#any). `Z.none (pred, foldable)` is
equivalent to `!(Z.any (pred, foldable))`.

See also [`all`](#all).

```javascript
> Z.none (Number.isInteger, [])
true

> Z.none (Number.isInteger, [0, 0.25, 0.5, 0.75, 1])
false
```

#### <a name="elem" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L2071">`elem :: (Setoid a, Foldable f) => (a, f a) -⁠> Boolean`</a>

Takes a value and a structure and returns `true` if the
value is an element of the structure; `false` otherwise.

This function is derived from [`equals`](#equals) and
[`reduce`](#reduce).

```javascript
> Z.elem ('c', ['a', 'b', 'c'])
true

> Z.elem ('x', ['a', 'b', 'c'])
false

> Z.elem (3, {x: 1, y: 2, z: 3})
true

> Z.elem (8, {x: 1, y: 2, z: 3})
false

> Z.elem (0, Just (0))
true

> Z.elem (0, Just (1))
false

> Z.elem (0, Nothing)
false
```

#### <a name="intercalate" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L2103">`intercalate :: (Monoid m, Foldable f) => (m, f m) -⁠> m`</a>

Concatenates the elements of the given structure, separating each pair
of adjacent elements with the given separator.

This function is derived from [`concat`](#concat), [`empty`](#empty),
and [`reduce`](#reduce).

```javascript
> Z.intercalate (', ', [])
''

> Z.intercalate (', ', ['foo', 'bar', 'baz'])
'foo, bar, baz'

> Z.intercalate (', ', Nil)
''

> Z.intercalate (', ', Cons ('foo', Cons ('bar', Cons ('baz', Nil))))
'foo, bar, baz'

> Z.intercalate ([0, 0, 0], [])
[]

> Z.intercalate ([0, 0, 0], [[1], [2, 3], [4, 5, 6], [7, 8], [9]])
[1, 0, 0, 0, 2, 3, 0, 0, 0, 4, 5, 6, 0, 0, 0, 7, 8, 0, 0, 0, 9]
```

#### <a name="foldMap" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L2142">`foldMap :: (Monoid m, Foldable f) => (TypeRep m, a -⁠> m, f a) -⁠> m`</a>

Deconstructs a foldable by mapping every element to a monoid and
concatenating the results.

This function is derived from [`concat`](#concat), [`empty`](#empty),
and [`reduce`](#reduce).

```javascript
> Z.foldMap (String, f => f.name, [Math.sin, Math.cos, Math.tan])
'sincostan'
```

#### <a name="reverse" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L2162">`reverse :: (Applicative f, Foldable f, Monoid (f a)) => f a -⁠> f a`</a>

Reverses the elements of the given structure.

This function is derived from [`concat`](#concat), [`empty`](#empty),
[`of`](#of), and [`reduce`](#reduce).

```javascript
> Z.reverse ([1, 2, 3])
[3, 2, 1]

> Z.reverse (Cons (1, Cons (2, Cons (3, Nil))))
Cons (3, Cons (2, Cons (1, Nil)))
```

#### <a name="sort" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L2187">`sort :: (Ord a, Applicative f, Foldable f, Monoid (f a)) => f a -⁠> f a`</a>

Performs a [stable sort][] of the elements of the given structure,
using [`lte`](#lte) for comparisons.

This function is derived from [`lte`](#lte), [`concat`](#concat),
[`empty`](#empty), [`of`](#of), and [`reduce`](#reduce).

See also [`sortBy`](#sortBy).

```javascript
> Z.sort (['foo', 'bar', 'baz'])
['bar', 'baz', 'foo']

> Z.sort ([Just (2), Nothing, Just (1)])
[Nothing, Just (1), Just (2)]

> Z.sort (Cons ('foo', Cons ('bar', Cons ('baz', Nil))))
Cons ('bar', Cons ('baz', Cons ('foo', Nil)))
```

#### <a name="sortBy" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L2209">`sortBy :: (Ord b, Applicative f, Foldable f, Monoid (f a)) => (a -⁠> b, f a) -⁠> f a`</a>

Performs a [stable sort][] of the elements of the given structure,
using [`lte`](#lte) to compare the values produced by applying the
given function to each element of the structure.

This function is derived from [`lte`](#lte), [`concat`](#concat),
[`empty`](#empty), [`of`](#of), and [`reduce`](#reduce).

See also [`sort`](#sort).

```javascript
> Z.sortBy (s => s.length, ['red', 'green', 'blue'])
['red', 'blue', 'green']

> Z.sortBy (s => s.length, ['black', 'white'])
['black', 'white']

> Z.sortBy (s => s.length, ['white', 'black'])
['white', 'black']

> Z.sortBy (s => s.length, Cons ('red', Cons ('green', Cons ('blue', Nil))))
Cons ('red', Cons ('blue', Cons ('green', Nil)))
```

#### <a name="traverse" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L2264">`traverse :: (Applicative f, Traversable t) => (TypeRep f, a -⁠> f b, t a) -⁠> f (t b)`</a>

Function wrapper for [`fantasy-land/traverse`][].

`fantasy-land/traverse` implementations are provided for the following
built-in types: Array and Object.

See also [`sequence`](#sequence).

```javascript
> Z.traverse (Array, x => x, [[1, 2, 3], [4, 5]])
[[1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5]]

> Z.traverse (Identity, x => Identity (x + 1), [1, 2, 3])
Identity ([2, 3, 4])
```

#### <a name="sequence" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L2282">`sequence :: (Applicative f, Traversable t) => (TypeRep f, t (f a)) -⁠> f (t a)`</a>

Inverts the given `t (f a)` to produce an `f (t a)`.

This function is derived from [`traverse`](#traverse).

```javascript
> Z.sequence (Array, Identity ([1, 2, 3]))
[Identity (1), Identity (2), Identity (3)]

> Z.sequence (Identity, [Identity (1), Identity (2), Identity (3)])
Identity ([1, 2, 3])
```

#### <a name="extend" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L2299">`extend :: Extend w => (w a -⁠> b, w a) -⁠> w b`</a>

Function wrapper for [`fantasy-land/extend`][].

`fantasy-land/extend` implementations are provided for the following
built-in types: Array and Function.

```javascript
> Z.extend (ss => ss.join (''), ['x', 'y', 'z'])
['xyz', 'yz', 'z']

> Z.extend (f => f ([3, 4]), Z.reverse) ([1, 2])
[4, 3, 2, 1]
```

#### <a name="duplicate" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L2315">`duplicate :: Extend w => w a -⁠> w (w a)`</a>

Adds one level of nesting to a comonadic structure.

This function is derived from [`extend`](#extend).

```javascript
> Z.duplicate (Identity (1))
Identity (Identity (1))

> Z.duplicate ([1])
[[1]]

> Z.duplicate ([1, 2, 3])
[[1, 2, 3], [2, 3], [3]]

> Z.duplicate (Z.reverse) ([1, 2]) ([3, 4])
[4, 3, 2, 1]
```

#### <a name="extract" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L2336">`extract :: Comonad w => w a -⁠> a`</a>

Function wrapper for [`fantasy-land/extract`][].

```javascript
> Z.extract (Identity (42))
42
```

#### <a name="contramap" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v13.0.0/index.js#L2346">`contramap :: Contravariant f => (b -⁠> a, f a) -⁠> f b`</a>

Function wrapper for [`fantasy-land/contramap`][].

`fantasy-land/contramap` implementations are provided for the following
built-in types: Function.

```javascript
> Z.contramap (s => s.length, Math.sqrt) ('Sanctuary')
3
```

[Alt]:                      https://github.com/fantasyland/fantasy-land/tree/v5.0.0#alt
[Alternative]:              https://github.com/fantasyland/fantasy-land/tree/v5.0.0#alternative
[Applicative]:              https://github.com/fantasyland/fantasy-land/tree/v5.0.0#applicative
[Apply]:                    https://github.com/fantasyland/fantasy-land/tree/v5.0.0#apply
[Bifunctor]:                https://github.com/fantasyland/fantasy-land/tree/v5.0.0#bifunctor
[Category]:                 https://github.com/fantasyland/fantasy-land/tree/v5.0.0#category
[Chain]:                    https://github.com/fantasyland/fantasy-land/tree/v5.0.0#chain
[ChainRec]:                 https://github.com/fantasyland/fantasy-land/tree/v5.0.0#chainrec
[Comonad]:                  https://github.com/fantasyland/fantasy-land/tree/v5.0.0#comonad
[Contravariant]:            https://github.com/fantasyland/fantasy-land/tree/v5.0.0#contravariant
[Extend]:                   https://github.com/fantasyland/fantasy-land/tree/v5.0.0#extend
[FL]:                       https://github.com/fantasyland/fantasy-land/tree/v5.0.0
[Filterable]:               https://github.com/fantasyland/fantasy-land/tree/v5.0.0#filterable
[Foldable]:                 https://github.com/fantasyland/fantasy-land/tree/v5.0.0#foldable
[Functor]:                  https://github.com/fantasyland/fantasy-land/tree/v5.0.0#functor
[Group]:                    https://github.com/fantasyland/fantasy-land/tree/v5.0.0#group
[Monad]:                    https://github.com/fantasyland/fantasy-land/tree/v5.0.0#monad
[Monoid]:                   https://github.com/fantasyland/fantasy-land/tree/v5.0.0#monoid
[Ord]:                      https://github.com/fantasyland/fantasy-land/tree/v5.0.0#ord
[Plus]:                     https://github.com/fantasyland/fantasy-land/tree/v5.0.0#plus
[Profunctor]:               https://github.com/fantasyland/fantasy-land/tree/v5.0.0#profunctor
[Semigroup]:                https://github.com/fantasyland/fantasy-land/tree/v5.0.0#semigroup
[Semigroupoid]:             https://github.com/fantasyland/fantasy-land/tree/v5.0.0#semigroupoid
[Setoid]:                   https://github.com/fantasyland/fantasy-land/tree/v5.0.0#setoid
[Traversable]:              https://github.com/fantasyland/fantasy-land/tree/v5.0.0#traversable
[`Object.entries`]:         https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
[`fantasy-land/alt`]:       https://github.com/fantasyland/fantasy-land/tree/v5.0.0#alt-method
[`fantasy-land/ap`]:        https://github.com/fantasyland/fantasy-land/tree/v5.0.0#ap-method
[`fantasy-land/bimap`]:     https://github.com/fantasyland/fantasy-land/tree/v5.0.0#bimap-method
[`fantasy-land/chain`]:     https://github.com/fantasyland/fantasy-land/tree/v5.0.0#chain-method
[`fantasy-land/chainRec`]:  https://github.com/fantasyland/fantasy-land/tree/v5.0.0#chainrec-method
[`fantasy-land/compose`]:   https://github.com/fantasyland/fantasy-land/tree/v5.0.0#compose-method
[`fantasy-land/concat`]:    https://github.com/fantasyland/fantasy-land/tree/v5.0.0#concat-method
[`fantasy-land/contramap`]: https://github.com/fantasyland/fantasy-land/tree/v5.0.0#contramap-method
[`fantasy-land/empty`]:     https://github.com/fantasyland/fantasy-land/tree/v5.0.0#empty-method
[`fantasy-land/equals`]:    https://github.com/fantasyland/fantasy-land/tree/v5.0.0#equals-method
[`fantasy-land/extend`]:    https://github.com/fantasyland/fantasy-land/tree/v5.0.0#extend-method
[`fantasy-land/extract`]:   https://github.com/fantasyland/fantasy-land/tree/v5.0.0#extract-method
[`fantasy-land/filter`]:    https://github.com/fantasyland/fantasy-land/tree/v5.0.0#filter-method
[`fantasy-land/id`]:        https://github.com/fantasyland/fantasy-land/tree/v5.0.0#id-method
[`fantasy-land/invert`]:    https://github.com/fantasyland/fantasy-land/tree/v5.0.0#invert-method
[`fantasy-land/lte`]:       https://github.com/fantasyland/fantasy-land/tree/v5.0.0#lte-method
[`fantasy-land/map`]:       https://github.com/fantasyland/fantasy-land/tree/v5.0.0#map-method
[`fantasy-land/of`]:        https://github.com/fantasyland/fantasy-land/tree/v5.0.0#of-method
[`fantasy-land/promap`]:    https://github.com/fantasyland/fantasy-land/tree/v5.0.0#promap-method
[`fantasy-land/reduce`]:    https://github.com/fantasyland/fantasy-land/tree/v5.0.0#reduce-method
[`fantasy-land/traverse`]:  https://github.com/fantasyland/fantasy-land/tree/v5.0.0#traverse-method
[`fantasy-land/zero`]:      https://github.com/fantasyland/fantasy-land/tree/v5.0.0#zero-method
[stable sort]:              https://en.wikipedia.org/wiki/Sorting_algorithm#Stability
[type identities]:          https://github.com/sanctuary-js/sanctuary-type-identifiers/tree/v3.0.0
[type-classes]:             https://github.com/sanctuary-js/sanctuary-def#type-classes
