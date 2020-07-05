import { ModelClass } from './ModelClass';
import { ModelObject } from './ModelObject';
import { InvalidValue } from 'exceptions/InvalidValue';
import { IntegerObject } from './IntegerObject';
import { NullValue } from 'exceptions/NullValue';

export class IntegerClass extends ModelClass<number> {
  createObject(value: any): ModelObject<number> {
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
    if (typeof id === 'number' || typeof id === 'string') {
      result = new IntegerObject(parseInt(id.toString(), 10));
      result.properties = properties;
      return result;
    }
    throw new InvalidValue();
  }
  isInteger() {
    return true;
  }
}
