import { PredicateEnumeration } from './PredicateEnumeration';
import { ModelObject } from './ModelObject';

describe('PredicateEnumeration', () => {
  const ImplModObj = class extends ModelObject<any> {
    nativeToString(): string {
      return this.id.toString();
    }
  };

  it('should be true for enumeration', () => {
    const predicate = new PredicateEnumeration([]);
    expect(predicate.isEnumerable()).toBe(true);
  });
  it('should be false for aggregate', () => {
    const predicate = new PredicateEnumeration([]);
    expect(predicate.isAggregate()).toBe(false);
  });
  it('should be false for range', () => {
    const predicate = new PredicateEnumeration([]);
    expect(predicate.isRange()).toBe(false);
  });
  it('should throw exception getMinimum', () => {
    const predicate = new PredicateEnumeration([]);
    expect(predicate.getMinimum).toThrow(Error);
  });
  it('should throw exception getMaximum', () => {
    const predicate = new PredicateEnumeration([]);
    expect(predicate.getMaximum).toThrow(Error);
  });
  it('should add value and keep reference', () => {
    const values: ModelObject<any>[] = [];
    const predicate = new PredicateEnumeration(values);
    const testObject1 = new ImplModObj(5);
    const testObject2 = new ImplModObj(5);
    testObject2.properties = { en: { label: 'Fünf' } };
    let predicateValues = predicate.getEnumeration();
    expect(values.length).toBe(0);
    expect(predicateValues.length).toBe(0);
    // do not add a  null value
    predicate.addValue((null as unknown) as ModelObject<any>);
    predicateValues = predicate.getEnumeration();
    expect(values.length).toBe(0);
    expect(predicateValues.length).toBe(0);
    predicate.addValue(testObject1);
    expect(values.length).toBe(1);
    predicateValues = predicate.getEnumeration();
    expect(predicateValues.length).toBe(1);
    expect(predicateValues[0]).toBe(testObject1);
    expect(predicateValues[0].properties).toBeUndefined();
    predicate.addValue(testObject2);
    // keep reference to testObject1
    expect(predicateValues.length).toBe(1);
    expect(predicateValues[0]).toBe(testObject1);
    expect(predicateValues[0]).not.toBe(testObject2);
    expect(predicateValues[0].properties).not.toBeUndefined();
    expect(predicateValues[1]).toBeUndefined();
  });
  it('should add values', () => {
    const values: ModelObject<any>[] = [];
    const predicate = new PredicateEnumeration(values);
    const testObject1 = new ImplModObj(5);
    const testObject2 = new ImplModObj(6);
    predicate.addValues([testObject1, testObject2]);
    const predicateValues = predicate.getEnumeration();
    expect(predicateValues.length).toBe(2);
    expect(predicateValues[0]).toBe(testObject1);
    expect(predicateValues[1]).toBe(testObject2);
  });
  it('should remove value', () => {
    const testObject1 = new ImplModObj(5);
    const testObject2 = new ImplModObj(6);
    const values: ModelObject<any>[] = [testObject1, testObject2];
    const predicate = new PredicateEnumeration(values);
    predicate.removeValue((null as unknown) as ModelObject<any>);
    let predicateValues = predicate.getEnumeration();
    expect(predicateValues.length).toBe(2);
    predicate.removeValue(new ImplModObj(5));
    predicateValues = predicate.getEnumeration();
    expect(predicateValues.length).toBe(1);
    expect(predicateValues[0]).toBe(testObject2);
    predicate.removeValue(new ImplModObj(6));
    predicateValues = predicate.getEnumeration();
    expect(predicateValues.length).toBe(0);
  });
  it('should remove values', () => {
    const testObject1 = new ImplModObj(5);
    const testObject2 = new ImplModObj(6);
    const testObject3 = new ImplModObj(7);
    const testObject4 = new ImplModObj(8);
    const values: ModelObject<any>[] = [
      testObject1,
      testObject2,
      testObject3,
      testObject4,
    ];
    const predicate = new PredicateEnumeration(values);
    predicate.removeValues([new ImplModObj(6), new ImplModObj(8)]);
    let predicateValues = predicate.getEnumeration();
    expect(predicateValues.length).toBe(2);
    expect(predicateValues[0]).toBe(testObject1);
    expect(predicateValues[1]).toBe(testObject3);
  });
});
