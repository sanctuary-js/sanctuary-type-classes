'use strict';

var FL = require('fantasy-land');

var Z = require('..');

var curry2 = require('./curry2');
var eq = require('./eq');


var List = {prototype: _List.prototype};

List.prototype.constructor = List;

function _List(tag, head, tail) {
  this.tag = tag;
  if (tag === 'Cons') {
    this.head = head;
    this.tail = tail;
  }
}

List['@@type'] = 'sanctuary-type-classes/List';

//  Nil :: List a
var Nil = List.Nil = new _List('Nil');

//  Cons :: (a, List a) -> List a
var Cons = List.Cons = function Cons(head, tail) {
  eq(arguments.length, Cons.length);
  return new _List('Cons', head, tail);
};

List[FL.empty] = function() { return Nil; };

List[FL.of] = function(x) { return Cons(x, Nil); };

List.prototype[FL.equals] = function(other) {
  return this.tag === 'Nil' ?
    other.tag === 'Nil' :
    other.tag === 'Cons' &&
      Z.equals(other.head, this.head) &&
      Z.equals(other.tail, this.tail);
};

List.prototype[FL.concat] = function(other) {
  return this.tag === 'Nil' ?
    other :
    Cons(this.head, Z.concat(this.tail, other));
};

List.prototype[FL.map] = function(f) {
  return this.tag === 'Nil' ?
    Nil :
    Cons(f(this.head), Z.map(f, this.tail));
};

List.prototype[FL.ap] = function(other) {
  return this.tag === 'Nil' || other.tag === 'Nil' ?
    Nil :
    Z.concat(Z.map(other.head, this), Z.ap(other.tail, this));
};

List.prototype[FL.chain] = function(f) {
  return this.tag === 'Nil' ?
    Nil :
    Z.concat(f(this.head), Z.chain(f, this.tail));
};

List.prototype[FL.reduce] = function(f, x) {
  return this.tag === 'Nil' ?
    x :
    Z.reduce(f, f(x, this.head), this.tail);
};

List.prototype[FL.traverse] = function(typeRep, f) {
  return this.tag === 'Nil' ?
    Z.of(typeRep, Nil) :
    Z.ap(Z.map(curry2(Cons), f(this.head)), Z.traverse(typeRep, f, this.tail));
};

List.prototype.inspect =
List.prototype.toString = function() {
  return this.tag === 'Nil' ?
    'Nil' :
    'Cons(' + Z.toString(this.head) + ', ' + Z.toString(this.tail) + ')';
};

module.exports = List;
