import { should } from 'chai';
import * as sets from '../src/sets.js';

// Initialises the 'should'-style.
should();

const isTrue = result => result.should.be.true;
const isFalse = result => result.should.be.false;
const equalSet = arr => result => result.should.deep.equal(new Set(arr));
const noChangeCheckBuilder = (arr1, arr2) => result => {
  result.should.deep.equal(new Set(arr1));
  result.should.deep.equal(new Set(arr2));
};

/**
 * Returns a check builder from an already constructed check operation. This can be
 * used to wrap checks in a check builder that don't need the array information.
 */
function wrapCheck(check) {
  return ((arr1, arr2) => check);
}

/**
 * @param arr1 The first set as an Array.
 * @param arr2 The second set as an Array.
 * @param operation An operation that is applied to the two sets.
 * @param check A function that reasons about the validity of the operation result.
 */
function assessCollectionCombinations(arr1, arr2, operation, check) {
  check(operation(arr1, arr2));
  check(operation(arr1, new Set(arr2)));
  check(operation(new Set(arr1), arr2));
  check(operation(new Set(arr1), new Set(arr2)));
}

/**
 * Combines some equal sets with 'operation'. The result is then checked by the check, which is produced
 * by the check builder.
 *
 * @param operation An operation that is applied to the two equal sets.
 * @param checkBuilder A check builder that builds a check function from the additional information
 *                     of which arrays have produced the current result. This allows the user of this
 *                     function to access the array values that have been transformed by the operation.
 */
function assessEqualSets(operation, checkBuilder) {
  const assess = (arr1, arr2) => {
    assessCollectionCombinations(arr1, arr2, operation, checkBuilder(arr1, arr2));
  };
  assess([], []);
  assess([1, 2, 3, 3, 3], [1, 2, 3]);
  assess(['x', 'y'], ['y', 'x']);
}

/**
 * Applies an assess function to some single sets.
 */
function applyToSingleSets(assess) {
  assess(['p']);
  assess([1, 2]);
  assess(['x', 'y']);
  assess(['y', 'x']);
}

describe('areEqual', () => {
  it('should return true for equal sets', () => {
    assessEqualSets(sets.areEqual, wrapCheck(isTrue));
  });
  it('should return false for subsets', () => {
    assessCollectionCombinations([], [1], sets.areEqual, isFalse);
    assessCollectionCombinations([], ['x', 'y', 3], sets.areEqual, isFalse);
    assessCollectionCombinations([1, 2], [1, 2, 3], sets.areEqual, isFalse);
    assessCollectionCombinations(['y', 'x', 3], [3, 'x', 44, 'y', 'abc'], sets.areEqual, isFalse);
  });
});

describe('isSubset', () => {
  it('should return true for equal sets', () => {
    assessEqualSets(sets.isSubset, wrapCheck(isTrue));
  });
  it('should return true if the left set is empty', () => {
    assessCollectionCombinations([], [1], sets.isSubset, isTrue);
    assessCollectionCombinations([], ['x', 'y', 3], sets.isSubset, isTrue);
  });
  it('should return true for non-trivial subsets', () => {
    assessCollectionCombinations([1, 2], [1, 2, 3], sets.isSubset, isTrue);
    assessCollectionCombinations(['y', 'x', 3], [3, 'x', 44, 'y', 'abc'], sets.isSubset, isTrue);
  });
  it('should return false for supersets', () => {
    assessCollectionCombinations([1], [], sets.isSubset, isFalse);
    assessCollectionCombinations(['x', 'y', 3], [3, 'y'], sets.isSubset, isFalse);
    assessCollectionCombinations([1, 2, 3], [1, 2], sets.isSubset, isFalse);
  });
  it('should compare with strict equality', () => {
    assessCollectionCombinations([3], ['3'], sets.isSubset, isFalse);
    assessCollectionCombinations(['3'], [3], sets.isSubset, isFalse);
  })
});

