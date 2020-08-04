import {
  Retriever,
  RetrieverResult,
  Case,
  FacetResult,
  Facet,
  FacetValue,
  EntropyResult,
  RetrieverEvaluationOptions,
} from './Retriever';
import {
  AggregateObject,
  Attribute,
  Project,
  ModelObject,
  SetObject,
} from '../model';

const similarityComparator = (a: Case, b: Case) =>
  b.similarity.value - a.similarity.value;

export class LinearRetriever implements Retriever {
  constructor(private casebase: AggregateObject[], private project: Project) {}

  evaluate(
    queryObject: AggregateObject,
    options?: RetrieverEvaluationOptions | undefined
  ): RetrieverResult {
    options = options || {};

    const offset = options.offset != null ? options.offset : 0;
    const maxCount = options.maxCount != null ? options.maxCount : 10;
    const threshold = options.threshold != null ? options.threshold : -1;
    const roundTo = options.roundTo != null ? options.roundTo : 2;
    const evaluatorId = options.queryEvaluatorId;
    const facets = options.facets != null ? options.facets : null;

    const facettingCache = facets != null ? {} : null;
    const facettingResult: FacetResult[] | null = facets != null ? [] : null;

    const evaluator = this.project.getEvaluator(evaluatorId);
    const result: Case[] = [];
    let entropyResult = null;
    this.casebase.forEach((caseObject) => {
      const similarity = evaluator.evaluate(queryObject, caseObject);
      if (
        (threshold < 0 && similarity.value > 0) ||
        (threshold >= 0 && similarity.value >= threshold)
      ) {
        result.push(new Case(similarity, caseObject));
        if (facets != null) {
          this.updateGroupByResult(
            facets,
            caseObject,
            facettingCache,
            facettingResult
          );
        }
      }
    });
    if (facets != null && facettingResult != null) {
      facettingResult.forEach((facet: FacetResult) => {
        const facetting: Facet | undefined = facets.find(
          (reference) => reference.id === facet.id
        );
        if (facetting == null) {
          return;
        }
        this.calculateEntropy(facet, result.length);
        facet.values.sort((a: FacetValue, b: FacetValue) => b.count - a.count);
        facet.values = facet.values.slice(0, facetting.maxCount || 10);
      });
      facettingResult.sort(
        (a: FacetResult, b: FacetResult) => b.entropy - a.entropy
      );
      entropyResult = facettingResult
        .filter(
          (facet) =>
            !queryObject.native[facet.id] ||
            (Array.isArray(queryObject.native[facet.id]) &&
              queryObject.native[facet.id].length === 0)
        )
        .map((facet) => {
          const entropyEntry = new EntropyResult(
            facet.id,
            facet.entropy,
            facet.values.map((facetValue) => facetValue.value)
          );
          delete facet.entropy;
          return entropyEntry;
        });
    }
    result.sort(similarityComparator);
    if (maxCount > 0 && (offset === 0 || result.length > offset)) {
      return {
        count: result.length,
        facets:
          facettingResult != null && facettingResult.length > 0
            ? facettingResult
            : undefined,
        entropies:
          entropyResult != null && entropyResult.length > 0
            ? entropyResult
            : undefined,
        cases: result.slice(offset, maxCount).map((element) => {
          element.aggregate = element.aggregate.toJSON();
          element.rounded = parseFloat(
            element.similarity.value.toFixed(roundTo)
          );
          return element;
        }),
      };
    }
    return {
      count: result.length,
      facets:
        facettingResult != null && facettingResult.length > 0
          ? facettingResult
          : undefined,
      entropies:
        entropyResult != null && entropyResult.length > 0
          ? entropyResult
          : undefined,
      cases: [],
    };
  }

  addCase(aggregate: AggregateObject): void {
    this.casebase.push(aggregate);
  }

  removeCase(id: string): AggregateObject | undefined {
    const result = this.casebase.find((aggregate) => aggregate.id === id);
    this.casebase = this.casebase.filter((aggregate) => aggregate.id !== id);
    return result;
  }

  findCases(
    attribute: Attribute,
    values: ModelObject<any>[]
  ): AggregateObject[] {
    return this.casebase.filter((object) => {
      let found = false;
      Object.keys(object.native).forEach((attributeId: string) => {
        if (found) {
          return;
        }
        if (attributeId === attribute.id) {
          const nativeValue = object.native[attributeId];
          if (Array.isArray(nativeValue)) {
            for (let i = 0, n = values.length; i < n; i++) {
              if (
                nativeValue.find((entry) => values[i].equals(entry)) != null
              ) {
                found = true;
                return;
              }
            }
          } else {
            for (let i = 0, n = values.length; i < n; i++) {
              if (values[i].equals(nativeValue)) {
                found = true;
                return;
              }
            }
          }
        }
      });
      return found;
    });
  }

  private calculateEntropy(facet: FacetResult, divider: number) {
    let entropy = 0;
    facet.values.forEach((element: FacetValue) => {
      const ratio = element.count / divider;
      entropy -= ratio * Math.log2(ratio);
    });
    facet.entropy = entropy;
  }

  private updateGroupByResult(
    facets: Facet[],
    caseObject: AggregateObject,
    facettingCache: any,
    facettingResult: any
  ) {
    facets.forEach((reference) => {
      const attributeId = reference.id;
      const valueObject = caseObject.native[attributeId];
      if (valueObject != null && !facettingCache[attributeId]) {
        facettingCache[attributeId] = {
          facet: new FacetResult(attributeId, [], 0),
          values: {},
        };
        facettingResult.push(facettingCache[attributeId].facet);
      }
      this.adaptFacettingResult(attributeId, valueObject, facettingCache);
    });
  }

  private adaptFacettingResult(
    attributeId: string,
    valueObject: ModelObject<any>,
    facettingCache: any
  ) {
    if (!valueObject) {
      return;
    }
    if (!valueObject.isSet() && !valueObject.isAggregate()) {
      if (!facettingCache[attributeId].values[valueObject.native]) {
        facettingCache[attributeId].values[valueObject.native] = new FacetValue(
          valueObject.native,
          1
        );
        facettingCache[attributeId].facet.values.push(
          facettingCache[attributeId].values[valueObject.native]
        );
      } else {
        facettingCache[attributeId].values[valueObject.native].count++;
      }
      facettingCache[attributeId].facet.count++;
    } else if (valueObject.isSet()) {
      (valueObject as SetObject<any>).native.forEach((element) => {
        this.adaptFacettingResult(attributeId, element, facettingCache);
      });
    }
  }
}
