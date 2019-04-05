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

#### <a name="TypeClass" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L168">`TypeClass :: (String, String, Array TypeClass, a -⁠> Boolean) -⁠> TypeClass`</a>

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

#### <a name="Setoid" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L312">`Setoid :: TypeClass`</a>

`TypeClass` value for [Setoid][].

```javascript
> Setoid.test (null)
true
```

#### <a name="Ord" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L322">`Ord :: TypeClass`</a>

`TypeClass` value for [Ord][].

```javascript
> Ord.test (0)
true

> Ord.test (Math.sqrt)
false
```

#### <a name="Semigroupoid" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L335">`Semigroupoid :: TypeClass`</a>

`TypeClass` value for [Semigroupoid][].

```javascript
> Semigroupoid.test (Math.sqrt)
true

> Semigroupoid.test (0)
false
```

#### <a name="Category" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L348">`Category :: TypeClass`</a>

`TypeClass` value for [Category][].

```javascript
> Category.test (Math.sqrt)
true

> Category.test (0)
false
```

#### <a name="Semigroup" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L361">`Semigroup :: TypeClass`</a>

`TypeClass` value for [Semigroup][].

```javascript
> Semigroup.test ('')
true

> Semigroup.test (0)
false
```

#### <a name="Monoid" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L374">`Monoid :: TypeClass`</a>

`TypeClass` value for [Monoid][].

```javascript
> Monoid.test ('')
true

> Monoid.test (0)
false
```

#### <a name="Group" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L387">`Group :: TypeClass`</a>

`TypeClass` value for [Group][].

```javascript
> Group.test (Sum (0))
true

> Group.test ('')
false
```

#### <a name="Filterable" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L400">`Filterable :: TypeClass`</a>

`TypeClass` value for [Filterable][].

```javascript
> Filterable.test ({})
true

> Filterable.test ('')
false
```

#### <a name="Functor" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L413">`Functor :: TypeClass`</a>

`TypeClass` value for [Functor][].

```javascript
> Functor.test ([])
true

> Functor.test ('')
false
```

#### <a name="Bifunctor" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L426">`Bifunctor :: TypeClass`</a>

`TypeClass` value for [Bifunctor][].

```javascript
> Bifunctor.test (Pair ('foo') (64))
true

> Bifunctor.test ([])
false
```

#### <a name="Profunctor" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L439">`Profunctor :: TypeClass`</a>

`TypeClass` value for [Profunctor][].

```javascript
> Profunctor.test (Math.sqrt)
true

> Profunctor.test ([])
false
```

#### <a name="Apply" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L452">`Apply :: TypeClass`</a>

`TypeClass` value for [Apply][].

```javascript
> Apply.test ([])
true

> Apply.test ('')
false
```

#### <a name="Applicative" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L465">`Applicative :: TypeClass`</a>

`TypeClass` value for [Applicative][].

```javascript
> Applicative.test ([])
true

> Applicative.test ({})
false
```

#### <a name="Chain" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L478">`Chain :: TypeClass`</a>

`TypeClass` value for [Chain][].

```javascript
> Chain.test ([])
true

> Chain.test ({})
false
```

#### <a name="ChainRec" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L491">`ChainRec :: TypeClass`</a>

`TypeClass` value for [ChainRec][].

```javascript
> ChainRec.test ([])
true

> ChainRec.test ({})
false
```

#### <a name="Monad" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L504">`Monad :: TypeClass`</a>

`TypeClass` value for [Monad][].

```javascript
> Monad.test ([])
true

> Monad.test ({})
false
```

#### <a name="Alt" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L517">`Alt :: TypeClass`</a>

`TypeClass` value for [Alt][].

```javascript
> Alt.test ({})
true

> Alt.test ('')
false
```

#### <a name="Plus" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L530">`Plus :: TypeClass`</a>

`TypeClass` value for [Plus][].

```javascript
> Plus.test ({})
true

> Plus.test ('')
false
```

#### <a name="Alternative" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L543">`Alternative :: TypeClass`</a>

`TypeClass` value for [Alternative][].

```javascript
> Alternative.test ([])
true

> Alternative.test ({})
false
```

#### <a name="Foldable" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L556">`Foldable :: TypeClass`</a>

`TypeClass` value for [Foldable][].

```javascript
> Foldable.test ({})
true

> Foldable.test ('')
false
```

#### <a name="Traversable" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L569">`Traversable :: TypeClass`</a>

`TypeClass` value for [Traversable][].

```javascript
> Traversable.test ([])
true

> Traversable.test ('')
false
```

