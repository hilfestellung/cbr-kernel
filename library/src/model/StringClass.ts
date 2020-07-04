import { ModelClass } from './ModelClass';
import { ModelObject } from './ModelObject';
import { StringObject } from './StringObject';

export class StringClass extends ModelClass<string> {
  createObject(value: any): ModelObject<string> {
    if (value == null) {
      throw new Error('Value is null.');
    }
    if (typeof value === 'string') {
      return new StringObject(value);
    }
    if (value && value.id) {
      const result = this.createObject(value.id.toString());
      result.properties = value.properties;
      return result;
    }
    throw new Error('Invalid value.');
  }
}
