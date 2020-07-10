import { ModelClass, ModelObject } from 'model';
import { Similarity } from './Similarity';

export class SimilarityEvaluator<T> {
  constructor(public id: string, public modelClass: ModelClass<T>) {}

  evaluate(
    queryObject: ModelObject<T>,
    caseObject: ModelObject<T>
  ): Similarity {
    if (queryObject == null || caseObject == null) {
      return new Similarity(0, queryObject, caseObject);
    }
    return new Similarity(
      queryObject.equals(caseObject) ? 1 : 0,
      queryObject,
      caseObject
    );
  }

  toJSON(_key?: string): any {
    return { id: this.id, type: this.modelClass.id };
  }
}
