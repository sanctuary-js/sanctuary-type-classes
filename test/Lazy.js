'use strict';

var FL = require ('fantasy-land');

var Z = require ('..');


//  Lazy :: (() -> a) -> Lazy a
function Lazy(f) {
  if (!(this instanceof Lazy)) return new Lazy (f);
  this.run = f;
}

Lazy[FL.of] = function(a) {
  return Lazy (function() { return a; });
};

Lazy.prototype['@@type'] = 'sanctuary-type-classes/Lazy@1';

Lazy.prototype[FL.map] = function(f) {
  return Z.ap (Z.of (Lazy, f), this);
};

Lazy.prototype[FL.ap] = function(other) {
  var task = this;
  return Lazy (function() { return other.run () (task.run ()); });
};

module.exports = Lazy;
