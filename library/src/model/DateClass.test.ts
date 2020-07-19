import { DateClass } from './DateClass';
import { NullValue } from '../exceptions/NullValue';
import { InvalidValue } from '../exceptions/InvalidValue';

describe('DateClass', () => {
  it('should create date based ModelObject from date', () => {
    const clazz = new DateClass('TestClass');
    expect(clazz.isDate()).toBe(true);
    expect(clazz.isAggregate()).toBe(false);
    expect(clazz.isFloat()).toBe(false);
    expect(clazz.isInteger()).toBe(false);
    expect(clazz.isSet()).toBe(false);
    expect(clazz.isString()).toBe(false);
    const obj = clazz.createObject(new Date(2020, 6, 5));
    expect(obj.isDate()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isFloat()).toBe(false);
    expect(obj.isInteger()).toBe(false);
    expect(obj.isSet()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.id).not.toBeUndefined();
    expect(obj.id).not.toBeNull();
    expect(obj.id).toEqual(new Date(2020, 6, 5));
  });
  it('should create date based ModelObject from number', () => {
    const clazz = new DateClass('TestClass');
    const obj = clazz.createObject(1593900000000);
    expect(obj.isDate()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isFloat()).toBe(false);
    expect(obj.isInteger()).toBe(false);
    expect(obj.isSet()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.id).not.toBeUndefined();
    expect(obj.id).not.toBeNull();
    expect(obj.id).toEqual(new Date(2020, 6, 5));
  });
  it('should create date based ModelObject from string', () => {
    const clazz = new DateClass('TestClass');
    const obj = clazz.createObject(new Date(2020, 6, 5).toISOString());
    expect(obj.isDate()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isFloat()).toBe(false);
    expect(obj.isInteger()).toBe(false);
    expect(obj.isSet()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.id).not.toBeUndefined();
    expect(obj.id).not.toBeNull();
    expect(obj.id).toEqual(new Date(2020, 6, 5));
  });
  it('should create date based ModelObject from object with id property', () => {
    const clazz = new DateClass('TestClass');
    const obj = clazz.createObject({
      id: new Date(2020, 6, 5).toISOString(),
      properties: { de: { label: 'Heute' } },
    });
    expect(obj.isDate()).toBe(true);
    expect(obj.isAggregate()).toBe(false);
    expect(obj.isFloat()).toBe(false);
    expect(obj.isInteger()).toBe(false);
    expect(obj.isSet()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.id).not.toBeUndefined();
    expect(obj.id).not.toBeNull();
    expect(obj.id).toEqual(new Date(2020, 6, 5));
    expect(obj.properties).not.toBeUndefined();
    expect(obj.properties).not.toBeNull();
    expect(obj.getLabel('de')).toBe('Heute');
  });
  it('should throw NullValue error', () => {
    const clazz = new DateClass('TestClass');
    expect(() => clazz.createObject(null)).toThrow(NullValue);
  });
  it('should throw InvalidValue error', () => {
    const clazz = new DateClass('TestClass');
    expect(() => clazz.createObject({ some: 'object' })).toThrow(InvalidValue);
  });
});
