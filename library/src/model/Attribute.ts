import { ModelObject } from './ModelObject';
import { ModelClass } from './ModelClass';

export class Attribute extends ModelObject<string> {
  constructor(public id: string, public modelClass: ModelClass<any>) {
    super(id);
  }

  nativeToString(): string {
    return this.id;
  }

  toJSON(key?: string): any {
    const result = super.toJSON(key);
    result.type = this.modelClass.id;
    return result;
  }
}
