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
 <a href="#Setoid">Setoid</a>   <a href="#Semigroup">Semigroup</a>   <a href="#Foldable">Foldable</a>        <a href="#Functor">Functor</a>
(<a href="#equals">equals</a>)   (<a href="#concat">concat</a>)   (<a href="#reduce">reduce</a>)         (<a href="#map">map</a>)
              |           \         / | | | | \
              |            \       /  | | | |  \
              |             \     /   | | | |   \
              |              \   /    | | | |    \
              |               \ /     | | | |     \
           <a href="#Monoid">Monoid</a>         <a href="#Traversable">Traversable</a> | | | |      \
           (<a href="#empty">empty</a>)        (<a href="#traverse">traverse</a>)  / | | \       \
                                     /  | |  \       \
                                    /   / \   \       \
                            <a href="#Profunctor">Profunctor</a> /   \ <a href="#Bifunctor">Bifunctor</a> \
                             (<a href="#promap">promap</a>) /     \ (<a href="#bimap">bimap</a>)   \
                                     /       \           \
                                    /         \           \
                                  <a href="#Alt">Alt</a>        <a href="#Apply">Apply</a>      <a href="#Extend">Extend</a>
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

<h4 name="TypeClass"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L123">TypeClass :: (String, Array TypeClass, a -> Boolean) -> TypeClass</a></code></h4>

The arguments are:

  - the name of the type class, prefixed by its npm package name;
  - an array of dependencies; and
  - a predicate which accepts any JavaScript value and returns `true`
    if the value satisfies the requirements of the type class; `false`
    otherwise.

Example:

```javascript
//    hasMethod :: String -> a -> Boolean
const hasMethod = name => x => x != null && typeof x[name] == 'function';

//    Foo :: TypeClass
const Foo = Z.TypeClass('my-package/Foo', [], hasMethod('foo'));

//    Bar :: TypeClass
const Bar = Z.TypeClass('my-package/Bar', [Foo], hasMethod('bar'));
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

<h4 name="Setoid"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L237">Setoid :: TypeClass</a></code></h4>

`TypeClass` value for [Setoid][].

```javascript
> Setoid.test(null)
true
```

<h4 name="Semigroup"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L247">Semigroup :: TypeClass</a></code></h4>

`TypeClass` value for [Semigroup][].

```javascript
> Semigroup.test('')
true

> Semigroup.test(0)
false
```

<h4 name="Monoid"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L260">Monoid :: TypeClass</a></code></h4>

`TypeClass` value for [Monoid][].

```javascript
> Monoid.test('')
true

> Monoid.test(0)
false
```

<h4 name="Functor"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L273">Functor :: TypeClass</a></code></h4>

`TypeClass` value for [Functor][].

```javascript
> Functor.test([])
true

> Functor.test('')
false
```

<h4 name="Bifunctor"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L286">Bifunctor :: TypeClass</a></code></h4>

`TypeClass` value for [Bifunctor][].

```javascript
> Bifunctor.test(Tuple('foo', 64))
true

> Bifunctor.test([])
false
```

<h4 name="Profunctor"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L299">Profunctor :: TypeClass</a></code></h4>

`TypeClass` value for [Profunctor][].

```javascript
> Profunctor.test(Math.sqrt)
true

> Profunctor.test([])
false
```

<h4 name="Apply"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L312">Apply :: TypeClass</a></code></h4>

`TypeClass` value for [Apply][].

```javascript
> Apply.test([])
true

> Apply.test({})
false
```

<h4 name="Applicative"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L325">Applicative :: TypeClass</a></code></h4>

`TypeClass` value for [Applicative][].

```javascript
> Applicative.test([])
true

> Applicative.test({})
false
```

<h4 name="Chain"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L338">Chain :: TypeClass</a></code></h4>

`TypeClass` value for [Chain][].

```javascript
> Chain.test([])
true

> Chain.test({})
false
```

<h4 name="ChainRec"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L351">ChainRec :: TypeClass</a></code></h4>

`TypeClass` value for [ChainRec][].

```javascript
> ChainRec.test([])
true

> ChainRec.test({})
false
```

<h4 name="Monad"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L364">Monad :: TypeClass</a></code></h4>

`TypeClass` value for [Monad][].

```javascript
> Monad.test([])
true

> Monad.test({})
false
```

<h4 name="Alt"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L377">Alt :: TypeClass</a></code></h4>

`TypeClass` value for [Alt][].

```javascript
> Alt.test({})
true

