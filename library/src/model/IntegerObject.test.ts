import { IntegerObject } from './IntegerObject';

describe('IntegerObject', () => {
  it('should return correct number value as native', () => {
    const obj = new IntegerObject(5);
    expect(obj.isInteger()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isDate()).toBe(false);
    expect(obj.isFloat()).toBe(false);
    expect(obj.isSet()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.nativeToString()).toBe('5');
  });
});
