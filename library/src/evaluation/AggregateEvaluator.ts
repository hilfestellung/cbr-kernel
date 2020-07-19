import { AggregateClass } from '../model/AggregateClass';
import { AggregateObject } from '../model/AggregateObject';
import { ModelClass } from '../model/ModelClass';
import { ModelObject } from '../model/ModelObject';
import { Similarity } from './Similarity';
import { SimilarityEvaluator } from './SimilarityEvaluator';

export const DEFAULT_EVALUATOR = new SimilarityEvaluator(
  'default',
  (null as unknown) as ModelClass<any>
);

export enum AggregateSimilarityMode {
  average,
  min,
  max,
  euclidean,
}

export interface AttributeEvaluatorLink {
  id: string;
  evaluator: string;
  weight: number;
}

export class AggregateEvaluator extends SimilarityEvaluator<any> {
  public attributes: AttributeEvaluatorLink[];
  public evaluators: SimilarityEvaluator<any>[];

  get mode(): AggregateSimilarityMode {
    return this.evaluationMode;
  }
  set mode(value: AggregateSimilarityMode) {
    this.evaluationMode = value;
    switch (value) {
      case AggregateSimilarityMode.min:
        this.evaluate = this.min;
        break;
      case AggregateSimilarityMode.max:
        this.evaluate = this.max;
        break;
      case AggregateSimilarityMode.euclidean:
        this.evaluate = this.euclidean;
        break;
      case AggregateSimilarityMode.average:
      default:
        this.evaluate = this.average;
    }
  }
  public weights: { [attributeId: string]: number };
  public measures: { [attributeId: string]: SimilarityEvaluator<any> };

  constructor(
    public id: string,
    public modelClass: AggregateClass,
    private evaluationMode: AggregateSimilarityMode
  ) {
    super(id, modelClass);
    this.weights = {};
    this.measures = {};
    this.mode = evaluationMode;
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
      weight = this.weights[attributeId] || 0;
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

  private getMeasure(attributeId: string): SimilarityEvaluator<any> {
    const attributeEvaluatorLink = this.attributes.find(
      (ad) => ad.id === attributeId
    );
    if (attributeEvaluatorLink != null) {
      return (
        this.evaluators.find(
          (evaluator) => evaluator.id === attributeEvaluatorLink.evaluator
        ) || DEFAULT_EVALUATOR
      );
    }
    return DEFAULT_EVALUATOR;
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
        measure = this.measures[attributeId];
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
        measure = this.measures[attributeId];
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
        measure = this.measures[attributeId];
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
    result.mode = this.mode.toString();
    result.attributes = this.attributes.map((measureDefinition) => ({
      id: measureDefinition.id,
      evaluator: measureDefinition.evaluator,
      weight: measureDefinition.weight,
    }));
    return result;
  }
}
