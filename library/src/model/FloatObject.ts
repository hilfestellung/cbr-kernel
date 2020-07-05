import { ModelObject } from './ModelObject';

export class FloatObject extends ModelObject<number> {
  nativeToString(): string {
    return this.id.toString();
  }
  isFloat() {
    return true;
  }
}
