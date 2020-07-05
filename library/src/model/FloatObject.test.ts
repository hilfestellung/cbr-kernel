import { FloatObject } from './FloatObject';

describe('FloatObject', () => {
  it('should return correct number value as native', () => {
    const obj = new FloatObject(5.81);
    expect(obj.isFloat()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isDate()).toBe(false);
    expect(obj.isInteger()).toBe(false);
    expect(obj.isSet()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.nativeToString()).toBe('5.81');
  });
});
