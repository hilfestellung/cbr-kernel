import { AggregateObject } from '../model/AggregateObject';
import { ModelObject } from '../model/ModelObject';
import { Similarity } from './Similarity';
import { SimilarityEvaluator } from './SimilarityEvaluator';

export const DEFAULT_EVALUATOR = new SimilarityEvaluator('default', 'default');

export enum AggregateSimilarityMode {
  Average,
  Min,
  Max,
  Euclidean,
}

export interface AttributeEvaluatorLink {
  id: string;
  evaluator: string;
  weight: number;
}

export class AggregateEvaluator extends SimilarityEvaluator<any> {
  private evaluationMode: AggregateSimilarityMode;
  private measureCache: any = {};
  private weightCache: any = {};

  public attributes: AttributeEvaluatorLink[];
  public evaluators: SimilarityEvaluator<any>[];

  get mode(): AggregateSimilarityMode {
    return this.evaluationMode;
  }
  set mode(value: AggregateSimilarityMode) {
    this.evaluationMode = value;
    switch (value) {
      case AggregateSimilarityMode.Min:
        this.evaluate = this.min;
        break;
      case AggregateSimilarityMode.Max:
        this.evaluate = this.max;
        break;
      case AggregateSimilarityMode.Euclidean:
        this.evaluate = this.euclidean;
        break;
      case AggregateSimilarityMode.Average:
      default:
        this.evaluate = this.average;
    }
  }

  constructor(
    public id: string,
    typeId: string,
    evaluationMode: AggregateSimilarityMode | string
  ) {
    super(id, typeId);
    this.evaluationMode = AggregateSimilarityMode[evaluationMode];
    this.mode = this.evaluationMode;
    this.attributes = [];
    this.evaluators = [];
  }

  get pattern(): string {
    return 'aggregate';
  }

  private average(
    queryObject: ModelObject<any>,
    caseObject: ModelObject<any>
  ): Similarity {
    const qo: AggregateObject = queryObject as AggregateObject;
    const co: AggregateObject = caseObject as AggregateObject;
    const result = new Similarity(0, queryObject, caseObject);
    let weight = 1;
    let divider = 0;
    let evaluator: SimilarityEvaluator<any>;
    let hasSimilarity = false;
    Object.keys(qo.native).forEach((attributeId: string) => {
      weight = this.getWeight(attributeId);
      evaluator = this.getMeasure(attributeId);
      if (weight > 0 && evaluator != null) {
        const evaluation = evaluator.evaluate(
          qo.native[attributeId],
          co.native[attributeId]
        );
        result.value += weight * evaluation.value;
        divider += weight;
        hasSimilarity = true;
      }
    });
    if (divider > 0) {
      result.value = result.value / divider;
    } else if (result.value > 1) {
      if (!hasSimilarity) {
        result.value = 1;
      } else {
        result.value = 0;
      }
    }
    return result;
  }

  private getWeight(attributeId: string): number {
    let result = this.weightCache[attributeId];
    if (result == null) {
      const attributeEvaluatorLink = this.attributes.find(
        (ad) => ad.id === attributeId
      );
      if (attributeEvaluatorLink != null) {
        result = attributeEvaluatorLink.weight || 0;
      } else {
        result = 0;
      }
      this.weightCache[attributeId] = result;
    }
    return result;
  }

  private getMeasure(attributeId: string): SimilarityEvaluator<any> {
    let result = this.measureCache[attributeId];
    if (result == null) {
      const attributeEvaluatorLink = this.attributes.find(
        (ad) => ad.id === attributeId
      );
      if (attributeEvaluatorLink != null) {
        result =
          this.evaluators.find(
            (evaluator) => evaluator.id === attributeEvaluatorLink.evaluator
          ) || DEFAULT_EVALUATOR;
      } else {
        result = DEFAULT_EVALUATOR;
      }
      this.measureCache[attributeId] = result;
    }
    return result;
  }

  private min(
    queryObject: ModelObject<any>,
    caseObject: ModelObject<any>
  ): Similarity {
    const qo: AggregateObject = queryObject as AggregateObject;
    const co: AggregateObject = caseObject as AggregateObject;
    const result = new Similarity(0, queryObject, caseObject);
    let newSimilarity = new Similarity(
      1,

      queryObject,
      caseObject
    );
    let measure: SimilarityEvaluator<any>;
    Object.keys(qo.native).forEach((attributeId: string) => {
      if (qo.native[attributeId]) {
        measure = this.getMeasure(attributeId);
        if (measure) {
          newSimilarity = measure.evaluate(
            qo.native[attributeId],
            co.native[attributeId]
          );
          if (newSimilarity.value > 0) {
            result.value = Math.min(newSimilarity.value, result.value);
          }
        }
      }
    });
    return result;
  }

  private max(
    queryObject: ModelObject<any>,
    caseObject: ModelObject<any>
  ): Similarity {
    const qo: AggregateObject = queryObject as AggregateObject;
    const co: AggregateObject = caseObject as AggregateObject;
    const result = new Similarity(0, queryObject, caseObject);
    let newSimilarity = new Similarity(
      0,

      queryObject,
      caseObject
    );
    let measure: SimilarityEvaluator<any>;
    Object.keys(qo.native).forEach((attributeId: string) => {
      if (qo.native[attributeId]) {
        measure = this.getMeasure(attributeId);
        if (measure) {
          newSimilarity = measure.evaluate(
            qo.native[attributeId],
            co.native[attributeId]
          );
          if (newSimilarity.value > 0) {
            result.value = Math.max(newSimilarity.value, result.value);
          }
        }
      }
    });
    return result;
  }

  private euclidean(
    queryObject: ModelObject<any>,
    caseObject: ModelObject<any>
  ): Similarity {
    const qo: AggregateObject = queryObject as AggregateObject;
    const co: AggregateObject = caseObject as AggregateObject;
    const result = new Similarity(0, queryObject, caseObject);
    let newSimilarity = new Similarity(
      0,

      queryObject,
      caseObject
    );
    let measure: SimilarityEvaluator<any>;
    Object.keys(qo.native).forEach((attributeId: string) => {
      if (qo.native[attributeId]) {
        measure = this.getMeasure(attributeId);
        if (measure) {
          newSimilarity = measure.evaluate(
            qo.native[attributeId],
            co.native[attributeId]
          );
          result.value += newSimilarity.value * newSimilarity.value;
        }
      }
    });
    result.value = Math.sqrt(result.value);
    return result;
  }

  toJSON(key?: string): any {
    const result: any = super.toJSON(key);
    result.mode = AggregateSimilarityMode[this.evaluationMode];
    result.attributes = this.attributes.map((measureDefinition) => ({
      id: measureDefinition.id,
      evaluator: measureDefinition.evaluator,
      weight: measureDefinition.weight,
    }));
    return result;
  }
}
