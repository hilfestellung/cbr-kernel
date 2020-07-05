import { ModelObject } from './ModelObject';

export class IntegerObject extends ModelObject<number> {
  nativeToString(): string {
    return this.id.toString();
  }
  isInteger() {
    return true;
  }
}