> Alt.test('')
false
```

<h4 name="Plus"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L390">Plus :: TypeClass</a></code></h4>

`TypeClass` value for [Plus][].

```javascript
> Plus.test({})
true

> Plus.test('')
false
```

<h4 name="Alternative"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L403">Alternative :: TypeClass</a></code></h4>

`TypeClass` value for [Alternative][].

```javascript
> Alternative.test([])
true

> Alternative.test({})
false
```

<h4 name="Foldable"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L416">Foldable :: TypeClass</a></code></h4>

`TypeClass` value for [Foldable][].

```javascript
> Foldable.test({})
true

> Foldable.test('')
false
```

<h4 name="Traversable"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L429">Traversable :: TypeClass</a></code></h4>

`TypeClass` value for [Traversable][].

```javascript
> Traversable.test([])
true

> Traversable.test({})
false
```

<h4 name="Extend"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L442">Extend :: TypeClass</a></code></h4>

`TypeClass` value for [Extend][].

```javascript
> Extend.test([])
true

> Extend.test({})
false
```

<h4 name="Comonad"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L455">Comonad :: TypeClass</a></code></h4>

`TypeClass` value for [Comonad][].

```javascript
> Comonad.test(Identity(0))
true

> Comonad.test([])
false
```

<h4 name="toString"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L899">toString :: a -> String</a></code></h4>

Returns a useful string representation of its argument.

Dispatches to the argument's `toString` method if appropriate.

Where practical, `equals(eval(toString(x)), x) = true`.

`toString` implementations are provided for the following built-in types:
Null, Undefined, Boolean, Number, Date, String, Array, Arguments, Error,
and Object.

```javascript
> toString(-0)
'-0'

> toString(['foo', 'bar', 'baz'])
'["foo", "bar", "baz"]'

> toString({x: 1, y: 2, z: 3})
'{"x": 1, "y": 2, "z": 3}'

> toString(Cons(1, Cons(2, Cons(3, Nil))))
'Cons(1, Cons(2, Cons(3, Nil)))'
```

<h4 name="equals"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L947">equals :: (a, b) -> Boolean</a></code></h4>

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
> equals(0, -0)
false

> equals(NaN, NaN)
true

> equals(Cons('foo', Cons('bar', Nil)), Cons('foo', Cons('bar', Nil)))
true

> equals(Cons('foo', Cons('bar', Nil)), Cons('bar', Cons('foo', Nil)))
false
```

<h4 name="concat"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L999">concat :: Semigroup a => (a, a) -> a</a></code></h4>

Function wrapper for [`fantasy-land/concat`][].

`fantasy-land/concat` implementations are provided for the following
built-in types: String, Array, and Object.

```javascript
> concat('abc', 'def')
'abcdef'

> concat([1, 2, 3], [4, 5, 6])
[1, 2, 3, 4, 5, 6]

> concat({x: 1, y: 2}, {y: 3, z: 4})
{x: 1, y: 3, z: 4}

> concat(Cons('foo', Cons('bar', Cons('baz', Nil))), Cons('quux', Nil))
Cons('foo', Cons('bar', Cons('baz', Cons('quux', Nil))))
```

<h4 name="empty"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1023">empty :: Monoid m => TypeRep m -> m</a></code></h4>

Function wrapper for [`fantasy-land/empty`][].

`fantasy-land/empty` implementations are provided for the following
built-in types: String, Array, and Object.

```javascript
> empty(String)
''

> empty(Array)
[]

> empty(Object)
{}

> empty(List)
Nil
```

<h4 name="map"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1047">map :: Functor f => (a -> b, f a) -> f b</a></code></h4>

Function wrapper for [`fantasy-land/map`][].

`fantasy-land/map` implementations are provided for the following
built-in types: Array, Object, and Function.

```javascript
> map(Math.sqrt, [1, 4, 9])
[1, 2, 3]

> map(Math.sqrt, {x: 1, y: 4, z: 9})
{x: 1, y: 2, z: 3}

> map(Math.sqrt, s => s.length)('Sanctuary')
3

> map(Math.sqrt, Tuple('foo', 64))
Tuple('foo', 8)

> map(Math.sqrt, Nil)
Nil

> map(Math.sqrt, Cons(1, Cons(4, Cons(9, Nil))))
Cons(1, Cons(2, Cons(3, Nil)))
```

