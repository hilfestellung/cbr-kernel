import { AggregateObject, Attribute, ModelObject } from '../model';
import { Similarity } from '../evaluation';

export class Case {
  rounded: number;
  constructor(public similarity: Similarity, public aggregate: any) {}
}

export class FacetValue {
  constructor(public value: any, public count: number) {}
}

export class FacetResult {
  constructor(
    public id: string,
    public values: FacetValue[],
    public count = 0,
    public entropy = 0
  ) {}
}

export interface Facet {
  id: string;
  maxCount?: number;
}

export class EntropyResult {
  constructor(public id: string, public entropy = 0, public values: any[]) {}
}

export class RetrieverResult {
  count: number;
  facets?: FacetResult[];
  entropies?: EntropyResult[];
  cases: Case[];
}

export class RetrieverEvaluationOptions {
  constructor(
    public offset?: number,
    public maxCount?: number,
    public threshold?: number,
    public roundTo?: number,
    public facets?: Facet[],
    public queryEvaluatorId?: string
  ) {}
}

export interface Retriever {
  evaluate(
    queryObject: AggregateObject,
    options?: RetrieverEvaluationOptions
  ): RetrieverResult;
  addCase(aggregate: AggregateObject): void;
  removeCase(id: string): AggregateObject | undefined;
  findCases(
    attribute: Attribute,
    values: ModelObject<any>[]
  ): AggregateObject[];
}
