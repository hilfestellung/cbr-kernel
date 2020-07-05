import { ModelObject } from './ModelObject';

export class SetObject<T> extends ModelObject<ModelObject<T>[]> {
  nativeToString(): string {
    return this.native
      .map((modelObject) => modelObject.nativeToString())
      .join(', ');
  }
  isSet() {
    return true;
  }
  toJSON(key?: string): any {
    return this.native.map((modelObject) => modelObject.toJSON(key));
  }
}
