import { ModelObject } from './ModelObject';

export class DateObject extends ModelObject<Date> {
  nativeToString(): string {
    return this.id.toISOString();
  }
  isDate() {
    return true;
  }
}