#### <a name="Extend" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L582">`Extend :: TypeClass`</a>

`TypeClass` value for [Extend][].

```javascript
> Extend.test ([])
true

> Extend.test ({})
false
```

#### <a name="Comonad" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L595">`Comonad :: TypeClass`</a>

`TypeClass` value for [Comonad][].

```javascript
> Comonad.test (Identity (0))
true

> Comonad.test ([])
false
```

#### <a name="Contravariant" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L608">`Contravariant :: TypeClass`</a>

`TypeClass` value for [Contravariant][].

```javascript
> Contravariant.test (Math.sqrt)
true

> Contravariant.test ([])
false
```

#### <a name="equals" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1127">`equals :: (a, b) -⁠> Boolean`</a>

Returns `true` if its arguments are of the same type and equal according
to the type's [`fantasy-land/equals`][] method; `false` otherwise.

`fantasy-land/equals` implementations are provided for the following
built-in types: Null, Undefined, Boolean, Number, Date, RegExp, String,
Array, Arguments, Error, Object, and Function.

The algorithm supports circular data structures. Two arrays are equal
if they have the same index paths and for each path have equal values.
Two arrays which represent `[1, [1, [1, [1, [1, ...]]]]]`, for example,
are equal even if their internal structures differ. Two objects are equal
if they have the same property paths and for each path have equal values.

```javascript
> equals (0, -0)
true

> equals (NaN, NaN)
true

> equals (Cons (1, Cons (2, Nil)), Cons (1, Cons (2, Nil)))
true

> equals (Cons (1, Cons (2, Nil)), Cons (2, Cons (1, Nil)))
false
```

#### <a name="lt" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1179">`lt :: (a, b) -⁠> Boolean`</a>

Returns `true` if its arguments are of the same type and the first is
less than the second according to the type's [`fantasy-land/lte`][]
method; `false` otherwise.

