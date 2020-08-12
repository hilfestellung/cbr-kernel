import { ModelClass } from './ModelClass';
import { ModelObject } from './ModelObject';
import { NullValue } from '../exceptions/NullValue';
import { DateObject } from './DateObject';
import { InvalidValue } from '../exceptions/InvalidValue';

export class DateClass extends ModelClass<Date> {
  createObject(value: any): ModelObject<Date> {
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
    if (id instanceof Date) {
      result = new DateObject(id);
      result.properties = properties;
      return result;
    } else if (typeof id === 'string') {
      if (id.endsWith('Z')) {
        result = new DateObject(new Date(id));
      } else {
        result = new DateObject(new Date(id + 'Z'));
      }
      result.properties = properties;
      return result;
    } else if (typeof id === 'number') {
      return new DateObject(new Date(id));
    }
    throw new InvalidValue();
  }

  isDate() {
    return true;
  }
}
