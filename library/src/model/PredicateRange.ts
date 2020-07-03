import { Predicate } from './Predicate';
import { ModelObject } from './ModelObject';

export class PredicateRange<T> implements Predicate<T> {
  constructor(private min: ModelObject<T>, private max: ModelObject<T>) {
    if (this.max.native < this.min.native) {
      const tmp = this.min;
      this.min = this.max;
      this.max = tmp;
    }
  }
  isAggregate(): boolean {
    return false;
  }
  isEnumerable(): boolean {
    return false;
  }
  isRange(): boolean {
    return true;
  }
  getEnumeration(): ModelObject<T>[] {
    throw new Error('Not implemented.');
  }
  getMinimum(): ModelObject<T> {
    return this.min;
  }
  getMaximum(): ModelObject<T> {
    return this.max;
  }
}
