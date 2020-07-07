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
  SetClass,
  StringClass,
} from 'model';
import {} from 'model/Attribute';

export function modelFactory(input: any) {
  if (Array.isArray(input.classes)) {
    input.classes.map(classFactory);
  }
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

export function aggregateFactory(input: any): AggregateClass {
  let result;
  if (Array.isArray(input.attributes)) {
    result = new AggregateClass(
      input.id,
      input.attributes.map(
        (attribute: any) =>
          new Attribute(attribute.id, (null as unknown) as ModelClass<any>)
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
  const result = new SetClass(input.id, (null as unknown) as ModelClass<any>);
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
