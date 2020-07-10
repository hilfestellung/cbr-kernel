import { Attribute } from './Attribute';
import { IntegerClass } from './IntegerClass';

describe('Attribute', () => {
  it('should keep the typeId', () => {
    const attribute = new Attribute('attribute', 'TestClass');
    expect(attribute.nativeToString()).toBe('attribute');
    expect(attribute.typeId).toBe('TestClass');
    attribute.modelClass = new IntegerClass('TestClassInt');
    expect(attribute.typeId).toBe('TestClassInt');
  });
  it('should serialize correct JSON', () => {
    const attribute = new Attribute('attribute');
    attribute.modelClass = new IntegerClass('TestClassInt');
    attribute.properties = { de: { label: 'Integer Testattribut' } };
    const jsonObj = attribute.toJSON();
    expect(jsonObj.id).toBe('attribute');
    expect(jsonObj.type).toBe('TestClassInt');
    expect(jsonObj.properties).not.toBeUndefined();
    expect(jsonObj.properties.de).not.toBeUndefined();
    expect(jsonObj.properties.de.label).toBe('Integer Testattribut');
  });
});
