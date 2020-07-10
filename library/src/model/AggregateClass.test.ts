// import { AggregateClass } from './AggregateClass';
// import { Attribute } from './Attribute';
// import { IntegerClass } from './IntegerClass';
// import { PredicateRange } from './PredicateRange';
// import { IntegerObject } from './IntegerObject';

import { AggregateClass } from './AggregateClass';
import { Attribute } from './Attribute';
import { IntegerClass } from './IntegerClass';
import { StringClass } from './StringClass';
import { IntegerObject } from './IntegerObject';
import { StringObject } from './StringObject';

describe('AggregateClass', () => {
  it('shoudl create correct aggregate object', () => {
    const attributes = [
      new Attribute('miles', new IntegerClass('Miles')),
      new Attribute('make', new StringClass('Make')),
    ];
    const clazz = new AggregateClass('TestClass', attributes);
    expect(clazz.isAggregate()).toBe(true);
    expect(clazz.isDate()).toBe(false);
    expect(clazz.isFloat()).toBe(false);
    expect(clazz.isInteger()).toBe(false);
    expect(clazz.isSet()).toBe(false);
    expect(clazz.isString()).toBe(false);
    let obj = clazz.createObject({ miles: 5, make: 'Opel' });
    expect(obj.isAggregate()).toBe(true);
    expect(obj.isDate()).toBe(false);
    expect(obj.isFloat()).toBe(false);
    expect(obj.isInteger()).toBe(false);
    expect(obj.isSet()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.native).not.toBeUndefined();
    expect(obj.native).not.toBeNull();
    expect(obj.native.miles).toEqual(new IntegerObject(5));
    expect(obj.native.make).toEqual(new StringObject('Opel'));
    obj = clazz.createObject([
      { id: 'miles', value: 5 },
      { id: 'make', value: 'Opel' },
    ]);
    expect(obj.isAggregate()).toBe(true);
    expect(obj.isDate()).toBe(false);
    expect(obj.isFloat()).toBe(false);
    expect(obj.isInteger()).toBe(false);
    expect(obj.isSet()).toBe(false);
    expect(obj.isString()).toBe(false);
    expect(obj.native).not.toBeUndefined();
    expect(obj.native).not.toBeNull();
    expect(obj.native.miles).toEqual(new IntegerObject(5));
    expect(obj.native.make).toEqual(new StringObject('Opel'));
  });
  it('shoudl serialize correct to JSON', () => {
    const attributes = [
      new Attribute('miles', new IntegerClass('Miles')),
      new Attribute('make', new StringClass('Make')),
    ];
    const clazz = new AggregateClass('TestClass', attributes);
    expect(clazz.toJSON()).toEqual({
      id: 'TestClass',
      type: 'aggregate',
      attributes: [
        { id: 'miles', type: 'Miles', properties: undefined },
        { id: 'make', type: 'Make', properties: undefined },
      ],
      properties: undefined,
    });
  });
  it('should get the correct attribute', () => {
    const attributes = [
      new Attribute('miles', new IntegerClass('Miles')),
      new Attribute('make', new StringClass('Make')),
    ];
    const clazz = new AggregateClass('TestClass', attributes);
    expect(clazz.getAttribute('miles')).toBe(attributes[0]);
    expect(clazz.getAttribute('make')).toBe(attributes[1]);
    expect(clazz.getAttribute('unknown')).toBeUndefined();
  });
});
