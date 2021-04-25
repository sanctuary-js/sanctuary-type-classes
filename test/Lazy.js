'use strict';

const FL = require ('fantasy-land');

const Z = require ('..');


//  Lazy :: (() -> a) -> Lazy a
function Lazy(f) {
  if (!(this instanceof Lazy)) return new Lazy (f);
  this.run = f;
}

Lazy[FL.of] = a => Lazy (() => a);

Lazy.prototype['@@type'] = 'sanctuary-type-classes/Lazy@1';

Lazy.prototype[FL.map] = function(f) {
  return Z.ap (Z.of (Lazy, f), this);
};

Lazy.prototype[FL.ap] = function(other) {
  return Lazy (() => other.run () (this.run ()));
};

module.exports = Lazy;
