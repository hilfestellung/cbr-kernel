import { ModelClass } from './ModelClass';
import { ModelObject } from './ModelObject';
import { SetObject } from './SetObject';
import { InvalidValue } from '../exceptions/InvalidValue';
import { NullValue } from '../exceptions/NullValue';

export class SetClass<T> extends ModelClass<ModelObject<T>[]> {
  private elementModelClassHolder: ModelClass<T>;

  constructor(id: string, public elementTypeId?: string) {
    super(id);
  }

  get elementModelClass(): ModelClass<T> {
    return this.elementModelClassHolder;
  }

  set elementModelClass(modelClass: ModelClass<T>) {
    this.elementModelClassHolder = modelClass;
    this.elementTypeId = modelClass.id;
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
    if (this.elementModelClass != null) {
      result.elementType = this.elementModelClass.id;
    }
    return result;
  }
}
