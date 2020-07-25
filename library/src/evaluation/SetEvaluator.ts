import { Similarity } from './Similarity';
import { SimilarityEvaluator } from './SimilarityEvaluator';
import { ModelObject } from '../model/ModelObject';
import { SetObject } from '../model/SetObject';

const contains = (
  array: ModelObject<any>[],
  value: ModelObject<any>,
  evaluator: SimilarityEvaluator<ModelObject<any>>
) => {
  const result = new Similarity(0, new SetObject(array), value);
  let divider = 0;
  let overrideSimilarity;
  for (let i = 0, n = array.length; i < n; i++) {
    const element = array[i];
    const s = evaluator.evaluate(value, element);
    if (s.value === 1) {
      overrideSimilarity = 1;
    } else if (s.value > 0) {
      result.value += s.value;
      divider += 1;
    }
  }
  if (overrideSimilarity != null) {
    result.value = overrideSimilarity;
    return result;
  } else if (divider > 0) {
    result.value = result.value / divider;
    return result;
  }
  return new Similarity(0, value, new SetObject(array));
};

const checkInclusion = (
  source: ModelObject<ModelObject<any>[]>,
  dest: ModelObject<ModelObject<any>[]>,
  evaluator: SimilarityEvaluator<ModelObject<any>>
): Similarity => {
  const max = source.native.length;
  const result = new Similarity(0, source, dest);
  if (max === 0) {
    return result;
  }
  const curr = source.native.reduce((accumulator, currentValue) => {
    const similarity = contains(dest.native, currentValue, evaluator);
    return accumulator + similarity.value;
  }, 0);
  result.value = curr / max;
  return result;
};

const queryInclusion = (
  queryObject: ModelObject<ModelObject<any>[]>,
  caseObject: ModelObject<ModelObject<any>[]>,
  evaluator: SimilarityEvaluator<ModelObject<any>>
): Similarity => {
  return checkInclusion(queryObject, caseObject, evaluator);
};

const caseInclusion = (
  queryObject: ModelObject<ModelObject<any>[]>,
  caseObject: ModelObject<ModelObject<any>[]>,
  evaluator: SimilarityEvaluator<ModelObject<any>>
): Similarity => {
  return checkInclusion(caseObject, queryObject, evaluator);
};

const intermediate = (
  queryObject: ModelObject<ModelObject<any>[]>,
  caseObject: ModelObject<ModelObject<any>[]>,
  evaluator: SimilarityEvaluator<ModelObject<any>>
): Similarity => {
  const first = checkInclusion(queryObject, caseObject, evaluator);
  const second = checkInclusion(caseObject, queryObject, evaluator);
  const result = new Similarity(
    (first.value + second.value) / 2,
    queryObject,
    caseObject
  );
  return result;
};

export enum SetComparisonType {
  QueryInclusion,
  CaseInclusion,
  Intermediate,
}

export class SetEvaluator extends SimilarityEvaluator<any> {
  private comparisonType: SetComparisonType;
  public evaluator: SimilarityEvaluator<any>;
  constructor(
    public id: string,
    typeId: string,
    comparisonType: SetComparisonType | string,
    public elementEvaluatorId: string
  ) {
    super(id, typeId);
    this.comparisonType = SetComparisonType[comparisonType];
  }

  evaluate(
    queryObject: ModelObject<ModelObject<any>[]>,
    caseObject: ModelObject<ModelObject<any>[]>
  ): Similarity {
    if (
      queryObject == null ||
      caseObject == null ||
      queryObject.native == null ||
      caseObject.native == null
    ) {
      return new Similarity(0, queryObject, caseObject);
    }
    const comparisonType = this.comparisonType;
    switch (comparisonType) {
      case SetComparisonType.QueryInclusion:
        return queryInclusion(queryObject, caseObject, this.evaluator);
      case SetComparisonType.CaseInclusion:
        return caseInclusion(queryObject, caseObject, this.evaluator);
      case SetComparisonType.Intermediate:
      default:
        return intermediate(queryObject, caseObject, this.evaluator);
    }
  }

  toJSON(key?: string): any {
    const result: any = super.toJSON(key);
    result.comparisonType = SetComparisonType[this.comparisonType];
    result.elementEvaluator = this.elementEvaluatorId;
    return result;
  }
}