This function is derived from [`lte`](#lte).

See also [`gt`](#gt) and [`gte`](#gte).

```javascript
> lt (0, 0)
false

> lt (0, 1)
true

> lt (1, 0)
false
```

#### <a name="lte" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1203">`lte :: (a, b) -⁠> Boolean`</a>

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
> lte (0, 0)
true

> lte (0, 1)
true

> lte (1, 0)
false
```

#### <a name="gt" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1250">`gt :: (a, b) -⁠> Boolean`</a>

Returns `true` if its arguments are of the same type and the first is
greater than the second according to the type's [`fantasy-land/lte`][]
method; `false` otherwise.

This function is derived from [`lte`](#lte).

See also [`lt`](#lt) and [`gte`](#gte).

```javascript
> gt (0, 0)
false

> gt (0, 1)
false

> gt (1, 0)
true
```

#### <a name="gte" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1274">`gte :: (a, b) -⁠> Boolean`</a>

Returns `true` if its arguments are of the same type and the first
is greater than or equal to the second according to the type's
[`fantasy-land/lte`][] method; `false` otherwise.

This function is derived from [`lte`](#lte).

See also [`lt`](#lt) and [`gt`](#gt).

```javascript
> gte (0, 0)
true

> gte (0, 1)
false

> gte (1, 0)
true
```

#### <a name="min" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1298">`min :: Ord a => (a, a) -⁠> a`</a>

Returns the smaller of its two arguments.

This function is derived from [`lte`](#lte).

See also [`max`](#max).

```javascript
> min (10, 2)
2

> min (new Date ('1999-12-31'), new Date ('2000-01-01'))
new Date ('1999-12-31')

> min ('10', '2')
'10'
```

#### <a name="max" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1320">`max :: Ord a => (a, a) -⁠> a`</a>

Returns the larger of its two arguments.

This function is derived from [`lte`](#lte).

See also [`min`](#min).

```javascript
> max (10, 2)
10

> max (new Date ('1999-12-31'), new Date ('2000-01-01'))
new Date ('2000-01-01')

> max ('10', '2')
'2'
```

#### <a name="clamp" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1342">`clamp :: Ord a => (a, a, a) -⁠> a`</a>

Takes a lower bound, an upper bound, and a value of the same type.
Returns the value if it is within the bounds; the nearer bound otherwise.

This function is derived from [`min`](#min) and [`max`](#max).

```javascript
> clamp (0, 100, 42)
42

> clamp (0, 100, -1)
0

> clamp ('A', 'Z', '~')
'Z'
```

#### <a name="compose" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1363">`compose :: Semigroupoid c => (c j k, c i j) -⁠> c i k`</a>

Function wrapper for [`fantasy-land/compose`][].

`fantasy-land/compose` implementations are provided for the following
built-in types: Function.

```javascript
> compose (Math.sqrt, x => x + 1) (99)
10
```

#### <a name="id" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1378">`id :: Category c => TypeRep c -⁠> c`</a>

Function wrapper for [`fantasy-land/id`][].

`fantasy-land/id` implementations are provided for the following
built-in types: Function.

```javascript
> id (Function) ('foo')
'foo'
```

#### <a name="concat" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1393">`concat :: Semigroup a => (a, a) -⁠> a`</a>

Function wrapper for [`fantasy-land/concat`][].

`fantasy-land/concat` implementations are provided for the following
built-in types: String, Array, and Object.

```javascript
> concat ('abc', 'def')
'abcdef'

> concat ([1, 2, 3], [4, 5, 6])
[1, 2, 3, 4, 5, 6]

> concat ({x: 1, y: 2}, {y: 3, z: 4})
{x: 1, y: 3, z: 4}

> concat (Cons ('foo', Cons ('bar', Cons ('baz', Nil))), Cons ('quux', Nil))
Cons ('foo', Cons ('bar', Cons ('baz', Cons ('quux', Nil))))
```

#### <a name="empty" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1417">`empty :: Monoid m => TypeRep m -⁠> m`</a>

Function wrapper for [`fantasy-land/empty`][].

`fantasy-land/empty` implementations are provided for the following
built-in types: String, Array, and Object.

```javascript
> empty (String)
''

> empty (Array)
[]

> empty (Object)
{}

> empty (List)
Nil
```

#### <a name="invert" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1441">`invert :: Group g => g -⁠> g`</a>

Function wrapper for [`fantasy-land/invert`][].

```javascript
> invert (Sum (5))
Sum (-5)
```

#### <a name="filter" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1453">`filter :: Filterable f => (a -⁠> Boolean, f a) -⁠> f a`</a>

Function wrapper for [`fantasy-land/filter`][]. Discards every element
which does not satisfy the predicate.

`fantasy-land/filter` implementations are provided for the following
built-in types: Array and Object.

See also [`reject`](#reject).

```javascript
> filter (x => x % 2 == 1, [1, 2, 3])
[1, 3]

> filter (x => x % 2 == 1, {x: 1, y: 2, z: 3})
{x: 1, z: 3}

> filter (x => x % 2 == 1, Cons (1, Cons (2, Cons (3, Nil))))
Cons (1, Cons (3, Nil))

> filter (x => x % 2 == 1, Nothing)
Nothing

> filter (x => x % 2 == 1, Just (0))
Nothing

> filter (x => x % 2 == 1, Just (1))
Just (1)
```

#### <a name="reject" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1486">`reject :: Filterable f => (a -⁠> Boolean, f a) -⁠> f a`</a>

Discards every element which satisfies the predicate.

This function is derived from [`filter`](#filter).

```javascript
> reject (x => x % 2 == 1, [1, 2, 3])
[2]

> reject (x => x % 2 == 1, {x: 1, y: 2, z: 3})
{y: 2}

> reject (x => x % 2 == 1, Cons (1, Cons (2, Cons (3, Nil))))
Cons (2, Nil)

> reject (x => x % 2 == 1, Nothing)
Nothing

> reject (x => x % 2 == 1, Just (0))
Just (0)

> reject (x => x % 2 == 1, Just (1))
Nothing
```

#### <a name="map" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1515">`map :: Functor f => (a -⁠> b, f a) -⁠> f b`</a>

Function wrapper for [`fantasy-land/map`][].

`fantasy-land/map` implementations are provided for the following
built-in types: Array, Object, and Function.

```javascript
> map (Math.sqrt, [1, 4, 9])
[1, 2, 3]

> map (Math.sqrt, {x: 1, y: 4, z: 9})
{x: 1, y: 2, z: 3}

> map (Math.sqrt, s => s.length) ('Sanctuary')
3

> map (Math.sqrt, Pair ('foo') (64))
Pair ('foo') (8)

> map (Math.sqrt, Nil)
Nil

> map (Math.sqrt, Cons (1, Cons (4, Cons (9, Nil))))
Cons (1, Cons (2, Cons (3, Nil)))
```

#### <a name="flip" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1545">`flip :: Functor f => (f (a -⁠> b), a) -⁠> f b`</a>

Maps over the given functions, applying each to the given value.

This function is derived from [`map`](#map).

```javascript
> flip (x => y => x + y, '!') ('foo')
'foo!'

> flip ([Math.floor, Math.ceil], 1.5)
[1, 2]

> flip ({floor: Math.floor, ceil: Math.ceil}, 1.5)
{floor: 1, ceil: 2}

> flip (Cons (Math.floor, Cons (Math.ceil, Nil)), 1.5)
Cons (1, Cons (2, Nil))
```

#### <a name="bimap" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1568">`bimap :: Bifunctor f => (a -⁠> b, c -⁠> d, f a c) -⁠> f b d`</a>

Function wrapper for [`fantasy-land/bimap`][].

```javascript
> bimap (s => s.toUpperCase (), Math.sqrt, Pair ('foo') (64))
Pair ('FOO') (8)
```

#### <a name="mapLeft" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1580">`mapLeft :: Bifunctor f => (a -⁠> b, f a c) -⁠> f b c`</a>

Maps the given function over the left side of a Bifunctor.

```javascript
> mapLeft (Math.sqrt, Pair (64) (9))
Pair (8) (9)
```

#### <a name="promap" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1592">`promap :: Profunctor p => (a -⁠> b, c -⁠> d, p b c) -⁠> p a d`</a>

Function wrapper for [`fantasy-land/promap`][].

`fantasy-land/promap` implementations are provided for the following
built-in types: Function.

```javascript
> promap (Math.abs, x => x + 1, Math.sqrt) (-100)
11
```

#### <a name="ap" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1607">`ap :: Apply f => (f (a -⁠> b), f a) -⁠> f b`</a>

Function wrapper for [`fantasy-land/ap`][].

`fantasy-land/ap` implementations are provided for the following
built-in types: Array, Object, and Function.

```javascript
> ap ([Math.sqrt, x => x * x], [1, 4, 9, 16, 25])
[1, 2, 3, 4, 5, 1, 16, 81, 256, 625]

> ap ({a: Math.sqrt, b: x => x * x}, {a: 16, b: 10, c: 1})
{a: 4, b: 100}

> ap (s => n => s.slice (0, n), s => Math.ceil (s.length / 2)) ('Haskell')
'Hask'

> ap (Identity (Math.sqrt), Identity (64))
Identity (8)

> ap (Cons (Math.sqrt, Cons (x => x * x, Nil)), Cons (16, Cons (100, Nil)))
Cons (4, Cons (10, Cons (256, Cons (10000, Nil))))
```

#### <a name="lift2" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1634">`lift2 :: Apply f => (a -⁠> b -⁠> c, f a, f b) -⁠> f c`</a>

Lifts `a -> b -> c` to `Apply f => f a -> f b -> f c` and returns the
result of applying this to the given arguments.

This function is derived from [`map`](#map) and [`ap`](#ap).

See also [`lift3`](#lift3).

```javascript
> lift2 (x => y => Math.pow (x, y), [10], [1, 2, 3])
[10, 100, 1000]

> lift2 (x => y => Math.pow (x, y), Identity (10), Identity (3))
Identity (1000)
```

#### <a name="lift3" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1654">`lift3 :: Apply f => (a -⁠> b -⁠> c -⁠> d, f a, f b, f c) -⁠> f d`</a>

Lifts `a -> b -> c -> d` to `Apply f => f a -> f b -> f c -> f d` and
returns the result of applying this to the given arguments.

This function is derived from [`map`](#map) and [`ap`](#ap).

See also [`lift2`](#lift2).

```javascript
> lift3 (x => y => z => x + z + y,
.        ['<', '['],
.        ['>', ']'],
.        ['foo', 'bar', 'baz'])
[ '<foo>', '<bar>', '<baz>',
. '<foo]', '<bar]', '<baz]',
. '[foo>', '[bar>', '[baz>',
. '[foo]', '[bar]', '[baz]' ]

> lift3 (x => y => z => x + z + y,
.        Identity ('<'),
.        Identity ('>'),
.        Identity ('baz'))
Identity ('<baz>')
```

#### <a name="apFirst" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1683">`apFirst :: Apply f => (f a, f b) -⁠> f a`</a>

Combines two effectful actions, keeping only the result of the first.
Equivalent to Haskell's `(<*)` function.

This function is derived from [`lift2`](#lift2).

See also [`apSecond`](#apSecond).

```javascript
> apFirst ([1, 2], [3, 4])
[1, 1, 2, 2]

> apFirst (Identity (1), Identity (2))
Identity (1)
```

#### <a name="apSecond" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1703">`apSecond :: Apply f => (f a, f b) -⁠> f b`</a>

Combines two effectful actions, keeping only the result of the second.
Equivalent to Haskell's `(*>)` function.

This function is derived from [`lift2`](#lift2).

See also [`apFirst`](#apFirst).

```javascript
> apSecond ([1, 2], [3, 4])
[3, 4, 3, 4]

> apSecond (Identity (1), Identity (2))
Identity (2)
```

#### <a name="of" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1723">`of :: Applicative f => (TypeRep f, a) -⁠> f a`</a>

Function wrapper for [`fantasy-land/of`][].

`fantasy-land/of` implementations are provided for the following
built-in types: Array and Function.

```javascript
> of (Array, 42)
[42]

> of (Function, 42) (null)
42

> of (List, 42)
Cons (42, Nil)
```

#### <a name="append" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1744">`append :: (Applicative f, Semigroup (f a)) => (a, f a) -⁠> f a`</a>

Returns the result of appending the first argument to the second.

This function is derived from [`concat`](#concat) and [`of`](#of).

See also [`prepend`](#prepend).

```javascript
> append (3, [1, 2])
[1, 2, 3]

> append (3, Cons (1, Cons (2, Nil)))
Cons (1, Cons (2, Cons (3, Nil)))
```

#### <a name="prepend" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1763">`prepend :: (Applicative f, Semigroup (f a)) => (a, f a) -⁠> f a`</a>

Returns the result of prepending the first argument to the second.

This function is derived from [`concat`](#concat) and [`of`](#of).

See also [`append`](#append).

```javascript
> prepend (1, [2, 3])
[1, 2, 3]

> prepend (1, Cons (2, Cons (3, Nil)))
Cons (1, Cons (2, Cons (3, Nil)))
```

#### <a name="chain" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1782">`chain :: Chain m => (a -⁠> m b, m a) -⁠> m b`</a>

Function wrapper for [`fantasy-land/chain`][].

`fantasy-land/chain` implementations are provided for the following
built-in types: Array and Function.

```javascript
> chain (x => [x, x], [1, 2, 3])
[1, 1, 2, 2, 3, 3]

> chain (x => x % 2 == 1 ? of (List, x) : Nil,
.        Cons (1, Cons (2, Cons (3, Nil))))
Cons (1, Cons (3, Nil))

> chain (n => s => s.slice (0, n),
.        s => Math.ceil (s.length / 2))
.       ('Haskell')
'Hask'
```

#### <a name="join" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1806">`join :: Chain m => m (m a) -⁠> m a`</a>

Removes one level of nesting from a nested monadic structure.

This function is derived from [`chain`](#chain).

```javascript
> join ([[1], [2], [3]])
[1, 2, 3]

> join ([[[1, 2, 3]]])
[[1, 2, 3]]

> join (Identity (Identity (1)))
Identity (1)
```

#### <a name="chainRec" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1826">`chainRec :: ChainRec m => (TypeRep m, (a -⁠> c, b -⁠> c, a) -⁠> m c, a) -⁠> m b`</a>

Function wrapper for [`fantasy-land/chainRec`][].

`fantasy-land/chainRec` implementations are provided for the following
built-in types: Array.

```javascript
> chainRec (
.   Array,
.   (next, done, s) => s.length == 2 ? [s + '!', s + '?'].map (done)
.                                    : [s + 'o', s + 'n'].map (next),
.   ''
. )
['oo!', 'oo?', 'on!', 'on?', 'no!', 'no?', 'nn!', 'nn?']
```

#### <a name="alt" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1846">`alt :: Alt f => (f a, f a) -⁠> f a`</a>

Function wrapper for [`fantasy-land/alt`][].

`fantasy-land/alt` implementations are provided for the following
built-in types: Array and Object.

```javascript
> alt ([1, 2, 3], [4, 5, 6])
[1, 2, 3, 4, 5, 6]

> alt (Nothing, Nothing)
Nothing

> alt (Nothing, Just (1))
Just (1)

> alt (Just (2), Just (3))
Just (2)
```

#### <a name="zero" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1870">`zero :: Plus f => TypeRep f -⁠> f a`</a>

Function wrapper for [`fantasy-land/zero`][].

`fantasy-land/zero` implementations are provided for the following
built-in types: Array and Object.

```javascript
> zero (Array)
[]

> zero (Object)
{}

> zero (Maybe)
Nothing
```

#### <a name="reduce" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1891">`reduce :: Foldable f => ((b, a) -⁠> b, b, f a) -⁠> b`</a>

Function wrapper for [`fantasy-land/reduce`][].

`fantasy-land/reduce` implementations are provided for the following
built-in types: Array and Object.

```javascript
> reduce ((xs, x) => [x].concat (xs), [], [1, 2, 3])
[3, 2, 1]

> reduce (concat, '', Cons ('foo', Cons ('bar', Cons ('baz', Nil))))
'foobarbaz'
```

#### <a name="size" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1909">`size :: Foldable f => f a -⁠> Integer`</a>

Returns the number of elements of the given structure.

This function is derived from [`reduce`](#reduce).

```javascript
> size ([])
0

> size (['foo', 'bar', 'baz'])
3

> size (Nil)
0

> size (Cons ('foo', Cons ('bar', Cons ('baz', Nil))))
3
```

#### <a name="all" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1934">`all :: Foldable f => (a -⁠> Boolean, f a) -⁠> Boolean`</a>

Returns `true` if all the elements of the structure satisfy the
predicate; `false` otherwise.

This function is derived from [`reduce`](#reduce).

See also [`any`](#any) and [`none`](#none).

```javascript
> all (Number.isInteger, [])
true

> all (Number.isInteger, [1, 2, 3])
true

> all (Number.isInteger, [0, 0.25, 0.5, 0.75, 1])
false
```

#### <a name="any" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1959">`any :: Foldable f => (a -⁠> Boolean, f a) -⁠> Boolean`</a>

Returns `true` if any element of the structure satisfies the predicate;
`false` otherwise.

This function is derived from [`reduce`](#reduce).

See also [`all`](#all) and [`none`](#none).

```javascript
> any (Number.isInteger, [])
false

> any (Number.isInteger, [1, 2, 3])
true

> any (Number.isInteger, [0, 0.25, 0.5, 0.75, 1])
true
```

#### <a name="none" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L1984">`none :: Foldable f => (a -⁠> Boolean, f a) -⁠> Boolean`</a>

Returns `true` if none of the elements of the structure satisfies the
predicate; `false` otherwise.

This function is derived from [`any`](#any). `none (pred, foldable)` is
equivalent to `!(any (pred, foldable))`.

See also [`all`](#all).

```javascript
> none (Number.isInteger, [])
true

> none (Number.isInteger, [0, 0.25, 0.5, 0.75, 1])
false
```

#### <a name="elem" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L2005">`elem :: (Setoid a, Foldable f) => (a, f a) -⁠> Boolean`</a>

Takes a value and a structure and returns `true` if the
value is an element of the structure; `false` otherwise.

This function is derived from [`equals`](#equals) and
[`reduce`](#reduce).

```javascript
> elem ('c', ['a', 'b', 'c'])
true

> elem ('x', ['a', 'b', 'c'])
false

> elem (3, {x: 1, y: 2, z: 3})
true

> elem (8, {x: 1, y: 2, z: 3})
false

> elem (0, Just (0))
true

> elem (0, Just (1))
false

> elem (0, Nothing)
false
```

#### <a name="foldMap" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L2039">`foldMap :: (Monoid m, Foldable f) => (TypeRep m, a -⁠> m, f a) -⁠> m`</a>

Deconstructs a foldable by mapping every element to a monoid and
concatenating the results.

This function is derived from [`concat`](#concat), [`empty`](#empty),
and [`reduce`](#reduce).

```javascript
> foldMap (String, f => f.name, [Math.sin, Math.cos, Math.tan])
'sincostan'
```

#### <a name="reverse" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L2057">`reverse :: (Applicative f, Foldable f, Monoid (f a)) => f a -⁠> f a`</a>

Reverses the elements of the given structure.

This function is derived from [`concat`](#concat), [`empty`](#empty),
[`of`](#of), and [`reduce`](#reduce).

```javascript
> reverse ([1, 2, 3])
[3, 2, 1]

> reverse (Cons (1, Cons (2, Cons (3, Nil))))
Cons (3, Cons (2, Cons (1, Nil)))
```

#### <a name="sort" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L2080">`sort :: (Ord a, Applicative f, Foldable f, Monoid (f a)) => f a -⁠> f a`</a>

Performs a [stable sort][] of the elements of the given structure,
using [`lte`](#lte) for comparisons.

This function is derived from [`lte`](#lte), [`concat`](#concat),
[`empty`](#empty), [`of`](#of), and [`reduce`](#reduce).

See also [`sortBy`](#sortBy).

```javascript
> sort (['foo', 'bar', 'baz'])
['bar', 'baz', 'foo']

> sort ([Just (2), Nothing, Just (1)])
[Nothing, Just (1), Just (2)]

> sort (Cons ('foo', Cons ('bar', Cons ('baz', Nil))))
Cons ('bar', Cons ('baz', Cons ('foo', Nil)))
```

#### <a name="sortBy" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L2104">`sortBy :: (Ord b, Applicative f, Foldable f, Monoid (f a)) => (a -⁠> b, f a) -⁠> f a`</a>

Performs a [stable sort][] of the elements of the given structure,
using [`lte`](#lte) to compare the values produced by applying the
given function to each element of the structure.

This function is derived from [`lte`](#lte), [`concat`](#concat),
[`empty`](#empty), [`of`](#of), and [`reduce`](#reduce).

See also [`sort`](#sort).

```javascript
> sortBy (s => s.length, ['red', 'green', 'blue'])
['red', 'blue', 'green']

> sortBy (s => s.length, ['black', 'white'])
['black', 'white']

> sortBy (s => s.length, ['white', 'black'])
['white', 'black']

> sortBy (s => s.length, Cons ('red', Cons ('green', Cons ('blue', Nil))))
Cons ('red', Cons ('blue', Cons ('green', Nil)))
```

#### <a name="traverse" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L2159">`traverse :: (Applicative f, Traversable t) => (TypeRep f, a -⁠> f b, t a) -⁠> f (t b)`</a>

Function wrapper for [`fantasy-land/traverse`][].

`fantasy-land/traverse` implementations are provided for the following
built-in types: Array and Object.

See also [`sequence`](#sequence).

```javascript
> traverse (Array, x => x, [[1, 2, 3], [4, 5]])
[[1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5]]

> traverse (Identity, x => Identity (x + 1), [1, 2, 3])
Identity ([2, 3, 4])
```

#### <a name="sequence" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L2179">`sequence :: (Applicative f, Traversable t) => (TypeRep f, t (f a)) -⁠> f (t a)`</a>

Inverts the given `t (f a)` to produce an `f (t a)`.

This function is derived from [`traverse`](#traverse).

```javascript
> sequence (Array, Identity ([1, 2, 3]))
[Identity (1), Identity (2), Identity (3)]

> sequence (Identity, [Identity (1), Identity (2), Identity (3)])
Identity ([1, 2, 3])
```

#### <a name="extend" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L2196">`extend :: Extend w => (w a -⁠> b, w a) -⁠> w b`</a>

Function wrapper for [`fantasy-land/extend`][].

`fantasy-land/extend` implementations are provided for the following
built-in types: Array and Function.

```javascript
> extend (ss => ss.join (''), ['x', 'y', 'z'])
['xyz', 'yz', 'z']

> extend (f => f ([3, 4]), reverse) ([1, 2])
[4, 3, 2, 1]
```

#### <a name="duplicate" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L2214">`duplicate :: Extend w => w a -⁠> w (w a)`</a>

Adds one level of nesting to a comonadic structure.

This function is derived from [`extend`](#extend).

```javascript
> duplicate (Identity (1))
Identity (Identity (1))

> duplicate ([1])
[[1]]

> duplicate ([1, 2, 3])
[[1, 2, 3], [2, 3], [3]]

> duplicate (reverse) ([1, 2]) ([3, 4])
[4, 3, 2, 1]
```

#### <a name="extract" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L2237">`extract :: Comonad w => w a -⁠> a`</a>

Function wrapper for [`fantasy-land/extract`][].

```javascript
> extract (Identity (42))
42
```

#### <a name="contramap" href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v11.0.0/index.js#L2249">`contramap :: Contravariant f => (b -⁠> a, f a) -⁠> f b`</a>

Function wrapper for [`fantasy-land/contramap`][].

`fantasy-land/contramap` implementations are provided for the following
built-in types: Function.

```javascript
> contramap (s => s.length, Math.sqrt) ('Sanctuary')
3
```

[Alt]:                      https://github.com/fantasyland/fantasy-land/tree/v4.0.1#alt
[Alternative]:              https://github.com/fantasyland/fantasy-land/tree/v4.0.1#alternative
[Applicative]:              https://github.com/fantasyland/fantasy-land/tree/v4.0.1#applicative
[Apply]:                    https://github.com/fantasyland/fantasy-land/tree/v4.0.1#apply
[Bifunctor]:                https://github.com/fantasyland/fantasy-land/tree/v4.0.1#bifunctor
[Category]:                 https://github.com/fantasyland/fantasy-land/tree/v4.0.1#category
[Chain]:                    https://github.com/fantasyland/fantasy-land/tree/v4.0.1#chain
[ChainRec]:                 https://github.com/fantasyland/fantasy-land/tree/v4.0.1#chainrec
[Comonad]:                  https://github.com/fantasyland/fantasy-land/tree/v4.0.1#comonad
[Contravariant]:            https://github.com/fantasyland/fantasy-land/tree/v4.0.1#contravariant
[Extend]:                   https://github.com/fantasyland/fantasy-land/tree/v4.0.1#extend
[FL]:                       https://github.com/fantasyland/fantasy-land/tree/v4.0.1
[Filterable]:               https://github.com/fantasyland/fantasy-land/tree/v4.0.1#filterable
[Foldable]:                 https://github.com/fantasyland/fantasy-land/tree/v4.0.1#foldable
[Functor]:                  https://github.com/fantasyland/fantasy-land/tree/v4.0.1#functor
[Group]:                    https://github.com/fantasyland/fantasy-land/tree/v4.0.1#group
[Monad]:                    https://github.com/fantasyland/fantasy-land/tree/v4.0.1#monad
[Monoid]:                   https://github.com/fantasyland/fantasy-land/tree/v4.0.1#monoid
[Ord]:                      https://github.com/fantasyland/fantasy-land/tree/v4.0.1#ord
[Plus]:                     https://github.com/fantasyland/fantasy-land/tree/v4.0.1#plus
[Profunctor]:               https://github.com/fantasyland/fantasy-land/tree/v4.0.1#profunctor
[Semigroup]:                https://github.com/fantasyland/fantasy-land/tree/v4.0.1#semigroup
[Semigroupoid]:             https://github.com/fantasyland/fantasy-land/tree/v4.0.1#semigroupoid
[Setoid]:                   https://github.com/fantasyland/fantasy-land/tree/v4.0.1#setoid
[Traversable]:              https://github.com/fantasyland/fantasy-land/tree/v4.0.1#traversable
[`fantasy-land/alt`]:       https://github.com/fantasyland/fantasy-land/tree/v4.0.1#alt-method
[`fantasy-land/ap`]:        https://github.com/fantasyland/fantasy-land/tree/v4.0.1#ap-method
[`fantasy-land/bimap`]:     https://github.com/fantasyland/fantasy-land/tree/v4.0.1#bimap-method
[`fantasy-land/chain`]:     https://github.com/fantasyland/fantasy-land/tree/v4.0.1#chain-method
[`fantasy-land/chainRec`]:  https://github.com/fantasyland/fantasy-land/tree/v4.0.1#chainrec-method
[`fantasy-land/compose`]:   https://github.com/fantasyland/fantasy-land/tree/v4.0.1#compose-method
[`fantasy-land/concat`]:    https://github.com/fantasyland/fantasy-land/tree/v4.0.1#concat-method
[`fantasy-land/contramap`]: https://github.com/fantasyland/fantasy-land/tree/v4.0.1#contramap-method
[`fantasy-land/empty`]:     https://github.com/fantasyland/fantasy-land/tree/v4.0.1#empty-method
[`fantasy-land/equals`]:    https://github.com/fantasyland/fantasy-land/tree/v4.0.1#equals-method
[`fantasy-land/extend`]:    https://github.com/fantasyland/fantasy-land/tree/v4.0.1#extend-method
[`fantasy-land/extract`]:   https://github.com/fantasyland/fantasy-land/tree/v4.0.1#extract-method
[`fantasy-land/filter`]:    https://github.com/fantasyland/fantasy-land/tree/v4.0.1#filter-method
[`fantasy-land/id`]:        https://github.com/fantasyland/fantasy-land/tree/v4.0.1#id-method
[`fantasy-land/invert`]:    https://github.com/fantasyland/fantasy-land/tree/v4.0.1#invert-method
[`fantasy-land/lte`]:       https://github.com/fantasyland/fantasy-land/tree/v4.0.1#lte-method
[`fantasy-land/map`]:       https://github.com/fantasyland/fantasy-land/tree/v4.0.1#map-method
[`fantasy-land/of`]:        https://github.com/fantasyland/fantasy-land/tree/v4.0.1#of-method
[`fantasy-land/promap`]:    https://github.com/fantasyland/fantasy-land/tree/v4.0.1#promap-method
[`fantasy-land/reduce`]:    https://github.com/fantasyland/fantasy-land/tree/v4.0.1#reduce-method
[`fantasy-land/traverse`]:  https://github.com/fantasyland/fantasy-land/tree/v4.0.1#traverse-method
[`fantasy-land/zero`]:      https://github.com/fantasyland/fantasy-land/tree/v4.0.1#zero-method
[stable sort]:              https://en.wikipedia.org/wiki/Sorting_algorithm#Stability
[type-classes]:             https://github.com/sanctuary-js/sanctuary-def#type-classes
