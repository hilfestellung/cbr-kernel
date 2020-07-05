import { StringClass } from './StringClass';
import { NullValue } from 'exceptions/NullValue';
import { InvalidValue } from 'exceptions/InvalidValue';

describe('StringClass', () => {
  it('should create string based ModelObject from string', () => {
    const clazz = new StringClass('TestClass');
    const obj = clazz.createObject('test');
    expect(obj.isString()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isDate()).toBe(false);
    expect(obj.isFloat()).toBe(false);
    expect(obj.isInteger()).toBe(false);
    expect(obj.isSet()).toBe(false);
    expect(obj.id).not.toBeUndefined();
    expect(obj.id).not.toBeNull();
    expect(obj.id).toBe('test');
  });
  it('should create string based ModelObject from object with id property', () => {
    const clazz = new StringClass('TestClass');
    const obj = clazz.createObject({
      id: 'test',
      properties: { de: { label: 'Test' } },
    });
    expect(obj.isString()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isDate()).toBe(false);
    expect(obj.isFloat()).toBe(false);
    expect(obj.isInteger()).toBe(false);
    expect(obj.isSet()).toBe(false);
    expect(obj.id).not.toBeUndefined();
    expect(obj.id).not.toBeNull();
    expect(obj.id).toBe('test');
    expect(obj.properties).not.toBeUndefined();
    expect(obj.properties).not.toBeNull();
    expect(obj.getLabel('de')).toBe('Test');
  });
  it('should throw NullValue error', () => {
    const clazz = new StringClass('TestClass');
    expect(() => clazz.createObject(null)).toThrow(NullValue);
  });
  it('should throw InvalidValue error', () => {
    const clazz = new StringClass('TestClass');
    expect(() => clazz.createObject(5)).toThrow(InvalidValue);
  });
});
