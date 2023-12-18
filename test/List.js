import {deepStrictEqual as eq} from 'node:assert';

import * as FL from 'fantasy-land';
import show from 'sanctuary-show';

import {
  ap,
  chain,
  concat,
  equals,
  filter,
  map,
  of,
  reduce,
  traverse,
} from '../index.js';


export const List = {prototype: _List.prototype};

List.prototype.constructor = List;

function _List(tag, head, tail) {
  this.isNil = tag === 'Nil';
  this.isCons = tag === 'Cons';
  if (this.isCons) {
    this.head = head;
    this.tail = tail;
  }
}

//  Nil :: List a
export const Nil = List.Nil = new _List ('Nil');

//  Cons :: (a, List a) -> List a
export const Cons = List.Cons = function Cons(head, tail) {
  eq (arguments.length, Cons.length);
  return new _List ('Cons', head, tail);
};

List[FL.empty] = () => Nil;

List[FL.of] = x => Cons (x, Nil);

List[FL.zero] = List[FL.empty];

List.prototype['@@type'] = 'sanctuary-type-classes/List@1';

List.prototype[FL.equals] = function(other) {
  return this.isNil ?
    other.isNil :
    other.isCons &&
      equals (other.head, this.head) &&
      equals (other.tail, this.tail);
};

List.prototype[FL.concat] = function(other) {
  return this.isNil ?
    other :
    Cons (this.head, concat (this.tail, other));
};

List.prototype[FL.filter] = function(pred) {
  return this.isNil ?
    Nil :
    pred (this.head) ?
      Cons (this.head, filter (pred, this.tail)) :
      filter (pred, this.tail);
};

List.prototype[FL.map] = function(f) {
  return this.isNil ?
    Nil :
    Cons (f (this.head), map (f, this.tail));
};

List.prototype[FL.ap] = function(other) {
  return this.isNil || other.isNil ?
    Nil :
    concat (map (other.head, this), ap (other.tail, this));
};

List.prototype[FL.chain] = function(f) {
  return this.isNil ?
    Nil :
    concat (f (this.head), chain (f, this.tail));
};

List.prototype[FL.alt] = List.prototype[FL.concat];

List.prototype[FL.reduce] = function(f, x) {
  return this.isNil ?
    x :
    reduce (f, f (x, this.head), this.tail);
};

List.prototype[FL.traverse] = function(typeRep, f) {
  return this.isNil ?
    of (typeRep, Nil) :
    ap (map (head => tail => Cons (head, tail), f (this.head)),
        traverse (typeRep, f, this.tail));
};

List.prototype.inspect =
List.prototype['@@show'] = function() {
  return this.isNil ?
    'Nil' :
    'Cons (' + show (this.head) + ', ' + show (this.tail) + ')';
};
