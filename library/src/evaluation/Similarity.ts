import { ModelObject } from '../model';

export class Similarity {
  constructor(
    public value: number,
    public source: ModelObject<any>,
    public target: ModelObject<any>
  ) {}

  toJSON(_key?: string): any {
    return this.value;
  }
}
