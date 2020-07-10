import { ModelElement, toType } from './ModelElement';
import { ModelObject } from './ModelObject';

describe('ModelElement', () => {
  const Impl = class extends ModelElement {
    properties = {
      de: {
        label: 'Deutsches Test-Element',
        url: 'Url Eigenschaft',
      },
      en: {
        label: 'English Test-Element',
        url: 'Url property',
      },
    };
    constructor(public id: string) {
      super();
    }
    toJSON(_key?: string | undefined) {
      throw new Error('Method not implemented.');
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

  it('should resolve is* methods to false', () => {
    const inst = new Impl('TestClass');
    expect(inst).not.toBeNull();
    expect(inst).not.toBeUndefined();
    expect(inst.isAggregate()).toBe(false);
    expect(inst.isDate()).toBe(false);
    expect(inst.isFloat()).toBe(false);
    expect(inst.isInteger()).toBe(false);
    expect(inst.isSet()).toBe(false);
    expect(inst.isString()).toBe(false);
  });
  it('should have german label "Deutsches Test-Element"', () => {
    const inst = new Impl('TestClass');
    expect(inst).not.toBeNull();
    expect(inst).not.toBeUndefined();
    expect(inst.getLabel('de')).toBe('Deutsches Test-Element');
  });
  it('should have english label "English Test-Element"', () => {
    const inst = new Impl('TestClass');
    expect(inst).not.toBeNull();
    expect(inst).not.toBeUndefined();
    expect(inst.getLabel('en')).toBe('English Test-Element');
  });
  it('should resolve label of unavailable language to id', () => {
    const inst = new Impl('TestClass');
    expect(inst).not.toBeNull();
    expect(inst).not.toBeUndefined();
    expect(inst.getLabel('tr')).toBe('TestClass');
    expect(inst.getLabel('gr')).toBe('TestClass');
  });
  it('should have german url property "Url Eigenschaft"', () => {
    const inst = new Impl('TestClass');
    expect(inst).not.toBeNull();
    expect(inst).not.toBeUndefined();
    expect(inst.getProperty('de', 'url')).toBe('Url Eigenschaft');
  });
  it('should have english url property "Url Property"', () => {
    const inst = new Impl('TestClass');
    expect(inst).not.toBeNull();
    expect(inst).not.toBeUndefined();
    expect(inst.getProperty('en', 'url')).toBe('Url property');
  });
  it('should resolve unknown property to null', () => {
    const inst = new Impl('TestClass');
    expect(inst).not.toBeNull();
    expect(inst).not.toBeUndefined();
    expect(inst.getProperty('en', 'unknown')).toBeNull();
  });
  it('should resolve unknown language property to null', () => {
    const inst = new Impl('TestClass');
    expect(inst).not.toBeNull();
    expect(inst).not.toBeUndefined();
    expect(inst.getProperty('tr', 'url')).toBeNull();
  });
  it('should convert type correctly', () => {
    expect(toType(new ImplModObj('Test', 'agg'))).toBe('aggregate');
    expect(toType(new ImplModObj('Test', 'set'))).toBe('set');
    expect(toType(new ImplModObj('Test', 'str'))).toBe('string');
    expect(toType(new ImplModObj('Test', 'int'))).toBe('integer');
    expect(toType(new ImplModObj('Test', 'flt'))).toBe('float');
    expect(toType(new ImplModObj('Test', 'dat'))).toBe('date');
    expect(toType(new ImplModObj('Test'))).toBeUndefined();
  });
});
