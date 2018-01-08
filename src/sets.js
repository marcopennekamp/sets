// @flow

type Collection<A> = Set<A> | Array<A>

const collectionTypeErrorMessage = 'The argument must be a Set or an Array.';

/**
 * Converts a collection object to a Set.
 */
export function setify<A>(collection: Collection<A>): Set<A> {
  if (collection instanceof Set) {
    return collection;
  }

  if (Array.isArray(collection)) {
    return new Set(collection);
  }

  throw new TypeError(collectionTypeErrorMessage);
}

/**
 * Converts a collection object to an Array.
 */
function toArray<A>(collection: Collection<A>): Array<A> {
  if (Array.isArray(collection)) {
    return collection;
  }

  if (collection instanceof Set) {
    return Array.from(collection);
  }

  throw new TypeError(collectionTypeErrorMessage);
}

/**
 * Applies the function f to each value of the collection, creating a new Set with the results.
 */
export function map<A, B>(collection: Collection<A>, f: A => B): Set<B> {
  return new Set(toArray(collection).map(f));
}

export function fold<A, X>(collection: Collection<A>, initial: X, f: (X, A) => X): X {
  return toArray(collection).reduce(f, initial);
}

export function forall<A>(collection: Collection<A>, condition: A => boolean): boolean {
  return toArray(collection).every(condition);
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
 * Checks whether two sets are equal.
 */
export function areEqual<A>(left: Collection<A>, right: Collection<A>): boolean {
  const leftSet = setify(left);
  const rightSet = setify(right);

  return isSubset(leftSet, rightSet) && isSubset(rightSet, leftSet);
}
