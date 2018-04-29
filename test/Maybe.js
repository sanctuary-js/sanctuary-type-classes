'use strict';

var FL = require('fantasy-land');
var show = require('sanctuary-show');

var Z = require('..');


var Maybe = {prototype: _Maybe.prototype};

Maybe.prototype.constructor = Maybe;

function _Maybe(tag, value) {
  this.isNothing = tag === 'Nothing';
  this.isJust = tag === 'Just';
  if (this.isJust) this.value = value;

  if (this.isNothing || Z.Setoid.test(this.value)) {
    this[FL.equals] = Maybe$prototype$equals;
  }

  if (this.isNothing || Z.Ord.test(this.value)) {
    this[FL.lte] = Maybe$prototype$lte;
  }

  if (this.isNothing || Z.Semigroup.test(this.value)) {
    this[FL.concat] = Maybe$prototype$concat;
  }
}

Maybe['@@type'] = 'sanctuary-type-classes/Maybe';

Maybe.Nothing = new _Maybe('Nothing');

Maybe.Just = function(x) { return new _Maybe('Just', x); };

Maybe[FL.empty] = function() { return Maybe.Nothing; };

Maybe[FL.of] = Maybe.Just;

Maybe[FL.zero] = Maybe[FL.empty];

function Maybe$prototype$equals(other) {
  return this.isNothing ? other.isNothing
                        : other.isJust && Z.equals(this.value, other.value);
}

function Maybe$prototype$lte(other) {
  return this.isNothing || other.isJust && Z.lte(this.value, other.value);
}

function Maybe$prototype$concat(other) {
  return this.isNothing ? other :
         other.isNothing ? this :
         /* otherwise */ Maybe.Just(Z.concat(this.value, other.value));
}

Maybe.prototype[FL.filter] = function(pred) {
  return this.isJust && pred(this.value) ? this : Maybe.Nothing;
};

Maybe.prototype[FL.map] = function(f) {
  return this.isJust ? Maybe.Just(f(this.value)) : Maybe.Nothing;
};

Maybe.prototype[FL.ap] = function(other) {
  return other.isJust ? Z.map(other.value, this) : Maybe.Nothing;
};

Maybe.prototype[FL.chain] = function(f) {
  return this.isJust ? f(this.value) : Maybe.Nothing;
};

Maybe.prototype[FL.alt] = function(other) {
  return this.isJust ? this : other;
};

Maybe.prototype[FL.reduce] = function(f, x) {
  return this.isJust ? f(x, this.value) : x;
};

Maybe.prototype.inspect =
Maybe.prototype['@@show'] = function() {
  return this.isJust ? 'Just (' + show(this.value) + ')' : 'Nothing';
};

module.exports = Maybe;