describe('union', () => {
  it('should return the same set for equal sets', () => {
    assessEqualSets(sets.union, noChangeCheckBuilder);
  });
  it('should return the non-trivial set if one set is empty', () => {
    applyToSingleSets(arr => {
      assessCollectionCombinations([], arr, sets.union, equalSet(arr));
      assessCollectionCombinations(arr, [], sets.union, equalSet(arr));
    });
  });
  it('should return the union of non-trivial sets', () => {
    assessCollectionCombinations(['x', 'y'], [3], sets.union, equalSet(['x', 'y', 3]));
    assessCollectionCombinations([1, 3, 2], [2, 4], sets.union, equalSet([1, 2, 3, 4]));
    assessCollectionCombinations([11, 'abc', 4], ['def', 4], sets.union, equalSet([4, 11, 'abc', 'def']));
  });
});

describe('intersection', () => {
  it('should return the same set for equal sets', () => {
    assessEqualSets(sets.intersection, noChangeCheckBuilder);
  });
  it('should return the empty set if one set is empty', () => {
    applyToSingleSets(arr => {
      assessCollectionCombinations([], arr, sets.intersection, equalSet([]));
      assessCollectionCombinations(arr, [], sets.intersection, equalSet([]));
    });
  });
  it('should return the intersection of non-trivial sets', () => {
    assessCollectionCombinations(['x', 'y'], [3], sets.intersection, equalSet([]));
    assessCollectionCombinations([1, 3, 2], [2, 4, 1], sets.intersection, equalSet([1, 2]));
    assessCollectionCombinations([11, 'abc', 4], ['def', 4, 'ghi'], sets.intersection, equalSet([4]));
    assessCollectionCombinations(['x', 'y', 1], ['y', 7, 'x'], sets.intersection, equalSet(['x', 'y']));
  });
});

describe('difference', () => {
  it('should return the empty set for equal sets', () => {
    assessEqualSets(sets.difference, wrapCheck(equalSet([])));
  });
  it('should return the same set if the right set is empty', () => {
    applyToSingleSets(arr => assessCollectionCombinations(arr, [], sets.difference, equalSet(arr)));
  });
  it('should return the empty set if the left set is empty', () => {
    applyToSingleSets(arr => assessCollectionCombinations([], arr, sets.difference, equalSet([])));
  });
  it('should return the difference of non-trivial sets', () => {
    assessCollectionCombinations(['x', 'y'], [3], sets.difference, equalSet(['x', 'y']));
    assessCollectionCombinations([1, 3, 2], [2, 4, 1], sets.difference, equalSet([3]));
    assessCollectionCombinations([11, 'abc', 4], ['def', 4, 'ghi'], sets.difference, equalSet([11, 'abc']));
    assessCollectionCombinations(['x', 'y', 1], ['y', 7, 'x'], sets.difference, equalSet([1]));
  });
});

describe('symmetric difference', () => {
  it('should return the empty set for equal sets', () => {
    assessEqualSets(sets.symmetricDifference, wrapCheck(equalSet([])));
  });
  it('should return the left set if the right set is empty', () => {
    applyToSingleSets(arr => assessCollectionCombinations(arr, [], sets.symmetricDifference, equalSet(arr)));
  });
  it('should return the right set if the left set is empty', () => {
    applyToSingleSets(arr => assessCollectionCombinations([], arr, sets.symmetricDifference, equalSet(arr)));
  });
  it('should return the symmetric difference of non-trivial sets', () => {
    assessCollectionCombinations(['x', 'y'], [3], sets.symmetricDifference, equalSet(['x', 'y', 3]));
    assessCollectionCombinations([1, 3, 2], [2, 4, 1], sets.symmetricDifference, equalSet([3, 4]));
    assessCollectionCombinations([11, 'abc', 4], ['def', 4, 'ghi'], sets.symmetricDifference, equalSet([11, 'abc', 'def', 'ghi']));
    assessCollectionCombinations(['x', 'y', 1], ['y', 7, 'x'], sets.symmetricDifference, equalSet([1, 7]));
  });
});
