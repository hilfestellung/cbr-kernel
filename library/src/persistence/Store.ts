import { AggregateClass, ModelClass, SetClass } from '../model';
import {
  SimilarityEvaluator,
  AggregateEvaluator,
  SetEvaluator,
} from '../evaluation';

export abstract class Store {
  async chargeModelClasses(
    aggregateClass: AggregateClass,
    ignoreIds: string[] = []
  ): Promise<ModelClass<any>[]> {
    let classIds: string[] = aggregateClass.attributes
      .map((attribute) => attribute.typeId)
      .filter((id) => !ignoreIds.includes(id));
    let classes = await this.fetchModelClasses(classIds);
    classes.push(aggregateClass);
    ignoreIds.push(aggregateClass.id);

    const sets = classes.filter(
      (modelClass) => !ignoreIds.includes(modelClass.id) && modelClass.isSet()
    );
    if (sets.length > 0) {
      const setClassIds = sets.map(
        (setClass: SetClass<any>) => setClass.elementTypeId
      ) as string[];
      classes = [...classes, ...(await this.fetchModelClasses(setClassIds))];
      classIds = [...classIds, ...setClassIds];
    }

    const aggregates = classes.filter(
      (modelClass) =>
        !ignoreIds.includes(modelClass.id) && modelClass.isAggregate()
    );
    return (
      await Promise.all(
        aggregates.map(
          async (aggregate) =>
            await this.chargeModelClasses(
              aggregate as AggregateClass,
              ignoreIds.concat(classIds)
            )
        )
      )
    ).reduce((previous, current) => [...previous, ...current], classes);
  }

  async chargeEvaluators(
    aggregateEvaluator: AggregateEvaluator,
    ignoreIds: string[] = []
  ): Promise<SimilarityEvaluator<any>[]> {
    let evaluatorIds = aggregateEvaluator.attributes
      .map((attribute) => attribute.evaluator)
      .filter((id) => !ignoreIds.includes(id));
    let evaluators: SimilarityEvaluator<any>[] = await this.fetchEvaluators(
      evaluatorIds
    );

    const sets = evaluators.filter((evaluator) => evaluator.pattern === 'set');
    if (sets.length > 0) {
      const setEvaluatorIds = sets.map(
        (setEvaluator: SetEvaluator) => setEvaluator.elementEvaluatorId
      );
      evaluators = [
        ...evaluators,
        ...(await this.fetchEvaluators(setEvaluatorIds)),
      ];
      evaluatorIds = [...evaluatorIds, ...setEvaluatorIds];
    }

    const aggregates = evaluators.filter(
      (evaluator) => evaluator.pattern === 'aggregate'
    );
    evaluators.push(aggregateEvaluator);
    ignoreIds.push(aggregateEvaluator.id);
    return (
      await Promise.all(
        aggregates.map(
          async (aggregate) =>
            await this.chargeEvaluators(
              aggregate as AggregateEvaluator,
              ignoreIds.concat(evaluatorIds)
            )
        )
      )
    ).reduce((previous, current) => [...previous, ...current], evaluators);
  }

  abstract fetchModelClasses(classIds: string[]): Promise<ModelClass<any>[]>;
  abstract fetchEvaluators(
    evaluatorIds: string[]
  ): Promise<SimilarityEvaluator<any>[]>;
}
