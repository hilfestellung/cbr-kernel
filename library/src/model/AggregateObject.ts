import { ModelObject } from './ModelObject';

export class AggregateObject extends ModelObject<any> {
  constructor(public id: string, private aggregate: any) {
    super(id);
  }

  get native(): any {
    return this.aggregate;
  }

  nativeToString(): string {
    return JSON.stringify(this.native);
  }

  toJSON(key?: string): any {
    const result = super.toJSON(key);
    result.attributes = Object.entries(this.aggregate).map((entry) => ({
      id: entry[0],
      value: entry[1],
    }));
    return result;
  }
}
