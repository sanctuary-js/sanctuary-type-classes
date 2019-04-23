'use strict';

var FL = require ('fantasy-land');
var show = require ('sanctuary-show');

var Z = require ('..');


//  Sum :: Number -> Sum
function Sum(value) {
  if (!(this instanceof Sum)) return new Sum (value);
  this.value = value;
}

Sum[FL.empty] = function() { return Sum (0); };

Sum.prototype['@@type'] = 'sanctuary-type-classes/Sum@1';

Sum.prototype[FL.equals] = function(other) {
  return Z.equals (this.value, other.value);
};

Sum.prototype[FL.concat] = function(other) {
  return Sum (this.value + other.value);
};

Sum.prototype[FL.invert] = function() {
  return Sum (-this.value);
};

Sum.prototype.inspect =
Sum.prototype['@@show'] = function() {
  return 'Sum (' + show (this.value) + ')';
};

module.exports = Sum;
