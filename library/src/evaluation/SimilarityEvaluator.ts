import { ModelObject } from '../model';
import { Similarity } from './Similarity';

export class SimilarityEvaluator<T> {
  private typeIdHolder: string;

  constructor(public id: string, typeId: string) {
    this.typeId = typeId;
  }

  get pattern(): string {
    return 'default';
  }

  get typeId(): string {
    return this.typeIdHolder;
  }

  set typeId(typeId: string) {
    this.typeIdHolder = typeId;
  }

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
    return { id: this.id, type: this.typeId, pattern: this.pattern };
  }
}
