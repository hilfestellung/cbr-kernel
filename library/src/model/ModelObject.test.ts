import { ModelObject } from './ModelObject';

describe('ModelObject', () => {
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
  it('should convert number to string', () => {
    const inst = new ImplModObj(5);
    const str = inst.nativeToString();
    expect(typeof str).toBe('string');
    expect(str).toBe('5');
  });
  it('should equals to true with native', () => {
    const inst = new ImplModObj(5);
    const other = new ImplModObj(5);
    expect(inst.equals(inst)).toBe(true);
    expect(inst.equals(other)).toBe(true);
  });
  it('should equals to false with native', () => {
    const inst = new ImplModObj(5);
    const other = new ImplModObj(6);
    expect(inst.equals(inst)).toBe(true);
    expect(inst.equals(other)).toBe(false);
  });
  it('should equals to true with date', () => {
    const inst = new ImplModObj(new Date(2020, 6, 4), 'dat');
    const other = new ImplModObj(new Date(2020, 6, 4), 'dat');
    expect(inst.equals(inst)).toBe(true);
    expect(inst.equals(other)).toBe(true);
  });
  it('should equals to false with date', () => {
    const inst = new ImplModObj(new Date(2020, 6, 4), 'dat');
    const other = new ImplModObj(new Date(2020, 6, 4, 1), 'dat');
    expect(inst.equals(inst)).toBe(true);
    expect(inst.equals(other)).toBe(false);
  });
  it('should equals to false when other is null', () => {
    const inst = new ImplModObj(new Date(2020, 6, 4), 'dat');
    expect(inst.equals(inst)).toBe(true);
    expect(inst.equals((null as unknown) as ModelObject<any>)).toBe(false);
  });
  it('should convert ModelObject to string', () => {
    const date = new Date(2020, 6, 4);
    let inst = new ImplModObj(date, 'dat');
    let str = inst.toString();
    expect(typeof str).toBe('string');
    expect(str).toBe(`<${date.toString()}>`);
    inst = new ImplModObj('TestObject', 'str');
    inst.properties = {
      de: { label: 'Test Objekt' },
      en: { label: 'Test object' },
    };
    str = inst.toString();
    expect(typeof str).toBe('string');
    expect(str).toBe(`<TestObject(de=>'Test Objekt', en=>'Test object')>`);
  });
});
