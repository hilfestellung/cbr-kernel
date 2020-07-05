import { SetObject } from './SetObject';
import { IntegerObject } from './IntegerObject';

describe('SetObject', () => {
  it('should return correct number value as native', () => {
    const obj = new SetObject([
      new IntegerObject(5),
      new IntegerObject(6),
      new IntegerObject(7),
    ]);
    expect(obj.isSet()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isDate()).toBe(false);
    expect(obj.isFloat()).toBe(false);
    expect(obj.isInteger()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.nativeToString()).toBe('5, 6, 7');
  });
});
