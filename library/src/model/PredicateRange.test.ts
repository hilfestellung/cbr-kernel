import { PredicateRange } from './PredicateRange';
import { ModelObject } from './ModelObject';

describe('PredicateRange', () => {
  const ImplModObj = class extends ModelObject<any> {
    nativeToString(): string {
      return this.id.toString();
    }
  };
  it('should be false for range', () => {
    const predicate = new PredicateRange(new ImplModObj(5), new ImplModObj(10));
    expect(predicate.isRange()).toBe(true);
  });
  it('should be false for enumeration', () => {
    const predicate = new PredicateRange(new ImplModObj(5), new ImplModObj(10));
    expect(predicate.isEnumerable()).toBe(false);
  });
  it('should be false for aggregate', () => {
    const predicate = new PredicateRange(new ImplModObj(5), new ImplModObj(10));
    expect(predicate.isAggregate()).toBe(false);
  });
  it('should throw exception getEnumeration', () => {
    const predicate = new PredicateRange(new ImplModObj(5), new ImplModObj(10));
    expect(predicate.getEnumeration).toThrow(Error);
  });
  it('should exchange min and max if the arguments are given in the wrong order', () => {
    const predicate = new PredicateRange(new ImplModObj(10), new ImplModObj(5));
    expect(predicate.getMinimum()).not.toBeNull();
    expect(predicate.getMinimum()).not.toBeUndefined();
    expect(predicate.getMinimum().id).not.toBeNull();
    expect(predicate.getMinimum().id).not.toBeUndefined();
    expect(predicate.getMinimum().id).toBe(5);
    expect(predicate.getMaximum()).not.toBeNull();
    expect(predicate.getMaximum()).not.toBeUndefined();
    expect(predicate.getMaximum().id).not.toBeNull();
    expect(predicate.getMaximum().id).not.toBeUndefined();
    expect(predicate.getMaximum().id).toBe(10);
  });
});
