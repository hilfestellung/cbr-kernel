import { DateObject } from './DateObject';

describe('DateObject', () => {
  it('should return correct date object', () => {
    const obj = new DateObject(new Date(2020, 6, 5));
    expect(obj.isDate()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isFloat()).toBe(false);
    expect(obj.isInteger()).toBe(false);
    expect(obj.isSet()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.nativeToString()).toBe(new Date(2020, 6, 5).toISOString());
  });
});
