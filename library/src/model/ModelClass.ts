import { ModelElement } from './ModelElement';
import { ModelObject } from './ModelObject';
import { Predicate } from './Predicate';
import { PredicateEnumeration } from './PredicateEnumeration';
import { PredicateRange } from './PredicateRange';
import { InvalidModelObject } from 'exceptions/InvalidModelObject';
import { UnexpectedPredicate } from 'exceptions/UnexpectedPredicate';

export abstract class ModelClass<T> extends ModelElement {
  predicate: Predicate<T>;

  constructor(public id: string) {
    super();
  }

  abstract createObject(value: any): ModelObject<T>;

  readObject(value: any): ModelObject<T> {
    if (this.predicate == null) {
      return this.createObject(value);
    } else if (this.predicate.isAggregate()) {
      return this.createObject(value);
    } else if (this.predicate.isEnumerable()) {
      const result = this.predicate
        .getEnumeration()
        .find((entry) => value === entry.id);
      if (result == null) {
        throw new InvalidModelObject(
          `The specified value is not an element of the enumeration of class ${this.id}`
        );
      }
      return result;
    } else if (this.predicate.isRange()) {
      const result = this.createObject(value);
      if (result == null) {
        throw new InvalidModelObject(
          `The specified value could not be used to create a ModelObject instance of class ${this.id}`
        );
      }
      if (
        this.predicate.getMinimum().native <= result.native &&
        this.predicate.getMaximum().native >= result.native
      ) {
        return result;
      } else {
        throw new InvalidModelObject(
          `The specified value is not in the range of ${
            this.predicate.getMinimum().native
          } - ${this.predicate.getMaximum().native}.`
        );
      }
    } else {
      throw new UnexpectedPredicate(
        `The class ${this.id} has an unexpected predicate.`
      );
    }
  }

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
