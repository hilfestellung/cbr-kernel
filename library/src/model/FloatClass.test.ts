import { FloatClass } from './FloatClass';
import { NullValue } from '../exceptions/NullValue';
import { InvalidValue } from '../exceptions/InvalidValue';

describe('FloatClass', () => {
  it('should create float based ModelObject from number', () => {
    const clazz = new FloatClass('TestClass');
    expect(clazz.isFloat()).toBe(true);
    expect(clazz.isAggregate()).toBe(false);
    expect(clazz.isDate()).toBe(false);
    expect(clazz.isInteger()).toBe(false);
    expect(clazz.isSet()).toBe(false);
    expect(clazz.isString()).toBe(false);
    const obj = clazz.createObject(5.81);
    expect(obj.isFloat()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isDate()).toBe(false);
    expect(obj.isInteger()).toBe(false);
    expect(obj.isSet()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.id).not.toBeUndefined();
    expect(obj.id).not.toBeNull();
    expect(obj.id).toBe(5.81);
  });
  it('should create float based ModelObject from string', () => {
    const clazz = new FloatClass('TestClass');
    const obj = clazz.createObject('5.81');
    expect(obj.isFloat()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isDate()).toBe(false);
    expect(obj.isInteger()).toBe(false);
    expect(obj.isSet()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.id).not.toBeUndefined();
    expect(obj.id).not.toBeNull();
    expect(obj.id).toBe(5.81);
  });
  it('should create float based ModelObject from object with id property', () => {
    const clazz = new FloatClass('TestClass');
    const obj = clazz.createObject({
      id: 5.81,
      properties: { de: { label: 'Fünf' } },
    });
    expect(obj.isFloat()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isDate()).toBe(false);
    expect(obj.isInteger()).toBe(false);
    expect(obj.isSet()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.id).not.toBeUndefined();
    expect(obj.id).not.toBeNull();
    expect(obj.id).toBe(5.81);
    expect(obj.properties).not.toBeUndefined();
    expect(obj.properties).not.toBeNull();
    expect(obj.getLabel('de')).toBe('Fünf');
  });
  it('should throw NullValue error', () => {
    const clazz = new FloatClass('TestClass');
    expect(() => clazz.createObject(null)).toThrow(NullValue);
  });
  it('should throw InvalidValue error', () => {
    const clazz = new FloatClass('TestClass');
    expect(() => clazz.createObject(new Date())).toThrow(InvalidValue);
  });
});
