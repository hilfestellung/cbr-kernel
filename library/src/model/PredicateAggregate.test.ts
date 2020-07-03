import { PredicateAggregate } from './PredicateAggregate';

import {} from 'jest';

describe('PredicateAggregate', () => {
  it('should be true for aggregate', () => {
    const predicate = new PredicateAggregate();
    expect(predicate.isAggregate()).toBe(true);
  });
  it('should be false for enumeration', () => {
    const predicate = new PredicateAggregate();
    expect(predicate.isEnumerable()).toBe(false);
  });
  it('should be false for range', () => {
    const predicate = new PredicateAggregate();
    expect(predicate.isRange()).toBe(false);
  });
  it('should throw exception getEnumeration', () => {
    const predicate = new PredicateAggregate();
    expect(predicate.getEnumeration).toThrow(Error);
  });
  it('should throw exception getMinimum', () => {
    const predicate = new PredicateAggregate();
    expect(predicate.getMinimum).toThrow(Error);
  });
  it('should throw exception getMaximum', () => {
    const predicate = new PredicateAggregate();
    expect(predicate.getMaximum).toThrow(Error);
  });
});
