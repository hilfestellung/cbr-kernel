import { SetClass } from './SetClass';
import { NullValue } from '../exceptions/NullValue';
import { InvalidValue } from '../exceptions/InvalidValue';
import { IntegerClass } from './IntegerClass';
import { IntegerObject } from './IntegerObject';

describe('SetClass', () => {
  it('should create integer based ModelObject set from number', () => {
    const clazz = new SetClass('TestClass');
    clazz.elementModelClass = new IntegerClass('TestClass2');
    expect(clazz.isSet()).toBe(true);
    expect(clazz.isAggregate()).toBe(false);
    expect(clazz.isDate()).toBe(false);
    expect(clazz.isFloat()).toBe(false);
    expect(clazz.isInteger()).toBe(false);
    expect(clazz.isString()).toBe(false);
    const obj = clazz.createObject([5, 6, 7]);
    expect(obj.isSet()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isDate()).toBe(false);
    expect(obj.isFloat()).toBe(false);
    expect(obj.isInteger()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.native).not.toBeUndefined();
    expect(obj.native).not.toBeNull();
    expect(obj.native).toEqual([
      new IntegerObject(5),
      new IntegerObject(6),
      new IntegerObject(7),
    ]);
  });
  it('should create integer based ModelObject set from string', () => {
    const clazz = new SetClass('TestClass');
    clazz.elementModelClass = new IntegerClass('TestClass2');
    const obj = clazz.createObject(['5', '6', '7']);
    expect(obj.isSet()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isDate()).toBe(false);
    expect(obj.isFloat()).toBe(false);
    expect(obj.isInteger()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.native).not.toBeUndefined();
    expect(obj.native).not.toBeNull();
    expect(obj.native).toEqual([
      new IntegerObject(5, undefined),
      new IntegerObject(6, undefined),
      new IntegerObject(7, undefined),
    ]);
  });
  it('should create integer based ModelObject set from object with id property', () => {
    const clazz = new SetClass('TestClass');
    clazz.elementModelClass = new IntegerClass('TestClass2');
    const obj = clazz.createObject([
      {
        id: 5,
        properties: { de: { label: 'Fünf' } },
      },
      {
        id: 6,
        properties: { de: { label: 'Sechs' } },
      },
      {
        id: 7,
        properties: { de: { label: 'Sieben' } },
      },
    ]);
    expect(obj.isSet()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isDate()).toBe(false);
    expect(obj.isFloat()).toBe(false);
    expect(obj.isInteger()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.native).not.toBeUndefined();
    expect(obj.native).not.toBeNull();
    expect(obj.native).toEqual([
      new IntegerObject(5, { de: { label: 'Fünf' } }),
      new IntegerObject(6, { de: { label: 'Sechs' } }),
      new IntegerObject(7, { de: { label: 'Sieben' } }),
    ]);
  });
  it('should throw NullValue error', () => {
    const clazz = new SetClass('TestClass');
    clazz.elementModelClass = new IntegerClass('TestClass2');
    expect(() => clazz.createObject(null)).toThrow(NullValue);
  });
  it('should throw InvalidValue error', () => {
    const clazz = new SetClass('TestClass');
    clazz.elementModelClass = new IntegerClass('TestClass2');
    expect(() => clazz.createObject(new Date())).toThrow(InvalidValue);
  });
  it('should convert by toJSON to the expected format', () => {
    const clazz = new SetClass('TestClass');
    clazz.elementModelClass = new IntegerClass('TestClass2');
    const json = clazz.toJSON();
    expect(json.id).toBe('TestClass');
    expect(json.type).toBe('set');
    expect(json.elementType).toBe('TestClass2');
  });
});
