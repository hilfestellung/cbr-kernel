import { StringObject } from './StringObject';

describe('StringObject', () => {
  it('should return correct string value as native', () => {
    const obj = new StringObject('test');
    expect(obj.isString()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isDate()).toBe(false);
    expect(obj.isFloat()).toBe(false);
    expect(obj.isInteger()).toBe(false);
    expect(obj.isSet()).toBe(false);
    expect(obj.nativeToString()).toBe('test');
  });
});
