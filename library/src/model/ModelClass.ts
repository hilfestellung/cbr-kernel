import { ModelElement } from './ModelElement';
import { ModelObject } from './ModelObject';
import { Predicate } from './Predicate';
import { PredicateEnumeration } from './PredicateEnumeration';
import { PredicateRange } from './PredicateRange';

export abstract class ModelClass<T> extends ModelElement {
  predicate: Predicate<T>;

  constructor(public id: string) {
    super();
  }

  abstract createObject(value: any): ModelObject<T>;

  toJSON(_key?: string | undefined): any {
    const result: any = { id: this.id, properties: this.properties };
    if (this.isAggregate()) {
      result.type = 'aggregate';
    } else if (this.isDate()) {
      result.type = 'date';
    } else if (this.isFloat()) {
      result.type = 'float';
    } else if (this.isInteger()) {
      result.type = 'integer';
    } else if (this.isString()) {
      result.type = 'string';
    } else if (this.isSet()) {
      result.type = 'set';
    }
    if (this.predicate != null) {
      if (this.predicate.isEnumerable()) {
        const predicate = this.predicate as PredicateEnumeration<T>;
        result.enumeration = predicate
          .getEnumeration()
          .map((modelObject) => modelObject.toJSON());
      } else if (this.predicate.isRange()) {
        const predicate = this.predicate as PredicateRange<T>;
        result.range = {
          min: predicate.getMinimum().toJSON(),
          max: predicate.getMaximum().toJSON(),
        };
      }
    }
    return result;
  }
}
