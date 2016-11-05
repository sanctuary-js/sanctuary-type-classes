'use strict';

var FL = require('fantasy-land');

var Z = require('..');


var Maybe = function Maybe(tag, value) {
  this.isNothing = tag === 'Nothing';
  this.isJust = tag === 'Just';
  if (this.isJust) this.value = value;
};

Maybe.Nothing = new Maybe('Nothing');

Maybe.Just = function(x) { return new Maybe('Just', x); };

Maybe[FL.zero] = function() { return Maybe.Nothing; };

Maybe.prototype['@@type'] = 'sanctuary-type-classes/Maybe';

Maybe.prototype[FL.equals] = function(other) {
  return this.isNothing ? other.isNothing
                        : other.isJust && Z.equals(other.value, this.value);
};

Maybe.prototype[FL.map] = function(f) {
  return this.isJust ? Maybe.Just(f(this.value)) : Maybe.Nothing;
};

Maybe.prototype[FL.alt] = function(other) {
  return this.isJust ? this : other;
};

Maybe.prototype.inspect =
Maybe.prototype.toString = function() {
  return this.isJust ? 'Just(' + Z.toString(this.value) + ')' : 'Nothing';
};

module.exports = Maybe;
