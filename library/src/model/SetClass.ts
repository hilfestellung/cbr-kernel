import { ModelClass } from './ModelClass';
import { ModelObject } from './ModelObject';
import { SetObject } from './SetObject';
import { InvalidValue } from 'exceptions/InvalidValue';
import { NullValue } from 'exceptions/NullValue';
import { toType } from './ModelElement';

export class SetClass<T> extends ModelClass<ModelObject<T>[]> {
  constructor(id: string, public elementModelClass: ModelClass<T>) {
    super(id);
  }
  createObject(value: any): ModelObject<ModelObject<T>[]> {
    if (value == null) {
      throw new NullValue();
    }
    if (Array.isArray(value)) {
      return new SetObject(
        value.map((element) => this.elementModelClass.readObject(element))
      );
    }
    throw new InvalidValue();
  }
  isSet() {
    return true;
  }
  toJSON(key?: string): any {
    const result = super.toJSON(key);
    result.elementType = toType(this.elementModelClass);
    return result;
  }
}