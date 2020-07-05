import { IntegerClass } from './IntegerClass';
import { NullValue } from 'exceptions/NullValue';
import { InvalidValue } from 'exceptions/InvalidValue';

describe('IntegerClass', () => {
  it('should create integer based ModelObject from number', () => {
    const clazz = new IntegerClass('TestClass');
    expect(clazz.isInteger()).toBe(true);
    expect(clazz.isAggregate()).toBe(false);
    expect(clazz.isDate()).toBe(false);
    expect(clazz.isFloat()).toBe(false);
    expect(clazz.isSet()).toBe(false);
    expect(clazz.isString()).toBe(false);
    const obj = clazz.createObject(5);
    expect(obj.isInteger()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isDate()).toBe(false);
    expect(obj.isFloat()).toBe(false);
    expect(obj.isSet()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.id).not.toBeUndefined();
    expect(obj.id).not.toBeNull();
    expect(obj.id).toBe(5);
  });
  it('should create integer based ModelObject from string', () => {
    const clazz = new IntegerClass('TestClass');
    const obj = clazz.createObject('5');
    expect(obj.isInteger()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isDate()).toBe(false);
    expect(obj.isFloat()).toBe(false);
    expect(obj.isSet()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.id).not.toBeUndefined();
    expect(obj.id).not.toBeNull();
    expect(obj.id).toBe(5);
  });
  it('should create integer based ModelObject from object with id property', () => {
    const clazz = new IntegerClass('TestClass');
    const obj = clazz.createObject({
      id: 5,
      properties: { de: { label: 'Fünf' } },
    });
    expect(obj.isInteger()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isDate()).toBe(false);
    expect(obj.isFloat()).toBe(false);
    expect(obj.isSet()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.id).not.toBeUndefined();
    expect(obj.id).not.toBeNull();
    expect(obj.id).toBe(5);
    expect(obj.properties).not.toBeUndefined();
    expect(obj.properties).not.toBeNull();
    expect(obj.getLabel('de')).toBe('Fünf');
  });
  it('should throw NullValue error', () => {
    const clazz = new IntegerClass('TestClass');
    expect(() => clazz.createObject(null)).toThrow(NullValue);
  });
  it('should throw InvalidValue error', () => {
    const clazz = new IntegerClass('TestClass');
    expect(() => clazz.createObject(new Date())).toThrow(InvalidValue);
  });
});
