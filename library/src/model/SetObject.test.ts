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
  it('should convert by toJSON to the expected format', () => {
    const clazz = new SetObject([
      new IntegerObject(5),
      new IntegerObject(6),
      new IntegerObject(7),
      new IntegerObject(8),
    ]);
    const json = clazz.toJSON();
    expect(json).toBeInstanceOf(Array);
    expect(json[0]).toEqual({ id: 5, properties: undefined });
    expect(json[1]).toEqual({ id: 6, properties: undefined });
    expect(json[2]).toEqual({ id: 7, properties: undefined });
    expect(json[3]).toEqual({ id: 8, properties: undefined });
  });
});
