import * as FL from 'fantasy-land';
import show from 'sanctuary-show';

import * as Z from '../index.js';

export {Sum};


//  Sum :: Number -> Sum
function Sum(value) {
  if (!(this instanceof Sum)) return new Sum (value);
  this.value = value;
}

Sum[FL.empty] = () => Sum (0);

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
