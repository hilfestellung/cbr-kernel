import { ModelClass } from './ModelClass';
import { ModelObject } from './ModelObject';
import { NullValue } from 'exceptions/NullValue';
import { FloatObject } from './FloatObject';
import { InvalidValue } from 'exceptions/InvalidValue';

export class FloatClass extends ModelClass<number> {
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
      result = new FloatObject(parseFloat(id.toString()));
      result.properties = properties;
      return result;
    }
    throw new InvalidValue();
  }
  isFloat() {
    return true;
  }
}
