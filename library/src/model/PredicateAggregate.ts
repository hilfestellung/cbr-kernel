import { Predicate } from './Predicate';
import { ModelObject } from './ModelObject';

export class PredicateAggregate implements Predicate<any> {
  isAggregate(): boolean {
    return true;
  }
  isEnumerable(): boolean {
    return false;
  }
  isRange(): boolean {
    return false;
  }
  getEnumeration(): ModelObject<any>[] {
    throw new Error('Not implemented.');
  }
  getMinimum(): ModelObject<any> {
    throw new Error('Not implemented.');
  }
  getMaximum(): ModelObject<any> {
    throw new Error('Not implemented.');
  }
}
