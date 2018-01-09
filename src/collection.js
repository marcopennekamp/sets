// @flow

/**
 * A collection in 'sets'-terms is any collection that can be handled by the API. The Collection
 * type is therefore a sum type of the types that can be handled. This is currently restricted to
 * Sets and Arrays, but may be expanded in the future.
 */
export type Collection<A> = Set<A> | Array<A>;

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
export function toArray<A>(collection: Collection<A>): Array<A> {
  if (Array.isArray(collection)) {
    return collection;
  }

  if (collection instanceof Set) {
    return Array.from(collection);
  }

  throw new TypeError(collectionTypeErrorMessage);
}
