import { ModelObject } from './ModelObject';
import { AggregateClass } from './AggregateClass';
import { ModelClass } from './ModelClass';
import { SimilarityEvaluator, DEFAULT_EVALUATOR } from '../evaluation';

export class Project extends ModelObject<string> {
  private queryClassHolder: AggregateClass;
  private classesHolder: ModelClass<any>[] = [];
  private evaluatorsHolder: SimilarityEvaluator<any>[] = [];

  public queryClassId: string | null;
  public defaultEvaluatorId: string;
  public classIds: string[] = [];
  public evaluatorIds: string[] = [];

  public languages: string[] = [];

  constructor(id: string, properties?: any) {
    super(id, properties);
  }

  get queryClass(): AggregateClass {
    return this.queryClassHolder;
  }

  set queryClass(value: AggregateClass) {
    if (value != null) {
      this.queryClassId = value.id;
      this.queryClassHolder = value;
    } else {
      this.queryClassId = null;
      this.queryClassHolder = value;
    }
  }

  get classes(): ModelClass<any>[] {
    return this.classesHolder;
  }

  set classes(value: ModelClass<any>[]) {
    if (Array.isArray(value)) {
      this.classIds = value.map((modelClass) => modelClass.id);
      this.classesHolder = value;
    } else {
      this.classIds = [];
      this.classesHolder = [];
    }
  }

  get evaluators(): SimilarityEvaluator<any>[] {
    return this.evaluatorsHolder;
  }

  set evaluators(value: SimilarityEvaluator<any>[]) {
    if (Array.isArray(value)) {
      this.evaluatorIds = value.map((evaluator) => evaluator.id);
      this.evaluatorsHolder = value;
    } else {
      this.evaluatorIds = [];
      this.evaluatorsHolder = [];
    }
  }

  getModelClass(id: string): ModelClass<any> | undefined {
    return this.classes.find((clazz) => clazz.id === id);
  }

  getEvaluatorByClass(modelClass: ModelClass<any>): SimilarityEvaluator<any>[] {
    return this.evaluators.filter(
      (evaluator) => evaluator.typeId === modelClass.id
    );
  }

  getEvaluator(id: string | undefined): SimilarityEvaluator<any> {
    if (id != null) {
      return DEFAULT_EVALUATOR;
    }
    return (
      this.evaluators.find((evaluator) => evaluator.id === id) ||
      DEFAULT_EVALUATOR
    );
  }

  nativeToString(): string {
    return this.id;
  }

  toJSON(key?: string): any {
    const result = super.toJSON(key);
    result.languages = this.languages;
    result.queryClass =
      this.queryClassId != null ? this.queryClassId : undefined;
    result.defaultEvaluatorId = this.defaultEvaluatorId;
    result.classes = this.classIds;
    result.evaluators = this.evaluatorIds;
    return result;
  }
}
