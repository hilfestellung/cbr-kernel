import { ModelClass } from './ModelClass';
import { ModelObject } from './ModelObject';

describe('ModelClass', () => {
  const Impl = class extends ModelClass<any> {
    constructor(id: string, private type?: string) {
      super(id);
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
  it('should have correct id', () => {
    const inst = new Impl('TestClass');
    expect(inst).not.toBeNull();
    expect(inst).not.toBeUndefined();
    expect(inst.id).toBe('TestClass');
  });
  it('should stringify to aggregate typed object', () => {
    const inst = new Impl('TestClass', 'agg');
    const jsonObject = inst.toJSON();
    expect(jsonObject).not.toBeNull();
    expect(jsonObject).not.toBeUndefined();
    expect(jsonObject.id).toBe('TestClass');
    expect(jsonObject.type).toBe('aggregate');
  });
  it('should stringify to date typed object', () => {
    const inst = new Impl('TestClass', 'dat');
    const jsonObject = inst.toJSON();
    expect(jsonObject).not.toBeNull();
    expect(jsonObject).not.toBeUndefined();
    expect(jsonObject.id).toBe('TestClass');
    expect(jsonObject.type).toBe('date');
  });
  it('should stringify to float typed object', () => {
    const inst = new Impl('TestClass', 'flt');
    const jsonObject = inst.toJSON();
    expect(jsonObject).not.toBeNull();
    expect(jsonObject).not.toBeUndefined();
    expect(jsonObject.id).toBe('TestClass');
    expect(jsonObject.type).toBe('float');
  });
  it('should stringify to integer typed object', () => {
    const inst = new Impl('TestClass', 'int');
    const jsonObject = inst.toJSON();
    expect(jsonObject).not.toBeNull();
    expect(jsonObject).not.toBeUndefined();
    expect(jsonObject.id).toBe('TestClass');
    expect(jsonObject.type).toBe('integer');
  });
  it('should stringify to set typed object', () => {
    const inst = new Impl('TestClass', 'set');
    const jsonObject = inst.toJSON();
    expect(jsonObject).not.toBeNull();
    expect(jsonObject).not.toBeUndefined();
    expect(jsonObject.id).toBe('TestClass');
    expect(jsonObject.type).toBe('set');
  });
  it('should stringify to string typed object', () => {
    const inst = new Impl('TestClass', 'str');
    const jsonObject = inst.toJSON();
    expect(jsonObject).not.toBeNull();
    expect(jsonObject).not.toBeUndefined();
    expect(jsonObject.id).toBe('TestClass');
    expect(jsonObject.type).toBe('string');
  });
});
