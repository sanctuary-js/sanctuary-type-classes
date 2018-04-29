'use strict';

var FL = require('fantasy-land');
var show = require('sanctuary-show');

var Z = require('..');


//  Identity :: a -> Identity a
function Identity(value) {
  if (!(this instanceof Identity)) return new Identity(value);
  this.value = value;
}

Identity['@@type'] = 'sanctuary-type-classes/Identity';

Identity[FL.of] = Identity;

Identity.prototype[FL.equals] = function(other) {
  return Z.equals(this.value, other.value);
};

Identity.prototype[FL.lte] = function(other) {
  return Z.lte(this.value, other.value);
};

Identity.prototype[FL.concat] = function(other) {
  return Identity(Z.concat(this.value, other.value));
};

Identity.prototype[FL.map] = function(f) {
  return Identity(f(this.value));
};

Identity.prototype[FL.ap] = function(other) {
  return Z.map(other.value, this);
};

Identity.prototype[FL.chain] = function(f) {
  return f(this.value);
};

Identity.prototype[FL.reduce] = function(f, x) {
  return f(x, this.value);
};

Identity.prototype[FL.traverse] = function(typeRep, f) {
  return Z.map(Identity, f(this.value));
};

Identity.prototype[FL.extend] = function(f) {
  return Identity(f(this));
};

Identity.prototype[FL.extract] = function() {
  return this.value;
};

Identity.prototype.inspect =
Identity.prototype['@@show'] = function() {
  return 'Identity (' + show(this.value) + ')';
};

module.exports = Identity;
