import { ModelObject } from './ModelObject';

export interface Predicate<T> {
  isAggregate(): boolean;
  isEnumerable(): boolean;
  isRange(): boolean;
  getEnumeration(): ModelObject<T>[];
  getMinimum(): ModelObject<T>;
  getMaximum(): ModelObject<T>;
}
