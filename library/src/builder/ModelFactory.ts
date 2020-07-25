import {
  AggregateClass,
  Attribute,
  DateClass,
  FloatClass,
  IntegerClass,
  ModelClass,
  ModelObject,
  PredicateAggregate,
  PredicateEnumeration,
  PredicateRange,
  Project,
  SetClass,
  StringClass,
} from '../model/index';
import {
  SimilarityEvaluator,
  AggregateEvaluator,
  NumberEvaluator,
  LookupEvaluator,
  SetEvaluator,
} from '../evaluation';

import { findClass } from './ClassUtils';

export function modelFactory(input: any) {
  const classes: ModelClass<any>[] = [];
  const result = { classes };
  if (Array.isArray(input.classes)) {
    classes.splice(0, 0, input.classes.map(classFactory));
    classes
      .filter((clazz) => clazz.isAggregate())
      .forEach((clazz: AggregateClass) => {
        clazz.attributes.forEach((attribute) => {
          if (attribute.typeId) {
            attribute.modelClass = findClass(classes, attribute.typeId);
          }
        });
      });
    classes
      .filter((clazz) => clazz.isSet())
      .forEach((clazz: SetClass<any>) => {
        if (clazz.elementTypeId) {
          clazz.elementModelClass = findClass(classes, clazz.elementTypeId);
        }
      });
  }
  return result;
}

export function classFactory(input: any): ModelClass<any> | null {
  switch (input.type) {
    case 'aggregate':
      return aggregateFactory(input);
    case 'set':
      return setFactory(input);
    case 'integer':
      return integerFactory(input);
    case 'float':
      return floatFactory(input);
    case 'string':
      return stringFactory(input);
    case 'date':
      return dateFactory(input);
    default:
      return null;
  }
}
export function evaluatorFactory(input: any): SimilarityEvaluator<any> | null {
  switch (input.pattern) {
    case 'aggregate':
      return aggregateEvaluatorFactory(input);
    case 'set':
      return setEvaluatorFactory(input);
    case 'number':
      return numberEvaluatorFactory(input);
    case 'lookup':
      return lookupEvaluatorFactory(input);
    default:
      return null;
  }
}

export function aggregateFactory(input: any): AggregateClass {
  let result;
  if (Array.isArray(input.attributes)) {
    result = new AggregateClass(
      input.id,
      input.attributes.map(
        (attribute: any) => new Attribute(attribute.id, attribute.type)
      )
    );
  } else {
    result = new AggregateClass(input.id, []);
  }
  result.predicate = new PredicateAggregate();
  result.properties = input.properties;
  return result;
}

export function setFactory(input: any): SetClass<any> {
  const result = new SetClass(input.id, input.elementType);
  result.properties = input.properties;
  return result;
}

export function integerFactory(input: any): IntegerClass {
  const result = new IntegerClass(input.id);
  let predicate = null;
  if (input.range && (input.range.min || input.range.max)) {
    const min = result.createObject(
      input.range.min != null ? input.range.min : Number.MIN_VALUE
    );
    const max = result.createObject(
      input.range.max != null ? input.range.max : Number.MAX_VALUE
    );
    predicate = new PredicateRange(min, max);
    result.predicate = predicate;
  }
  result.properties = input.properties;
  return result;
}

export function floatFactory(input: any): FloatClass {
  const result = new FloatClass(input.id);
  let predicate = null;
  if (input.range && (input.range.min || input.range.max)) {
    const min = result.createObject(
      input.range.min != null ? input.range.min : Number.MIN_VALUE
    );
    const max = result.createObject(
      input.range.max != null ? input.range.max : Number.MAX_VALUE
    );
    predicate = new PredicateRange(min, max);
    result.predicate = predicate;
  }
  result.properties = input.properties;
  return result;
}

export function stringFactory(input: any): StringClass {
  const result = new StringClass(input.id);
  if (Array.isArray(input.enumeration)) {
    result.predicate = new PredicateEnumeration(
      input.enumeration
        .map(result.createObject)
        .filter((value: ModelObject<any>) => value != null)
    );
  }
  result.properties = input.properties;
  return result;
}

export function dateFactory(input: any): DateClass {
  const result = new DateClass(input.id);
  if (input.range && (input.range.min || input.range.max)) {
    const min = result.createObject(
      input.range.min != null ? new Date(input.range.min) : new Date(0)
    );
    const max = result.createObject(
      input.range.max != null
        ? new Date(input.range.max)
        : new Date(Number.MAX_VALUE)
    );
    result.predicate = new PredicateRange(min, max);
  }
  result.properties = input.properties;
  return result;
}

export function projectFactory(input: any): Project {
  const result = new Project(input.id);
  result.languages = input.languages;
  result.queryClassId = input.queryClass;
  result.properties = input.properties;
  return result;
}

export function aggregateEvaluatorFactory(input: any): AggregateEvaluator {
  const result = new AggregateEvaluator(input.id, input.type, input.mode);
  if (Array.isArray(input.attributes)) {
    result.attributes = input.attributes.map(
      (attributeLinkDefinition: any) => ({
        id: attributeLinkDefinition.id,
        evaluator: attributeLinkDefinition.evaluator,
        weight: attributeLinkDefinition.weight,
      })
    );
  }
  return result;
}

export function numberEvaluatorFactory(input: any): NumberEvaluator {
  const options = {
    cyclic: input.cyclic,
    origin: input.origin,
    useOrigin: input.useOrigin,
    equalIfLess: input.equalIfLess,
    equalIfMore: input.equalIfMore,
    toleranceIfLess: input.toleranceIfLess,
    toleranceIfMore: input.toleranceIfMore,
    linearityIfLess: input.linearityIfLess,
    linearityIfMore: input.linearityIfMore,
    interpolationIfLess: input.interpolationIfLess,
    interpolationIfMore: input.interpolationIfMore,
  };
  return new NumberEvaluator(
    input.id,
    input.type,
    parseInt(input.min, 10),
    parseInt(input.max, 10),
    options
  );
}

export function lookupEvaluatorFactory(input: any): LookupEvaluator {
  return new LookupEvaluator(input.id, input.type, input.mode, input.lookup);
}

export function setEvaluatorFactory(input: any): SetEvaluator {
  return new SetEvaluator(
    input.id,
    input.type,
    input.comparisonType,
    input.elementEvaluator
  );
}
