import { ModelClass } from './ModelClass';
import { ModelObject } from './ModelObject';
import { StringObject } from './StringObject';
import { NullValue } from '../exceptions/NullValue';
import { InvalidValue } from '../exceptions/InvalidValue';

export class StringClass extends ModelClass<string> {
  createObject(value: any): ModelObject<string> {
    if (value == null) {
      throw new NullValue();
    }
    let id;
    let properties;
    if (typeof value === 'object' && value.id != null) {
      id = value.id;
      properties = value.properties;
    } else {
      id = value;
    }
    let result = null;
    if (typeof id === 'string') {
      result = new StringObject(id);
      result.properties = properties;
      return result;
    }
    throw new InvalidValue();
  }
  isString() {
    return true;
  }
}
