import { should } from 'chai';
import * as sets from '../src/sets.js';

// Initialises the 'should'-style.
should();

const isTrue = result => result.should.be.true;
const isFalse = result => result.should.be.false;

function assessCollectionCombinations(arr1, arr2, apply, check) {
  check(apply(arr1, arr2));
  check(apply(arr1, new Set(arr2)));
  check(apply(new Set(arr1), arr2));
  check(apply(new Set(arr1), new Set(arr2)));
}

function assessEqualSets(apply) {
  assessCollectionCombinations([], [], apply, isTrue);
  assessCollectionCombinations([1, 2, 3, 3, 3], [1, 2, 3], apply, isTrue);
  assessCollectionCombinations(['x', 'y'], ['y', 'x'], apply, isTrue);
}

describe('areEqual', () => {
  it('should return true for equal sets', () => {
    assessEqualSets(sets.areEqual);
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
    assessEqualSets(sets.isSubset);
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
