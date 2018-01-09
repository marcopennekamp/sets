// @flow

import { type Collection, setify, toArray } from './collection';

/**
 * Applies the function f to each value of the set, creating a new Set with the results.
 */
export function map<A, B>(collection: Collection<A>, f: A => B): Set<B> {
  return new Set(toArray(collection).map(f));
}

/**
 * Folds the elements of the set with an operation into an accumulator.
 */
export function fold<A, X>(collection: Collection<A>, initial: X, f: (X, A) => X): X {
  return toArray(collection).reduce(f, initial);
}

/**
 * Returns true if the condition is true for all elements of the set, otherwise false.
 */
export function forall<A>(collection: Collection<A>, condition: A => boolean): boolean {
  return toArray(collection).every(condition);
}

/**
 * Returns true if the condition is true for one element of the set, otherwise false.
 */
export function exists<A>(collection: Collection<A>, condition: A => boolean): boolean {
  return toArray(collection).some(condition);
}

/**
 * Returns the union of the two sets.
 */
export function union<A>(c1: Collection<A>, c2: Collection<A>): Set<A> {
  const set1 = setify(c1);
  const set2 = setify(c2);
  const result = new Set(set1);
  set2.forEach(e => result.add(e));
  return result;
}

/**
 * Returns the intersection of the two sets.
 */
export function intersection<A>(c1: Collection<A>, c2: Collection<A>): Set<A> {
  const set1 = setify(c1);
  const set2 = setify(c2);
  const result = new Set();
  set2.forEach((e) => {
    if (set1.has(e)) {
      result.add(e);
    }
  });
  return result;
}

/**
 * Returns the the set c1 without the elements from c2.
 */
export function difference<A>(c1: Collection<A>, c2: Collection<A>): Set<A> {
  const set1 = setify(c1);
  const set2 = setify(c2);
  const result = new Set(set1);
  set2.forEach((e) => {
    result.delete(e);
  });
  return result;
}

/**
 * Returns the symmetric difference of the two sets.
 */
export function symmetricDifference<A>(c1: Collection<A>, c2: Collection<A>): Set<A> {
  return union(difference(c1, c2), difference(c2, c1));
}

/**
 * Checks whether left is a subset of right.
 */
export function isSubset<A>(left: Collection<A>, right: Collection<A>): boolean {
  const leftSet = setify(left);
  const rightSet = setify(right);

  // We check naively whether all elements of the left set are also in the right set.
  return forall(leftSet, value => rightSet.has(value));
}

/**
 * Checks whether the two sets are equal.
 */
export function areEqual<A>(left: Collection<A>, right: Collection<A>): boolean {
  const leftSet = setify(left);
  const rightSet = setify(right);

  return isSubset(leftSet, rightSet) && isSubset(rightSet, leftSet);
}
