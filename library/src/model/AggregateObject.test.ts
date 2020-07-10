import { AggregateObject } from './AggregateObject';
import { IntegerObject } from './IntegerObject';
import { StringObject } from './StringObject';

describe('AggregateObject', () => {
  it('should return correct aggregate as native', () => {
    const nativeAggregate = {
      miles: new IntegerObject(5),
      make: new StringObject('Opel'),
    };
    const aggregate = new AggregateObject('1', nativeAggregate);
    expect(aggregate.isAggregate()).toBe(true);
    expect(aggregate.isDate()).toBe(false);
    expect(aggregate.isFloat()).toBe(false);
    expect(aggregate.isInteger()).toBe(false);
    expect(aggregate.isSet()).toBe(false);
    expect(aggregate.isString()).toBe(false);
    expect(aggregate.native).toEqual(nativeAggregate);
    expect(aggregate.nativeToString()).toBe(
      '{"miles":{"id":5},"make":{"id":"Opel"}}'
    );
  });
  it('should serialize correct JSON', () => {
    const nativeAggregate = {
      miles: new IntegerObject(5),
      make: new StringObject('Opel'),
    };
    const aggregate = new AggregateObject('1', nativeAggregate);
    const jsonObj = aggregate.toJSON();
    expect(jsonObj.id).toBe('1');
    expect(jsonObj.attributes).toEqual([
      { id: 'miles', value: { id: 5, properties: undefined } },
      { id: 'make', value: { id: 'Opel', properties: undefined } },
    ]);
  });
});
