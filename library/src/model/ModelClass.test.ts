import { ModelClass } from './ModelClass';
import { ModelObject } from './ModelObject';
import { Predicate } from './Predicate';
import { PredicateEnumeration } from './PredicateEnumeration';
import { PredicateRange } from './PredicateRange';

describe('ModelClass', () => {
  const ImplClass = class extends ModelClass<any> {
    constructor(id: string, private type?: string, predicate?: Predicate<any>) {
      super(id);
      this.predicate = (predicate as unknown) as Predicate<any>;
    }
    isAggregate() {
      return this.type === 'agg';
    }
    isDate() {
      return this.type === 'dat';
    }
    isFloat() {
      return this.type === 'flt';
    }
    isInteger() {
      return this.type === 'int';
    }
    isSet() {
      return this.type === 'set';
    }
    isString() {
      return this.type === 'str';
    }
    createObject() {
      return (null as unknown) as ModelObject<any>;
    }
  };
  const ImplModObj = class extends ModelObject<any> {
    nativeToString(): string {
      return this.id.toString();
    }
  };

  it('should have correct id', () => {
    const inst = new ImplClass('TestClass');
    expect(inst).not.toBeNull();
    expect(inst).not.toBeUndefined();
    expect(inst.id).toBe('TestClass');
  });
  it('should convert with toJSON to aggregate typed object', () => {
    const inst = new ImplClass('TestClass', 'agg');
    const jsonObject = inst.toJSON();
    expect(jsonObject).not.toBeNull();
    expect(jsonObject).not.toBeUndefined();
    expect(jsonObject.id).toBe('TestClass');
    expect(jsonObject.type).toBe('aggregate');
  });
  it('should convert with toJSON to date typed object', () => {
    const inst = new ImplClass('TestClass', 'dat');
    const jsonObject = inst.toJSON();
    expect(jsonObject).not.toBeNull();
    expect(jsonObject).not.toBeUndefined();
    expect(jsonObject.id).toBe('TestClass');
    expect(jsonObject.type).toBe('date');
  });
  it('should convert with toJSON to float typed object', () => {
    const inst = new ImplClass('TestClass', 'flt');
    const jsonObject = inst.toJSON();
    expect(jsonObject).not.toBeNull();
    expect(jsonObject).not.toBeUndefined();
    expect(jsonObject.id).toBe('TestClass');
    expect(jsonObject.type).toBe('float');
  });
  it('should convert with toJSON to integer typed object', () => {
    const inst = new ImplClass('TestClass', 'int');
    const jsonObject = inst.toJSON();
    expect(jsonObject).not.toBeNull();
    expect(jsonObject).not.toBeUndefined();
    expect(jsonObject.id).toBe('TestClass');
    expect(jsonObject.type).toBe('integer');
  });
  it('should convert with toJSON to set typed object', () => {
    const inst = new ImplClass('TestClass', 'set');
    const jsonObject = inst.toJSON();
    expect(jsonObject).not.toBeNull();
    expect(jsonObject).not.toBeUndefined();
    expect(jsonObject.id).toBe('TestClass');
    expect(jsonObject.type).toBe('set');
  });
  it('should convert with toJSON to string typed object', () => {
    const inst = new ImplClass('TestClass', 'str');
    const jsonObject = inst.toJSON();
    expect(jsonObject).not.toBeNull();
    expect(jsonObject).not.toBeUndefined();
    expect(jsonObject.id).toBe('TestClass');
    expect(jsonObject.type).toBe('string');
    expect(jsonObject.enumeration).toBeUndefined();
  });
  it('should convert with toJSON to string typed object with enumeration', () => {
    const inst = new ImplClass(
      'TestClass',
      'str',
      new PredicateEnumeration([
        new ImplModObj('Eins'),
        new ImplModObj('Zwei'),
        new ImplModObj('Drei'),
      ])
    );
    const jsonObject = inst.toJSON();
    expect(jsonObject).not.toBeNull();
    expect(jsonObject).not.toBeUndefined();
    expect(jsonObject.id).toBe('TestClass');
    expect(jsonObject.type).toBe('string');
    expect(jsonObject.enumeration).not.toBeUndefined();
    expect(Array.isArray(jsonObject.enumeration)).toBe(true);
    expect(jsonObject.enumeration.length).toBe(3);
    expect(jsonObject.enumeration[0].id).not.toBeNull();
    expect(jsonObject.enumeration[0].id).not.toBeUndefined();
    expect(jsonObject.enumeration[0].id).toBe('Eins');
    expect(jsonObject.enumeration[1].id).not.toBeNull();
    expect(jsonObject.enumeration[1].id).not.toBeUndefined();
    expect(jsonObject.enumeration[1].id).toBe('Zwei');
    expect(jsonObject.enumeration[2].id).not.toBeNull();
    expect(jsonObject.enumeration[2].id).not.toBeUndefined();
    expect(jsonObject.enumeration[2].id).toBe('Drei');
  });
  it('should convert with toJSON to integer typed object with range 5 to 10', () => {
    const inst = new ImplClass(
      'TestClass',
      'int',
      new PredicateRange(new ImplModObj(5), new ImplModObj(10))
    );
    const jsonObject = inst.toJSON();
    expect(jsonObject).not.toBeNull();
    expect(jsonObject).not.toBeUndefined();
    expect(jsonObject.id).toBe('TestClass');
    expect(jsonObject.type).toBe('integer');
    expect(jsonObject.range).not.toBeUndefined();
    expect(jsonObject.range.min).not.toBeUndefined();
    expect(jsonObject.range.min).not.toBeNull();
    expect(jsonObject.range.min.id).not.toBeUndefined();
    expect(jsonObject.range.min.id).not.toBeNull();
    expect(jsonObject.range.min.id).toBe(5);
    expect(jsonObject.range.max).not.toBeUndefined();
    expect(jsonObject.range.max).not.toBeNull();
    expect(jsonObject.range.max.id).not.toBeUndefined();
    expect(jsonObject.range.max.id).not.toBeNull();
    expect(jsonObject.range.max.id).toBe(10);
  });
});
