import { ModelClass } from '../model';
import { SimilarityEvaluator } from '../evaluation';

export function findClass(
  classes: ModelClass<any>[],
  id: string
): ModelClass<any> {
  return (classes.find((clazz) => clazz.id === id) as unknown) as ModelClass<
    any
  >;
}

export function findEvaluator(
  evaluators: SimilarityEvaluator<any>[],
  id: string
): SimilarityEvaluator<any> {
  return (evaluators.find(
    (evaluator) => evaluator.id === id
  ) as unknown) as SimilarityEvaluator<any>;
}
