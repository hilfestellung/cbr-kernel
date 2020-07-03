import { Predicate } from './Predicate';
import { ModelObject } from './ModelObject';

export class PredicateEnumeration<T> implements Predicate<T> {
  constructor(private values: ModelObject<T>[]) {}
  addValue(value: ModelObject<T>) {
    if (value == null) {
      return;
    }
    const modelObject = this.values.find((entry) => entry.id === value.id);
    if (modelObject == null) {
      this.values.push(value);
    } else {
      modelObject.properties = value.properties;
    }
  }
  addValues(values: ModelObject<T>[]) {
    if (Array.isArray(values)) {
      values.forEach((value) => this.addValue(value));
    }
  }
  removeValue(value: ModelObject<T>) {
    if (value == null) {
      return;
    }
    const index = this.values.findIndex((entry) => entry.id === value.id);
    if (index > -1) {
      this.values.splice(index, 1);
    }
  }
  removeValues(values: ModelObject<T>[]) {
    if (Array.isArray(values)) {
      values.forEach((entry) => this.removeValue(entry));
    }
  }
  isAggregate(): boolean {
    return false;
  }
  isEnumerable(): boolean {
    return true;
  }
  isRange(): boolean {
    return false;
  }
  getEnumeration(): ModelObject<T>[] {
    return [...this.values];
  }
  getMinimum(): ModelObject<T> {
    throw new Error('Not implemented.');
  }
  getMaximum(): ModelObject<T> {
    throw new Error('Not implemented.');
  }
}