<h4 name="bimap"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1077">bimap :: Bifunctor f => (a -> b, c -> d, f a c) -> f b d</a></code></h4>

Function wrapper for [`fantasy-land/bimap`][].

```javascript
> bimap(s => s.toUpperCase(), Math.sqrt, Tuple('foo', 64))
Tuple('FOO', 8)
```

<h4 name="promap"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1089">promap :: Profunctor p => (a -> b, c -> d, p b c) -> p a d</a></code></h4>

Function wrapper for [`fantasy-land/promap`][].

`fantasy-land/promap` implementations are provided for the following
built-in types: Function.

```javascript
> promap(Math.abs, x => x + 1, Math.sqrt)(-100)
11
```

<h4 name="ap"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1104">ap :: Apply f => (f (a -> b), f a) -> f b</a></code></h4>

Function wrapper for [`fantasy-land/ap`][].

`fantasy-land/ap` implementations are provided for the following
built-in types: Array and Function.

```javascript
> ap([Math.sqrt, x => x * x], [1, 4, 9, 16, 25])
[1, 2, 3, 4, 5, 1, 16, 81, 256, 625]

> ap(s => n => s.slice(0, n), s => Math.ceil(s.length / 2))('Haskell')
'Hask'

> ap(Identity(Math.sqrt), Identity(64))
Identity(8)

> ap(Cons(Math.sqrt, Cons(x => x * x, Nil)), Cons(16, Cons(100, Nil)))
Cons(4, Cons(10, Cons(256, Cons(10000, Nil))))
```

<h4 name="lift2"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1128">lift2 :: Apply f => (a -> b -> c, f a, f b) -> f c</a></code></h4>

Lifts `a -> b -> c` to `Apply f => f a -> f b -> f c` and returns the
result of applying this to the given arguments.

