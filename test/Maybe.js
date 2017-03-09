'use strict';

var FL = require('fantasy-land');

var Z = require('..');


var Maybe = {prototype: _Maybe.prototype};

Maybe.prototype.constructor = Maybe;

function _Maybe(tag, value) {
  this.isNothing = tag === 'Nothing';
  this.isJust = tag === 'Just';
  if (this.isJust) this.value = value;
}

Maybe['@@type'] = 'sanctuary-type-classes/Maybe';

Maybe.Nothing = new _Maybe('Nothing');

Maybe[FL.of] = Maybe.Just = function(x) { return new _Maybe('Just', x); };

Maybe[FL.empty] = Maybe[FL.zero] = function() { return Maybe.Nothing; };

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
