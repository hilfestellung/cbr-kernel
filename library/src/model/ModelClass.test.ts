import { ModelClass } from './ModelClass';
import { ModelObject } from './ModelObject';
import { Predicate } from './Predicate';
import { PredicateEnumeration } from './PredicateEnumeration';
import { PredicateRange } from './PredicateRange';
import { PredicateAggregate } from './PredicateAggregate';
import { InvalidModelObject } from '../exceptions/InvalidModelObject';
import { UnexpectedPredicate } from '../exceptions/UnexpectedPredicate';

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
    createObject(id: any) {
      return new ImplModObj(id, this.type);
    }
  };
  const ImplModObj = class extends ModelObject<any> {
    constructor(id: any, private type?: string) {
      super(id);
    }
    nativeToString(): string {
      return this.id.toString();
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
  };
  const ImplePred = class implements Predicate<any> {
    isAggregate(): boolean {
      return false;
    }
    isEnumerable(): boolean {
      return false;
    }
    isRange(): boolean {
      return false;
    }
    getEnumeration(): ModelObject<any>[] {
      throw new Error('Method not implemented.');
    }
    getMinimum(): ModelObject<any> {
      throw new Error('Method not implemented.');
    }
    getMaximum(): ModelObject<any> {
      throw new Error('Method not implemented.');
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
  it('should readObject to created native object', () => {
    const inst = new ImplClass('TestClass', 'int');
    const createObjectMock = jest.fn();
    createObjectMock.mockReturnValue(5);
    inst.createObject = createObjectMock;
    const obj = inst.readObject(5 /* is ok here we do nothing with it*/);
    expect(obj).toBe(5);
  });
  it('should readObject as created aggregate object', () => {
    const inst = new ImplClass('TestClass', 'agg');
    inst.predicate = new PredicateAggregate();
    const createObjectMock = jest.fn();
    createObjectMock.mockReturnValue('aggregate');
    inst.createObject = createObjectMock;
    const obj = inst.readObject({} /* is ok here we do nothing with it*/);
    expect(obj).toBe('aggregate');
  });
  it('should readObject as value of enumerated object', () => {
    const inst = new ImplClass('TestClass', 'str');
    const values = [
      new ImplModObj('Eins', 'str'),
      new ImplModObj('Zwei', 'str'),
      new ImplModObj('Drei', 'str'),
    ];
    inst.predicate = new PredicateEnumeration(values);
    const obj = inst.readObject('Zwei');
    expect(obj).toBe(values[1]);
  });
  it('should readObject and throw InvalidModelObject error', () => {
    const inst = new ImplClass('TestClass', 'str');
    const values = [
      new ImplModObj('Eins', 'str'),
      new ImplModObj('Zwei', 'str'),
      new ImplModObj('Drei', 'str'),
    ];
    inst.predicate = new PredicateEnumeration(values);
    expect(() => inst.readObject('Vier')).toThrowError(InvalidModelObject);
  });
  it('should readObject as created object of range but throw InvalidModelObject error', () => {
    const inst = new ImplClass('TestClass', 'int');
    const min = new ImplModObj(5, 'int');
    const max = new ImplModObj(10, 'int');
    inst.predicate = new PredicateRange(min, max);
    expect(() => inst.readObject(4)).toThrowError(InvalidModelObject);
    expect(() => inst.readObject(11)).toThrowError(InvalidModelObject);
    expect(() => inst.readObject(8)).not.toThrowError(InvalidModelObject);
  });
  it('should readObject as created object of range but throw InvalidModelObject error because class creates null', () => {
    const inst = new ImplClass('TestClass', 'int');
    const min = new ImplModObj(5, 'int');
    const max = new ImplModObj(10, 'int');
    inst.predicate = new PredicateRange(min, max);
    inst.createObject = jest.fn().mockReturnValue(null);
    expect(() => inst.readObject(4)).toThrowError(InvalidModelObject);
  });
  it('should readObject and throw UnexpectedPredicate error', () => {
    const inst = new ImplClass('TestClass', 'int');
    inst.predicate = new ImplePred();
    expect(() => inst.readObject(4)).toThrowError(UnexpectedPredicate);
  });
  it('should readObject as created object of integer between 4 and 11', () => {
    const inst = new ImplClass('TestClass', 'int');
    const min = new ImplModObj(5, 'int');
    const max = new ImplModObj(10, 'int');
    inst.predicate = new PredicateRange(min, max);
    let value = inst.readObject(7);
    expect(value).toBeInstanceOf(ModelObject);
    expect(value.id).not.toBeUndefined();
    expect(value.id).not.toBeNull();
    expect(value.id).toBe(7);
    value = inst.readObject(5);
    expect(value).toBeInstanceOf(ModelObject);
    expect(value.id).not.toBeUndefined();
    expect(value.id).not.toBeNull();
    expect(value.id).toBe(5);
    value = inst.readObject(10);
    expect(value).toBeInstanceOf(ModelObject);
    expect(value.id).not.toBeUndefined();
    expect(value.id).not.toBeNull();
    expect(value.id).toBe(10);
  });
});