This function is derived from [`map`](#map) and [`ap`](#ap).

See also [`lift3`](#lift3).

```javascript
> lift2(x => y => Math.pow(x, y), [10], [1, 2, 3])
[10, 100, 1000]

> lift2(x => y => Math.pow(x, y), Identity(10), Identity(3))
Identity(1000)
```

<h4 name="lift3"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1148">lift3 :: Apply f => (a -> b -> c -> d, f a, f b, f c) -> f d</a></code></h4>

Lifts `a -> b -> c -> d` to `Apply f => f a -> f b -> f c -> f d` and
returns the result of applying this to the given arguments.

This function is derived from [`map`](#map) and [`ap`](#ap).

See also [`lift2`](#lift2).

```javascript
> lift3(x => y => z => x + z + y, ['<'], ['>'], ['foo', 'bar', 'baz'])
['<foo>', '<bar>', '<baz>']

> lift3(x => y => z => x + z + y, Identity('<'), Identity('>'), Identity('baz'))
Identity('<baz>')
```

<h4 name="apFirst"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1168">apFirst :: Apply f => (f a, f b) -> f a</a></code></h4>

Combines two effectful actions, keeping only the result of the first.
Equivalent to Haskell's `(<*)` function.

This function is derived from [`lift2`](#lift2).

See also [`apSecond`](#apSecond).

```javascript
> apFirst([1, 2], [3, 4])
[1, 1, 2, 2]

> apFirst(Identity(1), Identity(2))
Identity(1)
```

<h4 name="apSecond"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1188">apSecond :: Apply f => (f a, f b) -> f b</a></code></h4>

Combines two effectful actions, keeping only the result of the second.
Equivalent to Haskell's `(*>)` function.

This function is derived from [`lift2`](#lift2).

See also [`apFirst`](#apFirst).

```javascript
> apSecond([1, 2], [3, 4])
[3, 4, 3, 4]

> apSecond(Identity(1), Identity(2))
Identity(2)
```

<h4 name="of"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1208">of :: Applicative f => (TypeRep f, a) -> f a</a></code></h4>

Function wrapper for [`fantasy-land/of`][].

`fantasy-land/of` implementations are provided for the following
built-in types: Array and Function.

```javascript
> of(Array, 42)
[42]

> of(Function, 42)(null)
42

> of(List, 42)
Cons(42, Nil)
```

<h4 name="chain"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1229">chain :: Chain m => (a -> m b, m a) -> m b</a></code></h4>

Function wrapper for [`fantasy-land/chain`][].

`fantasy-land/chain` implementations are provided for the following
built-in types: Array and Function.

```javascript
> chain(x => [x, x], [1, 2, 3])
[1, 1, 2, 2, 3, 3]

> chain(x => x % 2 == 1 ? of(List, x) : Nil, Cons(1, Cons(2, Cons(3, Nil))))
Cons(1, Cons(3, Nil))

> chain(n => s => s.slice(0, n), s => Math.ceil(s.length / 2))('Haskell')
'Hask'
```

<h4 name="join"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1250">join :: Chain m => m (m a) -> m a</a></code></h4>

Removes one level of nesting from a nested monadic structure.

This function is derived from [`chain`](#chain).

```javascript
> join([[1], [2], [3]])
[1, 2, 3]

> join([[[1, 2, 3]]])
[[1, 2, 3]]

> join(Identity(Identity(1)))
Identity(1)
```

<h4 name="chainRec"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1270">chainRec :: ChainRec m => (TypeRep m, (a -> c, b -> c, a) -> m c, a) -> m b</a></code></h4>

Function wrapper for [`fantasy-land/chainRec`][].

`fantasy-land/chainRec` implementations are provided for the following
built-in types: Array.

```javascript
> chainRec(
.   Array,
.   (next, done, s) => s.length == 2 ? [s + '!', s + '?'].map(done)
.                                    : [s + 'o', s + 'n'].map(next),
.   ''
. )
['oo!', 'oo?', 'on!', 'on?', 'no!', 'no?', 'nn!', 'nn?']
```

<h4 name="filter"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1290">filter :: (Applicative f, Foldable f, Monoid (f a)) => (a -> Boolean, f a) -> f a</a></code></h4>

Filters its second argument in accordance with the given predicate.

This function is derived from [`empty`](#empty), [`of`](#of), and
[`reduce`](#reduce).

See also [`filterM`](#filterM).

```javascript
> filter(x => x % 2 == 1, [1, 2, 3])
[1, 3]

> filter(x => x % 2 == 1, Cons(1, Cons(2, Cons(3, Nil))))
Cons(1, Cons(3, Nil))
```

<h4 name="filterM"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1313">filterM :: (Monad m, Monoid (m a)) => (a -> Boolean, m a) -> m a</a></code></h4>

Filters its second argument in accordance with the given predicate.

This function is derived from [`empty`](#empty), [`of`](#of), and
[`chain`](#chain).

See also [`filter`](#filter).

```javascript
> filterM(x => x % 2 == 1, [1, 2, 3])
[1, 3]

> filterM(x => x % 2 == 1, Cons(1, Cons(2, Cons(3, Nil))))
Cons(1, Cons(3, Nil))
```

<h4 name="alt"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1335">alt :: Alt f => (f a, f a) -> f a</a></code></h4>

Function wrapper for [`fantasy-land/alt`][].

`fantasy-land/alt` implementations are provided for the following
built-in types: Array and Object.

```javascript
> alt([1, 2, 3], [4, 5, 6])
[1, 2, 3, 4, 5, 6]

> alt(Nothing, Nothing)
Nothing

> alt(Nothing, Just(1))
Just(1)

> alt(Just(2), Just(3))
Just(2)
```

<h4 name="zero"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1359">zero :: Plus f => TypeRep f -> f a</a></code></h4>

Function wrapper for [`fantasy-land/zero`][].

`fantasy-land/zero` implementations are provided for the following
built-in types: Array and Object.

```javascript
> zero(Array)
[]

> zero(Object)
{}

> zero(Maybe)
Nothing
```

<h4 name="reduce"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1380">reduce :: Foldable f => ((b, a) -> b, b, f a) -> b</a></code></h4>

Function wrapper for [`fantasy-land/reduce`][].

`fantasy-land/reduce` implementations are provided for the following
built-in types: Array and Object.

```javascript
> reduce((xs, x) => [x].concat(xs), [], [1, 2, 3])
[3, 2, 1]

> reduce(concat, '', Cons('foo', Cons('bar', Cons('baz', Nil))))
'foobarbaz'
```

<h4 name="traverse"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1398">traverse :: (Applicative f, Traversable t) => (TypeRep f, a -> f b, t a) -> f (t b)</a></code></h4>

Function wrapper for [`fantasy-land/traverse`][].

`fantasy-land/traverse` implementations are provided for the following
built-in types: Array.

See also [`sequence`](#sequence).

```javascript
> traverse(Array, x => x, [[1, 2, 3], [4, 5]])
[[1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5]]

> traverse(Identity, x => Identity(x + 1), [1, 2, 3])
Identity([2, 3, 4])
```

<h4 name="sequence"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1418">sequence :: (Applicative f, Traversable t) => (TypeRep f, t (f a)) -> f (t a)</a></code></h4>

Inverts the given `t (f a)` to produce an `f (t a)`.

This function is derived from [`traverse`](#traverse).

```javascript
> sequence(x => [x], Identity([1, 2, 3]))
[Identity(1), Identity(2), Identity(3)]

> sequence(Identity, [Identity(1), Identity(2), Identity(3)])
Identity([1, 2, 3])
```

<h4 name="extend"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1435">extend :: Extend w => (w a -> b, w a) -> w b</a></code></h4>

Function wrapper for [`fantasy-land/extend`][].

`fantasy-land/extend` implementations are provided for the following
built-in types: Array.

```javascript
> extend(xs => xs.length, ['foo', 'bar', 'baz', 'quux'])
[4]
```

<h4 name="extract"><code><a href="https://github.com/sanctuary-js/sanctuary-type-classes/blob/v3.0.0/index.js#L1450">extract :: Comonad w => w a -> a</a></code></h4>

Function wrapper for [`fantasy-land/extract`][].

```javascript
> extract(Identity(42))
42
```

[Alt]:                      https://github.com/fantasyland/fantasy-land#alt
[Alternative]:              https://github.com/fantasyland/fantasy-land#alternative
[Applicative]:              https://github.com/fantasyland/fantasy-land#applicative
[Apply]:                    https://github.com/fantasyland/fantasy-land#apply
[Bifunctor]:                https://github.com/fantasyland/fantasy-land#bifunctor
[Chain]:                    https://github.com/fantasyland/fantasy-land#chain
[ChainRec]:                 https://github.com/fantasyland/fantasy-land#chainrec
[Comonad]:                  https://github.com/fantasyland/fantasy-land#comonad
[Extend]:                   https://github.com/fantasyland/fantasy-land#extend
[FL]:                       https://github.com/fantasyland/fantasy-land
[Foldable]:                 https://github.com/fantasyland/fantasy-land#foldable
[Functor]:                  https://github.com/fantasyland/fantasy-land#functor
[Monad]:                    https://github.com/fantasyland/fantasy-land#monad
[Monoid]:                   https://github.com/fantasyland/fantasy-land#monoid
[Plus]:                     https://github.com/fantasyland/fantasy-land#plus
[Profunctor]:               https://github.com/fantasyland/fantasy-land#profunctor
[Semigroup]:                https://github.com/fantasyland/fantasy-land#semigroup
[Setoid]:                   https://github.com/fantasyland/fantasy-land#setoid
[Traversable]:              https://github.com/fantasyland/fantasy-land#traversable
[`fantasy-land/alt`]:       https://github.com/fantasyland/fantasy-land#alt-method
[`fantasy-land/ap`]:        https://github.com/fantasyland/fantasy-land#ap-method
[`fantasy-land/bimap`]:     https://github.com/fantasyland/fantasy-land#bimap-method
[`fantasy-land/chain`]:     https://github.com/fantasyland/fantasy-land#chain-method
[`fantasy-land/chainRec`]:  https://github.com/fantasyland/fantasy-land#chainrec-method
[`fantasy-land/concat`]:    https://github.com/fantasyland/fantasy-land#concat-method
[`fantasy-land/empty`]:     https://github.com/fantasyland/fantasy-land#empty-method
[`fantasy-land/equals`]:    https://github.com/fantasyland/fantasy-land#equals-method
[`fantasy-land/extend`]:    https://github.com/fantasyland/fantasy-land#extend-method
[`fantasy-land/extract`]:   https://github.com/fantasyland/fantasy-land#extract-method
[`fantasy-land/map`]:       https://github.com/fantasyland/fantasy-land#map-method
[`fantasy-land/of`]:        https://github.com/fantasyland/fantasy-land#of-method
[`fantasy-land/promap`]:    https://github.com/fantasyland/fantasy-land#promap-method
[`fantasy-land/reduce`]:    https://github.com/fantasyland/fantasy-land#reduce-method
[`fantasy-land/traverse`]:  https://github.com/fantasyland/fantasy-land#traverse-method
[`fantasy-land/zero`]:      https://github.com/fantasyland/fantasy-land#zero-method
[type-classes]:             https://github.com/sanctuary-js/sanctuary-def#type-classes
