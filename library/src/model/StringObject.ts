import { ModelObject } from './ModelObject';

export class StringObject extends ModelObject<string> {
  nativeToString(): string {
    return this.id;
  }

  isString(): boolean {
    return true;
  }
}
